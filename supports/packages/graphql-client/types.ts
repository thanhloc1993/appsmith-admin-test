import { DocumentNode } from 'graphql';

export interface HasuraErrorOptions {
    code?: number;
    message: string;
}

export class HasuraError {
    originMessage: string;
    code?: number;
    name = 'HasuraError';

    constructor({ message, code }: HasuraErrorOptions) {
        this.originMessage = message;
        this.code = code;
    }
}

export interface GraphqlBody<T = Record<string, any>> {
    query: DocumentNode;
    operationName?: string;
    variables?: T;
}
