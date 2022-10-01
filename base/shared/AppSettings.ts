import { IAppSettings } from "base/interfaces/IAppSettings";

export default class AppSettings implements IAppSettings {

    cachedValue: Object | undefined;
    loadedSettings: Object | undefined;

    constructor() { }

    public consume(source: Object): void {
        this.loadedSettings = Object.fromEntries(Object.entries(source));
    }

    public getSection(path: string): IAppSettings {
        let accessPath = path.split(':').reverse();

        this.cachedValue = this.loadedSettings;

        while (accessPath.length > 0) {
            let temporaryValue: Object;

            temporaryValue = this.getPropertyInfo(this.cachedValue!, accessPath.pop()!);

            if (temporaryValue !== null) {
                this.cachedValue = temporaryValue;
            }
        }
        return this;
    }

    public getValue<T>(property: string): T {
        let k: keyof Object;

        for (k in this.cachedValue) {
            if (k === property) {
                this.cachedValue = this.cachedValue![k];
            }
        }

        return this.cachedValue?.valueOf() as T;
    }

    private getPropertyInfo(source: Object, propertyName: string): Object {
        let result = new Object();

        for (let [k, v] of Object.entries(source)) {
            if (k === propertyName) {
                result = v;
            }
        }
        return result;
    }
}