import { IConnectionParameters } from "../base/interfaces/IConnectionParameters";
import { IProvideSqlConnection } from "../base/interfaces/IProvideSqlConnection";
import ConnectionParameters from "../base/shared/ConnectionParameters";
import { Client, Query, SSLMode } from 'ts-postgres'
import { URL } from "whatwg-url";
import Logger from "../base/logger";
import { LogLevel } from "../base/enumerations";
import { IResponseObject } from "../base/interfaces/IResponseObject";
import { ResponseObject } from "../base/shared/ResponseObject";
import { Batch } from "./batch";

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

        this.parameters.initialize(url.username, url.password, url.pathname, url.host, parseInt(url.port), SSLMode.Disable);
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

    public async executeBatchAsync(script: string): Promise<IResponseObject[]> {
        let response: IResponseObject[] = [];
        let batch = new Batch(script);
        batch.build();

        while (batch.isValid() && batch.next()) {
            response.push(await this.executeQueryAsync(batch.getCurrent()!.text));
        }

        return response;
    }
}