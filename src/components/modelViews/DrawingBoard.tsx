import * as tf from '@tensorflow/tfjs';
import * as React from 'react'
import { DrawUtil } from '../../utils/DrawUtil';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../../store/index';
import { updateModelPredictions } from '../../store/mnist/actions';
import { IPoint } from '../../interfaces/IPoint';
import { AppSettings } from '../../settings/AppSettings';
import {TextButton} from "../commonViews/TextButton";
import {LoadingScreen} from "../commonViews/LoadingScreen";
import {MouseUtil} from "../../utils/MouseUtil";

interface Props {
    onNewPrediction: (predictions:number[]) => any;
}

interface State {
    isLoading:boolean;
}

class DrawingBoardComponent extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    protected boardWrapper:HTMLDivElement;
    protected canvas:HTMLCanvasElement;
    protected previousMousePosition:IPoint = null;
    protected mousePosition:IPoint = null;
    protected isDrawing:boolean = false;
    protected model:tf.Model;
    protected predictions:number[];
    protected drawingBoardScale:number = 1;

    public componentDidMount() {
        this.loadModel().then(() =>
            this.setState({ isLoading: false })
        );
        window.addEventListener("resize", this.setUpCanvas);
    }

    public componentDidUpdate() {
        this.setUpCanvas();
    }

    public componentWillUnmount() {
        this.props.onNewPrediction([]);
        window.removeEventListener("resize", this.setUpCanvas);
    }

    protected onMouseDown = (event) => {
        this.isDrawing = true;
        // this.updateMousePosition({x: event.clientX, y: event.clientY});
        // this.draw();
        window.addEventListener("mouseup", this.onMouseUp);
    };

    protected onTouchStart = (event) => {
        this.isDrawing = true;
        // this.updateMousePosition({x: event.touches[0].clientX, y: event.touches[0].clientY});
        // this.draw();
        window.addEventListener("touchend", this.onTouchEnd);
    };

    protected onMouseUp = () => {
        this.isDrawing = false;
        this.previousMousePosition = null;
        window.removeEventListener("mouseup", this.onMouseUp);
    };

    protected onTouchEnd = () => {
        this.isDrawing = false;
        this.previousMousePosition = null;
        window.removeEventListener("touchend", this.onTouchEnd);
    };

    protected handleMouseMove = (event) => {
        const clientMousePosition = MouseUtil.clientCoordinatesFromEvent(event);
        event.preventDefault();
        event.stopPropagation();
        if (clientMousePosition && !!this.canvas) {
            const canvasRect = this.canvas.getBoundingClientRect();
            const newPosition:IPoint = {
                x: clientMousePosition.x - canvasRect.left,
                y: clientMousePosition.y - canvasRect.top
            };

            this.updateMousePosition(newPosition);
        }

        if(this.isDrawing) {
            this.draw();
            this.makePrediction();
        }
    };

    protected draw() {

        console.log("PREVIOUS", this.previousMousePosition);
        console.log("CURRENT", this.mousePosition);

        const brushDiameter = this.drawingBoardScale * AppSettings.MNIST_DRAWING_BOARD_BASE_BRUSH_DIAMETER;
        const brushColor = AppSettings.MNIST_DRAWING_BOARD_BASE_BRUSH_COLOR;
        DrawUtil.drawLine(this.canvas, this.previousMousePosition, this.mousePosition, brushColor, brushDiameter);
    }

    protected clearPrediction = () => {
        DrawUtil.clearCanvas(this.canvas);
        this.props.onNewPrediction([]);
    }

    protected makePrediction = () => {
        const pixSize:number = AppSettings.MNIST_MODEL_INPUT_PIXEL_SIZE;
        let image = DrawUtil.getImageDataAndScale(this.canvas, {width: pixSize, height: pixSize});        
        this.predict(image);
        this.props.onNewPrediction(this.predictions);
    }

    protected updateMousePosition (newMousePosition:IPoint) {
        this.previousMousePosition = this.previousMousePosition ? this.mousePosition : newMousePosition;
        this.mousePosition = newMousePosition;
    }

    protected async loadModel() {
        this.model = await tf.loadModel(AppSettings.MNIST_MODEL_URL);
    }

    protected async predict(imageData: ImageData) {

        const pred = await tf.tidy(() => {
        
            const pixSize:number = AppSettings.MNIST_MODEL_INPUT_PIXEL_SIZE;
            let img:any = tf.fromPixels(imageData, 1);
            img = img.reshape([1, pixSize, pixSize, 1]);
            img = tf.cast(img, 'float32');
            img = img.div(tf.scalar(255));

            const output = this.model.predict(img) as any;

            this.predictions = Array.from(output.dataSync());
        });
    }

    protected setUpCanvas = () => {
        const maxDim:number = AppSettings.MNIST_DRAWING_BOARD_BASE_DIM;
        const boardWrapperRect = this.boardWrapper.getBoundingClientRect();

        if(boardWrapperRect.width >= maxDim && boardWrapperRect.height >= maxDim) {
            this.canvas.width = maxDim;
            this.canvas.height = maxDim;
        }
        else if (boardWrapperRect.width >= boardWrapperRect.height) {
            this.canvas.width = boardWrapperRect.height;
            this.canvas.height = boardWrapperRect.height;
        }
        else {
            this.canvas.width = boardWrapperRect.width;
            this.canvas.height = boardWrapperRect.width;
        }
   
        this.drawingBoardScale = this.canvas.width/maxDim;
    }

    public render() {

        let boardTextStyle:React.CSSProperties = {
            fontSize: this.drawingBoardScale * AppSettings.MNIST_DRAWING_BOARD_BASE_TEXT_SIZE
        };
 
        return(
            <div className={"DrawingBoard"}>
                {this.state.isLoading && <LoadingScreen/>}
                {!this.state.isLoading && <div className={"BoardWrapper"} ref = {ref => this.boardWrapper = ref}>
                    <canvas className={"Board"} ref = {ref => this.canvas = ref}
                        onMouseMove={this.handleMouseMove}
                        onMouseDown={this.onMouseDown}
                        onTouchStart={this.onTouchStart}
                        onTouchMove={this.handleMouseMove}
                    />
                    <div className={"BoardText"} style={boardTextStyle}>
                        <b>DRAW HERE</b>
                    </div>
                </div>}
                {!this.state.isLoading && <div className={"ButtonsRow"}>
                    {/*<TextButton label={"Predict"} onClick={this.makePrediction}/>*/}
                    <TextButton label={"Clear"} onClick={this.clearPrediction}/>
                </div>}
            </div>
        );
    }
}

// const mapStateToProps = (state: ApplicationState) => ({
//     predictions: state.predictions.predictionValues
// });

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>) => ({
    onNewPrediction: (predictions:number[]) => dispatch(updateModelPredictions(predictions))
});

export const DrawingBoard = connect(null, mapDispatchToProps)(
    DrawingBoardComponent
);
