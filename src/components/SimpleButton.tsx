import * as React from 'react';
import './../styles/SimpleButton.css';

interface IProps {
    name:string,
    width:number,
    height:number,
    onClick:() => void
}

export class SimpleButton extends React.Component<IProps, {}> {

    public render() {

        let simpleButtonStyle:React.CSSProperties = {
            width: this.props.width,
            height: this.props.height
        }

        return(
            <div className="SimpleButton" style={simpleButtonStyle} onClick={this.props.onClick}>
                {this.props.name}
            </div>
        );
    }
}