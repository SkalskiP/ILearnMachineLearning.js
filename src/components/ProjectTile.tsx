import * as React from 'react';
import { Link } from 'react-router-dom';

interface IProps {
    name:string,
    rout:string
}

export const ProjectTile = (props:IProps) => {
    
    return(
        <div className="ProjectTile">
            <Link to={props.rout}>
                <div className="InnerProjectTile">
                    <b>{props.name}</b>
                </div>
            </Link>
        </div>
    );
}