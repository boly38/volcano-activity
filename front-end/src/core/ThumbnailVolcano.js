import React, {Component} from 'react';
import {isSet, showPage} from "../service/util";

export default class ThumbnailVolcano extends Component {
    render() {
        const {volcano, suggestId} = this.props;
        if (!isSet(volcano)) {
            return null;
        }
        const volcanoStyle = "volcanoEntry" + (suggestId ? " volcanoEntrySuggest" : "");
        const volcanoImage = (suggestId ? "/images/volcano_suggest.webp" : "/images/volcano.webp");
        const {id, name, country, region} = volcano;
        const livesCount = volcano?.lives?.length;
        const onClick = () => suggestId ? showPage('volcano', volcano.volcano_id, suggestId) : showPage('volcano', id);
        return (<div className={volcanoStyle} onClick={onClick}>
            <div className="volcanoIcon"><img src={volcanoImage} width="100" alt="volcano view"/></div>
            {name} {livesCount && (<><sup>{livesCount}</sup></>)}<br/>
            {country} {region && (<>({region})</>)}
        </div>);
    }
}