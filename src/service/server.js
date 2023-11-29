import express from 'express';
import V0ApiController from '../controller/V0ApiController.js';
import Logger from './logger.js';
import AuthService from "./authService.js";
import session from "express-session";
import MemoryStore from "express-session/session/memory.js";

const DEBUG_REQUEST = false;
const X_POWERED_BY = "boly38/volcano-activity application : a free and open source github repository"
const VOL_SESSION_SECRET_KEY = process.env.VOL_SESSION_SECRET_KEY;
const VOL_SESSION_DURATION_MS = 3*60000;
export default class Server {
    constructor() {
        this.app = express()
        this.v0Api = new V0ApiController();
        this.log = (new Logger()).getLogger();
        this.authService = new AuthService();
        this.appMemorySessionStore();
        this.appMiddlewareAuthModerator();
        this.appMiddlewareAppendResponseHeader();
        this.apiV0();
        this.appMiddlewareFrontEnd();
    }

    appMemorySessionStore() {
        this.app.use(session({
            secret: VOL_SESSION_SECRET_KEY,
            resave: false,
            saveUninitialized: true,
            store: new MemoryStore(),
            cookie: { maxAge: VOL_SESSION_DURATION_MS } // Durée de vie de la session en millisecondes
        }));
    }
    appMiddlewareAuthModerator() {
        this.app.use((req, res, next) => {
            const TOKEN = req.headers?.["x-token"] || null;
            const isModerator = this.authService.authModerator(TOKEN);
            DEBUG_REQUEST && console.log("req.headers", JSON.stringify(req.headers));
            DEBUG_REQUEST && console.log("x-token", TOKEN, isModerator);
            req.auth = {isModerator};
            next();
        });
    }
    appMiddlewareAppendResponseHeader() {
        // middleware with no mount path: gets executed for every request to the app
        this.app.use(function (req, res, next) {
            res.setHeader('charset', 'utf-8');
            res.setHeader('X-Powered-By', X_POWERED_BY);
            next();
        });
    }

    apiV0() {
        this.app.use(express.json());
        for (const [path, router] of Object.entries(this.v0Api.getSpecs())) {
            // this.app.all(path,handler);
            this.app.use(path, router);
        }
    }

    appMiddlewareFrontEnd() {// Pick up React index.html file
        this.app.use(express.static("ui"));
    }

    listen() {
        const port = process.env.PORT || 4000;
        const about = this.v0Api.getAbout();
        this.app.listen(port)
        this.log.info(`🔥 version ${about?.application?.version} - api ${JSON.stringify(about?.api)}`, {port});
    }

}
