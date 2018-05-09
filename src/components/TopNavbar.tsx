import * as React from 'react';
import './../styles/TopNavbar.css';
import { ImageButton } from './ImageButton';
import GHLogo from './../assets/images/GitHub-Mark-Light-64px.png';

export const TopNavbar = () => {
    
    return(
        <div className="TopNavbar">
            <div className="NavbarGroup">
                <div className="MainHeader">
                    <b>ILearnMachineLearning.js</b>
                </div>
                <div className="AdditionalHeader">
                    MNIST Project
                </div>
            </div>
            <div className="NavbarGroup">
                <ImageButton
                    image={GHLogo}
                    imageAlt={"GitHubLogo"}
                    href={"https://github.com/SkalskiP"}
                    size={{width: 55, height: 55}}
                />
            </div>
        </div>
    );
}