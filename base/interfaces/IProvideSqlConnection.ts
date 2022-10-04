import { IConnectionParameters } from "./IConnectionParameters";

/**
 * Provides set of members allowing to establish SQL connection.
 */
export interface IProvideSqlConnection {
    parameters: IConnectionParameters;

    configureConnection(connectionString: string): void;
    executeQueryAsync(query: string, queryParameters: any[]): Promise<any>;
}