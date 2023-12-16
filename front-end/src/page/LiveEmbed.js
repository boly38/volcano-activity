import React, {Component} from "react";
import {getEmbedUrlFrom, isSet} from "../service/util";

export default class LiveEmbed extends Component {
    render() {
        const {live} = this.props;
        if (!isSet(live)) {
            return null;
        }
        const embedUrl = getEmbedUrlFrom(live);
        const typeImage = (live.type === 'earthquakes') ? "/images/earthquakes.jpg" : "/images/camera_icon_view150.png";
        return embedUrl ? (
            <iframe width="300" height="250" src={embedUrl} title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
        ) : (<>
            <img src={typeImage} width="150" alt="volcano view"/><br/>
        </>);
    }
}