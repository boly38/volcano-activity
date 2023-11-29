import React, {Component} from "react";
import ThumbnailLocation from "../core/ThumbnailLocation";

export default class LiveDetails extends Component {
    render() {
        const {volcano, live, isSuggest} = this.props;
        const volcanoName = volcano?.name;
        const {name, location, region, country} = live;
        return (
            <div className="entityContainer entityAbout">
                Live name: {name} {isSuggest && (<sup>Suggestion</sup>)}<br/>
                <small>Of volcano {volcanoName}</small><br/>
                <ThumbnailLocation location={location} region={region} country={country}/>
            </div>
        );
    }
}