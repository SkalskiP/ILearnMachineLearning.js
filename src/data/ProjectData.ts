import {IProject} from "../interfaces/IProject";

const ProjectData:IProject[] = [
    {
        name: "MNIST",
        rout: "/mnist/",
        imageSrc: "/images/mnist.png"
    },
    {
        name: "TINY YOLO",
        rout: "/object_detection/",
        imageSrc: "/images/yolo.png"
    }
];

export default ProjectData;