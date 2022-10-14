export interface IDataRow {
    index: number;
    isSelected: boolean;
    rowData: Map<string, Object>;

    createRowData(columns: string[], rowValues: Object[]): void;
    getRowData<T>(): T;
    getCellData(key: string): Object;
}
