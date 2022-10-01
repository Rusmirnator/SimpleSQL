import { IConnectionParameters } from "./IConnectionParameters";

export interface IProvideSqlConnection {
    parameters: IConnectionParameters;

    configureConnection(connectionString: string): void;
    executeQueryAsync(query: string): Promise<any>;
    executeQueryAsync(query: string, queryParameters: any[]): Promise<any>;
}