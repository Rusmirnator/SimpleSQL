import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';

@Injectable({
  providedIn: 'root'
})
export class KeyGestureService {

  private gestureResolver?: Function;

  constructor(private _ipcService: IpcService) {
    this._ipcService.on('keyPressed', (_event: any, arg: string) => this.onKeyPressed(arg));
  }

  public registerGestureResolver(resolverFunction: Function) {
    this.gestureResolver = resolverFunction;
  }

  private onKeyPressed(keyGesture: string) {
    if (this.gestureResolver !== null) {
      this.gestureResolver?.call(this, keyGesture);
    }
  }
}
