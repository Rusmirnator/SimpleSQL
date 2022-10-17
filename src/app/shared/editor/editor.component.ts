import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @Output() editValue = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onTextInput(event: Event){
    this.editValue.emit((event.target as HTMLTextAreaElement).value);
  }
}
