import * as tf from '@tensorflow/tfjs';
import * as React from 'react'
import { DrawUtil } from '../utils/DrawUtil';
import './../styles/DrawingBoard.css'; 
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../store/index';
import { updateModelPredictions } from '../store/mnist/actions';
import { SimpleButton } from '../components/SimpleButton';
import { IPoint } from '../interfaces/IPoint';

interface Props {
    onNewPrediction: (predictions:number[]) => any;
}

class DrawingBoardComponent extends React.Component<Props, {}> {
    constructor(props: any) {
        super(props);
    }

    protected drawingBoardBox:HTMLDivElement;
    protected boardWrapper:HTMLDivElement;
    protected canvas:HTMLCanvasElement;
    protected mousePosition:IPoint = {x: 0, y: 0}
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

    protected startDrawing = () => {
        this.isDrawing = true;
        window.addEventListener("mouseup", this.endDrawing);
    }

    protected endDrawing = () => {
        this.isDrawing = false;
        window.removeEventListener("mouseup", this.endDrawing);
    }

    protected onMouseMove = (event) => {
        this.updateMousePosition({x: event.clientX, y: event.clientY});
        if(this.isDrawing)
            DrawUtil.drawLine(this.canvas, this.mousePosition, this.mousePosition, "#fff", 35);
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
        this.model = await tf.loadModel('https://raw.githubusercontent.com/SkalskiP/ILearnMachineLearning.js/master/src/assets/models/mnist/model.json');
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
        const maxDim:number = 400;
        const drawingBoardBoxRect = this.drawingBoardBox.getBoundingClientRect();

        if(drawingBoardBoxRect.width >= maxDim && drawingBoardBoxRect.height >= maxDim) {
            this.canvas.width = maxDim;
            this.canvas.height = maxDim;
        }
        else if (drawingBoardBoxRect.width >= drawingBoardBoxRect.height) {
            this.canvas.width = drawingBoardBoxRect.height;
            this.canvas.height = drawingBoardBoxRect.height;
        }
        else {
            this.canvas.width = drawingBoardBoxRect.width;
            this.canvas.height = drawingBoardBoxRect.width;
        }

        this.boardWrapper.style.width = this.canvas.width + "px";
        this.boardWrapper.style.height = this.canvas.height + "px";
    }

    public render() {
        return(
            <div className={"DrawingBoard"} ref = {ref => this.drawingBoardBox = ref}>
                <div className={"BoardWrapper"} ref = {ref => this.boardWrapper = ref}>
                    <canvas className={"Board"} ref = {ref => this.canvas = ref} 
                        onMouseMove={this.onMouseMove} 
                        onMouseDown={this.startDrawing}
                    />
                    <div className={"BoardText"}>
                        <b>DRAW HERE</b>
                    </div>
                </div>
                <div className={"ButtonsRow"}>
                    <SimpleButton name={"Predict"} size={{width:100, height:50}} onClick={this.makePrediction}/>
                    <SimpleButton name={"Clear"} size={{width:100, height:50}} onClick={this.clearPrediction}/>
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
