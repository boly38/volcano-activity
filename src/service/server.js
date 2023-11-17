import express from 'express';
import {loadJsonFile, readJsonFilesFromDirectory} from './util.js';
import Logger from './logger.js';

const VERBOSE_SERVER = process.env.VERBOSE_SERVER === 'true';
const V0_VOLCANOES_PATH = "src/data/v0/volcanoes"
const V0_LIVES_PATH = "src/data/v0/lives"
const X_POWERED_BY = "boly38/volcano-activity application : a free and open source github repository"
const deepCopy = o => JSON.parse(JSON.stringify(o));


export default class Server {
    constructor() {
        this.prepareData();
        this.app = express()
        this.log = (new Logger()).getLogger();
        this.appMiddlewareAppendResponseHeader();
        this.appApi();
    }

    prepareData() {
        this.data = {};
        this.prepareDataBusiness();
        this.prepareDataAbout();
    }

    prepareDataBusiness() {
        const v0_volcanoes_data = readJsonFilesFromDirectory(V0_VOLCANOES_PATH);
        const v0_lives_data = readJsonFilesFromDirectory(V0_LIVES_PATH);
        this.data.volcanoesOnly = v0_volcanoes_data;
        this.data.volcanoes = _enrichVolcanoesWithLives(v0_volcanoes_data, v0_lives_data);
        this.data.volcanoesCount = v0_volcanoes_data.length;
        this.data.livesCount = v0_lives_data.length;
    }

    prepareDataAbout() {
        const {volcanoesCount, livesCount} = this.data;
        const api = {"version": "v0", volcanoesCount, livesCount};
        const application = _buildAboutApplication();
        this.about = {application, api};
    }

    appMiddlewareAppendResponseHeader(app) {
        // middleware with no mount path: gets executed for every request to the app
        this.app.use(function (req, res, next) {
            res.setHeader('charset', 'utf-8');
            res.setHeader('X-Powered-By', X_POWERED_BY);
            next();
        });
    }

    appApi(app, data) {
        const {volcanoesOnly, volcanoes} = this.data;
        this.app.all('/about', (req, res) => {
            res.send(this.about)
        })
        this.app.all('/api/v0/volcanoes', (req, res) => {
            if (req.query["without-lives"] === 'true') {
                res.send(volcanoesOnly);
                return;
            }
            res.send(volcanoes);
        });
    }

    listen() {
        let port = process.env.PORT || 3000;
        this.app.listen(port)
        this.log.info(`🔥 version ${this.about?.application?.version} - api ${JSON.stringify(this.about?.api)}`, {port});
    }
}

//~  private

function _buildAboutApplication() {
    const packageJson = loadJsonFile("package.json");
    VERBOSE_SERVER && console.log(`packageJson(keys): ${Object.keys(packageJson)}`);
    const startDate = new Date();
    return {
        "version": packageJson["version"], "name": packageJson["name"], startDate
    };
}

function _enrichVolcanoesWithLives(volcanoes, lives) {
    const enriched = deepCopy(volcanoes);
    enriched.forEach(v => v.lives = lives.filter(live => live.volcano_id === v.id));
    return enriched;
}