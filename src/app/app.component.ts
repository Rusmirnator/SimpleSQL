import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAppSettings } from 'base/interfaces/IAppSettings';
import { AppSettings } from 'base/shared/AppSettings';
import { Observable } from 'rxjs';
import EventArgs from './core/classes/eventargs';
import { IDataRow } from './core/interfaces/idata-row';
import { IpcService } from './core/services/ipc.service';
import { LoggerService } from './core/services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string = 'SimpleSQL'
  dlgTrigger: string | undefined;

  appSettings: IAppSettings;
  host: string | undefined;
  database: string | undefined;
  user: string | undefined;
  password: string | undefined;
  ssl: string | undefined;
  selectedIndex: number | undefined;

  resultSet: Observable<IDataRow[]> = new Observable<IDataRow[]>();

  constructor(private _logger: LoggerService, private _ipcService: IpcService, private _ref: ChangeDetectorRef) {
    this.appSettings = new AppSettings();
  }

  ngOnInit(): void {
    this._ipcService.send('startup');
    this._ipcService.on('configurationRequired', (configPath: string) => {

      this._logger.logInfo("Configuration required!");

      this.dlgTrigger = "dlgConnectionSettings";
      this._ref.detectChanges();
    });
  }

  onSSLModeSelected(event: Event) {
    this.ssl = (event.target as HTMLSelectElement).options[this.selectedIndex ??= 0].value;
  }

  onModalResultResolved(e: EventArgs<HTMLElement>) {
    if (e.handle) {
      this.initializeFields(e.instance!);
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
    }
    this.dlgTrigger = '';
    this._ref.detectChanges();
  }

  private initializeFields(modalBody: HTMLElement): void {
    let elements = modalBody.getElementsByClassName("editable");
    this.host = (elements[0] as HTMLInputElement).value;
    this.database = (elements[1] as HTMLInputElement).value;
    this.user = (elements[2] as HTMLInputElement).value;
    this.password = (elements[3] as HTMLInputElement).value;
    this.selectedIndex = (elements[4] as HTMLSelectElement).selectedIndex;
    this.ssl = (elements[4] as HTMLSelectElement).options[this.selectedIndex ??= 0].value;
  }
}
