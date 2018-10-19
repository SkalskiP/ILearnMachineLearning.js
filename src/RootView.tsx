import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MnistView } from './components/MnistView';
import { TopBar } from './components/TopBar';
import { HomeView } from './components/HomeView';
import { ObjectDetectionView } from './components/ObjectDetectionView';
import {AppSettings} from "./settings/AppSettings";
import {connect, Dispatch} from "react-redux";
import {ApplicationState} from "./store";
import {setDeviceAsMobile} from "./store/app/actions";

interface IProps {
    isDeviceMobile: (isMobile:boolean) => any;
}

interface IState {
    isMobile:boolean;
}

export class RootViewComponent extends React.Component<IProps, IState> {

    constructor(props) {
        super(props);
        this.state = {
            isMobile: false
        }
    };

    public componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
    };

    public componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    };

    protected handleResize = () => {
        const isMobile:boolean = window.innerWidth < AppSettings.MOBILE_BORDER_WIDTH;

        if (isMobile !== this.state.isMobile) {
            this.props.isDeviceMobile(isMobile);
            this.setState({isMobile});
        }
    };

    public render() {
        const {isMobile} = this.state;
        return(
            <div className="RootView">
                <TopBar
                    isMobile={isMobile}
                />
                <Switch>
                    <Route exact={true} path="/" component={HomeView} />
                    <Route exact={true} path="/mnist/" component={MnistView} />
                    <Route exact={true} path="/object_detection/" component={ObjectDetectionView} />
                </Switch>
            </div>
        );
    };
}

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>) => ({
    isDeviceMobile: (isMobile:boolean) => dispatch(setDeviceAsMobile(isMobile))
});

export const RootView = connect(null, mapDispatchToProps)(
    RootViewComponent
);
