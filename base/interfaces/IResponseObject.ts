export interface IResponseObject {
    names?: string[],
    rows?: any[],
    status?: string

    asSingle<T>(): T;
    asMany<T>(): T[];
    getColumnIndex(colName: string): number;
}