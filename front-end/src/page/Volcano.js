import React, {Component} from 'react';
import HistoricLinks from "../core/HistoricLinks";
import Live from "../core/Live";

export default class Volcano extends Component {

    volcanoDetails(name, country, region) {
        return (<>
            <div className="volcanoSubTitle">Volcano <span className="volcanoTitle">{name}</span></div>
            <HistoricLinks historic={this.props.historic}/>;
            <div className="volcanoAbout">
                {name} {country} ({region})
            </div>
        </>);
    }

    render() {
        const {name, country, region, lives} = this.props.volcano;
        return (<>
            {this.volcanoDetails(name, country, region)}
            {lives && (<>
                <span className="listCount">{lives?.length} lives</span>
                <div className="livesList">{lives.map(live => (<Live live={live}/>))}</div>
            </>)}
        </>);
    }
}