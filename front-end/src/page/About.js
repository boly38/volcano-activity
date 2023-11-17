import React, {Component} from 'react';
import HistoricLinks from "../core/HistoricLinks";

export default class About extends Component {
    render() {
        const {about} = this.props;
        const {version, startDate} = about?.application;
        const {"version": apiVersion, volcanoesCount, livesCount} = about?.api;
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        return (<>
            <div className="volcanoSubTitle">About <span className="volcanoTitle">volcano-activity</span></div>
            <HistoricLinks historic={this.props.historic}/>;
            <div className="aboutApp">
                App. version : {version}<br/><br/>
                API version  : {apiVersion}<br/>
                volcanoes    : {volcanoesCount}<br/>
                lives        : {livesCount}<br/>
            </div>
            <div className="volcanoAbout">
                <div className="largeScreen">
                    <div className="volcanicWrapper">
                        <marquee behavior="alternate"><span className="volcanicText">The earth is in perpetual seismic and volcanic activity</span>
                        </marquee>
                    </div>
                </div>
                <div className="smallScreen">The earth is in perpetual seismic and volcanic activity<br/></div>
                <br/>
                It is interesting to maintain the list of active webcams 📹 near the volcanoes 🗻 which can sometimes
                surprise 🔥.<br/>
                <br/>
                we may try to do that via collaborative 🤝👥 open github project 🏗️.
            </div>
        </>);
    }
}