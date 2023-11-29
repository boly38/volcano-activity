import React, {Component} from 'react';
import {isSet} from "../service/util";
import ThumbnailLive from "./ThumbnailLive";

export default class ThumbnailSuggestLivesList extends Component {
    render() {
        const {token, volcanoId, suggestId, suggestLives, label, labelClass} = this.props;
        return isSet(suggestLives) && suggestLives.length > 0 ? (<div className="livesEntries">
            <span className={labelClass}>{suggestLives.length} {label}</span><br/>
            {suggestLives.map((live, index) => (
                <ThumbnailLive key={index}
                               volcanoId={volcanoId} suggestId={suggestId}
                               live={live} liveId={live.id} editSuggest={isSet(token)}/>
            ))}
        </div>) : null;
    }
}