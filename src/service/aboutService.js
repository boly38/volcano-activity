import {loadJsonFile} from "./util.js";

export default class AboutService {
    constructor() {
        const api = {"version": "v0"};
        const application = _buildAboutApplication();
        this.about = {application, api};
    }

    getAbout() {
        return this.about;
    }
}

function _buildAboutApplication() {
    const packageJson = loadJsonFile("package.json");
    const startDate = new Date();
    return {
        "version": packageJson["version"], "name": packageJson["name"], startDate
    };
}