import React, {Component} from 'react';
import {getPendingRefusedLives, getPendingRefusedVolcanoes} from "../service/util";
import ThumbnailSuggestVolcanoesList from "../core/ThumbnailSuggestVolcanoesList";
import ThumbnailSuggestLivesList from "../core/ThumbnailSuggestLivesList";
import ApiV0 from "../service/ApiV0";

export default class Moderate extends Component {

    cleanCaches() {
        const {token} = this.props;
        console.log("clear caches")
        ApiV0.clearCaches(token).then(console.log).catch(console.log);
    }

    suggestOfVolcano(volcano, key) {
        const {token, suggestLives} = this.props;
        const volcanoId = volcano.id;
        const {pendingSuggestLives, refusedSuggestLives} = getPendingRefusedLives(volcanoId, suggestLives);
        if (pendingSuggestLives.length + refusedSuggestLives.length < 1) {
            return null;
        }
        return (<div className="entitiesList" key={key}>
            <h3>{volcanoId}</h3>
            <ThumbnailSuggestLivesList token={token} volcanoId={volcanoId}
                                       suggestLives={pendingSuggestLives}
                                       labelClass="listLabel" label="lives suggestions"/>
            <div className="clearBoth"/>
            <ThumbnailSuggestLivesList token={token} volcanoId={volcanoId}
                                       suggestLives={refusedSuggestLives}
                                       labelClass="listLabel refused" label="declined lives suggestions"/>
        </div>)
    }

    render() {
        const {volcanoes, suggestVolcanoes} = this.props;
        const {pendingSuggestVolcanoes, refusedSuggestVolcanoes} = getPendingRefusedVolcanoes(suggestVolcanoes);
        return (<div className="entitiesList">
            <button className="btn-outline-dark"
                    onClick={this.cleanCaches.bind(this)}>Clear caches
            </button>
            <ThumbnailSuggestVolcanoesList suggestVolcanoes={pendingSuggestVolcanoes}
                                           labelClass="listLabel" label="suggestions"/>
            <div className="clearBoth"/>
            <ThumbnailSuggestVolcanoesList suggestVolcanoes={refusedSuggestVolcanoes}
                                           labelClass="listLabel refused" label="declined suggestions"/>
            <div className="clearBoth"/>
            {volcanoes.map((v, key) => this.suggestOfVolcano(v, key))}
        </div>);
    }
}