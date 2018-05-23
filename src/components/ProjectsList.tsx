import * as React from 'react';
import { ProjectTile } from './ProjectTile';

export const ProjectsList = () => {
    return(
        <div className={"ProjectsList"}>
            <ProjectTile
                name={"MNIST"}
                rout={"/mnist/"}
                backgroudImageSrc={"/images/mnist.png"}
            />
            <ProjectTile
                name={"TINY YOLO"}
                rout={"/object_detection/"}
            />
        </div>
    );
}