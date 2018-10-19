import * as React from 'react';

interface IProps {
    name:string,
    payload:JSX.Element,
    style:React.CSSProperties
}

export const PreetyBox = (props:IProps) => {
    
    let headerBoxStyle:React.CSSProperties = {};
    let payloadBoxStyle:React.CSSProperties = {};
    
    if(props.style.backgroundColor)
        headerBoxStyle.backgroundColor = props.style.backgroundColor
    if(props.style.color)
        headerBoxStyle.color = props.style.color

    if(props.style.borderColor)
        payloadBoxStyle.borderColor = props.style.borderColor

    return(
        <div className="PrettyBox" style={props.style}>
            <div className="PrettyBoxHeader" style={headerBoxStyle}>
                {props.name}
            </div>
            <div className="PrettyBoxPayload" style={payloadBoxStyle}>
                {props.payload}
            </div>
        </div>
    );
}