import express from 'express';
import {loadJsonFile, readJsonFilesFromDirectory} from './util.js';

const VERBOSE_SERVER = process.env.VERBOSE_SERVER === 'true';
const V0_VOLCANOES_PATH = "src/data/v0/volcanoes"
const V0_LIVES_PATH = "src/data/v0/lives"
const X_POWERED_BY = "boly38/volcano-activity application : a free and open source github repository"
const deepCopy = o => JSON.parse(JSON.stringify(o));

function appMiddlewareAppendResponseHeader(app) {
    // middleware with no mount path: gets executed for every request to the app
    app.use(function (req, res, next) {
        res.setHeader('charset', 'utf-8');
        res.setHeader('X-Powered-By', X_POWERED_BY);
        next();
    });
}

function enrichVolcanoesWithLives(volcanoes, lives) {
    VERBOSE_SERVER && console.log(`enrichVolcanoesWithLives before volcanoes:${JSON.stringify(volcanoes, null, 2)}`)
    VERBOSE_SERVER && console.log(`enrichVolcanoesWithLives before lives:${JSON.stringify(lives, null, 2)}`)
    const enriched = deepCopy(volcanoes);
    enriched.forEach(
        v => v.lives = lives.filter(live => live.volcano_id === v.id)
    );
    return enriched;
}

function prepareData() {
    const version = "0.0.1"
    const startDate = new Date();
    const application = {version, startDate}

    const apiVersion = "v0";
    const v0_volcanoes_data = readJsonFilesFromDirectory(V0_VOLCANOES_PATH);
    const v0_lives_data = readJsonFilesFromDirectory(V0_LIVES_PATH);
    const volcanoesCount = v0_volcanoes_data.length;
    const livesCount = v0_lives_data.length;
    const api = {"version": apiVersion, volcanoesCount, livesCount};

    const about = {application, api};
    const volcanoesOnly = v0_volcanoes_data;
    const volcanoes = enrichVolcanoesWithLives(volcanoesOnly, v0_lives_data);

    return {about, volcanoesOnly, volcanoes}
}

function appApi(app, data) {
    const {about, volcanoesOnly, volcanoes} = data;
    app.all('/about', (req, res) => {
        res.send(about)
    })
    app.all('/api/v0/volcanoes', (req, res) => {
        if (req.query["without-lives"] === 'true') {
            res.send(volcanoesOnly);
            return;
        }
        res.send(volcanoes);
    });
}

function appListen(app, data) {
    app.listen(process.env.PORT || 3000)
    console.log(`🔥 version ${data?.about?.application?.version} - api ${JSON.stringify(data?.about?.api)}`)
}

function serve() {
    const app = express()
    const data = prepareData();
    appMiddlewareAppendResponseHeader(app);
    appApi(app, data);
    appListen(app, data);
}

// Export the function to be used in other modules
export {serve};