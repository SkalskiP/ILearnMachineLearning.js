import * as React from 'react';

interface IProps {
    key:string;
    image:string;
    imageAlt:string;
    label:string;
    href:string;
}

export const ToggledMenuButton = (props:IProps) => {
    return(
        <div
            className="ToggledMenuButton"
            key={props.key}
        >
            <a href={props.href}>
                <div className="MenuButtonWrapper">
                    <img alt={props.imageAlt} src={props.image}/>
                    <span className="ButtonLabel">
                        {props.label}
                    </span>
                </div>
            </a>
        </div>)
};