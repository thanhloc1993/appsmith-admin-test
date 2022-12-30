import { materialByEnv } from 'test-suites/squads/lesson/common/constants';
import { MethodSavingType } from 'test-suites/squads/lesson/common/types';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';
import { CreateLessonTimeType } from 'test-suites/squads/lesson/utils/lesson-upsert';
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

export const parseLessonTime = (params: {
    lessonTime: LessonManagementLessonTime;
    methodSaving: MethodSavingType;
}): CreateLessonTimeType => {
    const { lessonTime, methodSaving } = params;
    switch (true) {
        case lessonTime === 'future' && methodSaving === 'Weekly Recurring':
            return 'future weekly recurring';
        case lessonTime === 'past' && methodSaving === 'Weekly Recurring':
            return 'past weekly recurring';
        default:
            return lessonTime;
    }
};

export const getMaterialIdByEnv = (type: 'pdf' | 'video'): string => {
    const env = process.env.ENV;
    if (env === 'uat') {
        return materialByEnv['uat'][type];
    }
    return materialByEnv['staging'][type];
};
