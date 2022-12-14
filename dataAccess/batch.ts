import { Query } from "ts-postgres";

/**
 * Handles multiple statement execution in a form of batch.
 */
export class Batch {
    private _rawScript: string;
    private _isValid: boolean = true;
    private _buffer: string[] = [];
    private _queue: Query[] = [];
    private _current: Query | undefined;
    private _validationErrors: string[] = [];

    /**
     * Initializes new instance of Batch class.
     * @param rawScript Raw SQL text which statements will be fetched and formed from.
     */
    constructor(rawScript: string) {
        this._rawScript = rawScript;
    }

    /**
     * Prepares list of statements to execute.
     * @returns Associated instance of a Batch class - ready to execute if no initial inconsistencies are detected.
     */
    public build(): Batch {
        if (!this.validate(this._rawScript)) {
            this._isValid = false;
            return this;
        }

        this.prepareStatements(this._rawScript);

        return this;
    }

    /**
     * Gets the validation result.
     * @returns True if provided script is valid, otherwise False.
     */
    public isValid(): boolean {
        return this._isValid;
    }

    /**
     * Seeks next statement from prepared queue.
     * @returns True if there is any statement to execute, otherwise False.
     */
    public next(): boolean {
        this._current = this._queue.shift();

        return this._current !== undefined;
    }

    /**
     * Gets statement to execute.
     * @returns Current statement.
     */
    public getCurrent(): Query | undefined {
        return this._current;
    }

    private validate(rawScript: string): boolean {
        if (!rawScript || rawScript.length === 0) {
            this._validationErrors.push("Cannot execute empty batch!");
            return false;
        }
        return true;
    }

    private prepareStatements(rawScript: string): void {
        this._buffer = this.removeEmptyEntries(rawScript.replace(/[\r\n\t]/g, "\0").split("\0"));
        let next: string | undefined;
        let statement: string[] = [];

        do {
            next = this._buffer.shift();

            if (next?.endsWith(";")) {
                statement.push(next);
                statement = this.finalizeStatement(this.ensureStatementIsCorrect(statement.join(" ")));
                continue;
            }

            if (statement.length > 0 && !next) {
                statement = this.finalizeStatement(this.ensureStatementIsCorrect(statement.join(" ")));
                continue;
            }

            if (next) {
                statement.push(next);
            }

        } while (next !== undefined);
    }

    private finalizeStatement(preparedStatement: string): string[] {
        this._queue.push(new Query(preparedStatement));

        return [];
    }

    private removeEmptyEntries(buffer: string[]) {
        return buffer.filter((v) => {
            return v !== "";
        });
    }

    private ensureStatementIsCorrect(semiPreparedStatement: string): string {
        let preparedStatement: string = "";
        let inQuotes: boolean = false;
        let current: string;
        let last: string = "";

        for (let i = 0; i < semiPreparedStatement.length; i++) {
            current = semiPreparedStatement[i];

            switch (inQuotes.valueOf()) {
                case false:
                    if (!(last === " " && current === last)) {
                        preparedStatement += current;
                    }
                    
                    if (last === ";") {
                        this.finalizeStatement(this.ensureStatementIsCorrect(semiPreparedStatement.slice(i)));
                        return preparedStatement;
                    }
                    break;

                default:
                    preparedStatement += current;
                    break;
            }

            inQuotes = current === "\'" || current === "\"";
            last = current;
        }
        return preparedStatement;
    }
}