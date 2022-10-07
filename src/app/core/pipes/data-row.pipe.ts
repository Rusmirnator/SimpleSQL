import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataRow } from '../classes/data-row';

@Pipe({
  name: 'dataRow'
})
export class DataRowPipe implements PipeTransform {

  private _rowData: any[] = [];
  private _convertedData: DataRow[] = [];

  transform(value: Observable<any[]>, ...args: any[]): Observable<DataRow[]> {
    this._convertedData = [];

    value.subscribe(v => {
      this._rowData = v as any[];
    });

    this._rowData.forEach((x,i) => {
      this._convertedData.push(new DataRow(x, i));
    });

    return new BehaviorSubject<DataRow[]>(this._convertedData).asObservable();
  }

}
