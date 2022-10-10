import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { nextTick } from 'process';
import { Observable } from 'rxjs';
import { ITreeViewElement } from 'src/app/core/interfaces/itree-view-element';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit {

  @Output() selectedItem: EventEmitter<ITreeViewElement> = new EventEmitter<ITreeViewElement>();
  @Input() itemsSource: Observable<ITreeViewElement[]> = new Observable<ITreeViewElement[]>();

  constructor(private _ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.itemsSource.subscribe(() => {
      nextTick(() => {
        this._ref.detectChanges();
      });
    });
  }

}
