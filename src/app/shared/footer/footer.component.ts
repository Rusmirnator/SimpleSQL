import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IResponseObject, SQLClientService } from '../../base/services/sqlclient.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  databaseName = new BehaviorSubject<string>('');
  connectionEstablished: boolean = false;

  constructor(private _sqlService: SQLClientService, private _notifyDataUpdated: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    await this._sqlService.tryConnectAsync().then((success) => {
      if (success) {
        this._sqlService.sqlQuery("SELECT CURRENT_DATABASE() AS databaseName", (response: IResponseObject) => this.setDatabaseName(response));
      }
    }, (failure: string = "Could not connect to SQL server.") => {
      console.log(failure);
    });
  }

  setDatabaseName(response: IResponseObject): void {
    if (response !== undefined) {
      console.log(response);
      this.databaseName.next(response.rows[0]);
    }
    this._notifyDataUpdated.detectChanges();
  }
}
