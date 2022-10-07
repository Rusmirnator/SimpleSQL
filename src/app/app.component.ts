import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IpcService } from './base/services/ipc.service';
import { LoggerService } from './base/services/logger.service';
import { IDataRow } from './shared/interfaces/idata-row';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string = 'SimpleSQL'
  dlgTrigger: string | undefined;

  host: string | undefined;
  database: string | undefined;
  user: string | undefined;
  password: string | undefined;
  ssl: string | undefined;

  configPath: string | undefined;

  resultSet: Observable<IDataRow[]> = new Observable<IDataRow[]>();

  constructor(private _logger: LoggerService, private _ipcService: IpcService, private _ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._ipcService.send('startup');
    this._ipcService.on('configurationRequired', (configPath: string) => {

      this._logger.logInfo("Configuration required!");

      this.configPath = configPath;
      this.dlgTrigger = "dlgConnectionSettings";
      this._ref.detectChanges();
    });
  }

  onSSLModeSelected(event: Event) {
    let selectedIndex = (event.target as HTMLSelectElement).options.selectedIndex;
    this.ssl = (event.target as HTMLSelectElement).options[selectedIndex].value;
  }
}
