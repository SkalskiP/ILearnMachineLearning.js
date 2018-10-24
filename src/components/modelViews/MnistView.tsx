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

            let prettyBoxLeftStyle:React.CSSProperties = {
                width: "40%",
                height: "100%"
            };

            let prettyBoxRightStyle:React.CSSProperties = {
                width: "60%",
                height: "100%"
            };

            return [
                <PreetyBox
                    key="Draw"
                    name="Draw"
                    style={prettyBoxLeftStyle}
                    payload={<DrawingBoard/>}
                />,
                <PreetyBox
                    key="Predictions"
                    name="Predictions"
                    style={prettyBoxRightStyle}
                    payload={<CircleChart/>}
                />
            ]
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
            ];
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