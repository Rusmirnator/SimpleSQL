import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class SQLClientService {

  private responseCallback!: Function;

  constructor(private _ipcService: IpcService) {
    _ipcService.on('sqlQuery', (_event: any, arg: IResponseObject) => this.responseCallback(arg));
  }

  sqlQuery(query: string, callback: Function): void {
    this.responseCallback = callback;

    this._ipcService.send('sqlQuery', query);
  }

  tryConnectAsync(callback: Function): void {
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
}

export interface IResponseObject {
  names: string[],
  rows: any[],
  status: string
}