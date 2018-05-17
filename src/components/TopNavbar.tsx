import * as React from 'react';
import { ImageButton } from './ImageButton';
import { AppSettings } from '../settings/AppSettings';
import GitHubLogo from './../assets/images/GitHubLogo.png';
import TwitterLogo from './../assets/images/TwitterLogo.png';
import MediumLogo from './../assets/images/MediumLogo.png';
import ILMLLogo from './../assets/images/logo_color.png';

export const TopNavbar = () => {
    
    return(
        <div className="TopNavbar">
            <div className="NavbarGroup">
                <div className="Logo">
                <img alt={"I Learn Machine Learning Logo"} 
                    src={ILMLLogo} 
                    style={{maxHeight: 45}}/>
                </div>
                <div className="MainHeader">
                    <b>ILearnMachineLearning</b>
                </div>
                <div className="AdditionalHeader">
                    MNIST Project
                </div>
            </div>
            <div className="NavbarGroup">
                <ImageButton
                    image={MediumLogo}
                    imageAlt={"MediumLogo"}
                    href={AppSettings.mediumUrl}
                    size={{width: 45, height: 45}}
                />
                <ImageButton
                    image={TwitterLogo}
                    imageAlt={"TwitterLogo"}
                    href={AppSettings.twitterUrl}
                    size={{width: 45, height: 45}}
                />
                <ImageButton
                    image={GitHubLogo}
                    imageAlt={"GitHubLogo"}
                    href={AppSettings.gitHubUrl}
                    size={{width: 45, height: 45}}
                />
            </div>
        </div>
    );
}