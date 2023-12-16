import React, {Component} from 'react';
import {isSet} from "../service/util";

export default class ThumbnailLocation extends Component {

    render() {
        const {location, region, country} = this.props;
        if (!isSet(`${location}${region}${country}`)) {
            return null;
        }
        return location ? (<span className="thumbnailLocation">🗺️ {location}</span>):
            (<span className="thumbnailLocation">🗺️ {country} {region && (<>({region})</>)}</span>)
    }
}