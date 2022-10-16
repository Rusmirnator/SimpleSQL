import { Pipe, PipeTransform } from '@angular/core';
import { IResponseObject } from 'base/interfaces/IResponseObject';
import { TreeViewElement } from '../classes/tree-view-element';
import { ITreeViewElement } from '../interfaces/itree-view-element';

@Pipe({
  name: 'treeViewElement'
})
export class TreeViewElementPipe implements PipeTransform {

  transform(value: IResponseObject, ...args: any[]): ITreeViewElement[] {
    let convertedData: ITreeViewElement[] = [];

    if (value === undefined) {
      return convertedData;
    }

    for (let i: number = 0; i < value.rows!.length; i++) {
      convertedData.push(new TreeViewElement(value.rows![i], false, false, i));
    }
    return convertedData;
  }

}