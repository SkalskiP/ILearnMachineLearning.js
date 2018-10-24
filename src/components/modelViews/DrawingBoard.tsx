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
import classNames from "classnames";

interface Props {
    onNewPrediction: (predictions:number[]) => any;
    isMobile: boolean;
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
        window.addEventListener("mouseup", this.handleDrawEnd);
        window.addEventListener("touchend", this.handleDrawEnd);
    }

    public componentDidUpdate() {
        this.setUpCanvas();
    }

    public componentWillUnmount() {
        this.props.onNewPrediction([]);
        window.removeEventListener("resize", this.setUpCanvas);
        window.removeEventListener("mouseup", this.handleDrawEnd);
        window.removeEventListener("touchend", this.handleDrawEnd);
    }

    protected handleDrawStart = (event) => {
        this.isDrawing = true;
        this.handleMouseMove(event);
    };

    protected handleDrawEnd = () => {
        this.isDrawing = false;
        this.previousMousePosition = null;
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
        if (this.isDrawing) {
            this.draw();
            setTimeout(this.makePrediction, 0);
        }
    };

    protected draw() {
        const brushDiameter = this.drawingBoardScale * AppSettings.MNIST_DRAWING_BOARD_BASE_BRUSH_DIAMETER;
        const brushColor = AppSettings.MNIST_DRAWING_BOARD_BASE_BRUSH_COLOR;
        DrawUtil.drawLine(this.canvas, this.previousMousePosition, this.mousePosition, brushColor, brushDiameter);
    }

    protected clearPrediction = () => {
        DrawUtil.clearCanvas(this.canvas);
        this.props.onNewPrediction([]);
    };

    protected makePrediction = async () => {
        const pixSize:number = AppSettings.MNIST_MODEL_INPUT_PIXEL_SIZE;
        let image = DrawUtil.getImageDataAndScale(this.canvas, {width: pixSize, height: pixSize});        
        await this.predict(image);
        this.props.onNewPrediction(this.predictions);
    };

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
        if (!!this.canvas && !!this.boardWrapper) {
            const maxDim:number = AppSettings.MNIST_DRAWING_BOARD_BASE_DIM;
            const boardWrapperRect = this.boardWrapper.getBoundingClientRect();

            if (boardWrapperRect.width >= boardWrapperRect.height) {
                this.canvas.width = boardWrapperRect.height;
                this.canvas.height = boardWrapperRect.height;
            }
            else {
                this.canvas.width = boardWrapperRect.width;
                this.canvas.height = boardWrapperRect.width;
            }
            this.drawingBoardScale = this.canvas.width/maxDim;
        }
    };

    protected getClassName = () => {
        return classNames(
            "DrawingBoard", {
                "mobile": this.props.isMobile,
                "desktop": !this.props.isMobile
            }
        );
    };

    public render() {
        return(
            <div className={"DrawingBoard"}>
                {this.state.isLoading && <LoadingScreen/>}
                {!this.state.isLoading && <div className={"BoardWrapper"} ref = {ref => this.boardWrapper = ref}>
                    <canvas className={"Board"} ref = {ref => this.canvas = ref}
                        onMouseMove={this.handleMouseMove}
                        onMouseDown={this.handleDrawStart}
                        onTouchStart={this.handleDrawStart}
                        onTouchMove={this.handleMouseMove}
                    />
                </div>}
                {!this.state.isLoading && <div className={"ButtonsRow"}>
                    <TextButton label={"Clear"} onClick={this.clearPrediction}/>
                </div>}
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    isMobile: state.app.isMobile
});

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>) => ({
    onNewPrediction: (predictions:number[]) => dispatch(updateModelPredictions(predictions))
});

export const DrawingBoard = connect(mapStateToProps, mapDispatchToProps)(
    DrawingBoardComponent
);
