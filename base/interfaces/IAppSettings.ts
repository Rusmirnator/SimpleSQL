export interface IAppSettings {

    cachedValue? : Object;
    loadedSettings? : Object;

    consume(source : Object) : void;
    getSection(path: string): IAppSettings;
    getValue<T>(property: string): T;
}