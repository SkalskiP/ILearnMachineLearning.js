import * as tf from '@tensorflow/tfjs';

export class AppSettings {

    // APP SETTINGS
    public static gitHubUrl:string = 'https://github.com/SkalskiP';
    public static twitterUrl:string = 'https://twitter.com/PiotrSkalski92';
    public static mediumUrl:string = 'https://medium.com/@piotr.skalski92';

    // MNIST
    public static mnistModelUrl:string = 'https://raw.githubusercontent.com/SkalskiP/ILearnMachineLearning.js/master/models/mnist/ModelJS/model.json';
    public static mnistModelInputPixelSize:number = 28;
    public static drawingBoardBaseDim:number = 400;
    public static drawingBoardBaseTextSize:number = 40;
    public static drawingBoardBaseBrushDiameter:number = 40;
    public static drawingBoardBaseBrushColor:string = "#fff";

    // CIRCLE CHART
    public static circleChartBaseDiameter:number = 600;
    public static circleChartBaseCircleThickness:number = 15;
    public static circleChartBaseTextSize:number = 150;

    // OBJECT DETECTION
    public static yoloModelUrl:string = 'https://raw.githubusercontent.com/SkalskiP/ILearnMachineLearning.js/master/models/tfjs-yolo-tiny/model.json';
    public static yoloModelInputPixelSize:number = 416;
    public static yoloModelIouThreshold:number = 0.5;
    public static yoloModelClassProbThreshold:number = 0.5;
    public static yoloModelClassCount:number = 80;
    public static yoloModelAnchors:tf.Tensor2D = tf.tensor2d([
        [0.57273, 0.677385], [1.87446, 2.06253], [3.33843, 5.47434],
        [7.88282, 3.52778], [9.77052, 9.16828],
      ]);
}