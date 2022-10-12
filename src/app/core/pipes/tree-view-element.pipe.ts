import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TreeViewElement } from '../classes/tree-view-element';
import { ITreeViewElement } from '../interfaces/itree-view-element';

@Pipe({
  name: 'treeViewElement'
})
export class TreeViewElementPipe implements PipeTransform {

  private _branchData: any[] = [];
  private _convertedData: ITreeViewElement[] = [];

  transform(value: Observable<any[]>, ...args: any[]): Observable<ITreeViewElement[]> {
    this._convertedData = [];

    value.subscribe(v => {
      this._branchData = v as any[];
    });

    this._branchData.forEach((x, i) => {
      console.log(x);
      this._convertedData.push(new TreeViewElement(x["header"], false, false, i));
    });

    console.log(this._convertedData);

    return new BehaviorSubject<ITreeViewElement[]>(this._convertedData).asObservable();
  }

}