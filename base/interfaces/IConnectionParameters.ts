import { Configuration, SSL, SSLMode } from "ts-postgres";

export interface IConnectionParameters extends Configuration {
    user: string;
    password: string;
    database: string;
    host: string;
    port?: number;
    ssl?: (SSLMode.Disable | SSL);
    options?: Object[]

    initialize(user: string, password: string, database: string, host: string, port?: number, ssl?: SSLMode, options?: Object[]): void
}