import { Injectable } from '@angular/core';
import { ServerProvider } from 'base/enumerations';
import { IConveyOperationResult } from 'base/interfaces/IConveyOperationResult';
import { IResponseObject } from 'base/interfaces/IResponseObject';
import { ResponseObject } from 'base/shared/ResponseObject';
import { BehaviorSubject } from 'rxjs';
import { DataRow } from '../classes/data-row';
import { IDataRow } from '../interfaces/idata-row';
import { ITreeViewElement } from '../interfaces/itree-view-element';
import { IpcService } from './ipc.service';
import { SQLClientService } from './sqlclient.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private _sqlService: SQLClientService, private _ipc: IpcService) { }

  async getDatabasesAsync(): Promise<BehaviorSubject<ITreeViewElement[]>> {
    let query = "SELECT datname AS header, ROW_NUMBER() OVER(ORDER BY (SELECT NULL)) AS index FROM pg_database";

    let res = new ResponseObject(await this._sqlService.sqlQueryAsync(query!));

    return new BehaviorSubject<ITreeViewElement[]>(res.asMany<ITreeViewElement>());
  }

  async getDatabaseNameAsync(): Promise<BehaviorSubject<string>> {
    let query = "SELECT CURRENT_DATABASE() AS databaseName";

    let res = new ResponseObject(await this._sqlService.sqlQueryAsync(query!));

    return new BehaviorSubject<string>(res.rows![0]);
  }

  async executeQueryAsync(query: string): Promise<BehaviorSubject<IDataRow[]>> {
    return new BehaviorSubject<IDataRow[]>(this.toDataRowArray(await this._sqlService.sqlQueryAsync(query!)));
  }

  async executeBatchAsync(script: string): Promise<BehaviorSubject<IDataRow[][]>> {
    let response = await this._sqlService.sqlBatchAsync(script!);
    let resultSets: DataRow[][] = [];

    for (let result of response) {
      resultSets.push(this.toDataRowArray(new ResponseObject(result)));
    }
    return new BehaviorSubject<IDataRow[][]>(resultSets);
  }

  private toDataRowArray(response: IResponseObject): DataRow[] {
    let res = new ResponseObject(response);
    let dataRow: IDataRow;
    let resultSet: IDataRow[] = [];

    res.rows?.forEach((_, i) => {
      dataRow = new DataRow(i);
      dataRow.fromResponse(res, i);

      resultSet.push(dataRow);
    });

    return resultSet;
  }

  async saveScriptAsync(path: string, script: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._ipc.send('saveScript', [path, script]);
      this._ipc.once('scriptSaved', (res: IConveyOperationResult) => {
        if (res.statusCode !== 0) {
          return reject(res.message);
        }
        resolve();
      });
    });
  }

  async selectDirectoryAsync(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._ipc.send('selectDirectory');
      this._ipc.once('directorySelected', (_: any, res: IConveyOperationResult) => {
        if (res.statusCode !== 0) {
          return reject(res.message);
        }
        resolve(res.result as string);
      });
    });
  }
}
