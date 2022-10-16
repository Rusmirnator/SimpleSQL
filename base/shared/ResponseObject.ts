import { IResponseObject } from "base/interfaces/IResponseObject";

export class ResponseObject implements IResponseObject {
    names?: string[];
    rows?: any[];
    status?: string;

    constructor(response: IResponseObject) {
        this.names = response.names;
        this.rows = response.rows;
        this.status = response.status;
    }

    asSingle<T>(): T {
        return this.asMany<T>()[0] as T;
    }

    asMany<T>(): T[] {
        let res: T[] = [];
        const fillOne = <T>(columnSource: string[], rowSource: Object[]) => {
            let entries = new Map<string, Object>();

            columnSource.forEach((col) => {
                entries.set(col, rowSource[this.getColumnIndex(col)]);
            });

            return Object.fromEntries(entries) as unknown as T;
        };

        this.rows!.forEach((row) => {
            res.push(fillOne<T>(this.names!, row));
        });

        return res;
    }

    getColumnIndex(colName: string): number {
        return this.names!.indexOf(colName);
    }

}