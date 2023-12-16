import React, {Component} from 'react';

import HomeVolcanoesList from '../page/HomeVolcanoesList'
import About from "../page/About";
import ApiV0 from "../service/ApiV0";
import Volcano from "../page/Volcano";
import AddVolcano from "../forms/AddVolcano";
import LoginModerator from "../forms/LoginModerator";
import Moderate from "../page/Moderate";
import AddLive from "../forms/AddLive";
import Live from "../page/Live";
import {eventTrack, isSet} from "../service/util";
import HistoricLinks from "./HistoricLinks";

const KEY_DOWN_ARROW = 40;
const DEBUG = false;
const HISTORIC_MAX = 3;

export default class MainContent extends Component {
    constructor(props) {
        super(props);
        const page = "home";
        const volcanoId = null;
        this.state = {
            about: null,
            volcanoes: null,
            suggests: null,
            showSuggests: false,
            page,
            volcanoId,
            historic: [{page, volcanoId}],
            token: null,
            downCount: 0
        };
    }

    toggleSuggests(event) {
        const {showSuggests} = this.state;
        eventTrack(`showSuggest to ${!showSuggests}`);
        this.setState({"showSuggests": !showSuggests});
    }

    handlePageChange(event) {
        const {page, volcanoId, suggestId, liveId} = event.detail;
        DEBUG && console.log(`page has changed to page:${page} volcano:${volcanoId} suggest:${suggestId} liveId:${liveId}`);
        let historic = this.addHistoricEntry(page, volcanoId, suggestId, liveId);
        this.setState({page, volcanoId, suggestId, liveId, historic});
    }

    _retainToken(event) {
        const {token} = event.detail;
        DEBUG && console.log(`retain token`);
        this.setState({token});
    }

    addHistoricEntry(page, volcanoId, suggestId, liveId) {
        let {historic} = this.state;
        let newHistory = [...historic];
        const existing = newHistory.find(h => h.page === page && h.volcanoId === volcanoId && h.suggestId === suggestId && h.liveId === liveId);
        if (existing) {// then move it to the last position
            newHistory.push(newHistory.splice(newHistory.indexOf(existing), 1)[0]);
            return newHistory;
        }
        if (!isSet(liveId)) {
            newHistory.push({page, volcanoId, suggestId, liveId});
            newHistory = newHistory.slice(Math.max(newHistory.length - HISTORIC_MAX, 0));// keep only HISTORIC_MAX last entries
        }
        return newHistory;
    }

    componentDidMount() {
        document.body.addEventListener('showPage', this.handlePageChange.bind(this));
        document.body.addEventListener('suggestAdded', this.doLoadSuggests.bind(this));
        document.body.addEventListener('suggestModerated', this.doLoadAndVolcano.bind(this));
        document.body.addEventListener('toggleSuggests', this.toggleSuggests.bind(this));
        document.body.addEventListener("keydown", this._handleKeyDown.bind(this));
        document.body.addEventListener("retainToken", this._retainToken.bind(this));
        if (this.state.about === null) {
            this.doLoadAbout();
        }
        if (this.state.volcanoes === null) {
            this.doLoadVolcanoes();
        }
        if (this.state.suggests === null) {
            this.doLoadSuggests();
        }
    }

    doLoadAndVolcano() {
        this.doLoadVolcanoes();
        this.doLoadSuggests();
    }

    componentWillUnmount() {
        document.body.removeEventListener('showPage', this.handlePageChange.bind(this));
        document.body.removeEventListener('suggestAdded', this.doLoadSuggests.bind(this));
        document.body.removeEventListener('suggestModerated', this.doLoadAndVolcano.bind(this));
        document.body.addEventListener('toggleSuggests', this.toggleSuggests.bind(this));
        document.body.removeEventListener("keydown", this._handleKeyDown.bind(this));
        document.body.removeEventListener("retainToken", this._retainToken.bind(this));
    }

    _handleKeyDown = (event) => {
        // DEBUG // console.log(event.keyCode)
        (event.keyCode === KEY_DOWN_ARROW) && this.onDown();
    }

    onDown() {
        let {downCount, token} = this.state;
        downCount++;
        this.setState({downCount}, () => {
            if (downCount % 10 === 0 && token === null) {
                this.setState({"page": "login"});
            }
        });
    }

    doLoadAbout() {
        ApiV0.about().then(about => {
            this.setState({about})
            DEBUG && console.log("about", about)
        });
    }

    doLoadVolcanoes() {
        ApiV0.volcanoes().then(volcanoes => {
            volcanoes.sort();
            this.setState({volcanoes})
            DEBUG && console.log("volcanoes", volcanoes)
        });
    }

    doLoadSuggests() {
        ApiV0.suggests().then(suggests => {
            this.setState({suggests})
            DEBUG && console.log("suggests", suggests)
        });
    }

    render() {
        const {
            volcanoes,
            suggests,
            showSuggests,
            about,
            page,
            volcanoId,
            suggestId,
            liveId,
            historic,
            token
        } = this.state;
        DEBUG && console.log("MainContent | ", {page, volcanoes, volcanoId, historic, suggests});
        let content;
        let volcano = volcanoId ? volcanoes.find(v => v.id === volcanoId) : null;
        if (volcanoId && isSet(suggestId)) {
            volcano = suggests?.suggestVolcanoes?.[suggestId];
        }
        const suggestedLives = suggests?.suggestLives;
        let live = liveId ? volcano?.lives?.find(l => l.id === liveId) : null;
        if (isSet(liveId)) {
            live = suggests?.suggestLives?.[liveId];
        }
        if (page === 'login') {
            content = (<LoginModerator/>);
        } else if (page === 'about') {
            content = (<About about={about}/>);
        } else if (page === 'volcanoNew') {
            content = (<AddVolcano/>);
        } else if (volcano && page === 'liveNew') {
            content = (<AddLive suggestId={suggestId} volcano={volcano}/>);
        } else if (page === 'moderate') {
            content = (<Moderate token={token}
                                 volcanoes={volcanoes}
                                 suggestVolcanoes={suggests?.suggestVolcanoes}
                                 suggestLives={suggests?.suggestLives}
                       />);
        } else if (page === 'volcano' && volcano) {
            content = (<Volcano token={token}
                                suggestId={suggestId}
                                volcano={volcano}
                                showSuggests={showSuggests}
                                suggestLives={suggestedLives}/>);
        } else if (page === 'live' && volcano && live) {
            content = (<Live token={token}
                             suggestId={suggestId}
                             volcano={volcano}
                             live={live}/>);
        } else {// default fallback to home
            content = (<HomeVolcanoesList volcanoes={volcanoes}
                                          showSuggests={showSuggests}
                                          suggestVolcanoes={suggests?.suggestVolcanoes}

            />);
        }
        return (<div id="app-main-content">
            <HistoricLinks historic={historic}/>
            <div className="clearBoth"/>
            {content}
        </div>);
    }
}