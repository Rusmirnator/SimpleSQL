import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {

  @Input() show: boolean | undefined;
  @Input() title: string | undefined;
  @Output() closed = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit(): void {
  }

  close() {
    this.closed.emit(this.show);
  }

}
