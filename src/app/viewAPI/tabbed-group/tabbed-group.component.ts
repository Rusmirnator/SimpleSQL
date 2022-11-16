import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'sm-tabbed-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabbed-group.component.html',
  styleUrls: ['./tabbed-group.component.css']
})
export class TabbedGroupComponent implements OnInit {

  private _selectedIndex: number = 0;

  @ViewChildren("header") headers?: QueryList<ElementRef>;

  @Input() headersSource: Observable<string[]> = new Observable<string[]>();
  @Output() selectedIndex: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  onHeaderClick(event: Event, tabIndex: number): void {
    let header = event.target as HTMLElement;

    if (this.unselectIndex(this.headers?.get(this._selectedIndex)!.nativeElement)) {

      this.selectIndex(header, tabIndex);
    }
  }

  private selectIndex(header: HTMLElement, newIndex: number): void {
    this._selectedIndex = newIndex;

    header.classList.add("selected");
    this.selectedIndex.emit(this._selectedIndex);
  }

  private unselectIndex(header: HTMLElement): boolean {
    if (header?.getAttribute("tabIndex") === this._selectedIndex.toString()) {

      header.classList.remove("selected");

      return true;
    }
    return false;
  }
}
