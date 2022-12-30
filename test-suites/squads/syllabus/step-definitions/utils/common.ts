import { CMSInterface } from '@supports/app-types';
import MasterReaderService from '@supports/services/bob-master-data-reader/bob-master-data-reader-service';

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

export function toShortenStr(str: string | undefined, max = 30) {
    if (!str || str.length <= max) return str || '';

    return str.substring(0, max) + '...';
}

/**
 * @description Get randomly an element in the generic array
 * @example
 * const arrayString = ['hello', 'hi', 'bye'];
 * // Get randomly a string in arrayString
 * const elementString = getRandomElement(arrayString);
 *
 * @param array The generic array to get randomly element
 * @returns A generic element
 **/
export function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export const randomBoolean = () => Math.random() >= 0.5;

export function arrayHasItem<T>(arr?: T[] | T | null): boolean {
    return Array.isArray(arr) && arr.length > 0;
}

export const getRandomNumber = () => {
    return new Date().getTime();
};

export function randomString(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
        let rand = Math.floor(Math.random() * 62);
        const charCode = (rand += rand > 9 ? (rand < 36 ? 55 : 61) : 48);
        result += String.fromCharCode(charCode);
    }
    return result;
}

export async function retrieveLowestLocations(cms: CMSInterface) {
    const cmsToken = await cms.getToken();
    await cms.attach('Get Location list by GRPC');
    const { response } = await MasterReaderService.retrieveLowestLocations(cmsToken);
    let locationsList = response?.locationsList || [];
    if (!arrayHasItem(locationsList)) {
        await cms.attach('Dont have any locations by GRPC');
        await cms.attach('Importing location master-data...');
        await cms.importLocationData();
        await cms.attach('Get Location list by GRPC again');
        const { response } = await MasterReaderService.retrieveLowestLocations(cmsToken);
        locationsList = response?.locationsList || [];
    }

    return locationsList;
}
