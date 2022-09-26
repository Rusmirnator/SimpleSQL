import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.dlgTrigger = "dlgLogin";
    }, 1500);
  }

  onToggleMenu(): void {
    this.isMenuExpanded = !this.isMenuExpanded;
    console.log(`Menu expanded: ${this.isMenuExpanded}`);
  }
}
