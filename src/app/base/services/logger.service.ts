import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private _ipcService: IpcService) { }

  logInfo(content: string): void {
    this._ipcService.send('log', content);
  }

  logError(content: string): void {
    this._ipcService.send('log:error', content);
  }
}
