import * as tf from '@tensorflow/tfjs';

export class YoloDataProcessingUtil {

    /**
     * Convert data received from final layer to bounding box parameters
     * @param modelOutput - output of final convolutional layer
     * @param anchorBoxes - anchor box widths and heights
     * @param numClasses - number of target classes
     */
    public static yoloHead(modelOutput, anchorBoxes, numClasses) {

        const numberOfAnchorBoxes = anchorBoxes.shape[0]; 
        const anchorsTensor = tf.reshape(anchorBoxes, [1, 1, anchorBoxes.shape[0], anchorBoxes.shape[1]]);

        // Each photo is divided into a grid of cells
        let gridSize = modelOutput.shape.slice(1, 3);
        const gridSizeV = gridSize[0];
        const gridSizeH = gridSize[1];
      
        // In YOLO vertical index is the inner most iteration.
        let gridIndexV = tf.range(0, gridSizeV);
        let gridIndexH = tf.range(0, gridSizeH);

        gridIndexV = tf.tile(gridIndexV, [gridSize[1]])
        gridIndexH = tf.tile(tf.expandDims(gridIndexH, 0), [gridSize[0], 1]);
        gridIndexH = tf.transpose(gridIndexH).flatten();
      
        let convIndex = tf.transpose(tf.stack([gridIndexV, gridIndexH]));
        convIndex = tf.reshape(convIndex, [gridSize[0], gridSize[1], 1, 2])
        convIndex = tf.cast(convIndex, modelOutput.dtype);
      
        modelOutput = tf.reshape(modelOutput, [gridSize[0], gridSize[1], numberOfAnchorBoxes, numClasses + numberOfAnchorBoxes]);
        gridSize = tf.cast(tf.reshape(tf.tensor1d(gridSize), [1,1,1,2]), modelOutput.dtype);
      
        let boxPosition = tf.sigmoid(modelOutput.slice([0,0,0,0], [gridSizeV, gridSizeH, numberOfAnchorBoxes, 2]))
        let boxSize = tf.exp(modelOutput.slice([0,0,0,2], [gridSizeV, gridSizeH, numberOfAnchorBoxes, 2]))
        const boxConfidence = tf.sigmoid(modelOutput.slice([0,0,0,4], [gridSizeV, gridSizeH, numberOfAnchorBoxes, 1]))
        const boxClassProbs = tf.softmax(modelOutput.slice([0,0,0,5],[gridSizeV, gridSizeH, numberOfAnchorBoxes, numClasses]));
      
        // Adjust preditions to each spatial grid point and anchor size
        boxPosition = tf.div(tf.add(boxPosition, convIndex), gridSize);
        boxSize = tf.div(tf.mul(boxSize, anchorsTensor), gridSize);
      
        return [ boxPosition, boxSize, boxConfidence, boxClassProbs ];
    }

    /**
     * Convert box predictions to bounding box corners
     * @param boxPosition 
     * @param boxSize 
     */
    public static boxesToCorners(boxPosition, boxSize) {
        const two = tf.tensor1d([2.0]);
        const boxMins = tf.sub(boxPosition, tf.div(boxSize, two));
        const boxMaxes = tf.add(boxPosition, tf.div(boxSize, two));
      
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

    public static nonMaxSuppression(boxes, scores, iouThreshold) {
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
                const curIou = YoloDataProcessingUtil.boxIou(box[1], selectedBoxes[i][1]);
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

    public static boxIntersection(a, b) {
        const w = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
        const h = Math.min(a[2], b[2]) - Math.max(a[0], b[0]);
        if (w < 0 || h < 0) {
            return 0;
        }
        return w * h;
    }
    
    public static boxUnion(a, b) {
        const i = YoloDataProcessingUtil.boxIntersection(a, b);
        return (a[3] - a[1]) * (a[2] - a[0]) + (b[3] - b[1]) * (b[2] - b[0]) - i;
    }
    
    public static boxIou(a, b) {
        return YoloDataProcessingUtil.boxIntersection(a, b) / YoloDataProcessingUtil.boxUnion(a, b);
    }

    public static filterBoxes(boxes, boxConfidence, boxClassProbs, threshold) {
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
}