import { app } from "electron";
import { LogLevel } from "./enumerations";
import GeneralPurposeRepository from "./generalPurposeRepository";
import * as path from 'path';

export default class Logger {
    private static path: string;
    private static logFileName: string;
    private static repository = new GeneralPurposeRepository();

    static {
        Logger.logFileName = `${new Date().toDateString()}.log`;
        Logger.path = path.join(app.getPath("appData"), 'simplesql', Logger.logFileName);
    }

    constructor() { }

    static log(message: string, level: LogLevel = LogLevel.Info) {
        Logger.repository.safelyWriteToFile(Logger.path, `${new Date().toTimeString()}|${level}|${message}`, "utf-8");
    }
}