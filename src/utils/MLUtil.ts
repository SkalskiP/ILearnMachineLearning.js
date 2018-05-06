import * as tf from '@tensorflow/tfjs';

export class MLUtil {
    
    public static async predictDigit(imageData: ImageData) {
        console.log("TEST");
        let model = await tf.loadModel('../assets/model.json');

        const pred = await tf.tidy(() => {

            // Convert the canvas pixels to 
            let img = tf.fromPixels(imageData, 1);
            console.log(img); 
            img = img.reshape([1, 28, 28]);
            img = tf.cast(img, 'float32');
      
            // Make and format the predications
            const output = model.predict(img) as any;
      
            // Save predictions on the component
            console.log(Array.from(output.dataSync())); 
          });
    } 

}