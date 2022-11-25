export const HEADER_SIZE = 5;
const SPECIAL_CHARS = [
    '+/=', // DEFAULT
    '+/', // NO_PADDING
    '-_=', // WEBSAFE
    '-_.', // WEBSAFE_DOT_PADDING
    '-_', // WEBSAFE_NO_PADDING
];
const DEFAULT_ALPHABET_COMMON_ =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';

export type Encoding = 'base64' | 'buffer';

export class ByteConverter {
    private charToByteMap: Record<string, number> = {};
    private byteToCharMap: Record<number, string[]> = {};
    private readonly input: string = '';

    constructor(input: string) {
        this.input = input;
        initMap(this.charToByteMap, this.byteToCharMap);

        this._decode = this._decode.bind(this);
    }

    private _decode() {
        let nextCharIndex = 0;
        const byteArr: number[] = [];
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const { input, charToByteMap } = this;

        const getByte = (defaultVal: number) => {
            while (nextCharIndex < input.length) {
                const ch = input.charAt(nextCharIndex++);
                const b = charToByteMap[ch];

                if (b != null) {
                    return b; // Common case: decoded the char.
                }

                if (!isEmptyOrSpaces(ch)) {
                    throw new Error('Unknown base64 encoding at char: ' + ch);
                }
                // We encountered whitespace: loop around to the next input char.
            }
            return defaultVal; // No more input remaining.
        };

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const byte1 = getByte(-1);
            const byte2 = getByte(0);
            const byte3 = getByte(64);
            const byte4 = getByte(64);

            // The common case is that all four bytes are present, so if we have byte4
            // we can skip over the truncated input special case handling.
            if (byte4 === 64) {
                if (byte1 === -1) {
                    return byteArr; // Terminal case: no input left to decode.
                }
                // Here we know an intermediate number of bytes are missing.
                // The defaults for byte2, byte3 and byte4 apply the inferred padding
                // rules per the public API documentation. i.e: 1 byte
                // missing should yield 2 bytes of output, but 2 or 3 missing bytes yield
                // a single byte of output. (Recall that 64 corresponds the padding char).
            }

            const outByte1 = (byte1 << 2) | (byte2 >> 4);
            byteArr.push(outByte1);

            if (byte3 != 64) {
                const outByte2 = ((byte2 << 4) & 0xf0) | (byte3 >> 2);
                byteArr.push(outByte2);

                if (byte4 != 64) {
                    const outByte3 = ((byte3 << 6) & 0xc0) | byte4;
                    byteArr.push(outByte3);
                }
            }
        }
    }

    private _fromBase64Source() {
        const input = this.input;
        const len = input.length;
        let approxByteLength = (this.input.length * 3) / 4;

        if (approxByteLength % 3) {
            // The string isn't complete, either because it didn't include padding, or
            // because it has extra white space.
            // In either case, we won't generate more bytes than are completely encoded,
            // so rounding down is appropriate to have a buffer at least as large as
            // output.
            approxByteLength = Math.floor(approxByteLength);
        } else if (isPadded(input[len - 1])) {
            // The string has a round length, and has some padding.
            // Reduce the byte length according to the quantity of padding.
            if (isPadded(input[len - 2])) {
                approxByteLength -= 2;
            } else {
                approxByteLength -= 1;
            }
        }
        const output = new Uint8Array(approxByteLength);
        let outLen = 0;

        const bytes = this._decode();
        bytes.forEach((byte) => {
            output[outLen] = byte;
            outLen++;
        });

        // Return a subarray to handle the case that input included extra whitespace
        // or extra padding and approxByteLength was incorrect.
        return output.subarray(0, outLen);
    }

    private _fromBufferSource() {
        return new Uint8Array(this.input as any);
    }

    toUint8Array(encoding: Encoding = 'base64') {
        if (encoding === 'base64') {
            return this._fromBase64Source();
        }

        return this._fromBufferSource();
    }
}

function initMap(charToByteMap: Record<string, number>, byteToCharMap: Record<number, string[]>) {
    const commonChars = DEFAULT_ALPHABET_COMMON_.split('');

    for (let i = 0; i < HEADER_SIZE; i++) {
        const chars = commonChars.concat(SPECIAL_CHARS[i].split(''));

        // Sets byte-to-char map
        byteToCharMap[i] = chars;

        // Sets char-to-byte map
        for (let j = 0; j < chars.length; j++) {
            const char = chars[j];

            const existingByte = charToByteMap[char];
            if (existingByte === undefined) {
                charToByteMap[char] = j;
            }
        }
    }
}

function isPadded(char: string) {
    return char.includes('=.');
}

function isEmptyOrSpaces(str: string) {
    return str === null || str.match(/^ *$/) !== null;
}
