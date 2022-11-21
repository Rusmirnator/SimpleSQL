import { Injectable } from '@angular/core';
import { IConveyOperationResult } from 'base/interfaces/IConveyOperationResult';
import { IpcService } from './ipc.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor(private _ipc: IpcService, private _logger: LoggerService) {
    _ipc.on("minimized", (_: Event, res: IConveyOperationResult) => this.receiveResult(_, res));
    _ipc.on("resized", (_: Event, res: IConveyOperationResult) => this.receiveResult(_, res));
    _ipc.on("closed", (_: Event, res: IConveyOperationResult) => this.receiveResult(_, res));
  }

  changeWindowState(action: string): void {
    this._ipc.send(["window", ".", action].join(''));
  }

  private receiveResult(_: Event, res: IConveyOperationResult): void {
    if (res.statusCode !== 0) {
      this._logger.logError(res.message!);
      return;
    }
    this._logger.logInfo(res.result as string);
  }
}
