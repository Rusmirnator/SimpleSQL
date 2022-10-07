import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import EventArgs from 'src/app/core/classes/eventargs';
import { IEventArgs } from 'src/app/core/interfaces/ieventargs';
import { BackdropComponent } from '../backdrop/backdrop.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [BackdropComponent, CommonModule],
  standalone: true
})

export class ModalComponent implements OnInit {

  @Input() isVisible: boolean | undefined;
  @Input() title: string | undefined;
  @Output() modalResult = new EventEmitter<IEventArgs<HTMLElement>>();

  constructor() { }

  ngOnInit(): void {
  }

  apply(event: Event) {
    this.modalResult.emit(new EventArgs(true, this.getContext(event)));
  }

  cancel() {
    this.modalResult.emit(new EventArgs(false));
  }

  close() {
    this.modalResult.emit(new EventArgs(false));
  }

  private getContext(event: Event): HTMLElement {
    return (((event as PointerEvent).target as HTMLElement).parentElement as HTMLElement).previousSibling as HTMLElement;
  }

}
