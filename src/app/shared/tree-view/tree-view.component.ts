import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { nextTick } from 'process';
import { Observable } from 'rxjs';
import { DataRow } from '../data-grid/classes/data-row';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit {

  @Output() selectedItem: EventEmitter<DataRow> = new EventEmitter<DataRow>();
  @Input() itemsSource: Observable<DataRow[]> = new Observable<DataRow[]>();

  constructor(private _ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.itemsSource.subscribe(() => {
      nextTick(() => {
        this._ref.detectChanges();
      });
    });
  }

}
