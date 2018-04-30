import * as React from 'react';
import './../styles/DemoView.css';


export class DemoView extends React.Component {

    public render() {

        return(
            <div className="DemoView">
                <div className="PrettyContainer">
                    <div className="PrettyContainerHeader">
                        Draw
                    </div>
                    <div className="PrettyFiller"/>
                </div>
                <div className="PrettyContainer">
                    <div className="PrettyContainerHeader">
                        Predictions
                    </div>
                    <div className="PrettyFiller"/>
                </div>
            </div>
        );
    }
}