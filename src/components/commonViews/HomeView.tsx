import * as React from 'react';
import {Particles} from "./Particles";
import {ApplicationState} from "../../store";
import {connect} from "react-redux";
import {HomeViewMobile} from "../mobileViews/HomeViewMobileComplement";
import {TextButton} from "./TextButton";

interface IProps {
    isMobile:boolean;
}

export const HomeViewComponent = (props:IProps) => {
    return(
        <div className="HomeView">
            <div className="Wrapper">
                <img alt={"I Learn Machine Learning Logo"}
                     src={"/images/logo/logo_color.png"}
                />
                {props.isMobile && <HomeViewMobile/>}
                {!props.isMobile && <div className="HomeViewComplement">
                    <p>
                        The whole application is written in React using TypeScript and Redux, but the engine that drives it is <b>TensorFlow.js</b> - a modern library for training and deploying machine learning models.
                    </p>
                    <TextButton
                        label={"EXPLORE"}
                        rout={"/projects/"}
                        style={{margin: 10}}
                    />
                </div>}
            </div>
            <Particles/>
        </div>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    isMobile: state.app.isMobile,
});

export const HomeView = connect(mapStateToProps, null)(
    HomeViewComponent
);