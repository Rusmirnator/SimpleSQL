import { IResponseObject } from "base/interfaces/IResponseObject";

/**
 * Universal row data object.
 */
export interface IDataRow {
    index: number;
    isSelected: boolean;
    rowData: Map<string, Object>;

    /**
     * Fills row data.
     * @param response PGSQL response object instance.
     * @param rowIndex [Optional][Default = 0] Result set row index used to fill row data.
     */
    fromResponse(response: IResponseObject, rowIndex?: number): void;
    /**
     * Gets stored row column headers.
     */
    getColumns(): string[];
    /**
     * Gets stored row data and outputs it according to specified type parameter.
     */
    getRowData<T>(): T | undefined;
    /**
     * Gets stored row's cell value.
     * @param key Column name.
     */
    getCellData(key: string): Object | undefined;
}
