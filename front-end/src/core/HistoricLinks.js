import React, {Component} from "react";
import {isSet, showPage} from "../service/util";

const DEBUG = false;
export default class HistoricLinks extends Component {
    historicEntry(index, historic, isLast) {
        const {page, volcanoId, suggestId, liveId} = historic
        const title = (isSet(volcanoId) && isSet(suggestId))
            ? `${page} ${volcanoId} - suggest ${suggestId} ${isSet(liveId) && "live"}`
            : isSet(volcanoId)
                ? `${page} ${volcanoId} ${isSet(liveId) && "live"}`
                : page;
        const label = isSet(volcanoId) ? `${page} ${volcanoId}` : page
        return (<span key={"histo" + index}>
            <button onClick={() => showPage(page, volcanoId, suggestId)}
                    className="histoLink"
                    title={title}>{label}</button>
            {!isLast && (<>&#160;◾&#160;</>)}
        </span>);
    }

    render() {
        const {historic} = this.props;
        if (historic === undefined || historic.length < 1) {
            return null;
        }
        return (<div className="histoLinks">Historic :
            {DEBUG && JSON.stringify(historic)}
            {historic.map((h, i) => this.historicEntry(i, h, i === historic.length - 1))}
        </div>)
    }
}