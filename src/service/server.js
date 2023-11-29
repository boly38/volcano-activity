import express from 'express';
import ServerV0Api from './serverV0Api.js';
import Logger from './logger.js';

const X_POWERED_BY = "boly38/volcano-activity application : a free and open source github repository"

export default class Server {
    constructor() {
        this.app = express()
        this.v0Api = new ServerV0Api();
        this.log = (new Logger()).getLogger();
        this.appMiddlewareAppendResponseHeader();
        this.apiV0();
        this.appMiddlewareFrontEnd();
    }

    appMiddlewareAppendResponseHeader() {
        // middleware with no mount path: gets executed for every request to the app
        this.app.use(function (req, res, next) {
            res.setHeader('charset', 'utf-8');
            res.setHeader('X-Powered-By', X_POWERED_BY);
            next();
        });
    }
    appMiddlewareFrontEnd() {// Pick up React index.html file
        this.app.use(express.static("ui"));
    }

    apiV0() {
        this.v0Api.getSpecs().forEach( routeSpec => this.app.all(routeSpec.path, routeSpec.handler) );
    }


    listen() {
        const port = process.env.PORT || 4000;
        const about = this.v0Api.getAbout();
        this.app.listen(port)
        this.log.info(`🔥 version ${about?.application?.version} - api ${JSON.stringify(about?.api)}`, {port});
    }
}
