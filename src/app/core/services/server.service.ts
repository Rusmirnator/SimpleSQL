import { Injectable } from '@angular/core';
import { ServerProvider } from 'base/enumerations';
import { Observable } from 'rxjs';
import { TreeViewElement } from '../classes/tree-view-element';
import { IResponseObject, SQLClientService } from './sqlclient.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private provider?: ServerProvider | ServerProvider.PGSQL;

  constructor(private _sqlService: SQLClientService) { }

  getServerMembers(): Observable<TreeViewElement[]> {
    let response: IResponseObject;
    let query: string;

    switch (this.provider) {
      case ServerProvider.PGSQL:
        query = "SELECT datname FROM pg_database";
        break;
      case ServerProvider.MSSQL:
        query = "SELECT name FROM sys.databases";
        break;
    }

    this._sqlService.sqlQuery(query!, (requestResponse: IResponseObject) => response = requestResponse);

    return new Observable(sub => {
      sub.next(response.rows);
    });
  }

  getDatabaseName(): Observable<string> {
    let response: IResponseObject;
    let query: string;

    switch (this.provider) {
      case ServerProvider.PGSQL:
        query = "SELECT CURRENT_DATABASE() AS databaseName";
        break;
      case ServerProvider.MSSQL:
        query = "SELECT DB_NAME() AS databaseName";
        break;
    }

    this._sqlService.sqlQuery(query!, (requestResponse: IResponseObject) => response = requestResponse);

    return response!.rows[0] ?? "luj";
  }
}
