import * as React from 'react';
import { Link } from 'react-router-dom';
import { ImageButton } from './ImageButton';
import ILMLLogo from '../../assets/images/logo_white.png';
import { Route } from 'react-router-dom';
import {ToggledMenu} from "../mobileViews/ToggledMenu";
import SocialMediaData from "../../data/SocialMediaData";
import {ISocialMedia} from "../../interfaces/ISocialMedia";
import {ISize} from "../../interfaces/ISize";
import {ToggledMenuButton} from "../mobileViews/ToggledMenuButton";
import {connect, Dispatch} from "react-redux";
import {ApplicationState} from "../../store";
import {FullScreenMode} from "../../data/FullScreenMode";
import AllOptionsIco from './../../assets/images/AllOptions.png';
import ExitFullScreenIco from './../../assets/images/ExitFullScreen.png';
import EnterFullScreenIco from './../../assets/images/EnterFullScreen.png';
import {setFullScreenMode} from "../../store/app/actions";
import * as screenfull from "screenfull";

interface IProps {
    isMobile?:boolean;
    fullScreenMode?:FullScreenMode;
    backgroundImageSrc?:string;
    setFullScreenMode?: (mode:FullScreenMode) => any;
}

export const TopBarComponent = (props:IProps) => {
    const {isMobile} = props;

    const renderToggleMenu = () => {
        return(
            <div className="ToggledMenuContentWrapper">
                <div
                    key={1}
                    className="ToggledMenuSection"
                >
                    {getMainToggleButtons()}
                </div>
                <div
                    key={2}
                    className="ToggledMenuSection"
                >
                    {getSocialMediaToggleMenuButtons()}
                </div>
            </div>
        );
    };

    const getTopBarButtons = (size:ISize) => {
        return SocialMediaData.map((data:ISocialMedia) => {
            return <ImageButton
                key={data.displayName}
                size={size}
                image={data.image}
                imageAlt={data.imageAlt}
                href={data.href}
            />
        });
    };

    const getSocialMediaToggleMenuButtons = () => {
        return SocialMediaData.map((data:ISocialMedia) => {
            return <ToggledMenuButton
                key={data.displayName}
                image={data.image}
                imageAlt={data.imageAlt}
                label={data.displayName}
                href={data.href}
            />
        });
    };

    const getMainToggleButtons = () => {
        const buttons:React.ReactNode[] = [];
        console.log(props.fullScreenMode);
        buttons.push(
            <ToggledMenuButton
                key={"Explore projects"}
                image={AllOptionsIco}
                imageAlt={"All options icon"}
                label={"Explore projects"}
                rout={"/projects/"}
            />
        );
        if(props.fullScreenMode === FullScreenMode.ACTIVE)
            buttons.push(
                <ToggledMenuButton
                    key={"Exit full-screen"}
                    image={ExitFullScreenIco}
                    imageAlt={"Exit full-screen"}
                    label={"Exit full-screen"}
                    onClick={exitFullScreenCallback}
                />
            );
        else
            buttons.push(
                <ToggledMenuButton
                    key={"Enter full-screen"}
                    image={EnterFullScreenIco}
                    imageAlt={"Enter full-screen"}
                    label={"Enter full-screen"}
                    onClick={enterFullScreenCallback}
                />
            );
        return buttons;
    };

    const exitFullScreenCallback = () => {
        if (screenfull && screenfull.enabled) {
            screenfull.exit();
            props.setFullScreenMode(FullScreenMode.INACTIVE);
        }
    };

    const enterFullScreenCallback = () => {
        if (screenfull && screenfull.enabled) {
            screenfull.request();
            props.setFullScreenMode(FullScreenMode.ACTIVE);
        }
    };

    const style:React.CSSProperties = props.backgroundImageSrc ?
        {backgroundImage: 'url(' + props.backgroundImageSrc + ')'} : {};

    return(
        <div className="TopBar" style={style}>
            <div className="TopBarGroup">
                <div className="Logo">
                    <Link to="/" style={{maxHeight: 45}}>
                        <img alt={"I Learn Machine Learning Logo"} 
                            src={ILMLLogo} 
                            style={{maxHeight: 45}}
                        />
                    </Link>
                </div>
                {!isMobile && <div className="MainHeader">
                    <b>ILearnMachineLearning</b>
                </div>}
            </div>
            {!isMobile && <div className="TopBarGroup">
                {getTopBarButtons({width: 50, height: 50})}
            </div>}
            {isMobile && <ToggledMenu
                buttonSize={{width: 50, height: 50}}
                contentRenderer={renderToggleMenu}
            />}
        </div>
    );
};

export interface ITopBarProps {
    backgroundImageSrc?:string;
}

const mapStateToProps = (state: ApplicationState, ownProps: ITopBarProps) => ({
    isMobile: state.app.isMobile,
    fullScreenMode: state.app.fullScreenMode,
});

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>) => ({
    setFullScreenMode: (mode:FullScreenMode) => dispatch(setFullScreenMode(mode)),
});

export const TopBar = connect(mapStateToProps, mapDispatchToProps)(
    TopBarComponent
);