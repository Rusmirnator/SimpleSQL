import { IEventArgs } from "../../../../base/interfaces/IEventArgs";

export default class EventArgs<T> implements IEventArgs<T>{
    instance?: T | undefined;
    handle: boolean;

    constructor(handle: boolean, instance?: T) {
        this.handle = handle;
        this.instance = instance;
    }

}