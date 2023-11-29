import PantryNode from "pantry-node";
import {sleep, isSet} from "./util.js";
import Logger from "./logger.js";

const PANTRY_ID = process.env.VOL_PANTRY_ID // Your unique PantryID
const PANTRY_BASKET_PROD_ID = "prod";
const PANTRY_BASKET_EDIT_ID = "edit";

const isString = v => typeof v === 'string';
const errIncludes = (err, v) => typeof err === 'string' && err.includes(v);

export default class Pantry {
    constructor() {
        this.log = (new Logger()).getLogger();
        this.p = new PantryNode(PANTRY_ID);
        this.options = {parseJSON: true}
    }

    getDetails() {
        return this._rateCall(`details`, () => this.p.details());
    }
    getProd() {
        return this._getBasketById(PANTRY_BASKET_PROD_ID);
    }

    setProd(version) {
        return this._upsertBasketById(PANTRY_BASKET_PROD_ID, version);
    }

    getEdit() {
        return this._getBasketById(PANTRY_BASKET_EDIT_ID);
    }

    setEdit(version) {
        return this._upsertBasketById(PANTRY_BASKET_EDIT_ID, version);
    }

    /******************** private *************************************/
    _getBasketById(basketId) {
        return new Promise((resolve, reject) => {
            this._rateCall(`get ${basketId}`, () => this.p.basket.get(basketId, this.options)
                .then(resolve)
                .catch(err => {
                    if (errIncludes(err, "does not exist")) {
                        resolve(null)
                    } else {
                        reject(err);
                    }
                })
            );
        });
    }

    _upsertBasketById(basketId, version) {
        if (!isSet(version)) {
            return this._rateCall(`delete ${basketId}`, () => this.p.basket.delete(basketId));
        }
        return this._rateCall(`create ${basketId}`, () => this.p.basket.create(basketId, version));
    }

    _rateCall(name, callablePromise, delayMs = 1000) {
        this.log.debug(`pantry[${name}]`);
        return new Promise((resolve, reject) => {
            callablePromise()
                .then(result => {
                    this.log.debug(`pantry[${name}] OK`);
                    resolve(result);
                })
                .catch(async err => {
                    this.log.debug(err, JSON.stringify(err))
                    if (errIncludes(err, "try again later.")) {
                        this.log.debug(`pantry[${name}] pantry rate limit : sleep ${delayMs}`);
                        await sleep(delayMs);
                        this._rateCall(name, callablePromise, delayMs + 1000)
                            .then(resolve).catch(reject);
                    } else {
                        reject(err);
                    }
                })
        });
    }

}