import React, {Component} from 'react';

import Home from '../page/Home'
import About from "../page/About";
import ApiV0 from "../service/ApiV0";
import Volcano from "../page/Volcano";

const DEBUG = true;
const HISTORIC_MAX = 3;

export default class MainContent extends Component {
    constructor(props) {
        super(props);
        const page = "home";
        const volcanoId = null;
        this.state = {
            about: null,
            volcanoes: null,
            page,
            volcanoId,
            historic: [{page, volcanoId}]
        };
    }

    handlePageChange(event) {
        const {page, volcanoId} = event.detail;
        DEBUG && console.log("page has changed to", page, volcanoId);
        let historic = this.addHistoricEntry(page, volcanoId);
        DEBUG && console.log("NEW HISTO2", historic);
        this.setState({page, volcanoId, historic});
    }

    addHistoricEntry(page, volcanoId) {
        let {historic} = this.state;
        let newHistory = [...historic];
        const existing = newHistory.find(h => h.page === page && h.volcanoId === volcanoId);
        if (existing) {// then move it to the last position
            newHistory.push(newHistory.splice(newHistory.indexOf(existing), 1)[0]);
            return newHistory;
        }
        newHistory.push({page, volcanoId});
        DEBUG && console.log("PUSHED", {page, volcanoId});
        newHistory = newHistory.slice(Math.max(newHistory.length - HISTORIC_MAX, 0));// keep only HISTORIC_MAX last entries
        DEBUG && console.log("NEW HISTO", newHistory);
        return newHistory;
    }

    componentDidMount() {
        document.body.addEventListener('showPage', this.handlePageChange.bind(this));
        if (this.state.about === null) {
            this.doLoadAbout();
        }
        if (this.state.volcanoes === null) {
            this.doLoadVolcanoes();
        }
    }

    componentWillUnmount() {
        document.body.removeEventListener('showPage', this.handlePageChange.bind(this));
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

    render() {
        const {volcanoes, about, page, volcanoId, historic} = this.state;
        console.log("MC Render", {page, volcanoes, volcanoId, historic});
        let content;
        let volcano = (volcanoId) ? volcanoes.find(v => v.id === volcanoId) : null;
        if (page === 'about') {
            content = (<About historic={historic} about={about}/>);
        } else if (page === 'volcano' && volcano) {
            content = (<Volcano historic={historic} volcano={volcano}/>);
        } else {// default fallback to home
            content = (<Home historic={historic} volcanoes={volcanoes}/>);
        }
        return (<div id="app-main-content">{content}</div>);
    }
}