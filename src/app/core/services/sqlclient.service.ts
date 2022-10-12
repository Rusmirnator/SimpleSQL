import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class SQLClientService {
  private temporaryValue?: IResponseObject;

  constructor(private _ipcService: IpcService) {
    _ipcService.on('sqlQueryAsync', (_event: any, arg: IResponseObject) => this.setTemporaryValue(arg));
  }

  sqlQuery(query: string, callback: Function): void {
    this._ipcService.on('sqlQuery', (_event: any, arg: IResponseObject) => callback(arg));
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

  async sqlQueryAsync(query: string, args?: any[]): Promise<IResponseObject | unknown> {
    let tasks: Promise<any>[] = [];

    tasks.push(new Promise<void>((resolve, reject) => {
      this._ipcService.send('sqlQuery', query);
    }));

    tasks.push(new Promise<IResponseObject>((resolve, reject) => {
      console.log("promise 2");
      while (this.temporaryValue === undefined) {
        setTimeout(() => {
          console.log("waiting...");
        }, 1000);
      }

      let res = this.temporaryValue;

      this.temporaryValue = undefined;

      return res;
    }));

    return await Promise.all(tasks);
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