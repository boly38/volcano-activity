import React, {Component} from 'react';
import {showPage} from "../service/util";

export default class ThumbnailVolcanoNew extends Component {

    render() {
        return (<div className="volcanoEntry" onClick={() => showPage('volcanoNew')} title="Add a new entry">
            <div className="volcanoIcon"><img src="/images/volcano_new.webp" width="100" alt="volcano add new one"/></div>
            ADD ONE <sup>lives</sup><br/>
            Country (Region)
        </div>);
    }
}