import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private _ipcService: IpcService) { }

  log(content: string): void {
    this._ipcService.send('log', content);
  }
}
