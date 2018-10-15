import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MnistView } from './components/MnistView';
import { TopNavbar } from './components/TopNavbar';
import { HomeView } from './components/HomeView';
import { ObjectDetectionView } from './components/ObjectDetectionView';
import {AppSettings} from "./settings/AppSettings";

interface IState {
    isMobile:boolean;
}

export class RootView extends React.Component<{}, IState> {

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
            this.setState({isMobile});
        }
    };

    public render() {
        const {isMobile} = this.state;
        return(
            <div className="RootView">
                <TopNavbar
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