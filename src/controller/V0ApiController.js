import express from "express";
import svgCaptcha from 'svg-captcha';
import AboutService from "../service/aboutService.js";
import CachedVolcanoesService from "../service/cachedVolcanoesService.js";

import {assumeCaptcha, assumeMaxFieldLength, assumeModerator, assumeRequiredFields, handleError} from "./apiUtil.js"
import AuthService from "../service/authService.js";

export default class V0ApiController {
    constructor() {
        this.aboutService = new AboutService();
        this.authService = new AuthService();
        this.cachedVolcanoesService = new CachedVolcanoesService();
    }

    getAbout() {
        return this.aboutService.getAbout();
    }

    getSpecs() {
        return {
            "/about": this.v0About(),
            "/api/v0/auth": this.v0Auth(),
            "/api/v0/captcha": this.v0Captcha(),
            "/api/v0/caches": this.v0Caches(),
            "/api/v0/volcanoes": this.v0Volcanoes(),
            "/api/v0/suggests": this.v0Suggests()
        };
    }

    v0About() {
        const controller = this;
        const router = express.Router();
        router.get('/', async function (req, res) {
            res.send(controller.getAbout());
        });
        return router;
    }

    v0Auth() {
        const controller = this;
        const router = express.Router();
        router.post('/moderator', async function (req, res) {
            try {
                console.log("req.body",req.body)
                assumeRequiredFields(req.body, ["token"]);
                const {token} = req.body;
                assumeMaxFieldLength(res, "token", token, 5000);
                const isModerator = controller.authService.authModerator(token);
                res.send(isModerator);
            } catch (err) {
                handleError(res, err);
            }
        });
        return router;
    }

    v0Captcha() {
        const router = express.Router();
        router.get('/', async function (req, res) {
            const captcha = svgCaptcha.create();
            req.session.captchaText = captcha.text;
            console.log("captcha: " + captcha.text);
            let svg = captcha.data;
            res.send({svg});
        });
        return router
    }
    v0Caches() {
        const controller = this;
        const router = express.Router();
        router.post('/clear', async function (req, res) {
            assumeModerator(req);
            const result = controller.cachedVolcanoesService.clear()
            res.send(result);
        });
        return router
    }

    v0Volcanoes() {
        const controller = this;
        const router = express.Router();
        router.get('/', async function (req, res) {
            const withoutLives = req.query["without-lives"] === 'true'
            controller.cachedVolcanoesService.getVolcanoes(withoutLives)
                .then(result => res.send(result))
                .catch(err => handleError(res, err))
        });
        return router;
    }

    v0Suggests() {
        const controller = this;
        const router = express.Router();
        router.get('/', async function (req, res) {
            controller.cachedVolcanoesService.getSuggests()
                .then(result => res.send(result))
                .catch(err => handleError(res, err))
        });

        router.post('/volcano', async (req, res) => {
            try {
                assumeCaptcha(req);
                assumeRequiredFields(req.body, ["volcano"]);
                // const {captcha, volcano} = req.body;
                const {volcano} = req.body;
                assumeMaxFieldLength(res, "volcano", volcano, 5000);
                assumeMaxFieldLength(res, "volcano.volcano_id", volcano?.volcano_id, 50);
                assumeMaxFieldLength(res, "volcano.name", volcano?.name, 255);
                controller.cachedVolcanoesService.suggestVolcano(volcano)
                    .then(result => res.send(result))
                    .catch(err => handleError(res, err))
            } catch (err) {
                handleError(res, err);
            }
        });

        router.post('/live', async (req, res) => {
            try {
                assumeCaptcha(req);
                assumeRequiredFields(req.body, ["live"]);
                const {live} = req.body;
                assumeMaxFieldLength(res, "live", live, 5000);
                controller.cachedVolcanoesService.suggestLive(live)
                    .then(result => res.send(result))
                    .catch(err => handleError(res, err))
            } catch (err) {
                handleError(res, err);
            }
        });

        router.post('/volcano/accept', async (req, res) => {
            try {
                assumeModerator(req);
                assumeRequiredFields(req.body, ["suggestId"]);
                const {suggestId} = req.body;
                assumeMaxFieldLength(res, "suggestId", suggestId, 255);
                controller.cachedVolcanoesService.acceptVolcano(suggestId)
                    .then(result => res.send(result))
                    .catch(err => handleError(res, err))
            } catch (err) {
                handleError(res, err);
            }
        });

        router.post('/volcano/comment', async (req, res) => {
            try {
                assumeModerator(req);
                assumeRequiredFields(req.body, ["suggestId", "comment"]);
                const {suggestId, comment} = req.body;
                assumeMaxFieldLength(res, "suggestId", suggestId, 255);
                assumeMaxFieldLength(res, "comment", comment, 5000);
                controller.cachedVolcanoesService.commentSuggestVolcano(suggestId, comment)
                    .then(result => res.send(result))
                    .catch(err => handleError(res, err))
            } catch (err) {
                handleError(res, err);
            }
        });

        router.post('/live/accept', async (req, res) => {
            try {
                assumeModerator(req);
                assumeRequiredFields(req.body, ["suggestId"]);
                const {suggestId} = req.body;
                assumeMaxFieldLength(res, "suggestId", suggestId, 255);
                controller.cachedVolcanoesService.acceptLive(suggestId)
                    .then(result => res.send(result))
                    .catch(err => handleError(res, err))
            } catch (err) {
                handleError(res, err);
            }
        });

        router.post('/live/comment', async (req, res) => {
            try {
                assumeModerator(req);
                assumeRequiredFields(req.body, ["suggestId", "comment"]);
                const {suggestId, comment} = req.body;
                assumeMaxFieldLength(res, "suggestId", suggestId, 255);
                assumeMaxFieldLength(res, "comment", comment, 5000);
                controller.cachedVolcanoesService.commentSuggestLive(suggestId, comment)
                    .then(result => res.send(result))
                    .catch(err => handleError(res, err))
            } catch (err) {
                handleError(res, err);
            }
        });

        return router;
    }


}


