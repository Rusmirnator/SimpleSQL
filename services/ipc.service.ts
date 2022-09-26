import { Injectable } from '@angular/core';
const { ipcRenderer } = (<any>window).require('electron/renderer');

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  constructor() { }

  public on(channel: string, listener: Function) : void {
    ipcRenderer.on(channel, (event: any, arg: any) => listener(event, arg));
  }

  public send(channel: string, arg : any) : void {
    ipcRenderer.send(channel, arg);
  }
}
