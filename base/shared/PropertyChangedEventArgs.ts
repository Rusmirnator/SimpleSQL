import { IEventArgs } from "base/interfaces/IEventArgs";

export class PropertyChangedEventArgs<T> implements IEventArgs<T>{
    instance?: T | undefined;
    handle: boolean;
    propertyName: string;
    value: T;

    constructor(propertyName: string, value: T){
        this.handle = true;
        this.propertyName = propertyName;
        this.value = value;
    }
}