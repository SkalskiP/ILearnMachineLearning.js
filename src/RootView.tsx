import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MnistView } from './components/MnistView';
import { TopNavbar } from './components/TopNavbar';
import { HomeView } from './components/HomeView';

export class RootView extends React.Component {

    public render() {
        return(
        <div className="RootView">
            <TopNavbar/>
            <Switch>
                <Route exact={true} path="/" component={HomeView} />
                <Route exact={true} path="/mnist/" component={MnistView} />
            </Switch>
        </div>
        );
    }
}