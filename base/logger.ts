import { app } from "electron";
import { LogLevel } from "./enumerations";
import GeneralPurposeRepository from "./generalPurposeRepository";
import * as path from 'path';
import { existsSync } from 'fs'

export default class Logger {
    private static newLine: string;
    private static path: string;
    private static logFileName: string;
    private static repository = new GeneralPurposeRepository();

    static {
        Logger.logFileName = `${new Date().toDateString()}.log`;
        Logger.path = path.join(app.getPath("appData"), 'simplesql', Logger.logFileName);
        Logger.newLine = existsSync(Logger.path) ? "\n" : "";
        console.log(`Logger path: [${Logger.path}]`);
    }

    constructor() { }

    static log(message: string, level: LogLevel = LogLevel.Info) {
        let currentTime = new Date();
        let normalizedTimeStamp: string = "";

        normalizedTimeStamp += `${Logger.repository.left(currentTime.getHours() + "0", 2)}:`;
        normalizedTimeStamp += `${Logger.repository.left(currentTime.getMinutes() + "0", 2)}:`;
        normalizedTimeStamp += `${Logger.repository.left(currentTime.getSeconds() + "0", 2)}:`;
        normalizedTimeStamp += `${Logger.repository.left(currentTime.getMilliseconds() + "00", 3)}`;

        Logger.repository.safelyWriteToFile(
            Logger.path,`${this.newLine}${normalizedTimeStamp}|${level}|${message}`,"utf-8");

        if (Logger.newLine === "") {
            Logger.newLine = "\n";
        }
    }
}