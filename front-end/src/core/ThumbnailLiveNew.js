import React, {Component} from 'react';
import {isSet, showPage} from "../service/util";

export default class ThumbnailLiveNew extends Component {
    render() {
        const {volcanoId, suggestId} = this.props;
        if (!isSet(volcanoId)) {
            return null;
        }
        const typeImage = "/images/camera_icon_add150.png";
        return (<div className="livesEntry liveNew" onClick={() => showPage('liveNew', volcanoId, suggestId)} title="Add a new entry">
            <img src={typeImage} width="150" alt="add volcano view"/><br/>
        </div>);
    }
}