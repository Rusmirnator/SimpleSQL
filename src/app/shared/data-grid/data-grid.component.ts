import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { nextTick } from 'process';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataRow } from './classes/data-row';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {

  selectedItemsBag: any[] = [];
  isWaitIndicatorVisible: boolean = false;
  elapsedTime = new BehaviorSubject<string>(new Date().toLocaleTimeString());
  isWhileSelecting: boolean | undefined;

  @Output() selectedItems = new EventEmitter<any[]>();
  @Input() columnsSource?: string[];
  @Input() fieldNameSource?: string[];
  @Input() itemsSource: Observable<DataRow[]> = new Observable<DataRow[]>();
  @Input() showTimeStamp?: boolean = false;

  constructor(private _notifyDataUpdated: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.itemsSource.subscribe(() => {
      nextTick(() => {
        this.elapsedTime.next(new Date().toLocaleTimeString());
        this._notifyDataUpdated.detectChanges();
      });
    });
  }

  onDataInitialized(data: DataRow[]): void {
    if (this.fieldNameSource === undefined) {

      this.fieldNameSource = [];
      for (let o of data) {
        console.log(o);
        for (let f of Object.keys(o.Instance)) {
          this.fieldNameSource.push(f);
        }
        break;
      }

      for (let property of Object.keys(data[0].Instance)) {
        console.log(property);
      }

      console.log(this.fieldNameSource);
      this.isWaitIndicatorVisible = false;

      this._notifyDataUpdated.detectChanges();
    }
  }

  onSelectedItemsChanged(event: Event, row: DataRow, index: number): void {
    if (!(event as PointerEvent).ctrlKey && !(event as PointerEvent).shiftKey) {
      this.unselectAll();
    }

    this.selectRow(row);

    this._notifyDataUpdated.detectChanges();
    this.selectedItems.emit(this.selectedItemsBag);
  }

  onSelectionPending(event: Event, row: DataRow, index: number): void {
    if (!this.isWhileSelecting && !(event as PointerEvent).ctrlKey) {
      this.unselectAll();
    }

    if ((event as MouseEvent).buttons === 1) {
      this.isWhileSelecting = true;
      this.selectRow(row);
      this._notifyDataUpdated.detectChanges();
      return;
    }

    this.isWhileSelecting = false;
  }

  onKeyCombination(event: Event): void {
    console.log((event as KeyboardEvent).ctrlKey + (event as KeyboardEvent).key);
    if ((event as KeyboardEvent).ctrlKey && (event as KeyboardEvent).key === 'a') {
      this.selectAll();
      this._notifyDataUpdated.detectChanges();
    }
  }

  unselectAll(): void {
    this.selectedItemsBag = [];

    this.itemsSource.forEach(data => {
      data.forEach(row => {
        row.IsSelected = false;
      });
    });
  }

  selectAll(): void {
    this.itemsSource.forEach(data => {
      data.forEach(row => {
        row.IsSelected = true;
      });
    });
  }

  selectSome(startIndex: number, lastIndex: number): void {
    this.itemsSource.forEach(data => {
      data.forEach(row => {
        if (row.Index >= startIndex && row.Index <= lastIndex) {
          row.IsSelected = true;
          this.selectedItemsBag.push(row.Instance);
        }
      })
    });
  }

  selectRow(row: DataRow): void {
    row.IsSelected = !row.IsSelected;

    switch (row.IsSelected) {
      case true:

        this.selectedItemsBag.push(row.Instance);
        break;

      case false:
        this.selectedItemsBag.splice(this.selectedItemsBag.indexOf(row.Instance), 1);
        break;
    }
  }
}
