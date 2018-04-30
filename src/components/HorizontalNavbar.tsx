import * as React from 'react';
import './../styles/HorizontalNavbar.css';


export class HorizontalNavbar extends React.Component {
    
    public render() {
        return(
            <div className="HorizontalNavbar">
                <div className="MainHeader">
                    ILearnMachineLearning.js
                </div>
                <div className="AdditionalHeader">
                    Demo Project
                </div>
            </div>
        );
    }
}