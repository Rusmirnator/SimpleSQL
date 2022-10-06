import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
  login: string | undefined;
  password: string | undefined;
  commands: string | undefined;
  
  resultSet: Observable<IDataRow[]> = new Observable<IDataRow[]>();


  constructor(private _logger: LoggerService) { }

  ngOnInit(): void {
    this._logger.logInfo(`[Modal] ${this.dlgTrigger}`);
  }
}
