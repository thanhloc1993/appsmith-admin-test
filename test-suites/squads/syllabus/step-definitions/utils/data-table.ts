import { getRandomElement } from '@syllabus-utils/common';

import { NumberRange } from '../types/cms-types';
import { DTRegexExpression, DTValue } from '../types/data-table';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

// TODO: Continue to implement later, please ignore this file
export const parseDTStringToArrayValue = <T extends string>(
    stringRaw: T,
    options: Partial<{ arrayPattern: Array<T> }> = {}
): Array<T> => {
    const { arrayPattern = [] } = options;
    const expPattern = arrayPattern.length
        ? arrayPattern.join('|')
        : DTRegexExpression.EXP_WORD_CHARACTER;

    const regexDelimiter = new RegExp(DTRegexExpression.EXP_COMMA_WHITESPACE, 'g');
    const regexPattern = new RegExp(`^(${expPattern})(,\\s(${expPattern}))*$`, 'g');
    const arrayString = stringRaw.match(regexPattern);

    if (!arrayString) {
        throw new Error(`Invalid data table value pattern!
            Pattern: ${arrayPattern.join(', ')} (stringValue, stringValue,...)
            Result: ${stringRaw}
        `);
    }

    return arrayString[0].split(regexDelimiter) as Array<T>;
};

export const parseDTValueToNumber = (
    value: number | DTValue,
    options: Partial<NumberRange> = {}
): number => {
    const { min = 1, max = 5 } = options;

    if (value === DTValue.random) {
        return randomInteger(min, max);
    }

    return value;
};

export const parseDTValueToBoolean = (
    value: boolean | DTValue | undefined
): boolean | undefined => {
    if (!value) return undefined;

    if (value === DTValue.random) {
        return Math.random() > 0.5;
    }

    return value;
};

export const parseDTValueToString = <T = string>(arrayValue: T[]): T => {
    return arrayValue.length === 1 ? arrayValue[0] : getRandomElement(arrayValue);
};
