import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sm-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.css']
})
export class RibbonComponent implements OnInit {

  @Output('command') command = new EventEmitter<string>();

  ngOnInit(): void {
  }

  onCommand(keyGesture: string){
    this.command.emit(keyGesture);
  }

}
