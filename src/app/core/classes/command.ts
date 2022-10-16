export class Command {
    keyGesture?: string;
    description?: string;
    toExecute: () => void;
    canExecute?: () => boolean;

    constructor(execute: () => void, canExecute: (() => boolean) | undefined, keyGesture?: string, description?: string) {
        this.toExecute = execute;
        this.canExecute = canExecute;
        this.keyGesture = keyGesture;
        this.description = description;
    }

    public execute(): void {
        let canExecute: boolean = true;

        if(this.canExecute){
            canExecute = this.canExecute();
        }

        if(canExecute){
            this.execute();
        }
    }
}
