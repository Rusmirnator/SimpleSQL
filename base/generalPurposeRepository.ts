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

    public safelyWriteToFile(filePath: string, content: string, encoding?: string): void {
        let options = {
            encoding: encoding,
            flag: "a"
        };
        try {
            writeFileSync(filePath, content, options);
        } catch (error) {
            console.log(error);
        }
    }
}