import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncCommand } from 'src/app/core/classes/async-command';
import { Command } from 'src/app/core/classes/command';
import EventArgs from 'src/app/core/classes/eventargs';
import { IDataRow } from 'src/app/core/interfaces/idata-row';
import { ServerService } from 'src/app/core/services/server.service'; 

@Component({
  selector: 'im-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {

   dlgTrigger: string = '';
  isWaitIndicatorVisible: boolean = false;
  script: string | undefined;

  resultSet$: BehaviorSubject<IDataRow[]> = new BehaviorSubject<IDataRow[]>([]);
  commands$: Observable<Command[]> = new Observable<Command[]>();
  
  constructor(private _ref: ChangeDetectorRef, private _serverService: ServerService) {
    this.initializeCommands();
   }

  ngOnInit(): void {
  }

  onEditValueChanged(editValue: string) {
    this.script = editValue;
  }

  private initializeCommands(): void {
    let commands: Command[] = [];
    commands.push(new Command(() => this.showHelp(), () => this.canShowHelp(), 'F1', 'Help'));
    commands.push(new AsyncCommand(() => this.executeQueryAsync(), () => this.canExecuteQuery(), "F5", "Execute"));
    commands.push(new AsyncCommand(() => this.writeScriptAsync(), () => this.canWriteScript(), "CmdOrCtrl+S", "Write to file"));

    this.commands$ = new BehaviorSubject<Command[]>(commands).asObservable();
  }

  onModalResultResolved(e: EventArgs<HTMLElement>): void {
    this.dlgTrigger = '';
    this._ref.detectChanges();
  }

  private toggleWaitIndicator() {
    this.isWaitIndicatorVisible = !this.isWaitIndicatorVisible;
    this._ref.detectChanges();
  }

  async executeQueryAsync(): Promise<void> {
    this.toggleWaitIndicator();

    this.resultSet$ = await this._serverService.executeQueryAsync(this.script!);

    this.toggleWaitIndicator();
  }

  async writeScriptAsync(): Promise<void> {
    this.toggleWaitIndicator();

    await this._serverService.saveScriptAsync(this.script!);

    this.toggleWaitIndicator();
  }

  showHelp(): void {
    this.dlgTrigger = 'dlgHelp';
    this._ref.detectChanges();
  }

  canExecuteQuery(): boolean {
    return this.script !== undefined && this.script.length > 0;
  }

  canShowHelp(): boolean {
    return this.dlgTrigger.length === 0;
  }

  canWriteScript(): boolean {
    return this.script !== undefined && this.script.length > 0;
  }
}
