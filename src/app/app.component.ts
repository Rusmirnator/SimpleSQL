import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAppSettings } from 'base/interfaces/IAppSettings';
import { AppSettings } from 'base/shared/AppSettings';
import { BehaviorSubject, from, Observable } from 'rxjs';
import EventArgs from './core/classes/eventargs';
import { IDataRow } from './core/interfaces/idata-row';
import { ITreeViewElement } from './core/interfaces/itree-view-element';
import { IpcService } from './core/services/ipc.service';
import { LoggerService } from './core/services/logger.service';
import { ServerService } from './core/services/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  dlgTrigger: string | null | undefined;
  connectionEstablished: boolean = true;
  isWaitIndicatorVisible: boolean = false;

  appSettings: IAppSettings;
  host: string | undefined;
  database: string | undefined;
  user: string | undefined;
  password: string | undefined;
  ssl: string | undefined;
  selectedIndex: number | undefined;

  resultSet$: Observable<IDataRow[]> = new Observable<IDataRow[]>();
  databaseName$: Observable<string> = new Observable<string>();
  databases$: Observable<ITreeViewElement[]> = new Observable<ITreeViewElement[]>();

  constructor(private _logger: LoggerService, private _ipcService: IpcService, private _ref: ChangeDetectorRef, private _serverService: ServerService) {
    this.appSettings = new AppSettings();
  }

  async ngOnInit(): Promise<void> {
    this.toggleWaitIndicator();

    this._ipcService.send('startup');
    this._ipcService.on('configurationRequired', (_configPath: string) => {

      this.connectionEstablished = false;

      this._logger.logInfo("Configuration required!");

      this.dlgTrigger = "dlgConnectionSettings";
      this._ref.detectChanges();
    });

    await this.initAsync();

    this.toggleWaitIndicator();
  }

  onSSLModeSelected(event: Event) {
    this.ssl = (event.target as HTMLSelectElement).options[this.selectedIndex ??= 0].value;
  }

  onModalResultResolved(e: EventArgs<HTMLElement>) {
    if (e.handle) {
      this.consumeModalData(e.instance!);
      this.appSettings.loadedSettings = {
        Connection: {
          PGSQL: {
            DatabaseURL: `postgres://${this.user}:${this.password}@${this.host}/${this.database}`,
            SSL: this.ssl
          }
        }
      }
      this._logger.logInfo(`Manually provided connection settings...`);
      this._ipcService.send('configurationProvided', this.appSettings.loadedSettings);

      this.connectionEstablished = true;
      this.initAsync();
    }
    this.dlgTrigger = "";

    this.toggleWaitIndicator();
    this._ref.detectChanges();
  }

  private consumeModalData(modalBody: HTMLElement): void {
    let elements = modalBody.getElementsByClassName("editable");
    this.host = (elements[0] as HTMLInputElement).value;
    this.database = (elements[1] as HTMLInputElement).value;
    this.user = (elements[2] as HTMLInputElement).value;
    this.password = (elements[3] as HTMLInputElement).value;
    this.selectedIndex = (elements[4] as HTMLSelectElement).selectedIndex;
    this.ssl = (elements[4] as HTMLSelectElement).options[this.selectedIndex ??= 0].value;
  }

  private toggleWaitIndicator() {
    this.isWaitIndicatorVisible = !this.isWaitIndicatorVisible;
    this._ref.detectChanges();
  }

  private async initAsync(): Promise<void> {
    if (this.connectionEstablished) {
      this.databaseName$ = from(await this._serverService.getDatabaseNameAsync());
      let res = new BehaviorSubject<ITreeViewElement[]>(await this._serverService.getDatabasesAsync());

      this.databases$ = res.asObservable();
    }
  }
}
