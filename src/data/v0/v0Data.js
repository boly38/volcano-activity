import {deepCopy, readJsonFilesFromDirectory} from "../../service/util.js";

const V0_VOLCANOES_PATH = "src/data/v0/volcanoes"
const V0_LIVES_PATH = "src/data/v0/lives"
const DEBUG = true;
export default class V0Data {
    constructor() {
        this.data = {};
        this.prepareDataBusiness();
    }

    prepareDataBusiness() {
        this.data.volcanoesOnly = readJsonFilesFromDirectory(V0_VOLCANOES_PATH);
        this.data.livesOnly = readJsonFilesFromDirectory(V0_LIVES_PATH);
        this.data.volcanoes = _enrichVolcanoesWithLives(this.data.volcanoesOnly, this.data.livesOnly);
        this.data.volcanoesCount = this.data.volcanoesOnly.length;
        this.data.livesCount = this.data.livesOnly.length;
        DEBUG && console.log(`V0Data ${this.data.volcanoesOnly.length} volcanoes and ${this.data.livesOnly.length} lives`)
    }

    get() {
        return this.data;
    }
}
//~  private
function _enrichVolcanoesWithLives(volcanoes, lives) {
    const enriched = deepCopy(volcanoes);
    enriched.forEach(v => v.lives = lives.filter(live => live.volcano_id === v.id));
    return enriched;
}