import { Injectable } from '@angular/core';
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

    return await Promise.all(tasks);
  }

  private prepareQueryId(query: string): string {
    let hash = 0, i, chr;

    for (i = 0; i < query.length; i++) {
      chr = query.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }

    return `sqlQuery:${hash.toString()}`;
  }
}

export interface IResponseObject {
  names: string[],
  rows: any[],
  status: string
}