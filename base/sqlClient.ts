import { IConnectionParameters } from "./interfaces/IConnectionParameters";
import { IProvideSqlConnection } from "./interfaces/IProvideSqlConnection";
import ConnectionParameters from "./shared/ConnectionParameters";
import { Client } from 'ts-postgres'
import { URL } from "whatwg-url";

export default class SqlClient implements IProvideSqlConnection {
    parameters: IConnectionParameters;
    client!: Client;

    constructor() {
        this.parameters = new ConnectionParameters();
    }

    configureConnection(connectionString: string): void {
        let url = new URL(connectionString);

        if (connectionString === null) {
            console.log('ERROR: Connection could not be configured - connectionString is empty!');
            return;
        }

        this.parameters.initialize(url.username, url.password, url.pathname, url.pathname, parseInt(url.port));

        this.client = new Client(this.parameters);
    }

    public async executeQueryAsync(query: string): Promise<any>;
    public async executeQueryAsync(query: string, queryParameters?: any[]): Promise<any> {
        try {
            await this.client.connect();

            console.log(query);

            return await this.client.query(query);

        } catch (err) {

            console.log(err);

            return await err;
        }
        finally {
            await this.client.end();
        }
    }
}