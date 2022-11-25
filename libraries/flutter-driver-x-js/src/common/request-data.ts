import { Command, Result } from './message';

export class RequestData extends Command {
    message: string;

    constructor(message: string, { timeout }: { timeout?: number }) {
        super(timeout);
        this.message = message;
    }

    command = 'request_data';
}

export interface RequestDataResult extends Result {
    response: {
        message: string;
    };
}
