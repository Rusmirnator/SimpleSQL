import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataRow } from 'src/app/core/classes/data-row';

@Component({
  selector: 'sm-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class DataGridComponent implements OnInit {

  selectedItemsBag: any[] = [];
  isWaitIndicatorVisible: boolean = false;
  elapsedTime = new BehaviorSubject<string>(new Date().toLocaleTimeString());
  isWhileSelecting: boolean | undefined;

  @Output() selectedItems = new EventEmitter<any[]>();
  @Input() columnsSource?: Observable<string[]> = new Observable<string[]>();;
  @Input() itemsSource: Observable<DataRow[]> = new Observable<DataRow[]>();
  @Input() showTimeStamp?: boolean = false;

  constructor(private _ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemsSource']) {
      let observable = changes['itemsSource'].currentValue as Observable<DataRow[]>;

      if (observable) {
        observable.subscribe(val => {
          this.onDataReceived(val);
        });
      }
    }
  }

  onDataReceived(newData: DataRow[]): void {
    this.columnsSource = new BehaviorSubject<string[]>(newData[0].getColumns());
    this.elapsedTime = new BehaviorSubject<string>(new Date().toLocaleTimeString());
  }

  onSelectedItemsChanged(event: Event, row: DataRow, index: number): void {
    if (!(event as PointerEvent).ctrlKey && !(event as PointerEvent).shiftKey) {
      this.unselectAll();
    }

    this.selectRow(row);

    this._ref.detectChanges();
    this.selectedItems.emit(this.selectedItemsBag);
  }

  onSelectionPending(event: Event, row: DataRow, index: number): void {
    if (!this.isWhileSelecting && !(event as PointerEvent).ctrlKey) {
      this.unselectAll();
    }

    if ((event as MouseEvent).buttons === 1) {
      this.isWhileSelecting = true;
      this.selectRow(row);
      this._ref.detectChanges();
      return;
    }

    this.isWhileSelecting = false;
  }

  onKeyCombination(event: Event): void {
    console.log((event as KeyboardEvent).ctrlKey + (event as KeyboardEvent).key);
    if ((event as KeyboardEvent).ctrlKey && (event as KeyboardEvent).key === 'a') {
      this.selectAll();
      this._ref.detectChanges();
    }
  }

  unselectAll(): void {
    this.selectedItemsBag = [];

    this.itemsSource.forEach(data => {
      data.forEach(row => {
        row.isSelected = false;
      });
    });
  }

  selectAll(): void {
    this.itemsSource.forEach(data => {
      data.forEach(row => {
        row.isSelected = true;
      });
    });
  }

  selectSome(startIndex: number, lastIndex: number): void {
    this.itemsSource.forEach(data => {
      data.forEach(row => {
        if (row.index >= startIndex && row.index <= lastIndex) {
          row.isSelected = true;
          this.selectedItemsBag.push(row.rowData);
        }
      })
    });
  }

  selectRow(row: DataRow): void {
    row.isSelected = !row.isSelected;

    switch (row.isSelected) {
      case true:

        this.selectedItemsBag.push(row.rowData);
        break;

      case false:
        this.selectedItemsBag.splice(this.selectedItemsBag.indexOf(row.rowData), 1);
        break;
    }
  }
}
