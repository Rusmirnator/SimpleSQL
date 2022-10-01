import { IConnectionParameters } from "base/interfaces/IConnectionParameters";

export default class ConnectionParameters implements IConnectionParameters {
    user!: string;
    password!: string;
    database!: string;
    server!: string;
    port?: number | undefined;
    options?: Object[] | undefined;

    constructor(){}
    
    initialize(user: string, password: string, database: string, server: string, port?: number, options?: Object[]) : void {
        this.user = user;
        this.password = password;
        this.database = database;
        this.server = server;
        this.port = port;
        this.options = options;
    }
}