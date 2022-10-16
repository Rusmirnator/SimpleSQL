import { Command } from "./command";

export class AsyncCommand extends Command {
    override toExecute: () => Promise<void>;

    constructor(toExecute: () => Promise<void>, canExecute?: () => boolean, keyGesture?: string, description?: string) {
        super(toExecute, canExecute, keyGesture, description);
        this.toExecute = toExecute;
    }

    override async execute(): Promise<void> {
        let canExecute: boolean = true;

        if (this.canExecute) {
            canExecute = this.canExecute();
        }

        if (canExecute) {
            await this.toExecute();
        }
    }
}
