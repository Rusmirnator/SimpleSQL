import { Component, OnInit } from '@angular/core';
import { LoggerService } from './base/services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title: string = 'WMS Curiosity'
  isMenuExpanded: boolean = true;
  dlgTrigger: string | undefined;
  login: string | undefined;
  password: string | undefined;

  constructor(private _logger: LoggerService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.dlgTrigger = "dlgLogin";
    }, 1500);
  }

  onToggleMenu(): void {
    this.isMenuExpanded = !this.isMenuExpanded;
    this._logger.log(`Sidemenu expanded: ${this.isMenuExpanded.toString()}`);
  }
}
