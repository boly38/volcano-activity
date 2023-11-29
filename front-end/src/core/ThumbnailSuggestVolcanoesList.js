import React, {Component} from 'react';
import ThumbnailVolcano from "./ThumbnailVolcano";
import {isSet} from "../service/util";

export default class ThumbnailSuggestVolcanoesList extends Component {
    render() {
        const {suggestVolcanoes, label, labelClass} = this.props;
        return isSet(suggestVolcanoes) && suggestVolcanoes.length > 0 ? (<>
            <span className={labelClass}>{suggestVolcanoes.length} {label}</span><br/>
            {suggestVolcanoes.map((suggest, index) => (
                <ThumbnailVolcano key={index}
                                  volcano={suggest}
                                  suggestId={suggest.id}/>
            ))}
        </>) : null;
    }
}