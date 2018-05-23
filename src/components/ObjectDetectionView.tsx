import * as React from 'react';
import { PreetyBox } from './PreetyBox';
import { ImageLoader } from '../containers/ImageLoader';

export const ObjectDetectionView = () => {

    let prettyBoxStyle:React.CSSProperties = {
        width: "100%",
        height: "100%"
    }

    return(
        <div className="ObjectDetectionView">
            <PreetyBox 
                name="Where should I look?" 
                style={prettyBoxStyle} 
                payload={<ImageLoader/>}
            />
        </div>
    );
}