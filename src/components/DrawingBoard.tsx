import * as React from 'react'
import { IPoint } from '../interfaces/IPoint';
import { DrawUtil } from '../utils/DrawUtil';
import './../styles/DrawingBoard.css';


export class DrawingBoard extends React.Component {

    protected drawingBoardBox:HTMLDivElement;
    protected canvas:HTMLCanvasElement;
    protected mousePosition:IPoint = {x: 0, y: 0}
    protected isDrawing:boolean = false;

    public componentDidMount() {
        this.setUpBoard();
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
            DrawUtil.drawLine(this.canvas, this.mousePosition, this.mousePosition);
    }

    protected updateMousePosition (mousePosition:IPoint) {
        const boardRect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = mousePosition.x - boardRect.left;
        this.mousePosition.y = mousePosition.y - boardRect.top;
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
            <div className="DrawingBoard" ref = {ref => this.drawingBoardBox = ref}>
                <canvas className="Board" ref = {ref => this.canvas = ref} 
                    onMouseMove={this.onMouseMove} 
                    onMouseDown={this.startDrawing}
                />
            </div>
        );
    }

} 
