import React from "react";
import {Spinner} from 'react-bootstrap';
import './CLoadInProgress.css';

const CLoadInProgress = (props) => {
    const {msg} = props;
    return (
        <>
            <div className="loadSpinner">
                <Spinner animation="border" role="status"/><br/>
            </div>
            <div className="loadText">
                <center>Loading in progress</center>
                {msg ? (<center>{msg}</center>) : null}
            </div>
        </>);
}

export default CLoadInProgress;