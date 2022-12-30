import {
    ProtobufMessageClass,
    ProtobufMessage,
} from '@improbable-eng/grpc-web/dist/typings/message';

import { Response } from 'playwright';

import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder';

export async function decodeResponse<T extends ProtobufMessage>(
    responseType: ProtobufMessageClass<T>,
    response: Response
) {
    const decoder = createGrpcMessageDecoder(responseType);
    const encodedResponseText = await response?.text();
    const decodedResp = decoder.decodeMessage(encodedResponseText);

    return decodedResp;
}
