import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncCommand } from 'src/app/core/classes/async-command';
import { Command } from 'src/app/core/classes/command';
import { IDataRow } from 'src/app/core/interfaces/idata-row';
import { ServerService } from 'src/app/core/services/server.service'; 

@Component({
  selector: 'im-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {

  isWaitIndicatorVisible: boolean = false;
  script: string | undefined;

  resultSet$: Observable<IDataRow[]> = new Observable<IDataRow[]>();
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
    commands.push(new AsyncCommand(() => this.onQueryExecutedAsync(), () => this.canExecuteQuery(), "F5", "Execute"));

    this.commands$ = new BehaviorSubject<Command[]>(commands).asObservable();
  }

  private toggleWaitIndicator() {
    this.isWaitIndicatorVisible = !this.isWaitIndicatorVisible;
    this._ref.detectChanges();
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
