import {v4 as uuidv4} from "uuid";
import semaphore from "semaphore";
import Logger from "./logger.js";
import Pantry from "./pantry.js";
import V0Data from "../data/v0/v0Data.js";
import {clone, isEmpty, isSet} from "./util.js";
import InvalidParameterError from "../error/InvalidParameterError.js";

const MAX_SUGGEST_EDITS = 10;
const EDIT_SUGGEST_LIVES = "suggestLives";
const EDIT_SUGGEST_VOLCANOES = "suggestVolcanoes";

const countAwaitingModeration = (editSuggests) => Object.keys(editSuggests).map(k => editSuggests[k]).filter(suggest => suggest["comment"] === undefined).length;
export default class Dao {
    constructor() {
        this.log = (new Logger()).getLogger();
        let v0Data = new V0Data();
        this.v0Data = v0Data.get();
        this.pantry = new Pantry();
        this.writeSemaphore = semaphore(1);
    }

    getContext() {
        return this.pantry.getDetails();
    }

    getVolcanoes() {
        return this._semWritePromise((resolve, reject) => {
            this.pantry.getProd()
                .then(content => {
                    if (isEmpty(content)) {
                        let volcanoes = this.v0Data.volcanoesOnly;
                        let lives = this.v0Data.livesOnly;
                        this.log.info("no on-line volcanoes version, fallback to static version", volcanoes, lives);
                        this.pantry.setProd({volcanoes, lives})
                            .then(() => resolve({volcanoes, lives}))
                            .catch(reject)
                    } else {
                        resolve(content);
                    }
                })
                .catch(reject)

        })
    }

    getSuggests() {
        return this.pantry.getEdit()
    }

    setVolcanoes(volcanoes) {
        return this._semWritePromise((resolve, reject) => this.pantry.setProd(volcanoes).then(resolve).catch(reject));
    }

    suggestNewLive(newLive) {
        return this._pushEdit(EDIT_SUGGEST_LIVES, newLive);
    }

    suggestNewVolcano(newVolcano) {
        if (!isSet(newVolcano['volcano_id'])) {
            throw new InvalidParameterError("invalid volcano suggestion: expected a volcano_id");
        }
        return this._pushEdit(EDIT_SUGGEST_VOLCANOES, newVolcano);
    }

    acceptSuggestVolcano(suggestId) {
        return this._semWritePromise((subResolve, subReject) => {
            this.pantry.getEdit().then(edit => {
                const toBeAccepted = clone(edit)?.[EDIT_SUGGEST_VOLCANOES]?.[suggestId];
                if (!isSet(toBeAccepted)) {
                    throw new InvalidParameterError("invalid suggestion id");
                } else if (!isSet(toBeAccepted["volcano_id"])) {
                    throw new InvalidParameterError("suggestion without volcano_id");
                }
                this.pantry.getProd().then(contentResponse => {
                    let {volcanoes, lives} = clone(contentResponse);
                    const volcanoId = toBeAccepted["volcano_id"];
                    volcanoes = volcanoes.filter(v => v["id"] !== volcanoId);// remove previous volcano_id
                    toBeAccepted["id"] = volcanoId;
                    delete toBeAccepted["volcano_id"];
                    toBeAccepted.lastModeration = new Date();
                    volcanoes.push(toBeAccepted);// add suggested volcano
                    this.pantry.setProd({volcanoes, lives}).then(prodUpdated => {
                        this.log.info(`added suggested volcano #${suggestId} for ${volcanoId}: ${prodUpdated} | ${JSON.stringify(toBeAccepted)}`,
                            {toBeAccepted});
                        delete edit[EDIT_SUGGEST_VOLCANOES][suggestId]; // remove suggest entry
                        this.pantry.setEdit(edit).then(editUpdated => subResolve(volcanoId)).catch(subReject);
                    }).catch(err => subReject(err));
                }).catch(err => subReject(err));
            }).catch(err => subReject(err));
        });
    }

