import { AxiosInstance } from 'axios';

import { ASTNode, print } from 'graphql';

import {
    GRAPHQL_SCHEMA_URL_BOB,
    GRAPHQL_SCHEMA_URL_FATIMA,
    GRAPHQL_SCHEMA_URL_EUREKA,
} from '../constants';
import { applyInterceptors, injectCatchResponseInterceptor } from './interceptors';
import { GraphqlBody } from './types';

export interface RequestParams {
    url?: string;
    body: GraphqlBody;
    headers?: Record<string, any>;
    transformer?: (...params: any[]) => any;
}

export interface Options {
    url?: RequestParams['url'];
    defaultHeaders?: RequestParams['headers'];
}

class GraphqlClient {
    readonly httpClient: AxiosInstance;
    private readonly options: Options;
    axiosInterceptor: number | null | undefined = undefined;

    constructor(httpClient: AxiosInstance, options?: Options) {
        this.httpClient = httpClient;
        this.options = options || {};

        this.request = this.request.bind(this);

        applyInterceptors(httpClient, [injectCatchResponseInterceptor]);
    }

    appendAuthHeader(token: string) {
        if (!!this.axiosInterceptor || this.axiosInterceptor === 0) {
            this.httpClient.interceptors.request.eject(this.axiosInterceptor);
        }

        this.axiosInterceptor = this.httpClient.interceptors.request.use(
            async (config) => {
                config.headers['Content-Type'] = 'application/json';
                config.headers['Authorization'] = `Bearer ${token}`;
                return config;
            },
            (error) => error
        );
    }

    async request<T>(params: RequestParams): Promise<T> {
        const { url: overrideUrl, body, headers, transformer } = params;
        const mergedHeaders = { ...this.options?.defaultHeaders, ...headers };
        const url = overrideUrl || this.options?.url;

        if (!url) {
            throw new Error('Please provide url');
        }
        const query = queryConverter(body.query);
        const mergedBody = { ...body, query };

        console.log('[Hasura request]', mergedBody);

        try {
            const { data } = await this.httpClient.post(url, mergedBody, {
                method: 'POST',
                headers: mergedHeaders,
            });
            return transformer ? transformer(data, params) : data;
        } catch (e) {
            return (e as any).response?.data;
        }
    }

    async callGqlBob<T>(params: RequestParams): Promise<{ data: T }> {
        return await this.request<{ data: T }>({ ...params, url: GRAPHQL_SCHEMA_URL_BOB });
    }

    async callGqlFatima<T>(params: RequestParams): Promise<{ data: T }> {
        return await this.request<{ data: T }>({ ...params, url: GRAPHQL_SCHEMA_URL_FATIMA });
    }

    async callGqlEureka<T>(params: RequestParams): Promise<{ data: T }> {
        return await this.request<{ data: T }>({ ...params, url: GRAPHQL_SCHEMA_URL_EUREKA });
    }
}

function queryConverter(query: string | ASTNode) {
    if (typeof query === 'string') return query;
    return print(query);
}

export default GraphqlClient;
