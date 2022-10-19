import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sm-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class BackdropComponent implements OnInit {

  @Input() isVisible: boolean | undefined;
  @Output() clicked = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  backDropClick() {
    this.clicked.emit();
  }
}
