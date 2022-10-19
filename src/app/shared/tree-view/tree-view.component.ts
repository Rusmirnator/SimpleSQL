import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ITreeViewElement } from 'src/app/core/interfaces/itree-view-element';

@Component({
  selector: 'sm-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class TreeViewComponent implements OnInit {

  @Output() selectedItem: EventEmitter<ITreeViewElement> = new EventEmitter<ITreeViewElement>();
  @Input() itemsSource: Observable<ITreeViewElement[]> = new Observable<ITreeViewElement[]>();

  constructor() { }

  ngOnInit(): void {
  }

}
