import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';
@Injectable({
  providedIn: 'root'
})
export class SQLClientService {

  private responseCallback!: Function;

  constructor(private _ipcService: IpcService) {
    _ipcService.on('sqlResponse', (_event: any, arg: IResponseObject) => this.responseCallback(arg));
  }

  sqlQuery(query: string, callback: Function): void {
    this.responseCallback = callback;

    this._ipcService.send('sqlQuery', query);
  }

  tryConnect(): boolean {
    let canConnect: boolean = false;

    try {
      
      this.sqlQuery('SELECT 1', (response: IResponseObject) => {
        canConnect = response !== null;
      })
    } catch (exception) {

      console.log(exception);
    } finally {

      return canConnect;
    }
  }
}

export interface IResponseObject {
  recordsets: any[],
  recordset: any[],
  output: any,
  rowsAffected: number
}