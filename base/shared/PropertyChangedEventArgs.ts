import { IEventArgs } from "base/interfaces/IEventArgs";

/**
 * Contains data associated with changed property.
 */
export class PropertyChangedEventArgs<T> implements IEventArgs<T>{
    handle: boolean;
    propertyName: string;
    value: T;

    constructor(propertyName: string, value: T){
        this.handle = true;
        this.propertyName = propertyName;
        this.value = value;
    }
}