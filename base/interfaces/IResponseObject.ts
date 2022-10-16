/**
 * PGSQL result set data transfer object.
 */
export interface IResponseObject {
    names?: string[],
    rows?: any[],
    status?: string

    /**
     * Converts response and outputs it as single object according to specified type parameter.
     */
    asSingle<T>(): T;
    /**
     * Converts response and outputs it as object array according to specified type parameter.
     */
    asMany<T>(): T[];
    /**
     * Gets column index.
     * @param colName Column name.
     */
    getColumnIndex(colName: string): number;
    /**
     * Creates error response.
     * @param error A message to set.
     */
    createErrorMessage(error: string): void;
}