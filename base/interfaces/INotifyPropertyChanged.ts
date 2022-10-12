import * as EventEmitter from "events";
/**
 * Provides members simplifying property change tracking.
 */
export interface INotifyPropertyChanged {
    /**
     * Can be used to emit 'propertyChanged' event.
     */
    changeEmitter: EventEmitter;
    /**
     * Handles 'propertyChanged' event.
     */
    propertyChanged: <T>(propertyName: string, value: T) => void;
}