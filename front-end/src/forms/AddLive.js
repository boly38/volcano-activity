import React, {Component} from 'react';
import ApiV0 from "../service/ApiV0";
import CLoadInProgress from "../core/CLoadInProgress";
import {Alert, Form} from 'react-bootstrap';
import {eventTrack, nowDate, showPage, suggestAdded} from "../service/util";
import VolcanoDetails from "../page/VolcanoDetails";
import Captcha from "./Captcha";

export default class AddLive extends Component {
    constructor(props) {
        super(props);

        this.state = {
            waiting: false,
            errorMessage: null,
            type: "",
            name: "",
            url: "",
            region: "",
            country: ""
        }
    }

    componentDidMount() {
        this.doCaptcha();
    }

    _refocus() {
        this.typeInput.focus();
    }

    doCaptcha() {
        console.log("AddLive::doCaptcha")
        ApiV0.captcha()
            .then(captchaResults => {
                this.setState({
                    captchaSvg: captchaResults.svg,
                    captcha: ""
                }, () => this._refocus());
            });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    backToVolcano() {
        const {volcano, suggestId} = this.props;
        const volcano_id = volcano?.id;
        console.log("backToVolcano",'volcano', volcano_id, suggestId)
        showPage('volcano', volcano_id, suggestId)
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("handleSubmit")
        this.setState({
                waiting: true
            }, () => this.doSuggestLive()
        );
    }
    /*
      "volcano_id": "colima",
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=Z-pozJXA1dc",
      "name": "🇲🇽🔺Monitoreo sísmico y volcánico mexicano (Popocatépetl, Colima, espectrogramas, sismogramas)",
      "location": "Popocatépetl, Colima",
      "owner": "Monitoreo César Cabrera",
      "ownerURl": "https://www.youtube.com/@MonitoreoCesarCabrera",
      "state": "active",
      "lastState": "2023-11-27",
      "lastActive": "",
      "lastUpdate": "2023-11-27",
      "file": "lives_colima.json"
     */

    doSuggestLive() {
        const {volcano, suggestId} = this.props;
        const volcano_id = volcano?.id;
        const { name, url, type, region, country, captcha } = this.state;// TODO : , embed
        const state = "active";
        const lastState = nowDate(); // "2023-11-27",
        const lastUpdate = nowDate(); // "2023-11-27",
        const live = { volcano_id, name, url, type, region, country, state, lastState, lastUpdate};
        if (suggestId !== null) {
            live.suggestId = suggestId;
        }
        console.log("doSuggestLive", live)
        ApiV0.postSuggestLive({live, captcha})
            .then(suggestId => {
                console.log("suggestId", suggestId)
                suggestAdded(suggestId);
                eventTrack(`moderator-add-live-suggest ${volcano_id} ${type}`, {volcano_id, type});
                this.backToVolcano();
            })
            .catch(suggestErr => {
                const {code, error, status} = suggestErr;
                console.log(`doSuggestLive error ${status} - code:${code} error:${error}`)
                const errorMessage = error;
                eventTrack(`moderator-add-live-suggest-error ${volcano_id} ${type} ${code}`, {volcano_id, type, code, status, error});
                this.setState({errorMessage, waiting: false, "captcha":""},
                    ()=> {
                        if (errorMessage && errorMessage.includes("captcha")) {
                            this.captcha.focus();
                        }
                    });
            })
    }

    render() {
        if (this.state.waiting === true) {
            return (<CLoadInProgress/>)
        }
        const {volcano, suggestId} = this.props
        const volcanoName = `${suggestId ? "suggested " : ""} ${volcano.name}`;
        const { errorMessage, captcha, captchaSvg, type, name, url, region, country } = this.state;
        const alert = errorMessage && (<div className="suggestError"><Alert variant="warning">{errorMessage}</Alert></div>);
        const submitDisabled = !(type && url && name);
        return (<div className="entityContainer">
            <div className="alignCenter">
                <VolcanoDetails volcano={volcano} suggestId={suggestId}/>
                {alert}
                <h3>Add a new live entry for {volcanoName}</h3>
                <form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
                    <div className="card">
                        <div className="card-body">
                            <div className="form-group">
                                <label>Live type</label>
                                <Form.Select
                                    onChange={this.handleInputChange.bind(this)}
                                    value={type}
                                    name="type"
                                    className="form-inline"
                                    ref={(input) => {
                                        this.typeInput = input;
                                    }}
                                >
                                    <option key={0} value="">Choisissez</option>
                                    )
                                    <option key={1} value="youtube">YouTube!</option>)
                                    <option key={2} value="webcam">Webcam</option>)
                                    <option key={3} value="earthquakes">Earthquakes</option>)
                                    <option key={4} value="monitoring">Monitoring</option>)
                                    <option key={5} value="news">News</option>)
                                    <option key={6} value="other">Other</option>)
                                </Form.Select>
                            </div>

                            <div className="form-group">
                                <label>Name</label>
                                <input name="name" type="text" className="form-control"
                                       placeholder="live name - max length: 255"
                                       value={name}
                                       maxLength={255}
                                       onChange={this.handleInputChange.bind(this)}
                                />
                            </div>
                            <div className="form-group">
                                <label>URL</label>
                                <input name="url" type="text" className="form-control"
                                       placeholder="live url - max length: 255"
                                       value={url}
                                       maxLength={255}
                                       onChange={this.handleInputChange.bind(this)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Region</label>
                                <input name="region" type="text" className="form-control"
                                       placeholder="live region - max length: 255"
                                       value={region}
                                       maxLength={255}
                                       onChange={this.handleInputChange.bind(this)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input name="country" type="text" className="form-control"
                                       placeholder="live country - max length: 255"
                                       value={country}
                                       maxLength={255}
                                       onChange={this.handleInputChange.bind(this)}
                                />
                            </div>

                            <Captcha childRef={ref => (this.captcha = ref)}
                                     captchaValue={captcha}
                                     captchaSvg={captchaSvg}
                                     onChange={this.handleInputChange.bind(this)}
                            />

                            <button type="submit"
                                    className="btn btn-success btn-vol"
                                    disabled={submitDisabled}>➕ Add
                            </button>
                            <button type="button"
                                    className="btn btn-outline-secondary btn-vol"
                                    onClick={this.backToVolcano.bind(this)}>Cancel
                            </button>
                            <br/>
                        </div>
                    </div>
                </form>
            </div>
        </div>);
    }


}