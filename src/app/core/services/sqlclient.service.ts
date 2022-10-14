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
          reject("Couldn't query asynchronously!");
        }
        resolve(response);
      });
    });
  }

  asSingle<T>(source: IResponseObject): T {
    return this.asMany(source)[0] as T;
  }

  asMany<T>(source: IResponseObject): T[] {
    let res: T[] = [];

    source.rows.forEach((row) => {
      res.push(this.mapSingle<T>(source.names, row));
    });

    return res;
  }

  private mapSingle<T>(colSource: string[], rowSource: Object[]): T {
    let entries = new Map<string, Object>();

    colSource.forEach((col) => {
      entries.set(col, rowSource[this.getColumnIndex(col, colSource)]);
    });

    return Object.fromEntries(entries) as unknown as T;
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

  private getColumnIndex(colName: string, colSource: string[]): number {
    return colSource.indexOf(colName);
  }
}

export interface IResponseObject {
  names: string[],
  rows: any[],
  status: string
}