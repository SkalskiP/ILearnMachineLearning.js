import * as React from 'react';
import { PreetyBox } from './PreetyBox';
import { ProjectsList } from './ProjectsList';

export const HomeView = () => {

    let prettyBoxStyle:React.CSSProperties = {
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        color: "#000",
        borderColor: "#000"
    }

    return(
        <div className="HomeView">
            <PreetyBox 
                name="Projects" 
                style={prettyBoxStyle} 
                payload={<ProjectsList/>}
            />
        </div>
    );
}