import React, {Component} from 'react';
import {showPage} from "../service/util";
import ThumbnailLocation from "./ThumbnailLocation";
import LiveEmbed from "../page/LiveEmbed";

export default class ThumbnailLive extends Component {

    editLive() {
        const {volcanoId, suggestId, liveId} = this.props;
        showPage("live", volcanoId, suggestId, liveId)
    }

    render() {
        const {live, editSuggest} = this.props;
        const editLiveIcon = (<div className="editIcon" onClick={this.editLive.bind(this)}><img src="/icons/editw.png" alt="edit" width={30}/></div>)
        const liveDescription = (<>{live.name} {live.type} <sup>{live.owner}</sup><br/></>);
        return (<div className="livesEntry">
            {live.state === 'active' ? (<>
                <LiveEmbed live={live}/><br/>
                { editSuggest && editLiveIcon} <a href={live.url} target="_live">{liveDescription}</a>
                <ThumbnailLocation location={live.location} region={live.region} country={live.country}/>
            </>) : (
                <a href={live.url} target="_live">{liveDescription}</a>
            )}
        </div>)
    }
}