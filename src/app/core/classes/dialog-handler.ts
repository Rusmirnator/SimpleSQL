import { BindableBase } from "base/bindablebase";
import { BehaviorSubject } from "rxjs";

export class DialogHandler extends BindableBase {
    private _dlgTrigger$: BehaviorSubject<string> = new BehaviorSubject("");

    constructor(){
        super();
    }

    protected showDialog(identifier: string): void {
        this._dlgTrigger$.next(identifier);
    }

    protected closeDialog(): void {
        this._dlgTrigger$.next("");
    }

    public getDialog(identifier: string): boolean {
        return this._dlgTrigger$.getValue() === identifier;
    }
}