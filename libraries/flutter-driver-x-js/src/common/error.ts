export class DriverError extends Error {
    message: string;
    originalError?: Error;

    constructor(message: string, originalError?: Error) {
        super(message);
        this.message = message;
        this.originalError = originalError;
    }
}
