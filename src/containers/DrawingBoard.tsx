import * as tf from '@tensorflow/tfjs';
import * as React from 'react'
import { DrawUtil } from '../utils/DrawUtil';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../store/index';
import { updateModelPredictions } from '../store/mnist/actions';
import { SimpleButton } from '../components/SimpleButton';
import { IPoint } from '../interfaces/IPoint';
import { AppSettings } from '../settings/AppSettings';

interface Props {
    onNewPrediction: (predictions:number[]) => any;
}

interface State {
    drawingBoardScale:number;
}

class DrawingBoardComponent extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = { drawingBoardScale: 1 };
    }

    protected boardWrapper:HTMLDivElement;
    protected canvas:HTMLCanvasElement;
    protected mousePosition:IPoint = {x: null, y: null}
    protected isDrawing:boolean = false;
    protected model:tf.Model;
    protected predictions:number[];

    public componentDidMount() {
        this.setUpCanvas();
        this.loadModel();
        window.addEventListener("resize", this.setUpCanvas);
    }

    public componentWillUnmount() {
        window.addEventListener("resize", this.setUpCanvas);
    }

    protected onMouseDown = (event) => {
        this.isDrawing = true;
        this.updateMousePosition({x: event.clientX, y: event.clientY});
        this.draw();
        window.addEventListener("mouseup", this.onMouseUp);
    }

    protected onTouchStart = (event) => {
        this.isDrawing = true;
        this.updateMousePosition({x: event.touches[0].clientX, y: event.touches[0].clientY});
        this.draw();
        window.addEventListener("touchend", this.onTouchEnd);
    }

    protected onMouseUp = () => {
        this.isDrawing = false;
        window.removeEventListener("mouseup", this.onMouseUp);
    }

    protected onTouchEnd = () => {
        this.isDrawing = false;
        window.removeEventListener("touchend", this.onTouchEnd);
    } 

    protected onMouseMove = (event) => {
        this.updateMousePosition({x: event.clientX, y: event.clientY});

        if(this.isDrawing)
            this.draw();

        event.preventDefault();
    }

    protected onTouchMove = (event) => {
        this.updateMousePosition({x: event.touches[0].clientX, y: event.touches[0].clientY});
        
        if(this.isDrawing)
            this.draw();

        event.preventDefault();
    }

    protected draw() {
        const brushDiameter = this.state.drawingBoardScale * AppSettings.drawingBoardBaseBrushDiameter;
        const brushColor = AppSettings.drawingBoardBaseBrushColor;
        DrawUtil.drawLine(this.canvas, this.mousePosition, this.mousePosition, brushColor, brushDiameter);
    }

    protected clearPrediction = () => {
        DrawUtil.clearCanvas(this.canvas);
        this.props.onNewPrediction([]);
    }

    protected makePrediction = () => {
        let image = DrawUtil.getImageDataAndScale(this.canvas, {width: 28, height: 28});        
        this.predict(image);
        this.props.onNewPrediction(this.predictions);
    }

    protected updateMousePosition (mousePosition:IPoint) {
        const boardRect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = mousePosition.x - boardRect.left;
        this.mousePosition.y = mousePosition.y - boardRect.top;
    }

    protected async loadModel() {
        this.model = await tf.loadModel(AppSettings.mnistModelUrl);
    }

    protected async predict(imageData: ImageData) {

        const pred = await tf.tidy(() => {
    
          let img:any = tf.fromPixels(imageData, 1);
          img = img.reshape([1, 28, 28, 1]);
          img = tf.cast(img, 'float32');

          const output = this.model.predict(img) as any;
    
          this.predictions = Array.from(output.dataSync());
        });
    }

    protected setUpCanvas = () => {
        const maxDim:number = AppSettings.drawingBoardBaseDim;
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
   
        this.setState({ drawingBoardScale: this.canvas.width/maxDim });
    }

    public render() {

        let boardTextStyle:React.CSSProperties = {
            fontSize: this.state.drawingBoardScale * AppSettings.drawingBoardBaseTextSize
        }

        let buttonStyle:React.CSSProperties = {
            width: "40%",
            maxWidth: 100,
            minWidth: 50,
            height: 45
        }
 
        return(
            <div className={"DrawingBoard"}>
                <div className={"BoardWrapper"} ref = {ref => this.boardWrapper = ref}>
                    <canvas className={"Board"} ref = {ref => this.canvas = ref} 
                        onMouseMove={this.onMouseMove} 
                        onMouseDown={this.onMouseDown}
                        onTouchStart={this.onTouchStart}
                        onTouchMove={this.onTouchMove} 
                    />
                    <div className={"BoardText"} style={boardTextStyle}>
                        <b>DRAW HERE</b>
                    </div>
                </div>
                <div className={"ButtonsRow"}>
                    <SimpleButton name={"Predict"} style={buttonStyle} onClick={this.makePrediction}/>
                    <SimpleButton name={"Clear"} style={buttonStyle} onClick={this.clearPrediction}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    predictions: state.predictions.predictionValues
});

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>) => ({
    onNewPrediction: (predictions:number[]) => dispatch(updateModelPredictions(predictions))
});

export const DrawingBoard = connect(mapStateToProps, mapDispatchToProps)(
    DrawingBoardComponent
);
