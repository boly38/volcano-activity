import React, {Component} from 'react';
import ApiV0 from "../service/ApiV0";

export default class Live extends Component {

    getEmbedUrlFrom(liveUrl) {// credit - Sobral, J W, zurfyx : https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
        let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]+).*/;
        let r = liveUrl.match(rx);
        return r && r.length > 0 ? "https://www.youtube.com/embed/" + r[1] + "?enablejsapi=1" : null;
    }

    render() {
        const {live} = this.props;
        if (!ApiV0.isSet(live)) {
            return null;
        }
        const embedUrl = this.getEmbedUrlFrom(live.url);
        const typeImage = (live.type === 'earthquakes') ? "/earthquakes.jpg"
            : "/volcano_view.jpg";
        return (<div className="livesEntry">
            <a href={live.url} target="_live">
                {embedUrl ? (
                    <iframe width="300" height="215" src={embedUrl} title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen></iframe>
                ) : (<>
                    <img src={typeImage} width="300" alt="volcano view"/><br/>
                </>)}
                {live.name} {live.type} <sup>{live.owner}</sup><br/>
            </a>
            <span className="liveLocation">🗺️ {live.location}</span>
        </div>)
    }
}