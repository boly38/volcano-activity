import React, {Component} from 'react';
import CLoadInProgress from "../core/CLoadInProgress";
import {Alert} from "react-bootstrap";
import {home, retainToken} from "../service/util";
import ApiV0 from "../service/ApiV0";

export default class LoginModerator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            waiting: false,
            errorMessage: null
        }
    }

    componentDidMount() {
        this._refocus();
    }

    _refocus() {
        this.tokenInput.focus();
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
            }, () => this.doLogin(this.state.token)
        );
    }

    doLogin(token) {
        console.log("authModerator", token)
        ApiV0.authModerator(token)
            .then(result => {
                if (result === false) {
                    this.setState({"errorMessage": "auth failed", waiting: false});
                } else {
                    console.log("welcome moderator");
                    retainToken(token)
                    home();
                }
            })
            .catch(suggestErr => {
                const {code, error, status} = suggestErr;
                console.log(`token error ${status} - code:${code} error:${error}`)
                const errorMessage = error;
                this.setState({errorMessage, waiting: false}, () => this._refocus());
            })
    }

    render() {
        if (this.state.waiting === true) {
            return (<CLoadInProgress/>)
        }
        const alert = this.state.errorMessage &&
            (<div className="suggestError"><Alert variant="warning">{this.state.errorMessage}</Alert></div>);
        const submitDisabled = !(this.state.token);
        return (<div className="entityContainer">
            <div className="alignCenter">
                {alert}
                <h3>Login as moderator</h3>
                <form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
                    <div className="card">
                        <div className="card-body">

                            <div className="form-group">
                                <label>Token</label>
                                <input name="token" type="text" className="form-control"
                                       placeholder="token"
                                       maxLength={255}
                                       onChange={this.handleInputChange.bind(this)}
                                       ref={(input) => {
                                           this.tokenInput = input;
                                       }}
                                />
                            </div>
                            <button type="submit" className="btn btn-secondary"
                                    disabled={submitDisabled}>Add
                            </button>
                            <button className="btn btn-secondary btn-login"
                                    onClick={() => home()}>Cancel
                            </button>
                            <br/>
                        </div>
                    </div>
                </form>
            </div>
        </div>);
    }

}