import {isSet} from "./util";

const JSON_MEDIA = 'application/json';
const JSON_GET = {method: 'GET', headers: {'Accept': JSON_MEDIA}};
const JSON_HEADERS = {'Accept': JSON_MEDIA, 'Content-Type': JSON_MEDIA};
const JSON_POST = {method: 'POST', headers: JSON_HEADERS};
const JSON_PUT = {method: 'PUT', headers: JSON_HEADERS};
const JSON_DELETE = {method: 'DELETE', headers: JSON_HEADERS};

export default class ApiV0 {

    static moderatorAcceptSuggestVolcano(token, suggestId) {
        return ApiV0.moderatorSuggestAccept(token, "volcano", suggestId);
    }
    static moderatorAcceptSuggestLive(token, suggestId) {
        return ApiV0.moderatorSuggestAccept(token, "live", suggestId);
    }
    static moderatorSuggestAccept(token, entity, suggestId) {
        return new Promise((resolve, reject) => {
            fetch(`/api/v0/suggests/${entity}/accept`, ApiV0._jsonPostBody({suggestId}, token))
                .then(response => ApiV0._response(response, resolve, reject))
                .catch(reject);
        });
    }
    static moderatorDeclineSuggestVolcano(token, suggestId, comment) {
        return ApiV0.moderatorSuggestDecline(token, 'volcano', suggestId, comment);
    }
    static moderatorDeclineSuggestLive(token, suggestId, comment) {
        return ApiV0.moderatorSuggestDecline(token, 'live', suggestId, comment);
    }
    static moderatorSuggestDecline(token, entity, suggestId, comment) {
        return new Promise((resolve, reject) => {
            fetch(`/api/v0/suggests/${entity}/comment`, ApiV0._jsonPostBody({suggestId, comment}, token))
                .then(response => ApiV0._response(response, resolve, reject))
                .catch(reject);
        });
    }


    static about() {
        return ApiV0.simpleFetch("/about");
    }
    static clearCaches(token) {
        return new Promise((resolve, reject) => {
            fetch('/api/v0/caches/clear', ApiV0._jsonPostBody({}, token))
                .then(response => ApiV0._response(response, resolve, reject))
                .catch(reject);
        });
    }
    static captcha() {
        return ApiV0.simpleFetch("/api/v0/captcha");
    }
    static authModerator(token) {
        return new Promise((resolve, reject) => {
            fetch('/api/v0/auth/moderator', ApiV0._jsonPostBody({token}))
                .then(response => ApiV0._response(response, resolve, reject))
                .catch(reject);
        });
    }

    static volcanoes() {
        return ApiV0.simpleFetch("/api/v0/volcanoes");
    }

    static suggests() {
        return ApiV0.simpleFetch("/api/v0/suggests");
    }

    static postSuggestVolcano(body) {
        return new Promise((resolve, reject) => {
            fetch('/api/v0/suggests/volcano', ApiV0._jsonPostBody(body))
                .then(response => ApiV0._response(response, resolve, reject))
                .catch(reject);
        });
    };

    static postSuggestLive(body) {
        return new Promise((resolve, reject) => {
            fetch('/api/v0/suggests/live', ApiV0._jsonPostBody(body))
                .then(response => ApiV0._response(response, resolve, reject))
                .catch(reject);
        });
    };


    static simpleFetch(apiEndpoint) {
        return new Promise((resolve, reject) => {
            fetch(apiEndpoint, JSON_GET)
                .catch(reject)
                .then(response => response.json())
                .then(response => resolve(response));
        });
    }

    static _jsonPostBody(body, token = null) {
        let options = JSON_POST;
        options.body = JSON.stringify(body);
        if (isSet(token)) {
            options.headers["x-token"] = token;
        }
        return options;
    }

    static _jsonPutBody(body) {
        let options = JSON_PUT;
        options.body = JSON.stringify(body);
        return options;
    }

    static _jsonDeleteBody(body) {
        let options = JSON_DELETE;
        options.body = JSON.stringify(body);
        return options;
    }

    static async _response(response, resolve, reject) {
        const responseString = await response.text();
        try {
            const responseParsed = JSON.parse(responseString);
            console.log("response", response.status, responseParsed);
            response.ok ? resolve(responseParsed) : reject(responseParsed);
        } catch (error) {
            console.log("(not json) response", response.status, responseString);
            response.ok ? resolve(responseString) : reject(responseString);
        }
    }

}