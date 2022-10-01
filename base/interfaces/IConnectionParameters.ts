export interface IConnectionParameters {
    user: string;
    password: string;
    database: string;
    server: string;
    port?: number;
    options? : Object[];

    initialize(user: string, password: string, database: string, server: string, port?: number, options?: Object[]) : void
}