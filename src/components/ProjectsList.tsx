import * as React from 'react';
import { ProjectTile } from './ProjectTile';

export const ProjectList = () => {
    return(
        <ProjectTile
            name={"MNIST"}
            rout={"/mnist/"}
        />
    );
}