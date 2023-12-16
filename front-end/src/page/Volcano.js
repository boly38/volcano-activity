import React, {Component} from 'react';
import {eventTrack, getPendingRefusedLives, home, isSet, suggestModerated, toggleSuggests} from "../service/util";
import ApiV0 from "../service/ApiV0";
import VolcanoDetails from "./VolcanoDetails";
import ThumbnailSuggestLivesList from "../core/ThumbnailSuggestLivesList";
import ThumbnailLivesList from "../core/ThumbnailLivesList";

export default class Volcano extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: null,
            errorMessage: null,
        }
    }

    componentDidMount() {
        this._refocus();
    }

    _refocus() {
        this.commentInput && this.commentInput.focus();
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleAccept() {
        const {token, volcano} = this.props;
        const {id} = volcano;
        console.log("handleAccept", token, id);
        this.setState({
                waiting: true
            }, () => this.doAcceptSuggestedVolcano(token, id)
        );
    }

    handleDecline() {
        const {token, volcano} = this.props;
        const {id} = volcano;
        const {comment} = this.state;
        console.log("handleDecline", token, id, comment);
        this.setState({
                waiting: true
            }, () => this.doDeclineSuggestedVolcano(token, id, comment)
        );
    }

    doAcceptSuggestedVolcano(token, volcano_id) {
        console.log("doAcceptSuggestedVolcano", volcano_id)
        ApiV0.moderatorAcceptSuggestVolcano(token, volcano_id)
            .then(suggestId => {
                console.log("suggestId", suggestId)
                suggestModerated();
                eventTrack("moderator-accepted-volcano", {volcano_id});
                home();
            })
            .catch(suggestErr => {
                const {code, error, status} = suggestErr;
                console.log(`doAcceptSuggestedVolcano error ${status} - code:${code} error:${error}`)
                const errorMessage = error;
                eventTrack("moderator-accept-volcano-error", {volcano_id, code, status, error});
                this.setState({errorMessage, waiting: false});
            })
    }

    doDeclineSuggestedVolcano(token, volcano_id, comment) {
        console.log("doDeclineSuggestedVolcano", volcano_id, comment)
        ApiV0.moderatorDeclineSuggestVolcano(token, volcano_id, comment)
            .then(suggestId => {
                console.log("suggestId", suggestId)
                eventTrack("moderator-declined-volcano", {volcano_id});
                suggestModerated();
                home();
            })
            .catch(suggestErr => {
                const {code, error, status} = suggestErr;
                console.log(`doDeclineSuggestedVolcano error ${status} - code:${code} error:${error}`)
                const errorMessage = error;
                eventTrack("moderator-decline-volcano-error", {volcano_id, code, status, error});
                this.setState({errorMessage, waiting: false});
            })
    }

    volcanoDebug() {
        const {volcano} = this.props;
        return (
            <pre className="volcanoDebug">
                Volcano suggest payload:
                {JSON.stringify(volcano, null, 2)}
            </pre>
        );
    }

    volcanoModerate() {
        const declineEnabled = isSet(this.state.comment);
        return (
            <p className="entityModerate">
                <input name="comment" type="text" className="form-control"
                       placeholder="volcano suggest comment (to decline suggestion)"
                       pattern="[a-z]{1,255}" maxLength={255}
                       onChange={this.handleInputChange.bind(this)}
                       ref={(input) => {
                           this.commentInput = input;
                       }}
                />
                <button onClick={this.handleDecline.bind(this)} disabled={!declineEnabled}>Decline with comment
                </button>
                <button onClick={this.handleAccept.bind(this)}>Accept</button>
                <br/>
            </p>
        );
    }

    volcanoLives() {
        const {token, volcano, suggestId, showSuggests, suggestLives} = this.props;
        const {lives} = volcano;
        const volcanoId = volcano.id;
        const activeLives = lives?.filter(l => l.state === "active");
        const notActiveLives = lives?.filter(l => l.state !== "active");
        const {pendingSuggestLives, refusedSuggestLives} = getPendingRefusedLives(volcanoId, suggestLives);
        const withLiveNew = !isSet(suggestId);
        const livesList = lives && lives.length > 0 ?
            (<> <ThumbnailLivesList volcanoId={volcanoId} suggestId={suggestId} lives={activeLives} label="active lives"
                                    withLiveNew={withLiveNew}/>
                <ThumbnailLivesList volcanoId={volcanoId} suggestId={suggestId} lives={notActiveLives}
                                    label="offline lives" withLiveNew={false}/>
            </>) :
            (<ThumbnailLivesList volcanoId={volcanoId} suggestId={suggestId} lives={[]} label="lives"
                                 withLiveNew={withLiveNew}/>);
        const suggestsList = (<>
            <div className="clearBoth"/>
            {pendingSuggestLives.length + refusedSuggestLives.length > 0 && (<button className={showSuggests ? "toggleSuggest active" : "toggleSuggest"}
                                      onClick={() => toggleSuggests()}>Suggestions</button>)}
            {showSuggests && (<>
                <div className="clearBoth"/>
                <ThumbnailSuggestLivesList token={token} volcanoId={volcanoId} suggestId={suggestId}
                                           suggestLives={pendingSuggestLives}
                                           labelClass="listLabel" label="lives suggestions"/>
                <div className="clearBoth"/>
                <ThumbnailSuggestLivesList token={token} volcanoId={volcanoId} suggestId={suggestId}
                                           suggestLives={refusedSuggestLives}
                                           labelClass="listLabel refused" label="declined lives suggestions"/>
            </>)}
        </>)
        return (<div className="livesAllLists">
            {livesList}
            {suggestsList}
        </div>)
    }

    render() {
        const {token, volcano, suggestId} = this.props;
        return (<div className="entityContainer">
            <VolcanoDetails volcano={volcano} suggestId={suggestId}/>
            {isSet(suggestId) && isSet(token) && this.volcanoDebug()}
            {isSet(suggestId) && isSet(token) && this.volcanoModerate()}
            {this.volcanoLives()}
        </div>);
    }
}