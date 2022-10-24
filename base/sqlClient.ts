import { IConnectionParameters } from "./interfaces/IConnectionParameters";
import { IProvideSqlConnection } from "./interfaces/IProvideSqlConnection";
import ConnectionParameters from "./shared/ConnectionParameters";
import { Client, Query, SSLMode } from 'ts-postgres'
import { URL } from "whatwg-url";
import Logger from "./logger";
import { LogLevel } from "./enumerations";
import { IResponseObject } from "./interfaces/IResponseObject";
import { ResponseObject } from "./shared/ResponseObject";

export default class SqlClient implements IProvideSqlConnection {
    parameters: IConnectionParameters;

    constructor() {
        this.parameters = new ConnectionParameters();
    }

    configureConnection(connectionString: string, ssl: SSLMode = SSLMode.Disable): void {
        let url = new URL(connectionString);

        if (connectionString === null) {
            Logger.log('Connection could not be configured - connectionString is empty!', LogLevel.Error);
            return;
        }

        this.parameters.initialize(url.username, url.password, url.pathname, url.host, parseInt(url.port), SSLMode.Require, [ { trustServerCertificate: true } ]);
    }

    public async executeQueryAsync(query: string, queryParameters?: any[]): Promise<IResponseObject> {
        let response;
        let statement = new Query(query, queryParameters);
        const client = new Client(this.parameters);

        try {
            await client.connect();
            
            Logger.log(statement.text, LogLevel.Debug);

            response = await client.execute(statement);
        } catch (err: any) {
            Logger.log(err as string, LogLevel.Error);
            response = new ResponseObject();
            response.createErrorMessage(err);
        }
        finally {
            await client.end();
            return response as unknown as IResponseObject;
        }
    }
}