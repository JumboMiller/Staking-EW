import React from "react";
import './css/App.css';

function Modal (props)
{
    return(

        <div className={ props.active ? "popup popactive" : "popup" } onClick={ () => props.setActive(false) } >
            <div className="popup-div">
               <h3>{props.text}</h3>
            </div>
        </div>
    )
}
export default Modal;