import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SQLClientService, IResponseObject } from 'src/app/core/services/sqlclient.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  databaseName = new BehaviorSubject<string>('');
  connectionEstablished: boolean | undefined;

  constructor(private _sqlService: SQLClientService, private _ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._sqlService.tryConnectAsync((response: boolean) => this.setConnectionestablished(response));
  }

  setConnectionestablished(connected: boolean): void {
    if (connected) {
      this._sqlService.sqlQuery("SELECT CURRENT_DATABASE() AS databaseName", (response: IResponseObject) => this.setDatabaseName(response));
    }
  }

  setDatabaseName(response: IResponseObject): void {
    if (response !== undefined) {
      this.databaseName.next(response.rows[0]);
    }
    this._ref.detectChanges();
  }
}
