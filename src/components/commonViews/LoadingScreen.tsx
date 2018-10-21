import * as React from 'react';
import {ApplicationState} from "../../store";
import {connect, Dispatch} from "react-redux";
import {setModelLoadingStatus} from "../../store/app/actions";

interface IProps {
    setModelLoadingStatus: (status:boolean) => any;
}

export class LoadingScreenComponent extends React.Component<IProps, {}> {

    public componentDidMount() {
        this.props.setModelLoadingStatus(true);
    }

    public componentWillUnmount() {
        this.props.setModelLoadingStatus(false);
    }

    public render() {
        return(
            <div className="LoadingScreen">
                <div className="LoaderWrapper">
                    <div className="dot1"/>
                    <div className="dot2"/>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch<ApplicationState>) => ({
    setModelLoadingStatus: (status:boolean) => dispatch(setModelLoadingStatus(status)),
});

export const LoadingScreen = connect(null, mapDispatchToProps)(
    LoadingScreenComponent
);