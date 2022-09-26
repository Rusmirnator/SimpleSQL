import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sm-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.css']
})
export class FilterBoxComponent implements OnInit {

  @Output('whereParam') whereParam = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onInputValueChanged(e: Event){
    this.whereParam.emit((e.target as HTMLInputElement).value);
  }

}
