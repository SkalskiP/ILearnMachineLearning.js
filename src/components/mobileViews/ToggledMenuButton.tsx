import * as React from 'react';
import { Link } from 'react-router-dom';

interface IProps {
    key:string;
    image:string;
    imageAlt:string;
    label:string;
    href?:string;
    onClick?: () => any;
    rout?:string;
}

export const ToggledMenuButton = (props:IProps) => {
    const {key, image, imageAlt, label, href, onClick, rout} = props;

    const linkContents:React.ReactNode =
        <div className="MenuButtonWrapper">
            <img alt={imageAlt} src={image}/>
            <span className="ButtonLabel">
                {label}
            </span>
        </div>;

    return(
        <div
            className="ToggledMenuButton"
            key={key}
            onClick={onClick}
        >
            {!!href && <a href={href}>
                {linkContents}
            </a>}
            {!!rout && <Link to={props.rout}>
                {linkContents}
            </Link>}
            {!href && !rout && linkContents}
        </div>)
};