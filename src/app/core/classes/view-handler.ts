import { BehaviorSubject, Observable } from "rxjs";
import { DialogHandler } from "src/app/core/classes/dialog-handler";

/**
 * Provides set of helpful features used to handle view related problems.
 */
export class ViewHandler extends DialogHandler {
    private _isBusy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor() {
        super();
    }

    /**
     * Manages the state of component.
     */
    protected changeState(): void {
        this._isBusy.next(!this.isBusy());
    }

    /**
     * Gets direct information about component state.
     * @returns True if busy, otherwise False;
     */
    public isBusy(): BehaviorSubject<boolean> {
        return this._isBusy;
    }
}