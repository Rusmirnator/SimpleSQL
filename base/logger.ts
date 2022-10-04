import { app } from "electron";
import { format } from "util";
import { LogLevel } from "./enumerations";
import GeneralPurposeRepository from "./generalPurposeRepository";
import * as path from 'path';

export default class Logger {
    static path: string;
    static loFileName: string;
    static level: LogLevel | LogLevel.Info;
    static formattedMessage: string = "$0 |$1|: $2";
    static repository = new GeneralPurposeRepository();

    constructor(){
        Logger.loFileName = new Date().toDateString();
        Logger.path = path.join(app.getPath("appData"), Logger.loFileName);
    }

    static log(message: string, level: LogLevel = LogLevel.Info){
        let test = format(this.formattedMessage, new Date().toTimeString(), level,message);

        Logger.repository.safelyWriteToFile(test,"utf-8");
    }
}