import V0Data from "../data/v0/v0Data.js";
import {loadJsonFile} from "./util.js";

const VERBOSE_SERVER = process.env.VERBOSE_SERVER === 'true';

export default class ServerV0Api {
    constructor() {
        let v0Data = new V0Data();
        this.v0Data = v0Data.get();
        this.prepareDataAbout();
    }

    prepareDataAbout() {
        const {volcanoesCount, livesCount} = this.v0Data;
        const api = {"version": "v0", volcanoesCount, livesCount};
        const application = _buildAboutApplication();
        this.about = {application, api};
    }

    getAbout() {
        return this.about;
    }

    getSpecs() {
        const {volcanoesOnly, volcanoes} = this.v0Data;
        let specs = [];
        specs.push({
            "path": "/about",
            "handler": (req, res) => {
                res.send(this.about)
            }
        });
        specs.push({
            "path": "/api/v0/volcanoes",
            "handler": (req, res) => {
                if (req.query["without-lives"] === 'true') {
                    res.send(volcanoesOnly);
                    return;
                }
                res.send(volcanoes);
            }
        });
        return specs;
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