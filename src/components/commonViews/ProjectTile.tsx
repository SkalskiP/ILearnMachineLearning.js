import * as React from 'react';
import { Link } from 'react-router-dom';

interface IProps {
    name:string,
    rout:string,
    backgroudImageSrc?:string
}

export const ProjectTile = (props:IProps) => {

    let innerTileStyle:React.CSSProperties = props.backgroudImageSrc ? 
    {backgroundImage: 'url(' + props.backgroudImageSrc + ')'} : {};
    
    return(
        <div className="ProjectTile">
            <Link to={props.rout}>
                <div className="InnerProjectTile">
                    <div className="ProjectTileImage" style={innerTileStyle}>
                        <span>{props.name}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};