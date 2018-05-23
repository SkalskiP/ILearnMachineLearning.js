import * as tf from '@tensorflow/tfjs';
import * as React from 'react';
import { AppSettings } from '../settings/AppSettings';
import classNames from '../assets/cocoClasses'
import { IRect } from '../interfaces/IRect';
import { DrawUtil } from '../utils/DrawUtil';
import { IDetectedObject } from '../interfaces/IDetectedObject';

interface State {
    isPredictionActive:boolean;
}

export class ImageLoader extends React.Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = { isPredictionActive: false };
    }

    protected passiveCanvas:HTMLCanvasElement;
    protected activeCanvas:HTMLCanvasElement;
    protected canvasWrapper:HTMLDivElement;
    protected predictions:number[];
    protected predictionsRect:IRect;
    protected model:tf.Model;
    protected iouThreshold:number = AppSettings.yoloModelIouThreshold;
    protected classProbThreshold:number = AppSettings.yoloModelClassProbThreshold;
    protected maxPix:number = AppSettings.yoloModelInputPixelSize;
    protected img:HTMLImageElement = new Image();

    public componentDidMount() {
        this.loadModel();
        this.img.addEventListener('load', this.loadScaledImageToCanvas);
    }

    protected async loadModel() {
        this.model = await tf.loadModel(AppSettings.yoloModelUrl); 
    }

    protected async predict():Promise<IDetectedObject[]> {

        const anchors = tf.tensor2d([
            [0.57273, 0.677385], [1.87446, 2.06253], [3.33843, 5.47434],
            [7.88282, 3.52778], [9.77052, 9.16828],
          ]);

        const numAnchors = anchors.shape[0];
        const anchorsTensor = tf.reshape(anchors, [1, 1, numAnchors, 2]);
        const numClasses = 80;

        let imageData = this.passiveCanvas.getContext("2d").getImageData(0, 0, this.passiveCanvas.width, this.passiveCanvas.height);

        const [allBoxes, boxConfidence, boxClassProbs] = await tf.tidy(() => {
    
            let pixels:any = tf.fromPixels(imageData, 3);

            const centerHeight = pixels.shape[0] / 2;
            const beginHeight = centerHeight - (this.maxPix/ 2);
            const centerWidth = pixels.shape[1] / 2;
            const beginWidth = centerWidth - (this.maxPix / 2);

            let pixelsCropped = pixels.slice([beginHeight, beginWidth, 0], [this.maxPix, this.maxPix, 3]);
            let batchedImage = pixelsCropped.expandDims(0);
            batchedImage = batchedImage.toFloat().div(tf.scalar(255))



            let output = this.model.predict(batchedImage) as any;

            const [boxXY, boxWH, boxConfidence, boxClassProbs] = this.yolo_head(output, anchors, numClasses);

            const allBoxes = this.yolo_boxes_to_corners(boxXY, boxWH);

            return [allBoxes, boxConfidence, boxClassProbs];

        });

        let [boxes, scores, classes] = await this.yolo_filter_boxes(
            allBoxes, boxConfidence, boxClassProbs, 0.01);
        
          // If all boxes have been filtered out
          if (boxes == null) {
            return [];
          }
        
          const width = tf.scalar(this.maxPix);
          const height = tf.scalar(this.maxPix);
        
          const imageDims = tf.stack([height, width, height, width]).reshape([1,4]);
        
          boxes = tf.mul(boxes, imageDims);
        
          const [ preKeepBoxesArr, scoresArr ] = await Promise.all([
            boxes.data(), scores.data(),
          ]);
        
          const [ keepIndx, boxesArr, keepScores ] = this.nonMaxSuppression(
            preKeepBoxesArr,
            scoresArr,
            this.iouThreshold,
          );
        
          const classesIndxArr = await classes.gather(tf.tensor1d(keepIndx, 'int32')).data();
        
          const results:IDetectedObject[] = [];
        
          classesIndxArr.forEach((classIndx, i) => {
            const classProbability = keepScores[i];
            if (classProbability < this.classProbThreshold) {
              return;
            }
        
            const className = classNames[classIndx];
            let [top, left, bottom, right] = boxesArr[i];
        
            top = Math.max(0, top);
            left = Math.max(0, left);
            bottom = Math.min(this.maxPix, bottom);
            right = Math.min(this.maxPix, right);
        
            const nextObject:IDetectedObject = {
              class: className,
              probability: classProbability,
              rect: {
                  x: left,
                  y: top,
                  width: right - left,
                  height: bottom - top
              }
            };
        
            results.push(nextObject);
          });
        return results;
    }

    public yolo_head(feats, anchors, numClasses) {
        const numAnchors = anchors.shape[0];
      
        const anchorsTensor = tf.reshape(anchors, [1, 1, numAnchors, 2]);
      
        let convDims = feats.shape.slice(1, 3);
      
        // For later use
        const convDims0 = convDims[0];
        const convDims1 = convDims[1];
      
        let convHeightIndex = tf.range(0, convDims[0]);
        let convWidthIndex = tf.range(0, convDims[1]);
        convHeightIndex = tf.tile(convHeightIndex, [convDims[1]])
      
        convWidthIndex = tf.tile(tf.expandDims(convWidthIndex, 0), [convDims[0], 1]);
        convWidthIndex = tf.transpose(convWidthIndex).flatten();
      
        let convIndex = tf.transpose(tf.stack([convHeightIndex, convWidthIndex]));
        convIndex = tf.reshape(convIndex, [convDims[0], convDims[1], 1, 2])
        convIndex = tf.cast(convIndex, feats.dtype);
      
        feats = tf.reshape(feats, [convDims[0], convDims[1], numAnchors, numClasses + 5]);
        convDims = tf.cast(tf.reshape(tf.tensor1d(convDims), [1,1,1,2]), feats.dtype);
      
        let boxXY = tf.sigmoid(feats.slice([0,0,0,0], [convDims0, convDims1, numAnchors, 2]))
        let boxWH = tf.exp(feats.slice([0,0,0, 2], [convDims0, convDims1, numAnchors, 2]))
        const boxConfidence = tf.sigmoid(feats.slice([0,0,0, 4], [convDims0, convDims1, numAnchors, 1]))
        const boxClassProbs = tf.softmax(feats.slice([0,0,0, 5],[convDims0, convDims1, numAnchors, numClasses]));
      
        boxXY = tf.div(tf.add(boxXY, convIndex), convDims);
        boxWH = tf.div(tf.mul(boxWH, anchorsTensor), convDims);
      
        return [ boxXY, boxWH, boxConfidence, boxClassProbs ];
      }

    public yolo_boxes_to_corners(boxXY, boxWH) {
        const two = tf.tensor1d([2.0]);
        const boxMins = tf.sub(boxXY, tf.div(boxWH, two));
        const boxMaxes = tf.add(boxXY, tf.div(boxWH, two));
      
        const dim0 = boxMins.shape[0];
        const dim1 = boxMins.shape[1];
        const dim2 = boxMins.shape[2];
        const size = [dim0, dim1, dim2, 1];
      
        return tf.concat([
          boxMins.slice([0, 0, 0, 1], size),
          boxMins.slice([0, 0, 0, 0], size),
          boxMaxes.slice([0, 0, 0, 1], size),
          boxMaxes.slice([0, 0, 0, 0], size),
        ], 3);
    }

    public yolo_filter_boxes(boxes, boxConfidence, boxClassProbs, threshold) {
        const boxScores = tf.mul(boxConfidence, boxClassProbs);
        const boxClasses = tf.argMax(boxScores, -1);
        const boxClassScores = tf.max(boxScores, -1);
      
        // Many thanks to @jacobgil
        // Source: https://github.com/ModelDepot/tfjs-yolo-tiny/issues/6#issuecomment-387614801
        const predictionMask = tf.greaterEqual(boxClassScores, tf.scalar(threshold)).as1D();
      
        const N = predictionMask.size
        // linspace start/stop is inclusive.
        const allIndices = tf.linspace(0, N - 1, N).toInt();
        const negIndices = tf.zeros([N], 'int32');
        const indices:any = tf.where(predictionMask, allIndices, negIndices);
      
        return [
          tf.gather(boxes.reshape([N, 4]), indices),
          tf.gather(boxClassScores.flatten(), indices),
          tf.gather(boxClasses.flatten(), indices),
        ];
    }

    public nonMaxSuppression(boxes, scores, iouThreshold) {
        // Zip together scores, box corners, and index
        const zipped = [];
        for (let i=0; i<scores.length; i++) {
          zipped.push([
            scores[i], [boxes[4*i], boxes[4*i+1], boxes[4*i+2], boxes[4*i+3]], i,
          ]);
        }
        // Sort by descending order of scores (first index of zipped array)
        const sortedBoxes = zipped.sort((a, b) => b[0] - a[0]);
      
        const selectedBoxes = [];
      
        // Greedily go through boxes in descending score order and only
        // return boxes that are below the IoU threshold.
        sortedBoxes.forEach(box => {
          let add = true;
          for (let i=0; i < selectedBoxes.length; i++) {
            // Compare IoU of zipped[1], since that is the box coordinates arr
            // TODO: I think there's a bug in this calculation
            const curIou = this.boxIou(box[1], selectedBoxes[i][1]);
            if (curIou > iouThreshold) {
              add = false;
              break;
            }
          }
          if (add) {
            selectedBoxes.push(box);
          }
        });
      
        // Return the kept indices and bounding boxes
        return [
          selectedBoxes.map(e => e[2]),
          selectedBoxes.map(e => e[1]),
          selectedBoxes.map(e => e[0]),
        ];
      }
      
    public boxIntersection(a, b) {
        const w = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
        const h = Math.min(a[2], b[2]) - Math.max(a[0], b[0]);
        if (w < 0 || h < 0) {
            return 0;
        }
        return w * h;
    }
    
    public boxUnion(a, b) {
        const i = this.boxIntersection(a, b);
        return (a[3] - a[1]) * (a[2] - a[0]) + (b[3] - b[1]) * (b[2] - b[0]) - i;
    }
    
    public boxIou(a, b) {
        return this.boxIntersection(a, b) / this.boxUnion(a, b);
    }

    public loadScaledImageToCanvas = () => {
        const aspectRatio = this.img.naturalWidth / this.img.naturalHeight;

        if (this.img.naturalWidth >= this.img.naturalHeight) {
            this.passiveCanvas.height = this.maxPix;
            this.passiveCanvas.width = this.maxPix * aspectRatio;
        } else {
            this.passiveCanvas.width = this.maxPix;
            this.passiveCanvas.height = this.maxPix / aspectRatio;
        }

        this.activeCanvas.width = this.passiveCanvas.width;
        this.activeCanvas.height = this.passiveCanvas.height;

        this.canvasWrapper.style.width = this.passiveCanvas.width + "px";
        this.canvasWrapper.style.height = this.passiveCanvas.height + "px";

        let ctx = this.passiveCanvas.getContext('2d');
        ctx.drawImage(this.img, 0, 0, this.passiveCanvas.width, this.passiveCanvas.height);
        this.drawPredRects();
        this.predict().then((predictions) => {
            if(predictions === null)
                return;

            predictions.forEach((prediction:IDetectedObject) => {
                prediction.rect.x += this.predictionsRect.x;
                prediction.rect.y += this.predictionsRect.y;
                DrawUtil.drawPredictionRect(this.activeCanvas, prediction, 2, "#fff", 12);
            });
        }) 
    }

    public onImageUpload = (event:any) => {
        const file:File = event.target.files[0];
        
        if(file) {
            const url:string = URL.createObjectURL(file);
            this.setState({ isPredictionActive: true });
            this.img.src = url;
        }
    }

    public drawPredRects():void {
        let size = Math.min(this.passiveCanvas.width, this.passiveCanvas.height);
        this.predictionsRect = {
            x: this.passiveCanvas.width/2 - size/2,
            y: this.passiveCanvas.height/2 - size/2,
            width: size,
            height: size
        }
        DrawUtil.shadeEverythingButRect(this.activeCanvas, this.predictionsRect, "rgba(0, 0, 0, 0.7)");
        DrawUtil.drawRect(this.activeCanvas, this.predictionsRect, "#000", 1);
    }

    public render() {

        return(
            <div className={"ImageLoader"}>
                {this.state.isPredictionActive && 
                <div className={"BoardWrapper"} ref = {ref => this.canvasWrapper = ref}>
                    <canvas className={"PredictionsBoard"} ref = {ref => this.activeCanvas = ref}/>
                    <canvas className={"ImageBoard"} ref = {ref => this.passiveCanvas = ref}/>
                </div>}
                <input className={"ImageInput"} type={"file"} id={"file"} onChange={this.onImageUpload}/>
                <label htmlFor="file">Choose a file</label>
            </div>
        )
    }
}