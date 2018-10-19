import * as React from "react";
import {TextButton} from "../commonViews/TextButton";
import * as screenfull from "screenfull";
import {ApplicationState} from "../../store";
import {connect, Dispatch} from "react-redux";
import {setDataConsumptionNotificationStatus, setFullScreenMode} from "../../store/app/actions";
import {FullScreenMode} from "../../data/FullScreenMode";

interface IProps {
    fullScreenMode:FullScreenMode;
    isNotifiedOfDataConsumption:boolean;
    setFullScreenMode: (mode:FullScreenMode) => any;
    notifiedOfDataConsumption: () => any;
}

export class HomeViewMobileComponent extends React.Component<IProps, {}> {

    protected goFullScreen = () => {
        if (screenfull && screenfull.enabled) {
            screenfull.request();
            this.props.setFullScreenMode(FullScreenMode.ACTIVE);
        }
    };

    protected doNotGoFullScreen = () => {
        this.props.setFullScreenMode(FullScreenMode.UNWANTED);
    };

    protected getDataConsumptionInfo = () => {
        return(
            <div className="HomeViewComplement">
                <p>
                    It looks like you are using a mobile device. To reduce your mobile data usage, make sure you are connected to wifi.
                </p>
                <TextButton
                    label={"I UNDERSTAND"}
                    onClick={this.props.notifiedOfDataConsumption}
                    style={this.getButtonStyle()}
                />
            </div>
        )
    };

    protected getFullScreenInfo = () => {
        return(
            <div className="HomeViewComplement">
                <p>
                    In order to take full advantage of the possibilities offered by the website, we suggest that you switch to full-screen mode.
                </p>
                <TextButton
                    label={"GO FULL SCREEN"}
                    onClick={this.goFullScreen}
                    style={this.getButtonStyle()}
                />
                <TextButton
                    label={"NO THANKS"}
                    onClick={this.doNotGoFullScreen}
                    style={this.getButtonStyle()}
                />
            </div>
        )
    };

    protected getDafaultScreen = () => {
        return(
            <div className="HomeViewComplement">
                <p>
                    The whole application is written in React using TypeScript and Redux, but the engine that drives it is <b>TensorFlow.js</b> - a modern library for training and deploying machine learning models.
                </p>
                <TextButton
                    label={"EXPLORE"}
                    rout={"/projects/"}
                    style={this.getButtonStyle()}
                />
            </div>
        )
    };

    protected getButtonStyle():React.CSSProperties {
        return {
            margin: 10
        }
    }

    public render() {
        const {isNotifiedOfDataConsumption, fullScreenMode} = this.props;
        if(!isNotifiedOfDataConsumption)
            return this.getDataConsumptionInfo();
        else if(fullScreenMode === FullScreenMode.UNKNOWN)
            return this.getFullScreenInfo();
        else
            return this.getDafaultScreen();
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    fullScreenMode: state.app.fullScreenMode,
    isNotifiedOfDataConsumption: state.app.isNotifiedOfDataConsumption,
});

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>) => ({
    setFullScreenMode: (mode:FullScreenMode) => dispatch(setFullScreenMode(mode)),
    notifiedOfDataConsumption: () => dispatch(setDataConsumptionNotificationStatus(true)),
});

export const HomeViewMobile = connect(mapStateToProps, mapDispatchToProps)(
    HomeViewMobileComponent
);