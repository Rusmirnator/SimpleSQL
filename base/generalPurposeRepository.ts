import { app } from 'electron';
import { URL } from 'url';

export class GeneralPurposeRepository {
    private settings: string | undefined;
    private homeDirectory: string | undefined;

    constructor() {
        this.homeDirectory = app.getAppPath();
    }

    loadSettings(section: string): void {
        
    }
}