import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.css']
})
export class BackdropComponent implements OnInit {

  @Input() show: boolean | undefined;
  @Output() clicked = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit(): void {
  }

  backDropClick() {
    this.clicked.emit();
  }

}
