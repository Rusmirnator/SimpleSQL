import { PropertyChangedEventArgs } from "base/shared/PropertyChangedEventArgs";
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
    propertyChanged: <T>(e: PropertyChangedEventArgs<T>) => void;
}