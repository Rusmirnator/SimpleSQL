import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PropertyChangedEventArgs } from 'base/shared/PropertyChangedEventArgs';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncCommand } from 'src/app/core/classes/async-command';
import { Command } from 'src/app/core/classes/command';
import EventArgs from 'src/app/core/classes/eventargs';
import { ViewHandler } from 'src/app/core/classes/view-handler';
import { IDataRow } from 'src/app/core/interfaces/idata-row';
import { LoggerService } from 'src/app/core/services/logger.service';
import { ServerService } from 'src/app/core/services/server.service';

@Component({
  selector: 'im-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent extends ViewHandler implements OnInit {

  error: string = "";
  script: string = "";

  private get resultSets(): IDataRow[][] {
    return this.getValue("resultSets");
  }

  private set resultSets(value: IDataRow[][]) {
    this.setValue("resultSets", value);
  }

  private get scripts(): Map<number, string> {
    return this.getValue("scripts");
  }

  private set scripts(value: Map<number, string>) {
    this.setValue("scripts", value);
  }

  public get selectedPath(): string {
    return this.getValue("selectedPath");
  }

  private set selectedPath(value: string) {
    this.setValue("selectedPath", value);
  }

  resultSet$: BehaviorSubject<IDataRow[]> = new BehaviorSubject<IDataRow[]>([]);
  dataGridTabs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  editorTabs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  commands$: Observable<Command[]> = new Observable<Command[]>();

  constructor(private _ref: ChangeDetectorRef, private _serverService: ServerService, private _logger: LoggerService) {
    super();
    this.initializeCommands();
  }

  ngOnInit(): void {
    this.initializeProperties();
  }

  onEditValueChanged(editValue: string) {
    this.script = editValue;
  }

  onEditorTabAdded(newLength: number) {
    this.scripts.set(newLength, "");
  }

  onEditorTabRemoved(tabIndex: number) {
    this.scripts.delete(tabIndex);
  }

  onDataGridTabItemSelected(selectedIndex: number): void {
    this.changeState();

    this.resultSet$.next(this.resultSets[selectedIndex]);

    this.changeState();
  }

  onEditorTabItemSelected(selectedIndex: number): void {
    this.changeState();
    console.log(this.scripts.get(selectedIndex));
    this.script = this.scripts.get(selectedIndex) ?? "";

    this.changeState();
  }

  async onModalResultResolved(e: EventArgs<HTMLElement>): Promise<void> {
    if (this.getDialog('help') || this.getDialog('error')) {
      this.closeDialog();
    }

    if (this.getDialog('selectPath')) {
      this.closeDialog();

      await this.writeScriptAsync(e.instance);
    }
  }

  async executeQueryAsync(): Promise<void> {
    this.changeState();

    this.resultSets = (await this._serverService.executeBatchAsync(this.script!)).getValue();

    let tabs: string[] = [];

    this.resultSets.forEach((arr) => {
      tabs.push(["Rows affected:", arr.length.toString()].join(''));
    });

    this.dataGridTabs$ = new BehaviorSubject(tabs);
    this.resultSet$.next(this.resultSets[0]);

    this.changeState();
  }

  async browseDirectories(): Promise<void> {
    this.selectedPath = await this._serverService.selectDirectoryAsync();
  }

  selectPath(): void {
    this.showDialog('selectPath');
  }

  showHelp(): void {
    this.showDialog('help');
  }

  async writeScriptAsync(modalBody?: HTMLElement): Promise<void> {
    this.changeState();

    let elements = modalBody?.getElementsByClassName("editable");

    let path: string = (elements![0] as HTMLInputElement).value;

    if (path) {
      this._logger.logInfo(`Choosen path: ${path}`);
      await this._serverService.saveScriptAsync(path, this.script!);
    }

    if (!path) {
      this.error = "Couldn't save script - path was empty or invalid!";
      this.showDialog("error");
    }

    this.changeState();
  }

  private initializeCommands(): void {
    let commands: Command[] = [];
    commands.push(new Command(() => this.showHelp(), () => this.canShowHelp(), 'F1', 'Help'));
    commands.push(new AsyncCommand(() => this.executeQueryAsync(), () => this.canExecuteQuery(), "F5", "Execute"));
    commands.push(new Command(() => this.selectPath(), () => this.canWriteScript(), "CmdOrCtrl+S", "Write to file"));

    this.commands$ = new BehaviorSubject<Command[]>(commands).asObservable();
  }

  private initializeProperties(): void {
    this.scripts = new Map<number, string>();
    this.scripts.set(0, this.script);
    this.editorTabs$.next(["InitialTab"]);
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

  protected override raisePropertyChanged<T>(e: PropertyChangedEventArgs<T>): void {
    console.log(`Property ${e.propertyName} changed! New value: \n`);
    console.log(e.value);

    this._ref.detectChanges();
  }
}
