import * as React from 'react';
import {Particles} from "./Particles";
import ILMLLogo from '../../assets/images/logo_color.png';
import {ApplicationState} from "../../store";
import {connect} from "react-redux";
import {HomeViewMobileComplement} from "../mobileViews/HomeViewMobileComplement";

interface IProps {
    isMobile:boolean;
}

export const HomeViewComponent = (props:IProps) => {
    return(
        <div className="HomeView">
            <div className="Wrapper">
                <img alt={"I Learn Machine Learning Logo"}
                     src={ILMLLogo}
                />
                {props.isMobile && <HomeViewMobileComplement/>}
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