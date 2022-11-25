import { grpc } from '@improbable-eng/grpc-web';
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import {
    ProtobufMessage,
    ProtobufMessageClass,
} from '@improbable-eng/grpc-web/dist/typings/message';
import { Metadata } from '@improbable-eng/grpc-web/dist/typings/metadata';
import { UnaryMethodDefinition } from '@improbable-eng/grpc-web/dist/typings/service';
import { UnaryOutput } from '@improbable-eng/grpc-web/dist/typings/unary';
import { UnaryRpcOptions } from '@improbable-eng/grpc-web/dist/typings/unary';

import { genId } from '../../utils/ulid';
import { gRPCEndpoint } from './constants';

//use node http transport to call in node to avoid error: XMLHTTPRequest is not defined
grpc.setDefaultTransport(NodeHttpTransport());

grpc.CrossBrowserHttpTransport({
    withCredentials: false,
});

const METADATA = {
    KEY_TOKEN: 'token',
    KEY_PKG: 'pkg',
    KEY_VERSION: 'version',
    VALUE_PKG: 'com.manabie.liz',
    VALUE_VERSION: '1.0.0',
};

export const getMetadata = (token: string, requestId?: string): Metadata.ConstructorArg => {
    return {
        [METADATA.KEY_TOKEN]: token,
        [METADATA.KEY_PKG]: METADATA.VALUE_PKG,
        [METADATA.KEY_VERSION]: METADATA.VALUE_VERSION,
        'x-request-id': requestId ?? '',
    };
};

export default grpc;

interface CallGRPCInterface<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage> {
    request: UnaryRpcOptions<TRequest, TResponse>['request'];
    token: string;
    requestType: ProtobufMessageClass<TRequest>;
    responseType: ProtobufMessageClass<TResponse>;
    methodName: string;
    serviceName: string;
    callback?: (resp: UnaryOutput<TResponse>) => void;
}

export async function callGRPC<
    TRequest extends ProtobufMessage,
    TResponse extends ProtobufMessage
>({
    request,
    token,
    requestType,
    responseType,
    methodName,
    serviceName,
    callback,
}: CallGRPCInterface<TRequest, TResponse>) {
    return new Promise<UnaryOutput<TResponse>>((resolve, rejects) => {
        const requestId = genId();
        const metadata = getMetadata(token, requestId);
        return grpc.unary<TRequest, TResponse, UnaryMethodDefinition<TRequest, TResponse>>(
            {
                methodName,
                service: {
                    serviceName,
                },
                requestStream: false,
                responseStream: false,
                requestType: requestType,
                responseType: responseType,
            },
            {
                host: gRPCEndpoint,
                request: request,
                metadata: metadata,
                onEnd: (resp) => {
                    if (resp.status !== grpc.Code.OK) {
                        return rejects({
                            ...resp,
                            serviceName,
                            methodName,
                            request: JSON.stringify(request.toObject()),
                            requestId,
                            host: gRPCEndpoint,
                        });
                    }
                    callback && callback(resp);
                    resolve(resp);
                },
            }
        );
    });
}
