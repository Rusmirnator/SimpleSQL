import { Injectable } from '@angular/core';
import { IResponseObject } from 'base/interfaces/IResponseObject';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class SQLClientService {

  constructor(private _ipcService: IpcService) { }

  sqlQuery(query: string, callback: Function): void {
    this._ipcService.once(this.prepareQueryId(query), (_event: any, arg: IResponseObject) => callback(arg));
    this._ipcService.send('sqlQuery', query);
  }

  tryConnect(callback: Function): void {
    let canConnect: boolean = false;

    try {

      this.sqlQuery('SELECT NOW()', (response: IResponseObject) => {
        console.log(response);
        canConnect = true;

        callback(canConnect);
      });
    } catch (exception) {
      console.log(exception);
    }
  }

  async sqlQueryAsync(query: string, args?: any[]): Promise<IResponseObject> {
    return new Promise((resolve, reject) => {
      this._ipcService.send('sqlQuery', query);
      this._ipcService.once(this.prepareQueryId(query), (_event: any, response: IResponseObject) => {
        if (response === undefined) {
          return reject("Response was undefined!");
        }

        resolve(response);
      });
    });
  }

  async sqlBatchAsync(script: string): Promise<IResponseObject[]> {
    return new Promise((resolve, reject) => {
      this._ipcService.send('sqlBatch', script);
      this._ipcService.once(this.prepareQueryId(script.length > 128 ? script.slice(0, 127) : script, "sqlBatch"), 
      (_event: any, response: IResponseObject[]) => {
        if (response === undefined) {
          return reject("Response was undefined!");
        }

        resolve(response);
      });
    });
  }

  private prepareQueryId(statement: string, prefix: string = "sqlQuery"): string {
    let hash = 0, i, chr;

    for (i = 0; i < statement.length; i++) {
      chr = statement.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }

    return `${prefix}:${hash.toString()}`;
  }
}