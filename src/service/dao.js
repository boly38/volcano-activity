import {v4 as uuidv4} from "uuid";
import semaphore from "semaphore";
import Logger from "./logger.js";
import Pantry from "./pantry.js";
import V0Data from "../data/v0/v0Data.js";
import {isEmpty, isSet} from "./util.js";

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
                        this.log.info("no on-line volcanoes version, fallback to static version");
                        let volcanoes = this.v0Data.volcanoesOnly;
                        let lives = this.v0Data.livesOnly;
                        this.pantry.setProd({volcanoes, lives})
                            .then(() => resolve(volcanoes))
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
        return this._pushEdit("suggestLives", newLive);
    }

    suggestNewVolcano(newVolcano) {
        return this._pushEdit("suggestVolcanoes", newVolcano);
    }

    acceptSuggestVolcano(suggestId) {
        const suggestKey = "suggestVolcanoes";
        return this._semWritePromise((subResolve, subReject) => {
            this.pantry.getEdit()
                .then(edit => {
                    let updated = edit === null ? {} : edit;
                    if (!Object.keys(updated).includes(suggestKey)) {
                        updated[suggestKey] = {};
                    }
                    const toBeAccepted = updated[suggestKey][suggestId];
                    if (!isSet(toBeAccepted)) {
                        subReject("invalid suggestion id");
                        return;
                    }
                    if (!isSet(toBeAccepted["volcano_id"])) {
                        subReject("suggestion without volcano_id");
                        return;
                    }
                    this.pantry.getProd()
                        .catch(subReject)
                        .then(content => {
                            let {volcanoes, lives} = content;
                            const volcanoId = toBeAccepted["volcano_id"];
                            volcanoes = volcanoes.filter(v => v["volcano_id"] !== volcanoId);
                            volcanoes.push(toBeAccepted);// add suggested volcano
                            this.pantry.setProd(volcanoes)// update volcanoes
                                .catch(subReject)
                                .then(prodUpdated => {
                                    delete updated[suggestKey][suggestId]; // remove suggest entry
                                    this.pantry.setEdit(updated).then(editUpdated => subResolve(volcanoId)).catch(subReject);
                                })
                        })
                });
        });
    }


    // TODO : suggestUpdateLive(live)
    // TODO : suggestUpdateVolcano(volcano)
    // TODO : _putStaticVersion(version)

    _pushEdit(suggestKey, newSuggest) {
        return this._semWritePromise((subResolve, subReject) => {
            this.pantry.getEdit()
                .then(edit => {
                    let updated = edit === null ? {} : edit;
                    if (!Object.keys(updated).includes(suggestKey)) {
                        updated[suggestKey] = {};
                    }
                    const id = newSuggest.id ? newSuggest.id : this.generateUUID();
                    newSuggest.id = id;
                    updated[suggestKey][id] = newSuggest;
                    this.pantry.setEdit(updated)
                        .then(result => {
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