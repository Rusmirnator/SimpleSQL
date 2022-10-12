import { Injectable } from '@angular/core';
import { ServerProvider } from 'base/enumerations';
import { IResponseObject, SQLClientService } from './sqlclient.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private provider?: ServerProvider = ServerProvider.PGSQL;

  constructor(private _sqlService: SQLClientService) { }

  getDatabases(callback: Function): void {
    let query: string;

    switch (this.provider) {
      case ServerProvider.PGSQL:
        query = "SELECT datname AS header FROM pg_database";
        break;
      case ServerProvider.MSSQL:
        query = "SELECT name FROM sys.databases";
        break;
    }

    this._sqlService.sqlQuery(query!, (response: IResponseObject) => callback(response.rows));
  }

  getDatabaseName(callback: Function): void {
    let query: string;

    switch (this.provider) {
      case ServerProvider.PGSQL:
        query = "SELECT CURRENT_DATABASE() AS databaseName";
        break;
      case ServerProvider.MSSQL:
        query = "SELECT DB_NAME() AS databaseName";
        break;
    }
    this._sqlService.sqlQuery(query!, (response: IResponseObject) => callback(response.rows[0]));
  }
}
