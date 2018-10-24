import * as tf from '@tensorflow/tfjs';
import * as smartcrop from 'smartcrop';
import * as React from 'react';
import { AppSettings } from '../../settings/AppSettings';
import classNames from '../../assets/models/cocoClasses'
import { DrawUtil } from '../../utils/DrawUtil';
import { IDetectedObject } from '../../interfaces/IDetectedObject';
import { LoadingScreen } from '../commonViews/LoadingScreen';
import { Rect } from '../../utils/geometry/Rect';
import { YoloDataProcessingUtil } from '../../utils/YoloDataProcessingUtil';

interface State {
    isPredictionActive:boolean;
    isLoading:boolean;
}

export class ImageLoader extends React.Component<{}, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            isPredictionActive: false,
            isLoading:true
        };
    }

    protected passiveCanvas:HTMLCanvasElement;
    protected activeCanvas:HTMLCanvasElement;
    protected canvasWrapper:HTMLDivElement;
    protected predictions:number[];
    protected predictionsRect:Rect;
    protected model:tf.Model;
    protected iouThreshold:number = AppSettings.YOLO_MODEL_IOU_THRESHOLD;
    protected classProbThreshold:number = AppSettings.YOLO_MODEL_CLASS_PROB_THRESHOLD;
    protected maxPix:number = AppSettings.YOLO_MODEL_INPUT_PIXEL_SIZE;
    protected img:HTMLImageElement = new Image();

    public componentDidMount() {
        this.loadModel().then(()=>
            this.setState({ isLoading: false })
        );
        this.img.addEventListener('load', this.loadScaledImageToCanvas);
    }

    protected async loadModel() {
        this.model = await tf.loadModel(AppSettings.YOLO_MODEL_URL);
    }

    protected async predict():Promise<IDetectedObject[]> {

        // Load model settings from app settings
        const anchors = AppSettings.YOLO_MODEL_ANCHORS;
        const numClasses = AppSettings.YOLO_MODEL_CLASS_COUNT;

        let imageData = this.passiveCanvas.getContext("2d").getImageData(0, 0, this.passiveCanvas.width, this.passiveCanvas.height);

        const [allBoxes, boxConfidence, boxClassProbs] = await tf.tidy(() => {
    
            let pixels:tf.Tensor3D = tf.fromPixels(imageData, 3);
            let pixelsCropped:tf.Tensor3D = pixels.slice([this.predictionsRect.y, this.predictionsRect.x, 0], [this.maxPix, this.maxPix, 3]);
            let batchedImage:tf.Tensor4D = pixelsCropped.expandDims(0);
            batchedImage = batchedImage.toFloat().div(tf.scalar(255))

            let modelOutput:tf.Tensor4D = this.model.predict(batchedImage) as tf.Tensor4D;

            const [boxXY, boxWH, boxConfidence, boxClassProbs] = YoloDataProcessingUtil.yoloHead(modelOutput, anchors, numClasses);
            const allBoxes = YoloDataProcessingUtil.boxesToCorners(boxXY, boxWH);

            return [allBoxes, boxConfidence, boxClassProbs];
        });

        let [boxes, scores, classes] = await YoloDataProcessingUtil.filterBoxes(
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
    
        const [ keepIndx, boxesArr, keepScores ] = YoloDataProcessingUtil.nonMaxSuppression(
            preKeepBoxesArr,
            scoresArr,
            this.iouThreshold,
        );
    
        const classesIndexArr = await classes.gather(tf.tensor1d(keepIndx, 'int32')).data();
    
        return classesIndexArr.reduce((results:IDetectedObject[], classIndexValue:number, index:number) => {
            const classProbability = keepScores[index];
            if (classProbability < this.classProbThreshold) {
                return results;
            }

            const className = classNames[classIndexValue];
            let [top, left, bottom, right] = boxesArr[index];

            const x = Math.max(0, left);
            const y = Math.max(0, top);
            const width = Math.min(this.maxPix, right) - x;
            const height = Math.min(this.maxPix, bottom) - y;
            
            const nextObject:IDetectedObject = {
                class: className,
                probability: classProbability,
                rect: new Rect(x, y, width, height)
            };

            return results.concat([nextObject]);
        }, []);
    }
    
    public loadScaledImageToCanvas = () => {
        const aspectRatio:number = this.img.naturalWidth / this.img.naturalHeight;

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

        let ctx:CanvasRenderingContext2D = this.passiveCanvas.getContext('2d');
        ctx.drawImage(this.img, 0, 0, this.passiveCanvas.width, this.passiveCanvas.height);
        this.drawPredRects().then(() => {
            this.predict().then((predictions) => {
                if(predictions === null)
                    return;

                let class2ColorLedger:any = {};
    
                predictions.forEach((prediction:IDetectedObject) => {
                    prediction.rect.translateByVector({x: this.predictionsRect.x, y: this.predictionsRect.y});
                    
                    let color:string; 
                    if (prediction.class in class2ColorLedger) {
                        color = class2ColorLedger[prediction.class];
                    } else {
                        color = DrawUtil.getRandomRGBColor();
                        class2ColorLedger[prediction.class] = color;
                    }
                    
                    DrawUtil.drawPredictionRect(this.activeCanvas, prediction, 2, color, 12);
                });
            }) 
        });
    }

    public onImageUpload = (event:any) => {
        const file:File = event.target.files[0];
        
        if(file) {
            const url:string = URL.createObjectURL(file);
            this.setState({ isPredictionActive: true });
            this.img.src = url;
        }
    }

    public async drawPredRects() {
        let size = Math.min(this.passiveCanvas.width, this.passiveCanvas.height);
        let imgSize = Math.min(this.img.naturalWidth, this.img.naturalHeight);
        const scale = imgSize/size;

        let smartCropRect = await smartcrop.crop(this.img, { width: imgSize, height: imgSize });
        
        this.predictionsRect = new Rect(
            smartCropRect.topCrop.x / scale,
            smartCropRect.topCrop.y / scale,
            smartCropRect.topCrop.width / scale,
            smartCropRect.topCrop.height / scale
        );

        DrawUtil.shadeEverythingButRect(this.activeCanvas, this.predictionsRect, "rgba(0, 0, 0, 0.7)");
        DrawUtil.drawRect(this.activeCanvas, this.predictionsRect, "rgba(255, 255, 255, 0.5)", 1);
    }

    public render() {
        return(
            this.state.isLoading ?
            <LoadingScreen/> :
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