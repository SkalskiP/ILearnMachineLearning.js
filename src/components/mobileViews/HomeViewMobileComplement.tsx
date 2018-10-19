import * as React from "react";
import {TextButton} from "../commonViews/TextButton";
import * as screenfull from "screenfull";

export class HomeViewMobileComplement extends React.Component {

    protected goFullScreen = () => {
        if (screenfull.enabled) {
            screenfull.request();
        }
    };

    public render() {
        return(
            <div className="HomeViewMobileComplement">
                <p>
                    It looks like you are using a mobile device. To reduce your mobile data usage, make sure you are connected to wifi.
                </p>
                <TextButton
                    label={"LET'S GO"}
                    onClick={this.goFullScreen}
                />
            </div>
        )
    }
}