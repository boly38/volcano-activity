import React, {Component} from 'react';
import {isSet} from "../service/util";
import ThumbnailLive from "./ThumbnailLive";
import ThumbnailLiveNew from "./ThumbnailLiveNew";

export default class ThumbnailLivesList extends Component {
    render() {
        const {volcanoId, suggestId, lives, label, withLiveNew} = this.props;
        return withLiveNew || (isSet(lives) && lives.length > 0) ? (<>
            <span className="listLabel">{lives.length} {label}</span><br/>
            {lives.map((live, index) => (<ThumbnailLive key={index}
                                                        volcanoId={volcanoId} suggestId={suggestId}
                                                        live={live} liveId={live.id} editSuggest={false}/>))}
            {withLiveNew && (<ThumbnailLiveNew volcanoId={volcanoId} suggestId={suggestId}/>)}
            <div className="clearBoth"/>
        </>) : null;
    }
}