import * as React from 'react';
import { PreetyBox } from './PreetyBox';
import { ProjectList } from './ProjectsList';

export const HomeView = () => {

    let prettyBoxStyle:React.CSSProperties = {
        width: "100%",
        height: "100%"
    }

    return(
        <div className="HomeView">
            <PreetyBox 
                name="Projects" 
                style={prettyBoxStyle} 
                payload={<ProjectList/>}
            />
        </div>
    );
}