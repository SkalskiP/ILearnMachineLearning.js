import * as React from 'react';
import { Link } from 'react-router-dom';
import { ImageButton } from './ImageButton';
import { AppSettings } from '../settings/AppSettings';
import GitHubLogo from './../assets/images/GitHubLogo.png';
import TwitterLogo from './../assets/images/TwitterLogo.png';
import MediumLogo from './../assets/images/MediumLogo.png';
import ILMLLogo from './../assets/images/logo_white.png';
import { Route } from 'react-router-dom';
import {ToggledMenu} from "./ToggledMenu";

interface IProps {
    isMobile:boolean;
}

export const TopNavbar = (props:IProps) => {
    const {isMobile} = props;
    return(
        <div className="TopNavbar">
            <div className="NavbarGroup">
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
            {!isMobile && <div className="NavbarGroup">
                <ImageButton
                    image={MediumLogo}
                    imageAlt={"MediumLogo"}
                    href={AppSettings.MEDIUM_URL}
                    size={{width: 50, height: 50}}
                />
                <ImageButton
                    image={TwitterLogo}
                    imageAlt={"TwitterLogo"}
                    href={AppSettings.TWITTER_URL}
                    size={{width: 50, height: 50}}
                />
                <ImageButton
                    image={GitHubLogo}
                    imageAlt={"GitHubLogo"}
                    href={AppSettings.GITHUB_URL}
                    size={{width: 50, height: 50}}
                />
            </div>}
            {isMobile && <ToggledMenu
                buttonSize={{width: 50, height: 50}}
            />}
        </div>
    );
}