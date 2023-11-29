import React, {Component} from 'react';
import ApiV0 from "../service/ApiV0";
import CLoadInProgress from "../core/CLoadInProgress";
import {Alert} from "react-bootstrap";
import {eventTrack, home, suggestAdded} from "../service/util";
import Captcha from "./Captcha";

export default class AddVolcano extends Component {
    constructor(props) {
        super(props);

        this.state = {
            waiting: false,
            errorMessage: null,
            volcano_id: "",
            name: "",
            region: "",
            country: ""
        }
    }

    componentDidMount() {
        this.doCaptcha();
    }

    _refocus() {
        this.idInput.focus();
    }

    doCaptcha() {
        console.log("AddVolcano::doCaptcha")
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

    handleSubmit(event) {
        event.preventDefault();
        console.log("handleSubmit")
        this.setState({
                waiting: true
            }, () => this.doSuggestVolcano()
        );
    }

    doSuggestVolcano() {
        const {volcano_id, name, region, country, captcha} = this.state;
        const volcano = {volcano_id, name, region, country};
        console.log("doSuggestVolcano", volcano, captcha)
        ApiV0.postSuggestVolcano({volcano, captcha})
            .then(suggestId => {
                console.log("suggestId", suggestId)
                suggestAdded(suggestId);
                eventTrack(`moderator-add-volcano-suggest ${volcano_id}`, {volcano_id});
                home();
            })
            .catch(suggestErr => {
                const {code, error, status} = suggestErr;
                console.log(`doSuggestVolcano error ${status} - code:${code} error:${error}`)
                const errorMessage = error;
                eventTrack(`moderator-add-volcano-suggest-error ${volcano_id} ${code}`, {volcano_id, code, status, error});
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
        const {volcano_id, name, region, country, captcha, captchaSvg} = this.state;
        const alert = this.state.errorMessage &&
            (<div className="suggestError"><Alert variant="warning">{this.state.errorMessage}</Alert></div>);
        const submitDisabled = !(volcano_id && name && captcha);
        return (<div className="entityContainer">
            <div className="alignCenter">
                {alert}
                <h3>Add a new volcano</h3>
                <form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
                    <div className="card">
                        <div className="card-body">

                            <div className="form-group">
                                <label>Identifier</label>
                                <input name="volcano_id" type="text" className="form-control"
                                       value={volcano_id}
                                       placeholder="volcano identifier - expected format: [a-z]{1,50}"
                                       pattern="[a-z]{1,50}" maxLength={50}
                                       onChange={this.handleInputChange.bind(this)}
                                       ref={(input) => {
                                           this.idInput = input;
                                       }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Name</label>
                                <input name="name" type="text" className="form-control"
                                       value={name}
                                       placeholder="volcano name - max length: 255"
                                       maxLength={255}
                                       onChange={this.handleInputChange.bind(this)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Region</label>
                                <input name="region" type="text" className="form-control"
                                       value={region}
                                       placeholder="volcano region - max length: 255"
                                       maxLength={255}
                                       onChange={this.handleInputChange.bind(this)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input name="country" type="text" className="form-control"
                                       value={country}
                                       placeholder="volcano country - max length: 255"
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
                            <button className="btn btn-outline-secondary btn-vol"
                                    onClick={home}>Cancel
                            </button>
                            <br/>
                        </div>
                    </div>
                </form>
            </div>
        </div>);
    }


}