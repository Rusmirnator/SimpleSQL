import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAppSettings } from 'base/interfaces/IAppSettings';
import { AppSettings } from 'base/shared/AppSettings';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncCommand } from './core/classes/async-command';
import { Command } from './core/classes/command';
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
  script: string | undefined;

  resultSet$: Observable<IDataRow[]> = new Observable<IDataRow[]>();
  databaseName$: Observable<string> = new Observable<string>();
  databases$: Observable<ITreeViewElement[]> = new Observable<ITreeViewElement[]>();
  commands$: Observable<Command[]> = new Observable<Command[]>();

  constructor(private _logger: LoggerService, private _ipcService: IpcService, private _ref: ChangeDetectorRef, private _serverService: ServerService) {
    this.appSettings = new AppSettings();
    this.initializeCommands();
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

  onEditValueChanged(editValue: string) {
    this.script = editValue;
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

  private initializeCommands(): void {
    let commands: Command[] = [];
    commands.push(new AsyncCommand(() => this.onQueryExecutedAsync(), () => this.canExecuteQuery(), "F5", "Execute"));

    this.commands$ = new BehaviorSubject<Command[]>(commands).asObservable();
  }

  private async initAsync(): Promise<void> {
    if (this.connectionEstablished) {
      this.databaseName$ = (await this._serverService.getDatabaseNameAsync()).asObservable();
      this.databases$ = (await this._serverService.getDatabasesAsync()).asObservable();
    }
  }

  async onQueryExecutedAsync(): Promise<void> {
    this.toggleWaitIndicator();

    this.resultSet$ = (await this._serverService.executeQueryAsync(this.script!)).asObservable();

    this.toggleWaitIndicator();
  }

  canExecuteQuery(): boolean {
    return this.script !== undefined && this.script.length > 0;
  }
}
