import 'dotenv/config';
import Dao from "./service/dao.js";
import fs from "fs";
import Logger from "./service/logger.js";
import {isSet} from "./service/util.js";

const dao = new Dao();

const DATA_V0 = "src/data/v0";
const DATA2_V0 = "src/data2/v0";
const V2_VOLCANOES_DIR = `${DATA2_V0}/volcanoes`;
const V2_LIVES_DIR = `${DATA2_V0}/lives`;
const V2_INVALID_DIR = `${DATA2_V0}/invalid_lives`;

const VOLCANOES_DIR = `${DATA_V0}/volcanoes`;
const LIVES_DIR = `${DATA_V0}/lives`;
const INVALID_DIR = `${DATA_V0}/invalid_lives`;

const VOLCANOES_JSON = "volcanoes.json";
const STRINGIFY_SPACE = 2;

const log = (new Logger()).getLogger();
const mkdirp = target => fs.mkdirSync(target, {"recursive": true});
const rmdirs = toRemoveDirectories => toRemoveDirectories.forEach(d => fs.existsSync(d) && fs.rmdirSync(d, {"recursive": true}));
const renamedir = (oldName, newName) => fs.existsSync(oldName) &&  fs.renameSync(oldName, newName);
const removeEntitiesFile = entities => entities.forEach(v => delete v.file)

function writeLivesJsonFiles(volcanoLives, liveJsonFile) {
    fs.writeFileSync(liveJsonFile, JSON.stringify(volcanoLives, null, STRINGIFY_SPACE));
    log.info(`${liveJsonFile} | ${volcanoLives.length} lives`);
    return liveJsonFile;
}

async function pantryExport() {
    const prod = await dao.getVolcanoes();
    const {volcanoes, lives} = prod;
    const volcanoesCount = volcanoes ? volcanoes.length : 0;
    const livesCount = lives ? lives.length : 0;
    log.info(`1- get pantry prod - ${volcanoesCount} volcanoes and ${livesCount} lives`);

    mkdirp(V2_VOLCANOES_DIR);
    removeEntitiesFile(volcanoes);
    let volcanoesJsonFile = `${V2_VOLCANOES_DIR}/${VOLCANOES_JSON}`;
    fs.writeFileSync(volcanoesJsonFile, JSON.stringify(volcanoes, null, STRINGIFY_SPACE));
    log.info(`2- create ${volcanoesJsonFile} created with  ${volcanoesCount} volcanoes`);

    mkdirp(V2_LIVES_DIR);
    removeEntitiesFile(lives);
    let liveJsonFiles = [];
    volcanoes.forEach(volcano => {
        const volcanoId = volcano.id;
        const volcanoLives = lives.filter(l => l.volcano_id === volcanoId);
        if (volcanoLives.length > 0) {
            liveJsonFiles.push(writeLivesJsonFiles(volcanoLives, `${V2_LIVES_DIR}/lives_${volcanoId}.json`));
        }
    })
    const invalidLives = lives.filter(l => !isSet(l.volcano_id));
    if (invalidLives.length > 0) {
        mkdirp(V2_INVALID_DIR);
        liveJsonFiles.push(writeLivesJsonFiles(invalidLives, `${V2_INVALID_DIR}/lives_without_volcano_id.json`));
    }
    log.info(`3- create ${liveJsonFiles.length} files |  ${livesCount} lives`);

    rmdirs([VOLCANOES_DIR, LIVES_DIR, INVALID_DIR]);
    renamedir(V2_VOLCANOES_DIR, VOLCANOES_DIR);
    renamedir(V2_LIVES_DIR, LIVES_DIR);
    renamedir(V2_INVALID_DIR, INVALID_DIR);
    log.info(`4- ${DATA_V0} updated`)
}

await pantryExport();
// TODO : QA with githubactions