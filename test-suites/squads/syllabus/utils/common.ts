export const getTestId = (id: string) => `[data-testid='${id}']`;

export const getId = (id: string) => `[id=${id}]`;

/**
 * @description The `randomInteger` function is used randomly integer number.
 * Examples:
 * const randomNumber = randomInteger(min: 2, max: 5) => {
 *     // Math.floor(Math.random() * (5 - 2 + 1)) => [0-3]
 *     return Math.floor(Math.random() * (5 - 2 + 1)) + 2;
 * }
 *
 * @param min The minimum number
 * @param max the maximum number
 *
 */
export function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @description Get a generic array has n generic elements
 * @example
 * const getElement = () => randomInteger(1, 5);
 * // Generate an array with 2 numbers range 1-5
 * const arrayNumber = getArrayElementWithLength(2, getElement);
 *
 * @param {number} length The length of generic array
 * @param getElement The function returns generic element
 * @returns A generic array with length
 **/
export const getArrayElementWithLength = <T>(length: number, getElement: () => T): Array<T> => {
    let currentArray: Array<T> = [];

    if (length === 1) {
        return [getElement()];
    }

    for (let i = 1; i <= length; i++) {
        const element = getElement();

        currentArray = [...currentArray, element];
    }

    return currentArray;
};

/**
 * @description Truncate string with ellipsis
 * @example
 * const stringRaw = "Hello";
 * // Truncate stringRaw with ellipsis when stringRaw.length > 4
 * const result = toShortenStr(stringRaw, 4);
 * // Hell...
 * console.log(result);
 *
 * @param {string|undefined} stringRaw A raw string or undefined
 * @param {number} [maxCharacter=30] A number of max character to truncate the raw string
 * @returns An empty string | a string | a string with ellipsis
 **/
export function toShortenStr(stringRaw: string | undefined, maxCharacter = 30): string {
    if (!stringRaw || stringRaw.length <= maxCharacter) return stringRaw || '';

    return stringRaw.substring(0, maxCharacter) + '...';
}

export function convertOneOfStringTypeToArray<T = string>(input: string): T[] {
    const regex = new RegExp(/([^[]+(?=]))/g);
    const matched = regex.exec(input);

    if (!matched) throw new Error(`Cannot find any array in the ${input}`);

    const result = matched[0]
        .replace(', ', ',')
        .split(',')
        .map((item) => item.trim()) as unknown as T[];

    return result;
}

export function getRandomPollingOptionFromOptions(optionsString: string) {
    const options = convertOneOfStringTypeToArray(optionsString);
    if (options.length === 1) return optionsString[0];

    const randIndex = randomInteger(0, options.length - 1);
    return options[randIndex];
}
