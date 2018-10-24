import * as React from 'react';
import { DrawingBoard } from './DrawingBoard';
import { CircleChart } from './CircleChart';
import { PreetyBox } from '../commonViews/PreetyBox';
import {ApplicationState} from "../../store";
import {connect} from "react-redux";
import classNames from "classnames";
import {RoundedCornersBox} from "../commonViews/RoundedCornersBox";
import {LineChart} from "./LineChart";

interface IProps {
    isMobile:boolean;
}

export const MnistViewComponent = (props:IProps) => {

    const getClassName = () => classNames(
        "MnistView", {
            "mobile": props.isMobile,
            "desktop": !props.isMobile
        }
    );

    const getContent = () => {
        if (!props.isMobile) {
            return [
                <RoundedCornersBox
                    key={"Draw"}
                    name={"Draw"}
                    payload={<DrawingBoard/>}
                />,
                <RoundedCornersBox
                    key={"Predictions"}
                    name={"Predictions"}
                    payload={<CircleChart/>}
                />
            ];
        }
        else {
            return [
                <RoundedCornersBox
                    key={"Predictions"}
                    name={"Predictions"}
                    payload={<LineChart/>}
                />,
                <RoundedCornersBox
                    key={"Draw"}
                    name={"Draw"}
                    payload={<DrawingBoard/>}
                />
            ]
        }
    };

    return(
        <div className={getClassName()}>
            {getContent()}
        </div>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    isMobile: state.app.isMobile
});

export const MnistView = connect(mapStateToProps, null)(
    MnistViewComponent
);