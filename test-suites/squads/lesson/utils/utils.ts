import { $enum } from 'ts-enum-util';
import { StringKeyOf } from 'ts-enum-util/src/types';

export function convertEnumKeys<T extends Record<StringKeyOf<T>, number | string>>(
    enumObj: T
): EnumKeysReturn<T> {
    const keys: StringKeyOf<T>[] = $enum(enumObj).getKeys();

    return keys.reduce((result, key: StringKeyOf<T>) => {
        result[key] = String(key) as StringKeyOf<T>;
        return result;
    }, {} as EnumKeysReturn<T>);
}
export type EnumKeysReturn<T> = Record<StringKeyOf<T>, StringKeyOf<T>>;
