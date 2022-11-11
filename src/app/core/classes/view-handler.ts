import { BehaviorSubject, Observable } from "rxjs";
import { DialogHandler } from "src/app/core/classes/dialog-handler";

/**
 * Provides set of helpful features used to handle view related problems.
 */
export class ViewHandler extends DialogHandler {

    private get _isBusy(): boolean {
        return this.getValue("_isBusy");
    }
    private set _isBusy(v: boolean) {
        this.setValue("_isBusy", v);
    }

    constructor() {
        super();
    }

    /**
     * Manages the state of component.
     */
    protected changeState(): void {
        this._isBusy = !this._isBusy;
    }

    /**
     * Gets direct information about component state.
     * @returns True if busy, otherwise False;
     */
    public isBusy(): boolean {
        return this._isBusy;
    }
}