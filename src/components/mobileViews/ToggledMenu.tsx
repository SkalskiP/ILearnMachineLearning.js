import * as React from "react";
import classNames from "classnames";
import {ISize} from "../../interfaces/ISize";

interface IProps {
    buttonSize:ISize;
    contentRenderer:() => React.ReactNode;
}

interface IState {
    isOpened:boolean;
}

export class ToggledMenu extends React.Component<IProps, IState> {

    constructor(props) {
        super(props);
        this.state = {
            isOpened: false
        }
    }

    public toggleBurger = () => {
        this.setState({isOpened: !this.state.isOpened});
    };

    protected getMenuClassName() {
        const {isOpened} = this.state;
        return classNames("ToggledMenu", {"opened": isOpened});
    }

    public render() {
        const {buttonSize, contentRenderer} = this.props;
        const {isOpened} = this.state;

        const buttonStyle:React.CSSProperties = {
            width: buttonSize.width,
            height: buttonSize.height
        };

        return(
            <div className={this.getMenuClassName()} style={buttonStyle}>
                <div className="Panel" onClick={this.toggleBurger}>
                     {isOpened && contentRenderer()}
                </div>
                <div className="Button" onClick={this.toggleBurger}>
                    <div className="BarsContainer">
                        <div className="Bar" id="first"/>
                        <div className="Bar" id="second"/>
                        <div className="Bar" id="third"/>
                    </div>
                </div>
            </div>
        );
    }
}