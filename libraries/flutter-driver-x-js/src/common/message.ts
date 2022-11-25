export class Command {
    timeout: number;
    command!: string;

    constructor(timeout = 5000) {
        this.timeout = timeout;
    }

    get requiresRootWidgetAttached() {
        return true;
    }

    get flat() {
        return JSON.parse(JSON.stringify(this));
    }
}

export class Result {
    isError!: boolean;
    response!: Record<string, any>;
    type!: string;
    method!: string;

    constructor(isError = false, response = {}, type = '', method = '') {
        this.isError = isError;
        this.response = response;
        this.type = type;
        this.method = method;
    }

    static empty(): Result {
        return new Result();
    }
}
