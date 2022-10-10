import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class SQLClientService {

  private responseCallback!: Function;
  private temporaryValue?: IResponseObject;

  constructor(private _ipcService: IpcService) {
    _ipcService.on('sqlQuery', (_event: any, arg: IResponseObject) => this.responseCallback(arg));
    _ipcService.on('sqlQueryAsync', (_event: any, arg: IResponseObject) => this.setTemporaryValue(arg));
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

  async sqlQueryAsync(query: string, args?: any[]): Promise<IResponseObject> {
    let tasks: Promise<any>[] = [];

    tasks.push(new Promise<void>((resolve) => {
      this._ipcService.send('sqlQuery', query);
      return resolve;
    }));

    tasks.push(new Promise<IResponseObject>((returnValue) => {
      while (this.temporaryValue === undefined) {
      }
      this.temporaryValue = returnValue;
      return ;
    }));
  }

  private setTemporaryValue(response: IResponseObject) {
    this.temporaryValue = response;
  }
}

export interface IResponseObject {
  names: string[],
  rows: any[],
  status: string
}