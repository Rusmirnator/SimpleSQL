import { BehaviorSubject } from "rxjs";
import { DialogHandler } from "src/app/core/classes/dialog-handler";

export class ViewHandler extends DialogHandler {
    private _isWaitIndicatorVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor() {
        super();
    }

    protected changeState(): void {
        this._isWaitIndicatorVisible.next(!this.isBusy());
    }

    public isBusy(): BehaviorSubject<boolean> {
        return this._isWaitIndicatorVisible;
    }
}