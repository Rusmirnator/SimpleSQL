import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sm-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],  
  imports: [CommonModule],
  standalone: true
})
export class EditorComponent implements OnInit {

  @Output() editValue = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {

  }

  onTextInput(event: Event) {
    this.editValue.emit((event.target as HTMLTextAreaElement).value);
  }

  onEditorLoad(event: Event) {
    (event.target as HTMLTextAreaElement).value = "";
  }
}
