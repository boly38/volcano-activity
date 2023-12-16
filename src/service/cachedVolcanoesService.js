import NodeCache from "node-cache";
import Dao from "./dao.js";
import {deepCopy, isSet} from "./util.js";
import semaphore from "semaphore";

const CACHE_TTL_SECONDS = 600;// 10 min

export default class CachedVolcanoesService {
    constructor() {
        this.dao = new Dao();
        this.memCache = new NodeCache();
        this.readSemaphore = semaphore(1);
    }

    clear() {
        const dataDeleted = this.memCache.del("data");
        const editDeleted = this.memCache.del("edit");
        return {dataDeleted, editDeleted};
    }

    getVolcanoes(withoutLives = true) {
        return new Promise((resolve, reject) => {
            this._volcanoesCache()
                .then(data => {
                    const {volcanoes, lives} = data;
                    if (volcanoes == null || withoutLives) {
                        resolve(volcanoes);
                    } else {
                        resolve(_enrichVolcanoesWithLives(volcanoes, lives));
                    }
                })
                .catch(reject)
        });
    }

    _volcanoesCache() {
        return this._semReadPromise((resolve, reject) => {
            const data = this.memCache.get("data");
            if (!isSet(data)) {
                console.log("data cache miss!!!");
                this.dao.getVolcanoes().then(data => {
                    this.memCache.set("data",data, CACHE_TTL_SECONDS);
                    resolve(data);
                }).catch(reject);
            } else {
                resolve(data);
            }
        });
    }

    getSuggests() {
        return this._suggestsCache();
    }

    _suggestsCache() {
        return new Promise((resolve, reject) => {
            const edit = this.memCache.get("edit");
            if (edit === undefined) {
                console.log("edit cache miss!!!");
                this.dao.getSuggests().then(edit => {
                    const editResult = isSet(edit) ? edit : {};
                    this.memCache.set("edit",editResult, CACHE_TTL_SECONDS);
                    resolve(editResult);
                }).catch(reject);
            } else {
                resolve(edit);
            }
        });
    }

    suggestVolcano(newVolcano) {
        return new Promise((resolve, reject) => {
            this.dao.suggestNewVolcano(newVolcano).then(suggestId => {
                this.memCache.del("edit");
                resolve(suggestId);
            }).catch(reject);
        });
    }

    suggestLive(newLive) {
        return new Promise((resolve, reject) => {
            this.dao.suggestNewLive(newLive).then(suggestId => {
                this.memCache.del("edit");
                resolve(suggestId);
            }).catch(reject);
        });
    }

    acceptVolcano(suggestId) {
        return new Promise((resolve, reject) => {
            this.dao.acceptSuggestVolcano(suggestId).then(suggestId => {
                this.memCache.del("edit");
                this.memCache.del("data");
                resolve(suggestId);
            }).catch(reject);
        });
    }

    commentSuggestVolcano(suggestId, comment) {
        return new Promise((resolve, reject) => {
            this.dao.commentSuggestVolcano(suggestId, comment).then(suggestId => {
                this.memCache.del("edit");
                resolve(suggestId);
            }).catch(reject);
        });
    }

    acceptLive(suggestId) {
        return new Promise((resolve, reject) => {
            this.dao.acceptSuggestLive(suggestId).then(suggestId => {
                this.memCache.del("edit");
                this.memCache.del("data");
                resolve(suggestId);
            }).catch(reject);
        });
    }

    commentSuggestLive(suggestId, comment) {
        return new Promise((resolve, reject) => {
            this.dao.commentSuggestLive(suggestId, comment).then(suggestId => {
                this.memCache.del("edit");
                resolve(suggestId);
            }).catch(reject);
        });
    }

    _semReadPromise(callable) {
        return new Promise((resolve, reject) => {
            this.readSemaphore.take(() => callable(
                subResolve => {
                    this.readSemaphore.leave();
                    resolve(subResolve);
                },
                subReject => {
                    this.readSemaphore.leave();
                    reject(subReject);
                })
            );
        });
    }
}

function _enrichVolcanoesWithLives(volcanoes, lives) {
    const enriched = deepCopy(volcanoes);
    enriched.forEach(v => v.lives = lives.filter(live => live.volcano_id === v.id));
    return enriched;
}