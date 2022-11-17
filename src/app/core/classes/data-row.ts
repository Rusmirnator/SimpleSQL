import { IResponseObject } from "base/interfaces/IResponseObject";
import { IDataRow } from "../interfaces/idata-row";

export class DataRow implements IDataRow {
    index: number = 0;
    isSelected: boolean = false;
    rowData: Map<string, Object>;

    constructor(index: number, instance?: Object) {
        this.index = index;
        if (instance) {
            this.rowData = new Map<string, Object>(Object.entries(instance));
        }
        this.rowData ??= new Map<string, Object>();
    }
    getColumns(): string[] {
        return Array.from(this.rowData.keys());
    }

    fromResponse(response: IResponseObject, rowIndex: number = 0): void {
        response.names?.forEach((row) => {
            this.rowData.set(row, response.rows![rowIndex][response.getColumnIndex(row)]);
        });
        this.index = rowIndex;
    }

    getRowData<T>(): T | undefined {
        return Object.fromEntries(this.rowData) as unknown as T;
    }

    getCellData(propertyName: string): Object | undefined {
        return this.rowData.get(propertyName);
    }
}
