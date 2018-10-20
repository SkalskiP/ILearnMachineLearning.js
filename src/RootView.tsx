import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MnistView } from './components/modelViews/MnistView';
import { TopBar } from './components/commonViews/TopBar';
import { HomeView } from './components/commonViews/HomeView';
import { ObjectDetectionView } from './components/modelViews/ObjectDetectionView';
import {ProjectsList} from "./components/commonViews/ProjectsList";

export const RootView = () => {

        return(
            <div className="RootView">
                <TopBar
                    backgroundImageSrc={"/images/top_bar.svg"}
                />
                <Switch>
                    <Route exact={true} path="/" component={HomeView} />
                    <Route exact={true} path="/projects/" component={ProjectsList} />
                    <Route exact={true} path="/mnist/" component={MnistView} />
                    <Route exact={true} path="/object_detection/" component={ObjectDetectionView} />
                </Switch>
            </div>
        );

}