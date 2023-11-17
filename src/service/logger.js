// https://betterstack.com/docs/logs/javascript/winston/
import winston from "winston";
import {Logtail} from "@logtail/node";
import {LogtailTransport} from "@logtail/winston" ;
import express from "express"; // https://betterstack.com/docs/logs/javascript/winston/

import {isNotEmpty} from './util.js';

export default class Logger {
    constructor() {
        this.buildLogger();
    }

    buildLogger() {
        this._logtail = null;
        this._logtailSource = process.env.VOL_LOGTAIL_SOURCE_ID;
        this._logtailToken = process.env.VOL_LOGTAIL_SOURCE_TOKEN;

        const format = winston.format;
        winston.addColors({info: 'white', error: 'red', warn: 'yellow', debug: 'cyan'});

        // https://stackoverflow.com/questions/10271373/node-js-how-to-add-timestamp-to-logs-using-winston-library
        // Limitations: if you colorize all: true or level: true then the padEnd on level is not applied. If you use format.align, this aligns only the message start part..
        const consoleTransport = new winston.transports.Console({
            "format": format.combine(
                format.colorize({message: true}),
                format.timestamp({ format: 'MM-DD HH:mm:ss.SSS' }),
                format.printf(info => `${info.timestamp} | ${info.level.padEnd(5)} | ${info.message}`)
            )
        });

        if (isNotEmpty(this._logtailToken)&&isNotEmpty(this._logtailSource)) { // https://logs.betterstack.com
            this._logtail = new Logtail(this._logtailToken);
            const transports = [new LogtailTransport(this._logtail), consoleTransport];
            this._winstonLogger = winston.createLogger({transports});
            console.log(`☑ winston logtail logger (src:${this._logtailSource})`);
        } else {
            const transports = [consoleTransport];
            this._winstonLogger = winston.createLogger({transports});
            console.log(`☑ winston console logger`);
        }
    }

    async flush() {
        if (this._logtail === null) {
            return;
        }
        return this._logtail.flush();
    }


    getLogger() {
        return this._winstonLogger;
    }

}