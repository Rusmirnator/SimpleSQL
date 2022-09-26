import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IResponseObject, SQLClientService } from 'services/sqlclient.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  databaseName = new BehaviorSubject<string>('');

  constructor(private _sqlService: SQLClientService, private _notifyDataUpdated: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._sqlService.sqlQuery("SELECT DB_NAME() AS databaseName", (response: IResponseObject) => this.setDatabaseName(response));
  }

  setDatabaseName(response: IResponseObject){
    if(response !== undefined){
      this.databaseName.next(response.recordset[0].databaseName);
    }
    this._notifyDataUpdated.detectChanges();
  }

}
