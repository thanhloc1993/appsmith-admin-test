import * as fs from 'fs';
import path from 'path';
import { ulid } from 'ulid';

export default class Logs {
    private fileName: string;
    private filePath: string;

    constructor(prefix: string) {
        this.fileName = `${prefix}-logs-${ulid()}.txt`;
        this.filePath = path.resolve(__dirname, `../../report/logs/${this.fileName}`);

        // create log file initially, prevent TimeoutError make file does not exist
        this.log('');
    }

    log(message: string) {
        message = `${message}\n`;
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, message);
            return;
        }
        fs.appendFileSync(this.filePath, message);
    }
    readFile(encoding: BufferEncoding) {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, { encoding });
                return data;
            }
        } catch (err) {
            console.error("Can't read file", err);
        }
    }

    getFile() {
        return this.filePath;
    }

    getFileName() {
        return this.fileName;
    }
}
