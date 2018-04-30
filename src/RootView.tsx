import * as React from 'react';
import { DemoView } from './components/DemoView';
import { HorizontalNavbar } from './components/HorizontalNavbar';
import './RootView.css';

export class RootView extends React.Component {

    public render() {
        return(
        <div className="RootView">
            <HorizontalNavbar/>
            <DemoView/>
        </div>
        );
    }
}