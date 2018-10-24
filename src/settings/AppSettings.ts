import * as tf from '@tensorflow/tfjs';

export class AppSettings {

    /* -------------------------------- COMMON APP SETTINGS -------------------------------- */

    public static readonly GITHUB_URL:string = 'https://github.com/SkalskiP';
    public static readonly TWITTER_URL:string = 'https://twitter.com/PiotrSkalski92';
    public static readonly MEDIUM_URL:string = 'https://medium.com/@piotr.skalski92';
    public static readonly PRIMARY_COLOR:string = "#212121";
    public static readonly SECONDARY_COLOR:string = "#ffffff";
    public static readonly ALTERNATIVE_COLOR:string = "#ef6c00";
    public static readonly SECOND_ALTERNATIVE_COLOR:string = "#ffB700";
    public static readonly MOBILE_BORDER_WIDTH = 768;

    /* -------------------------------- MNIST MODEL SETTINGS -------------------------------- */

    public static readonly MNIST_MODEL_URL:string =
        'https://raw.githubusercontent.com/SkalskiP/ILearnMachineLearning.js/master/models/mnist/ModelJS/model.json';
    public static readonly MNIST_MODEL_INPUT_PIXEL_SIZE:number = 28;
    public static readonly MNIST_DRAWING_BOARD_BASE_DIM:number = 400;
    public static readonly MNIST_DRAWING_BOARD_BASE_TEXT_SIZE:number = 40;
    public static readonly MNIST_DRAWING_BOARD_BASE_BRUSH_DIAMETER:number = 40;
    public static readonly MNIST_DRAWING_BOARD_BASE_BRUSH_COLOR:string = "#fff";

    /* -------------------------------- YOLO MODEL SETTINGS -------------------------------- */

    public static readonly YOLO_MODEL_URL:string =
        'https://raw.githubusercontent.com/SkalskiP/ILearnMachineLearning.js/master/models/tfjs-yolo-tiny/model.json';
    public static readonly YOLO_MODEL_INPUT_PIXEL_SIZE:number = 416;
    public static readonly YOLO_MODEL_IOU_THRESHOLD:number = 0.4;
    public static readonly YOLO_MODEL_CLASS_PROB_THRESHOLD:number = 0.5;
    public static readonly YOLO_MODEL_CLASS_COUNT:number = 80;
    public static readonly YOLO_MODEL_ANCHORS:tf.Tensor2D = tf.tensor2d([
        [0.57273, 0.677385], [1.87446, 2.06253], [3.33843, 5.47434],
        [7.88282, 3.52778], [9.77052, 9.16828],
      ]);

    /* -------------------------------- CIRCLE CHART -------------------------------- */

    public static readonly CIRCLE_CHART_BASE_DIAMETER:number = 600;
    public static readonly CIRCLE_CHART_BASE_CIRCLE_THICKNESS:number = 15;
    public static readonly CIRCLE_CHART_BASE_TEXT_SIZE:number = 150;
}