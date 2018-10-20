import * as React from 'react';
import { ProjectTile } from './ProjectTile';
import {ApplicationState} from "../../store";
import {connect} from "react-redux";
import ProjectData from "../../data/ProjectData";
import {IProject} from "../../interfaces/IProject";
import Scrollbars from "react-custom-scrollbars"
import {ISize} from "../../interfaces/ISize";
import classNames from "classnames";

interface IProps {
    isMobile?:boolean;
}

interface IState {
    mainDivSize:ISize;
}

class ProjectsListComponent extends React.Component<IProps, IState> {

    protected mainDiv:HTMLDivElement = null;

    constructor(props) {
        super(props);
        this.state = {
            mainDivSize: null
        }
    }

    public componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
        window.addEventListener("deviceorientation", this.handleResize);
    };

    public componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
        window.removeEventListener("deviceorientation", this.handleResize);
    };

    protected handleResize = () => {
        if (!this.mainDiv)
            return;

        const mainDivSize = this.mainDiv.getBoundingClientRect();

        this.setState({
            mainDivSize: {width: mainDivSize.width, height: mainDivSize.height}
        });
    };

    protected getProjectTiles = () => {

        const tileSize:ISize = this.state.mainDivSize && this.props.isMobile ?
            {
                width: Math.min(this.state.mainDivSize.width - 50, 400),
                height: Math.min(this.state.mainDivSize.width - 50, 400)
            } : null;

        return ProjectData.map((projectData:IProject, index:number) => {
            return <ProjectTile
                key={index}
                name={projectData.name}
                rout={projectData.rout}
                backgroudImageSrc={projectData.imageSrc}
                size={tileSize}
            />
        })
    };

    protected getClassName = () => {
        return classNames(
            "InnerProjectsList",
            {
                "mobile": this.props.isMobile,
                "desktop": !this.props.isMobile
            }
        );
    };

    public render() {
        let innerListStyle:React.CSSProperties = this.state.mainDivSize ?
            {
                width: this.state.mainDivSize.width,
                minHeight: this.state.mainDivSize.height
            } : {};

        return(
            <div
                className="ProjectsList"
                ref = {ref => this.mainDiv = ref}
            >
                <Scrollbars>
                    <div className={this.getClassName()} style={innerListStyle}>
                        {this.getProjectTiles()}
                    </div>
                </Scrollbars>
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    isMobile: state.app.isMobile,
});

export const ProjectsList = connect(mapStateToProps, null)(
    ProjectsListComponent
);