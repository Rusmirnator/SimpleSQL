import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncCommand } from 'src/app/core/classes/async-command';
import { Command } from 'src/app/core/classes/command';
import EventArgs from 'src/app/core/classes/eventargs';
import { ViewHandler } from 'src/app/core/classes/view-handler';
import { IDataRow } from 'src/app/core/interfaces/idata-row';
import { ServerService } from 'src/app/core/services/server.service'; 

@Component({
  selector: 'im-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent extends ViewHandler implements OnInit {

  error: string = "";
  script: string | undefined;

  resultSet$: BehaviorSubject<IDataRow[]> = new BehaviorSubject<IDataRow[]>([]);
  commands$: Observable<Command[]> = new Observable<Command[]>();
  
  constructor(private _serverService: ServerService) {
    super();
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
    commands.push(new Command(() => this.selectPath(), () => this.canWriteScript(), "CmdOrCtrl+S", "Write to file"));

    this.commands$ = new BehaviorSubject<Command[]>(commands).asObservable();
  }

  async onModalResultResolved(e: EventArgs<HTMLElement>): Promise<void> {
    if (this.getDialog('help')) {
      this.closeDialog();
    }

    if (this.getDialog('selectPath')) {
      this.closeDialog();

      await this.writeScriptAsync(e.instance);
    }
  }

  async executeQueryAsync(): Promise<void> {
    this.changeState();

    this.resultSet$ = await this._serverService.executeQueryAsync(this.script!);

    this.changeState();
  }

  selectPath(): void {
    this.showDialog('selectPath');
  }

  showHelp(): void {
    this.showDialog('help');
  }

  async writeScriptAsync(content?: HTMLElement): Promise<void> {
    this.changeState();

    let path: string = content?.innerHTML!;

    await this._serverService.saveScriptAsync(path, this.script!);

    this.changeState();
  }

  canExecuteQuery(): boolean {
    return this.script !== undefined && this.script.length > 0;
  }

  canShowHelp(): boolean {
    return !this.getDialog("help");
  }

  canWriteScript(): boolean {
    return this.script !== undefined && this.script.length > 0;
  }
}
