import * as React from 'react';
import { PreetyBox } from '../commonViews/PreetyBox';
import { ImageLoader } from './ImageLoader';

export const ObjectDetectionView = () => {

    let prettyBoxStyle:React.CSSProperties = {
        width: "100%",
        height: "100%"
    }

    return(
        <div className="ObjectDetectionView">
            <PreetyBox 
                name="Let me take a look" 
                style={prettyBoxStyle} 
                payload={<ImageLoader/>}
            />
        </div>
    );
}