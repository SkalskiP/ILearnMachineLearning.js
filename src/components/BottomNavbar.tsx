import * as React from 'react';
import './../styles/BottomNavbar.css';
import logo from './../assets/images/GitHub_Logo_White.png';

export const BottomNavbar = () => {
    
    return(
        <div className="BottomNavbar">
            <a href="https://github.com/SkalskiP" className="GitHubLogo">
                <img alt="GiHubLogo" src={logo}/>
            </a>
        </div>
    );
}