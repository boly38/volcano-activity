import React, {Component} from "react";
import ApiV0 from "../service/ApiV0";
import {isSet, showPage, suggestModerated, eventTrack} from "../service/util";
import {Alert} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LiveDetails from "./LiveDetails";
import LiveEmbed from "./LiveEmbed";

export default class Live extends Component {
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
        const {token, live} = this.props;
        const {id} = live;
        console.log("handleAccept", token, id);
        this.setState({
                waiting: true
            }, () => this.doAcceptSuggestedLive(token, id, live.volcano_id)
        );
    }

    handleDecline() {
        const {token, live} = this.props;
        const {id} = live;
        const {comment} = this.state;
        console.log("handleDecline", token, id, comment);
        this.setState({
                waiting: true
            }, () => this.doDeclineSuggestedLive(token, id, comment, live.volcano_id)
        );
    }

    doAcceptSuggestedLive(token, id, volcano_id) {
        console.log("doAcceptSuggestedLive", id)
        ApiV0.moderatorAcceptSuggestLive(token, id)
            .then(suggestId => {
                console.log("suggestId", suggestId)
                suggestModerated();
                eventTrack("moderator-accepted-live", {volcano_id});
                showPage('volcano', volcano_id);
            })
            .catch(suggestErr => {
                const {code, error, status} = suggestErr;
                console.log(`doAcceptSuggestedLive error ${status} - code:${code} error:${error}`)
                const errorMessage = error;
                eventTrack("moderator-accept-live-error", {volcano_id, code, status, error});
                this.setState({errorMessage, waiting: false});
            })
    }

    doDeclineSuggestedLive(token, id, comment, volcano_id) {
        console.log("doDeclineSuggestedLive", id, comment)
        ApiV0.moderatorDeclineSuggestLive(token, id, comment)
            .then(suggestId => {
                console.log("suggestId", suggestId)
                eventTrack("moderator-declined-live", {volcano_id});
                suggestModerated();
                showPage('volcano', volcano_id);
            })
            .catch(suggestErr => {
                const {code, error, status} = suggestErr;
                console.log(`doDeclineSuggestedLive error ${status} - code:${code} error:${error}`)
                const errorMessage = error;
                eventTrack("moderator-decline-suggest-error", {volcano_id, code, status, error});
                this.setState({errorMessage, waiting: false});
            })
    }

    liveFormDetails() {
        const {live} = this.props;
        return (<div className="entityFormDetails">
            <Container>
                <Row><Col className="tar">Id</Col><Col className="tal">{live.id}</Col><Col>&#160;</Col></Row>
                <Row><Col className="tar">Type</Col><Col className="tal">{live.type}</Col><Col>&#160;</Col></Row>
                <Row><Col className="tar">URL</Col><Col className="tal">{live.url}</Col><Col>&#160;</Col></Row>
                <Row><Col className="tar">State</Col><Col className="tal">{live.state}</Col><Col>&#160;</Col></Row>
                <Row><Col className="tar">Updated</Col><Col className="tal">{live.updated}</Col><Col>&#160;</Col></Row>
                <Row><Col className="tar">URL embed preview</Col><Col className="tal"><LiveEmbed live={live}/></Col><Col>&#160;</Col></Row>
                { isSet(live.comment) && (
                    <Row><Col className="tar">Comment</Col><Col className="tal">{live.comment}</Col><Col>&#160;</Col></Row>
                )}
            </Container>
        </div>)
    }

    liveModerate() {
        const declineEnabled = isSet(this.state.comment);
        return (
            <p className="entityModerate">
                <Stack direction="horizontal" gap={3}>
                    <Form.Control name="comment" className="me-auto"
                                  placeholder="live suggest comment (to decline suggestion)"
                                  pattern="[a-z]{1,255}" maxLength={255}
                                  onChange={this.handleInputChange.bind(this)}
                                  ref={(input) => {
                                      this.commentInput = input;
                                  }}
                    />
                    <Button variant="danger"
                            onClick={this.handleDecline.bind(this)}
                            disabled={!declineEnabled}>Decline</Button>
                    <div className="vr"/>
                    <Button variant="success"
                            onClick={this.handleAccept.bind(this)}>Accept</Button>
                </Stack>
            </p>
        );
    }


    render() {
        const {token, volcano, live, liveId} = this.props;
        const alert = this.state.errorMessage &&
            (<div className="suggestError"><Alert variant="warning">{this.state.errorMessage}</Alert></div>);
        return (<>
            {alert}
            <LiveDetails volcano={volcano} live={live} suggestId={liveId}/>
            {this.liveFormDetails()}
            {isSet(token) && this.liveModerate()}
        </>);
    }
}