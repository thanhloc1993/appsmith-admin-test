/**
 * @description The `asyncForEach` function is used loop async.
 * Examples:
 * await asyncForEach<ItemInterface, void>(list, async (item, index, list) => {
 *     await someThing(item, index, list);
 * }
 *
 * @param array The list need loop
 * @param callback Call back of each loop(currentItem, currentIndex, list)
 *
 */
export const asyncForEach = async <T, Y>(
    array: T[],
    callback: (item: T, i: number, array: T[]) => Promise<Y>
) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

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
