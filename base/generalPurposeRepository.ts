import { app } from 'electron';
import * as path from 'path';
import { URL } from 'whatwg-url'

export default class GeneralPurposeRepository {
    private settings: string | undefined;
    private homeDirectory: string | undefined;

    constructor() {
        this.homeDirectory = app.getAppPath();
    }

    public loadSettings(section: string): void {
        console.log(this.homeDirectory);
    }
}