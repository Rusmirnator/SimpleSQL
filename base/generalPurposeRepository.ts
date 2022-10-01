import { readFileSync } from 'fs';

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
}