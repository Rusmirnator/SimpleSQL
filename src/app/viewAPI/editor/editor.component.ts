import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'sm-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class EditorComponent implements OnInit, AfterViewInit {

  @ViewChild("editor") editor?: ElementRef;
  @Output() editValue = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (this.editor) {
      this.clearText(this.editor);
    }
  }

  onTextInput(event: Event) {
    this.editValue.emit((event.target as HTMLTextAreaElement).value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Tab") {
      event.preventDefault();
      this.insertTab();
    }
  }

  private clearText(element: ElementRef): void {
    (element.nativeElement as HTMLTextAreaElement).value = "";
  }

  private insertTab(): void {
    let index = (this.editor!.nativeElement as HTMLTextAreaElement).selectionStart;
    const newValue = [
      (this.editor!.nativeElement as HTMLTextAreaElement).value.slice(0, index),
      "\t",
      (this.editor!.nativeElement as HTMLTextAreaElement).value.slice(index)
    ].join("");

    (this.editor!.nativeElement as HTMLTextAreaElement).value = newValue;
    (this.editor!.nativeElement as HTMLTextAreaElement).selectionStart = index + 1;
    (this.editor!.nativeElement as HTMLTextAreaElement).selectionEnd = index + 1;
  }
}
