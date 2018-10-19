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

interface IProps {
    isMobile:boolean;
    backgroudImageSrc?:string;
}

export const TopBar = (props:IProps) => {
    const {isMobile} = props;

    const renderToggleMenu = () => {
        return(
            <div className="ToggledMenuContentWrapper">
                {getToggleMenuButtons()}
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

    const getToggleMenuButtons = () => {
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

    const style:React.CSSProperties = props.backgroudImageSrc ?
        {backgroundImage: 'url(' + props.backgroudImageSrc + ')'} : {};

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