import { IConnectionParameters } from "base/interfaces/IConnectionParameters";
import { SSL, SSLMode } from "ts-postgres";

export default class ConnectionParameters implements IConnectionParameters {
    user!: string;
    password!: string;
    database!: string;
    host!: string;
    port?: number | undefined;
    ssl?: (SSLMode.Disable | SSL);

    constructor() { }

    initialize(user: string, password: string, database: string, host: string, port?: number, ssl?: SSLMode.Disable): void {
        this.user = user;
        this.password = password;
        this.database = database.slice(1);
        this.host = host;
        this.port = port;
        this.ssl = ssl;
    }
}