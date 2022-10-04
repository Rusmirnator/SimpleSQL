import { readFileSync, writeFileSync } from 'fs';

export default class GeneralPurposeRepository {

    constructor() {
    }

    public safelyReadFile(filePath: string, encoding: string): string {
        try {
            return readFileSync(filePath, encoding);
        } catch (error) {
            console.log(error);
        }

        return "";
    }

    public safelyWriteToFile(filePath: string, content: string, encoding?: string) : void {
        try {
            writeFileSync(filePath, content, encoding);
        } catch (error) {
            console.log(error);
        }
    }
}