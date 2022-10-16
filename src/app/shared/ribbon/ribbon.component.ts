import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Command } from 'src/app/core/classes/command';
import { KeyGestureService } from 'src/app/core/services/key-gesture.service';

@Component({
  selector: 'app-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.css']
})
export class RibbonComponent implements OnInit {

  @Input() commands?: Observable<Command[]> = new Observable<Command[]>();

  constructor(private _keyGestureService: KeyGestureService) { }

  ngOnInit(): void {

  }

}
