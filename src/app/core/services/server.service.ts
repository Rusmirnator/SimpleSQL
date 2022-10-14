import { Injectable } from '@angular/core';
import { ServerProvider } from 'base/enumerations';
import { DataRow } from '../classes/data-row';
import { TreeViewElement } from '../classes/tree-view-element';
import { IDataRow } from '../interfaces/idata-row';
import { ITreeViewElement } from '../interfaces/itree-view-element';
import { IResponseObject, SQLClientService } from './sqlclient.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private provider?: ServerProvider = ServerProvider.PGSQL;

  constructor(private _sqlService: SQLClientService) { }

  async getDatabasesAsync(): Promise<ITreeViewElement[]> {
    let query: string;

    switch (this.provider) {
      case ServerProvider.PGSQL:
        query = "SELECT datname AS header, datdba as number FROM pg_database";
        break;
      case ServerProvider.MSSQL:
        query = "SELECT name FROM sys.databases";
        break;
    }

    let res = await this._sqlService.sqlQueryAsync(query!);

    console.log(res);

    return this.toTreeViewElementArray(res);
  }

  async getDatabaseNameAsync(): Promise<string> {
    let query: string;

    switch (this.provider) {
      case ServerProvider.PGSQL:
        query = "SELECT CURRENT_DATABASE() AS databaseName";
        break;
      case ServerProvider.MSSQL:
        query = "SELECT DB_NAME() AS databaseName";
        break;
    }

    let res = await this._sqlService.sqlQueryAsync(query!);

    console.log(res);

    return res.rows[0];
  }

  private toDataRowArray(response: IResponseObject): IDataRow[] {
    let output: IDataRow[] = [];
    let columns = response.names;

    // response.rows.map((row: [], i) => {
    //   let obj = new DataRow(i);
    //   let entries = Object.entries(obj.rowData!);
    //   obj.createRowData(response.names, row)

    //   columns.map((col, j) => {
    //     entries.push([col, row[j]]);
    //     output.push(obj);
    //     console.log(obj);
    //   })
    // });
    return output;
  }

  private toTreeViewElementArray(response: IResponseObject): ITreeViewElement[] {
    let output: ITreeViewElement[] = [];

    response.rows.map((row, i) => {
      output.push(new TreeViewElement(row[i], false, false, i));
    });

    return output;
  }
}
