import { BindableBase } from "base/bindablebase";
import { BehaviorSubject } from "rxjs";

/**
 * Provides set of helpful features used to handle dialog related problems.
 */
export class DialogHandler extends BindableBase {
    private _dlgTrigger$: BehaviorSubject<string> = new BehaviorSubject("");

    constructor(){
        super();
    }

    /**
     * Searches for dialog using provided identifier and brings it to the view.
     * @param identifier Dialog identifier.
     */
    protected showDialog(identifier: string): void {
        this._dlgTrigger$.next(identifier);
    }

    /**
     * Takes currently displayed dialog off from the view.
     */
    protected closeDialog(): void {
        this._dlgTrigger$.next("");
    }

    /**
     * Gets value indicating if dialog with provided identifier is currently displayed.
     * @param identifier 
     * @returns 
     */
    public getDialog(identifier: string): boolean {
        return this._dlgTrigger$.getValue() === identifier;
    }
}