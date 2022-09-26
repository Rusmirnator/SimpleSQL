import { IDataRow } from "../../interfaces/idata-row";

export class DataRow implements IDataRow {
    Index: number = 0;
    IsSelected: boolean = false;
    Instance!: any;

    constructor(_instance: any, index: number) {
        this.Instance = _instance;
        this.Index = index;
    }
    
    getRowData(): any {
        return this.Instance;
    }

    getCellData(propertyName: string) {
        return this.Instance[propertyName];
    }
}
