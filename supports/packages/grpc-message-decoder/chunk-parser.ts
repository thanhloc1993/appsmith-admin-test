import { HEADER_SIZE } from './decoder-utils';

const isAllowedControlChars = (char: number) => char === 0x9 || char === 0xa || char === 0xd;

function isValidHeaderAscii(val: number): boolean {
    return isAllowedControlChars(val) || (val >= 0x20 && val <= 0x7e);
}

export function decodeASCII(input: Uint8Array): string {
    // With ES2015, TypedArray.prototype.every can be used
    for (let i = 0; i !== input.length; ++i) {
        if (!isValidHeaderAscii(input[i])) {
            throw new Error('Metadata is not valid (printable) ASCII');
        }
    }
    // With ES2017, the array conversion can be omitted with iterables
    return String.fromCharCode(...Array.prototype.slice.call(input));
}

export function encodeASCII(input: string): Uint8Array {
    const encoded = new Uint8Array(input.length);
    for (let i = 0; i !== input.length; ++i) {
        const charCode = input.charCodeAt(i);
        if (!isValidHeaderAscii(charCode)) {
            throw new Error('Metadata contains invalid ASCII');
        }
        encoded[i] = charCode;
    }
    return encoded;
}

function readLengthFromHeader(headerView: DataView) {
    return headerView.getUint32(1, false);
}

function hasEnoughBytes(buffer: Uint8Array, position: number, byteCount: number) {
    return buffer.byteLength - position >= byteCount;
}

function sliceUint8Array(buffer: Uint8Array, from: number, to?: number) {
    if (buffer.slice) {
        return buffer.slice(from, to);
    }

    let end = buffer.length;
    if (to !== undefined) {
        end = to;
    }

    const num = end - from;
    const array = new Uint8Array(num);
    let arrayIndex = 0;
    for (let i = from; i < end; i++) {
        array[arrayIndex++] = buffer[i];
    }
    return array;
}

export enum ChunkType {
    MESSAGE = 1,
    TRAILERS = 2,
}

export type Chunk = {
    chunkType: ChunkType;
    data?: Uint8Array;
};

function createChunkParser() {
    let _buffer: Uint8Array | null = null;
    let _position = 0;

    return {
        parse(bytes: Uint8Array, flush?: boolean): Chunk[] {
            if (bytes.length === 0 && flush) {
                return [];
            }

            const chunkData: Chunk[] = [];

            if (_buffer == null) {
                _buffer = bytes;
                _position = 0;
            } else if (_position === _buffer.byteLength) {
                _buffer = bytes;
                _position = 0;
            } else {
                const remaining = _buffer.byteLength - _position;
                const newBuf = new Uint8Array(remaining + bytes.byteLength);
                const fromExisting = sliceUint8Array(_buffer, _position);
                newBuf.set(fromExisting, 0);
                const latestDataBuf = new Uint8Array(bytes);
                newBuf.set(latestDataBuf, remaining);
                _buffer = newBuf;
                _position = 0;
            }

            if (!hasEnoughBytes(_buffer, _position, HEADER_SIZE)) {
                return chunkData;
            }

            const headerBuffer = sliceUint8Array(_buffer, _position, _position + HEADER_SIZE);

            const headerView = new DataView(
                headerBuffer.buffer,
                headerBuffer.byteOffset,
                headerBuffer.byteLength
            );

            const msgLength = readLengthFromHeader(headerView);
            if (!hasEnoughBytes(_buffer, _position, HEADER_SIZE + msgLength)) {
                return chunkData;
            }

            const messageData = sliceUint8Array(
                _buffer,
                _position + HEADER_SIZE,
                _position + HEADER_SIZE + msgLength
            );
            _position += HEADER_SIZE + msgLength;

            chunkData.push({ chunkType: ChunkType.MESSAGE, data: messageData });

            // we only care about message, ignore the trailer headers
            return chunkData;
        },
    };
}

export default createChunkParser;
