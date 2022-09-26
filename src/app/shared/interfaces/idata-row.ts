export interface IDataRow {
    Index: number;
    IsSelected: boolean;
    Instance: Object;

    getRowData() : Object;
    getCellData(key: string) : any;
}
