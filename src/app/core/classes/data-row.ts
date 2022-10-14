import { IDataRow } from "../interfaces/idata-row";

export class DataRow implements IDataRow {
    index: number = 0;
    isSelected: boolean = false;
    rowData: Map<string, Object> = new Map<string, Object>();

    constructor(index: number, instance?: Object) {
        this.index = index;
        if (instance !== undefined) {
            this.createRowData(Object.keys(instance!), Object.values(instance!));
        }
    }

    createRowData(columns: string[], rowValues: Object[]): void {
        throw new Error("Method not implemented.");
    }

    getRowData<T>(): T {
        return this.rowData as unknown as T;
    }

    getCellData(propertyName: string): Object {
        if (this.rowData === undefined) {
            return "null";
        }

        let entries = Object.entries(this.rowData);

        for (let i = 0; i < entries.length; i++) {
            if (entries[i][0] === propertyName) {
                return entries[i][1];
            }
        }

        return "empty";
    }
}
