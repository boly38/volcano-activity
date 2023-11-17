import React, {Component} from 'react';
import ApiV0 from "../service/ApiV0";

export default class ThumbnailVolcano extends Component {

    goToVolcano(id) {
        ApiV0.showPage('volcano',id)
    }

    render() {
        const {volcano} = this.props;
        if (!ApiV0.isSet(volcano)) {
            return null;
        }
        const {id, name, country, region } = volcano;
        const livesCount = volcano?.lives?.length;
        return (<div className="homeEntry" onClick={() => this.goToVolcano(id)}>
            <img src="/volcano.webp" width="250" alt="volcano view"/><br/>
            {name} {livesCount && (<><sup>{livesCount}</sup></>)}<br/>
            {country} ({region})
        </div>);
    }
}