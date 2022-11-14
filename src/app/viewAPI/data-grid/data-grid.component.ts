import { CommonModule } from '@angular/common';
import { OnChanges, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataRow } from 'src/app/core/classes/data-row';
import { VisibilityChangedDirective } from 'src/app/core/directives/visibility-changed.directive';

@Component({
  selector: 'sm-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css'],
  imports: [CommonModule, VisibilityChangedDirective],
  standalone: true
})
export class DataGridComponent implements OnInit, OnChanges {

  /**Tendency direction of a scroll event procs */
  private _tendency: number = 0;
  /**Virtualized chunk current startindex */
  private _startIndex: number = 0;
  /**Virtualized chunk endindex */
  private _endIndex: number = 33;
  /**Virtualization step size */
  private _step = 33;

  selectedItemsBag: any[] = [];
  elapsedTime = new BehaviorSubject<string>(new Date().toLocaleTimeString());
  isFrozen: boolean | undefined;

  virtualizedItemsSource: Observable<DataRow[]> = new Observable<DataRow[]>();

  @Output() selectedItems = new EventEmitter<any[]>();
  @Input() columnsSource?: Observable<string[]> = new Observable<string[]>();;
  @Input() itemsSource: BehaviorSubject<DataRow[]> = new BehaviorSubject<DataRow[]>([]);
  @Input() enableVirtualization: boolean = true;
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
    this.cleanUp();
    if (newData.length === 0) {
      return;
    }
    this.columnsSource = new BehaviorSubject<string[]>(newData[0].getColumns());
    this.elapsedTime = new BehaviorSubject<string>(new Date().toLocaleTimeString());

    if (!this.enableVirtualization || newData.length <= this._step) {
      this.virtualizedItemsSource = new BehaviorSubject<DataRow[]>(newData).asObservable();
      return;
    }

    this.stepForward(newData);
  }

  onScroll(event: Event): void {
    this.itemsSource.subscribe(value => {
      this.resolveStepDirection(event.target as HTMLElement) ? this.stepForward(value) : this.stepBackward(value);
    });
  }

  onVisible(event: Event): void {
    console.log(event);
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
    if (!this.isFrozen && !(event as PointerEvent).ctrlKey) {
      this.unselectAll();
    }

    if ((event as MouseEvent).buttons === 1) {
      this.isFrozen = true;
      this.selectRow(row);
      this._ref.detectChanges();
      return;
    }

    this.isFrozen = false;
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

  private takeSome(data: DataRow[]): DataRow[] {
    return data.slice(this._startIndex, this._endIndex);
  }

  private stepForward(data: DataRow[]): void {
    this._endIndex += this._step;

    this.recalculateRange(data, true);
    this.virtualizedItemsSource = new BehaviorSubject<DataRow[]>(this.takeSome(data)).asObservable();

    this._startIndex += this._step;
  }

  private stepBackward(data: DataRow[]): void {
    this._startIndex -= this._step;

    this.recalculateRange(data, false);
    this.virtualizedItemsSource = new BehaviorSubject<DataRow[]>(this.takeSome(data)).asObservable();

    this._endIndex -= this._step;
  }

  private recalculateRange(data: DataRow[], next: boolean = true): void {
    let indexRange = data.length - 1;
    switch (next) {
      case true:

        if (!data[this._startIndex]) {
          this._startIndex = indexRange - this._step;
        }
        if (!data[this._endIndex]) {
          this._endIndex = indexRange;
        }
        break;
      case false:

        if (!data[this._startIndex]) {
          this._startIndex = 0;
        }
        if (!data[this._endIndex]) {
          this._endIndex += indexRange;
        }
        break;
    }
  }

  private cleanUp(): void {
    this._startIndex = 0;
    this._endIndex = 33;
    this._step = 1;
  }

  private resolveStepDirection(element: HTMLElement): boolean {
    let currentPosition = element.scrollTop;
    let forward = currentPosition > this._tendency;

    this._tendency = currentPosition;
    return forward;
  }
}
