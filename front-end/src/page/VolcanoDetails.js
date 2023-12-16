import React, {Component} from "react";
import ThumbnailLocation from "../core/ThumbnailLocation";

export default class VolcanoDetails extends Component {
    render() {
        const {volcano, suggestId} = this.props;
        const {name, location, region, country} = volcano;
        return (
            <div className="entityAbout">
                Nom: {name} {suggestId && (<sup>Suggestion</sup>)}<br/>
                <ThumbnailLocation location={location} region={region} country={country}/>
            </div>
        );
    }
}