import React, { Component } from 'react';
import CryptoJS from 'crypto-js';

// TODO : add refresh captcha button feature
export default class Captcha extends Component {

    componentDidMount() {
        if (!this.props.onChange) {
            console.error("Captcha props::onChange is not defined");
        }
        const { childRef } = this.props;
        childRef(this);
    }

    componentWillUnmount() {
        const { childRef } = this.props;
        childRef(undefined);
    }

    focus() {
        if (this.captchaTokenInput) {
            this.captchaTokenInput.focus();
        }
    }

    onChange(event) {
        if (!this.props.onChange) {
            return;
        }
        this.props.onChange(event);
    }

    render() {
        const captchaSvg = this.props.captchaSvg;
        if (captchaSvg === null || captchaSvg === undefined) {
            return (<div>captchaSvg is not defined</div>)
        }
        const md5Svg = CryptoJS.MD5(captchaSvg);
        const tokenValue = this.props.captchaValue;
        return (
            <div key={md5Svg}>
                <img src={`data:image/svg+xml;utf8,${encodeURIComponent(captchaSvg)}`} alt="captcha" />
                <div className="form-group">
                    <label>Captcha</label>
                    <input name="captcha"
                           id="captchaTokenInputField"
                           type="text"
                           className="form-control"
                           placeholder="captcha image value"
                           autoComplete="off"
                           value={tokenValue}
                           onChange={this.onChange.bind(this)}
                           ref={(input) => { this.captchaTokenInput = input; }}
                    />
                </div>
            </div>
        );
    }
}