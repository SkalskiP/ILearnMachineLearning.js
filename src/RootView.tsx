import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { DemoView } from './components/DemoView';
import { TopNavbar } from './components/TopNavbar';

export class RootView extends React.Component {

    public render() {
        return(
        <div className="RootView">
            <TopNavbar/>
            <Switch>
                <Route exact={true} path="/" component={DemoView} />
            </Switch>
        </div>
        );
    }
}