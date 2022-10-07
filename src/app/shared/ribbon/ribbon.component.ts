import { Component, OnInit } from '@angular/core';
import { KeyGestureService } from 'src/app/core/services/key-gesture.service';

@Component({
  selector: 'app-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.css']
})
export class RibbonComponent implements OnInit {

  constructor(private _keyGestureService: KeyGestureService) { }

  ngOnInit(): void {
  }

}
