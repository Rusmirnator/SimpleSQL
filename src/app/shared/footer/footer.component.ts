import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLClientService, IResponseObject } from 'src/app/core/services/sqlclient.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input() databaseName = new Observable<string>();

  constructor() { }

  ngOnInit(): void {
  }
}
