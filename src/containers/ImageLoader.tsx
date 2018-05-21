import * as tf from '@tensorflow/tfjs';
import * as React from 'react';
import { AppSettings } from '../settings/AppSettings';


export class ImageLoader extends React.Component {

    constructor(props: any) {
        super(props);
    }

    protected canvas:HTMLCanvasElement;
    protected predictions:number[];
    protected model:tf.Model;

    public componentDidMount() {
        this.loadModel();
    }

    protected async loadModel() {
        this.model = await tf.loadModel(AppSettings.yoloModelUrl); 
    }

    protected async predict() {

        let imageData = this.canvas.getContext("2d").getImageData(0, 0, this.canvas.width, this.canvas.height);

        const pred = await tf.tidy(() => {
    
            let pixels:any = tf.fromPixels(imageData, 3);
            const centerHeight = pixels.shape[0] / 2;
            const beginHeight = centerHeight - (416/ 2);
            const centerWidth = pixels.shape[1] / 2;
            const beginWidth = centerWidth - (416 / 2);
            let pixelsCropped =
              pixels.slice([beginHeight, beginWidth, 0],
                           [416, 416, 3]);

            pixelsCropped = pixelsCropped.reshape([1, 416, 416, 3]);
            pixelsCropped = tf.cast(pixelsCropped, 'float32');

            const output = this.model.predict(pixelsCropped) as any;
            // console.log(Array.from(output.dataSync()));
            console.log(output);
            
            
        });
    }

    public onImageLoad = (event:any) => {
        const uploadedFile:File = event.target.files[0];
        const url:string = URL.createObjectURL(uploadedFile)
        
        let img:HTMLImageElement = new Image();
        let canvas = this.canvas;
        const predict = this.predict.bind(this);

        img.onload = function() {  
            
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            canvas.getContext("2d").drawImage(img, 0, 0);
            predict();
        };
        img.src = url;  
    }

    public render() {

        return(
            <div className="ImageLoader">
                <input type="file" onChange={this.onImageLoad}/>
                <canvas className={"Board"} ref = {ref => this.canvas = ref}/>
            </div>
        )
    }
}