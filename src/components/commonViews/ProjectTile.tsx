import * as React from 'react';
import { Link } from 'react-router-dom';
import {ISize} from "../../interfaces/ISize";

interface IProps {
    name:string,
    rout:string,
    backgroudImageSrc?:string
    size?:ISize;
}

export const ProjectTile = (props:IProps) => {

    const styleSize:React.CSSProperties = props.size ? props.size : {};

    const innerTileStyle:React.CSSProperties = props.backgroudImageSrc ?
    {backgroundImage: 'url(' + props.backgroudImageSrc + ')'} : {};
    
    return(
        <div className="ProjectTile" style={styleSize}>
            <Link to={props.rout}>
                <div className="InnerProjectTile" style={styleSize}>
                    <div className="ProjectTileImage" style={innerTileStyle}>
                        <span>{props.name}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};