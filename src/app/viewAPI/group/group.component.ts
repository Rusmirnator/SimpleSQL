import { Component, Input, OnInit } from '@angular/core';
import { Orientation } from 'src/app/core/enumerations/orientation';

@Component({
  selector: 'sm-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  standalone: true
})
export class GroupComponent implements OnInit {

  @Input() orientation: Orientation = Orientation.Horizontal;

  constructor() { }

  ngOnInit(): void {
  }

}
