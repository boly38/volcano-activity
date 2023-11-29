import React, {Component} from 'react';
import ThumbnailVolcano from "../core/ThumbnailVolcano";
import ThumbnailVolcanoNew from "../core/ThumbnailVolcanoNew";
import {getPendingRefusedVolcanoes, toggleSuggests} from "../service/util";
import ThumbnailSuggestVolcanoesList from "../core/ThumbnailSuggestVolcanoesList";

export default class HomeVolcanoesList extends Component {

    render() {
        const {volcanoes, suggestVolcanoes, showSuggests} = this.props;
        const {pendingSuggestVolcanoes, refusedSuggestVolcanoes} = getPendingRefusedVolcanoes(suggestVolcanoes);
        return (<div className="entitiesList">
            <div className="clearBoth"/>
            {volcanoes && (<>
                <span className="listLabel">{volcanoes?.length} entries</span>
                <div className="clearBoth"/>
                {volcanoes.map(
                    (volcano, index) => (
                        <ThumbnailVolcano key={index} volcano={volcano}/>)
                )}
                <ThumbnailVolcanoNew/>
                <div className="clearBoth"/>
                {suggestVolcanoes && (<button className={showSuggests ? "toggleSuggest active" : "toggleSuggest"}
                                              onClick={() => toggleSuggests()}>Suggestions</button>)}
                {showSuggests && (<>
                    <div className="clearBoth"/>
                    <ThumbnailSuggestVolcanoesList suggestVolcanoes={pendingSuggestVolcanoes}
                                                   labelClass="listLabel" label="suggestions"/>
                    <div className="clearBoth"/>
                    <ThumbnailSuggestVolcanoesList suggestVolcanoes={refusedSuggestVolcanoes}
                                                   labelClass="listLabel refused" label="declined suggestions"/>
                </>)}
            </>)}
        </div>);
    }
}