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

    public toHashCode(value: string): number {
        let hash = 0, i, chr;
    
        if (value.length === 0) {
          return hash;
        }
    
        for (i = 0; i < value.length; i++) {
          chr = value.charCodeAt(i);
          hash = ((hash << 5) - hash) + chr;
          hash |= 0;
        }
        return hash;
      }
}