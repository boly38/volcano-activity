import React, {Component} from 'react';

export default class About extends Component {
    render() {
        const {about} = this.props;
        const {version, startDate} = about?.application;
        const {"version": apiVersion} = about?.api;
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        return (<div className="entityContainer">
            <h3>About</h3>
            <div className="aboutApp">
                App. version : {version} since {startDate}<br/><br/>
                API version  : {apiVersion}
            </div>
            <div className="entityAbout">
                <span className="rise-shake">The earth is in perpetual seismic and volcanic activity</span>
                <div className="clr"></div>
                <br/>
                It is interesting to maintain the list of active webcams 📹 near the volcanoes 🗻 which can sometimes
                surprise 🔥.<br/>
                <br/>
                we may try to do that via collaborative 🤝👥 open github project 🏗️ <a href="https://github.com/boly38/volcano-activity" target="_umami">volcano-activity</a>.<br/><br/>
                <small>ie. a web designer could bring a lot 😅 </small>
            </div>
        </div>);
    }
}