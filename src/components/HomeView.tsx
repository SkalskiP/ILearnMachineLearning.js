import * as React from 'react';
import {Particles} from "./Particles";
import ILMLLogo from './../assets/images/logo_color.png';

export const HomeView = () => {

    return(
        <div className="HomeView">
            <div className="Wrapper">
                <img alt={"I Learn Machine Learning Logo"}
                     src={ILMLLogo}
                />
            </div>
            <Particles/>
        </div>
    );
};