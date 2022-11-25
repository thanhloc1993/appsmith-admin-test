import {
    ProtobufMessageClass,
    ProtobufMessage,
} from '@improbable-eng/grpc-web/dist/typings/message';

import createChunkParser, { ChunkType } from './chunk-parser';
import { ByteConverter } from './decoder-utils';

function createGrpcMessageDecoder<T extends ProtobufMessage>(
    responseType: ProtobufMessageClass<T>,
    contentType = 'application/grpc-web-text' // content type in header
) {
    const deserializeFn = responseType.deserializeBinary;

    function _getSource(msg: string): Uint8Array {
        const sourceCompiler = new ByteConverter(msg);

        if (contentType.startsWith('application/grpc-web-text')) {
            return sourceCompiler.toUint8Array('base64');
        }

        if (contentType.startsWith('application/grpc')) {
            return sourceCompiler.toUint8Array('buffer');
        }

        throw new Error("Content-type doesn't match, is this a GRPC request?");
    }

    return {
        decodeMessage(message: any): T | null {
            const parser = createChunkParser();
            const uInt8FromMessage = _getSource(message);

            // parse body to get the message and code, but we take message only
            const data = parser.parse(uInt8FromMessage);

            const msgElement = data.find((e) => {
                return e.chunkType === ChunkType.MESSAGE;
            });

            if (!msgElement || !msgElement.data) {
                return null;
            }

            return deserializeFn(msgElement.data);
        },
    };
}

export default createGrpcMessageDecoder;
