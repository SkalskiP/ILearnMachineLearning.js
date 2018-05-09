import * as React from 'react';
import { DemoView } from './components/DemoView';
import { TopNavbar } from './components/TopNavbar';
import './RootView.css';

export class RootView extends React.Component {

    public render() {
        return(
        <div className="RootView">
            <TopNavbar/>
            <DemoView/>
        </div>
        );
    }
}