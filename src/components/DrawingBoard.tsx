import * as tf from '@tensorflow/tfjs';
import * as React from 'react'
import { IPoint } from '../store/mnist/types';
import { DrawUtil } from '../utils/DrawUtil';
import { MLUtil } from '../utils/MLUtil';
import './../styles/DrawingBoard.css';
import { SimpleButton } from './SimpleButton';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../store/index';
import { updateModelPredictions } from '../store/mnist/actions';

interface Props {
    onNewPrediction: (predictions:number[]) => any;
}

class DrawingBoardComponent extends React.Component<Props, {}> {
    constructor(props: any) {
        super(props);
    }

    protected drawingBoardBox:HTMLDivElement;
    protected canvas:HTMLCanvasElement;
    protected mousePosition:IPoint = {x: 0, y: 0}
    protected isDrawing:boolean = false;
    protected model:tf.Model;
    protected predictions:number[];

    public componentDidMount() {
        this.setUpBoard();
        this.loadModel();
        window.addEventListener("resize", this.setUpBoard);
    }

    public componentWillUnmount() {
        window.addEventListener("resize", this.setUpBoard);
    }

    protected startDrawing = (event) => {
        this.isDrawing = true;
        window.addEventListener("mouseup", this.endDrawing);
    }

    protected endDrawing = (event) => {
        this.isDrawing = false;
        window.removeEventListener("mouseup", this.endDrawing);
    }

    protected onMouseMove = (event) => {
        this.updateMousePosition({x: event.clientX, y: event.clientY});
        if(this.isDrawing)
            DrawUtil.drawLine(this.canvas, this.mousePosition, this.mousePosition, "#111111");
    }

    protected clearCanvas = () => {
        DrawUtil.clearCanvas(this.canvas);
    }

    protected makePrediction = () => {
        let image = DrawUtil.getImgData(this.canvas);        
        this.predict(image);
        this.props.onNewPrediction(this.predictions);
    }

    protected updateMousePosition (mousePosition:IPoint) {
        const boardRect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = mousePosition.x - boardRect.left;
        this.mousePosition.y = mousePosition.y - boardRect.top;
    }

    protected async loadModel() {
        this.model = await tf.loadModel('https://raw.githubusercontent.com/AngularFirebase/97-tensorflowjs-quick-start/master/src/assets/model.json');
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

    protected setUpBoard = () => {
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
        
    }

    public render() {
        return(
            <div className={"DrawingBoard"} ref = {ref => this.drawingBoardBox = ref}>
                <canvas className={"Board"} ref = {ref => this.canvas = ref} 
                    onMouseMove={this.onMouseMove} 
                    onMouseDown={this.startDrawing}
                />
                <div className={"ButtonsRow"}>
                    <SimpleButton name={"Predict"} width={100} height={50} onClick={this.makePrediction}/>
                    <SimpleButton name={"Clear"} width={100} height={50} onClick={this.clearCanvas}/>
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
