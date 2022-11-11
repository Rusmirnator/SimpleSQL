import * as EventEmitter from "events";
import { INotifyPropertyChanged } from "./interfaces/INotifyPropertyChanged";
import { PropertyChangedEventArgs } from "./shared/PropertyChangedEventArgs";
/**
 * Allows relatively easy control over property binding.
 */
export class BindableBase implements INotifyPropertyChanged {

    private _dynamicStorage: Map<string, Object>;


    changeEmitter: EventEmitter = new EventEmitter();
    propertyChanged: <T>(e: PropertyChangedEventArgs<T>) => void;

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
        this.propertyChanged(new PropertyChangedEventArgs(propertyName, value));

        return true;
    }

    /**
     * Manualy raises 'propertyChanged' event.
     * @e Data associated with risen event.
     */
    protected raisePropertyChanged<T>(e: PropertyChangedEventArgs<T>): void {
        console.log(`Property ${e.propertyName} changed! New value: \n`);
        console.log(e.value);

        this.changeEmitter.emit('propertyChanged', e);
    }
}