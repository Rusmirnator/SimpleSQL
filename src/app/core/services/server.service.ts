import { Injectable } from '@angular/core';
import { ServerProvider } from 'base/enumerations';
import { ResponseObject } from 'base/shared/ResponseObject';
import { BehaviorSubject } from 'rxjs';
import { IDataRow } from '../interfaces/idata-row';
import { ITreeViewElement } from '../interfaces/itree-view-element';
import { SQLClientService } from './sqlclient.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private provider?: ServerProvider = ServerProvider.PGSQL;

  constructor(private _sqlService: SQLClientService) { }

  async getDatabasesAsync(): Promise<BehaviorSubject<ITreeViewElement[]>> {
    let query: string;

    switch (this.provider) {
      case ServerProvider.PGSQL:
        query = "SELECT datname AS header, ROW_NUMBER() OVER(ORDER BY (SELECT NULL)) AS index FROM pg_database";
        break;
      case ServerProvider.MSSQL:
        query = "SELECT name FROM sys.databases";
        break;
    }

    let res = new ResponseObject(await this._sqlService.sqlQueryAsync(query!));

    return new BehaviorSubject<ITreeViewElement[]>(res.asMany<ITreeViewElement>());
  }

  async getDatabaseNameAsync(): Promise<BehaviorSubject<string>> {
    let query: string;

    switch (this.provider) {
      case ServerProvider.PGSQL:
        query = "SELECT CURRENT_DATABASE() AS databaseName";
        break;
      case ServerProvider.MSSQL:
        query = "SELECT DB_NAME() AS databaseName";
        break;
    }

    let res = new ResponseObject(await this._sqlService.sqlQueryAsync(query!));

    return new BehaviorSubject<string>(res.rows![0]);
  }

  async getResultSetAsync(query: string): Promise<BehaviorSubject<IDataRow[]>> {
    let res = await this._sqlService.sqlQueryAsync(query!);

    return new BehaviorSubject<IDataRow[]>([]);
  }
}
