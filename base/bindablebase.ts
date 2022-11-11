import * as EventEmitter from "events";
import { INotifyPropertyChanged } from "./interfaces/INotifyPropertyChanged";
/**
 * Allows relatively easy control over property binding.
 */
export class BindableBase implements INotifyPropertyChanged {

    private _dynamicStorage: Map<string, Object>;
    

    changeEmitter: EventEmitter = new EventEmitter();
    propertyChanged: <T>(propertyName: string, value: T) => void;

    constructor() {
        this._dynamicStorage = new Map<string, Object>();
        this.propertyChanged = this.raisePropertyChanged;
    }

    /**
     * Gets value from BindableBase storage. 
     * This method should not be used in scenario where performance is the highest priority.
     * @param propertyName Key name used to store value.
     * @returns Value of type T associated with given key.
     */
    protected getValue<T>(propertyName: string): T {
        return this._dynamicStorage.get(propertyName) as T;
    }

    /**
     * Sets value of BindableBase stored property. 
     * This method should not be used in scenario where performance is the highest priority.
     * Raises 'propertyChanged' event if actual value differs from stored.
     * @param propertyName Key name used to store value.
     * @param value Actual value to be stored.
     * @returns True if stored value differs from actual.
     */
    protected setValue(propertyName: string, value: Object): boolean {
        let storedValue = this._dynamicStorage.get(propertyName);

        if (storedValue === value) {
            return false;
        }

        this._dynamicStorage.set(propertyName, value);
        this.propertyChanged(propertyName, value);

        return true;
    }

    /**
     * Manualy raises 'propertyChanged' event.
     * @param propertyName Key name used to store value.
     * @param value Value associated with raise of new event.
     */
    protected raisePropertyChanged<T>(propertyName: string, value: T): void {
        console.log(`Property ${propertyName} changed! New value: \n`);
        console.log(value);

        this.changeEmitter.emit('propertyChanged', propertyName, value);
    }
}