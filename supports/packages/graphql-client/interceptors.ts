import { AxiosInstance } from 'axios';

import { HasuraError } from './types';

export interface HasuraErrorReturn {
    message: string;
    extensions: {
        path: string;
        code: string;
    };
}

export function doesDataHasErrors(data: any) {
    return 'error' in data || 'code' in data || 'errors' in data;
}

export function injectCatchResponseInterceptor(ins: AxiosInstance) {
    ins.interceptors.response.use(
        async (response) => {
            const { data } = response;
            console.log('[Hasura response]', data);

            if (!doesDataHasErrors(data)) {
                return response;
            }

            if (!data.errors) {
                return Promise.reject(data.message);
            }

            const [mainError] = data.errors;
            const { message, extensions } = mainError;

            throw new HasuraError({ code: extensions.code, message: message });
        },
        (error) => error
    );
}

export type Interceptor = (...args: any[]) => any;

export function applyInterceptors(ins: AxiosInstance, interceptors: Interceptor[]) {
    interceptors.forEach((interceptor) => {
        interceptor(ins);
    });
}