    acceptSuggestLive(suggestId) {
        return this._semWritePromise((subResolve, subReject) => {
            this.pantry.getEdit().then(edit => {
                const toBeAccepted = clone(edit)?.[EDIT_SUGGEST_LIVES]?.[suggestId];
                if (!isSet(toBeAccepted)) {
                    throw new InvalidParameterError("invalid suggestion id");
                } else if (!isSet(toBeAccepted["volcano_id"])) {
                    throw new InvalidParameterError("suggestion without volcano_id");
                }
                this.pantry.getProd().then(contentResponse => {
                    let {volcanoes, lives} = clone(contentResponse);
                    const volcanoId = toBeAccepted["volcano_id"];
                    if (!volcanoes.find(v => v["id"] === volcanoId)) {
                        throw new InvalidParameterError(`suggestion with unknown volcano_id: '${volcanoId}`);
                    }
                    lives = lives.filter(v => v["id"] !== suggestId);// remove previous live
                    toBeAccepted.lastModeration = new Date();
                    lives.push(toBeAccepted);// add suggested live
                    this.pantry.setProd({volcanoes, lives}).then(prodUpdated => {
                        this.log.info(`added suggested live #${suggestId} for ${volcanoId}: ${prodUpdated}`, {toBeAccepted});
                        delete edit[EDIT_SUGGEST_LIVES][suggestId]; // remove suggest entry
                        this.pantry.setEdit(edit).then(editUpdated => subResolve(suggestId)).catch(subReject);
                    }).catch(err => subReject(err));
                }).catch(err => subReject(err));
            }).catch(err => subReject(err));
        });
    }

    commentSuggestVolcano(suggestId, comment = "") {
        return this._commentSuggest(EDIT_SUGGEST_VOLCANOES, suggestId, comment);
    }

    commentSuggestLive(suggestId, comment = "") {
        return this._commentSuggest(EDIT_SUGGEST_LIVES, suggestId, comment);
    }

    _commentSuggest(suggestKey, suggestId, comment) {
        return this._semWritePromise((subResolve, subReject) => {
            this.pantry.getEdit().then(edit => {
                const toBeAccepted = clone(edit)?.[suggestKey]?.[suggestId];
                if (!isSet(toBeAccepted)) {
                    throw new InvalidParameterError("invalid suggestion id");
                }
                edit[suggestKey][suggestId]["comment"] = comment; // comment suggest entry
                edit[suggestKey][suggestId].lastModeration = new Date();
                this.log.info(`comment ${suggestKey} #${suggestId}: ${comment}`, {toBeAccepted});
                this.pantry.setEdit(edit).then(editUpdated => subResolve(suggestId)).catch(subReject);
            }).catch(err => subReject(err));
        });
    }

    _pushEdit(suggestKey, newSuggest) {
        return this._semWritePromise((subResolve, subReject) => {
            this.pantry.getEdit()
                .then(edit => {
                    let updated = edit === null ? {} : edit;
                    if (!Object.keys(updated).includes(suggestKey)) {
                        updated[suggestKey] = {};
                    }
                    const awaitingModerationSuggests = countAwaitingModeration(updated[suggestKey]);
                    if (awaitingModerationSuggests >= MAX_SUGGEST_EDITS) {
                        this.log.warn(`Psssst, there is too much pending ${suggestKey} suggests, please proceed !`);
                        subReject(new InvalidParameterError("Too much awaiting moderation suggests, moderators have been warn by this issue, please retry in few moments."));
                        return;
                    }
                    const id = newSuggest.id ? newSuggest.id : this.generateUUID();
                    newSuggest.id = id;
                    newSuggest.updated = new Date();
                    updated[suggestKey][id] = newSuggest;
                    this.pantry.setEdit(updated)
                        .then(result => {
                            this.log.info(`${suggestKey} #${newSuggest.id} pushed : ${result}`, {newSuggest})
                            subResolve(newSuggest.id);
                        })
                        .catch(err => {
                            subReject(err);
                        });
                });
        });
    }

    _semWritePromise(callable) {
        return new Promise((resolve, reject) => {
            this.writeSemaphore.take(() => callable(
                subResolve => {
                    this.writeSemaphore.leave();
                    resolve(subResolve);
                },
                subReject => {
                    this.writeSemaphore.leave();
                    reject(subReject);
                })
            );
        });
    }

    generateUUID() {
        return uuidv4();
    }
}