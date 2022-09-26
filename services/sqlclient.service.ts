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
}

export interface IResponseObject {
  recordsets: any[],
  recordset: any[],
  output: any,
  rowsAffected: number
}