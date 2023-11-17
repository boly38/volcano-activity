import React, {Component} from 'react';
import HistoricLinks from "../core/HistoricLinks";
import ThumbnailVolcano from "../core/ThumbnailVolcano";

export default class Home extends Component {

    render() {
        const { volcanoes, historic } = this.props;
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        return (<>
            <div className="volcanoSubTitle">Bienvenue sur <span className="volcanoTitle">volcano-activity</span></div>
            <HistoricLinks historic={historic}/>
            { volcanoes && (<>
                <span className="listCount">{volcanoes?.length} entries</span>
                <div className="volcanoesList">
                    { volcanoes.map( (volcano, index) => (<ThumbnailVolcano key={index} volcano={volcano}/>) )}
                </div>

            </>)}
        </>);
    }
}