import { FormatDateOptions } from './constants/enum';
import { DateCommon, OptionSelectType } from './constants/types';
import moment, { MomentInput, Moment } from 'moment';
import { DurationInputArg2, unitOfTime } from 'moment-timezone';
import 'moment/locale/ja';
import 'moment/locale/vi';

export enum LanguageKeys {
    VI = 'vi',
    EN = 'en',
    JA = 'ja',
    PSEUDO = 'pseudo',
}

export const formatDate = (
    date: DateCommon['date'],
    formatOptions: FormatDateOptions,
    language?: LanguageKeys
) => {
    language && moment.locale(language);
    return moment(date).format(formatOptions);
};

export const createListMonths = (locale?: string): OptionSelectType[] => {
    const months: OptionSelectType[] = [];
    const formatType: FormatDateOptions = 'MM';

    for (let i = 0; i < 12; i++) {
        months.push({
            id: i,
            value: moment()
                .month(i)
                .locale(locale || LanguageKeys.EN)
                .format(formatType),
        });
    }

    return months;
};

export function createListYears(startCompanyYear: number): OptionSelectType[] {
    const years: OptionSelectType[] = [];
    for (let i = moment().year() + 2; i >= startCompanyYear; i--) {
        years.push({ id: i, value: `${i}` });
    }
    return years;
}

export const getTime = (date: Date) => {
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
    };
};

export const setDefaultTime = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
};

export const dateIsBefore = (first: Date, second: Date): boolean => moment(first).isBefore(second);

export const dateIsAfter = (first: Date, second: Date, granularity?: unitOfTime.StartOf): boolean =>
    moment(first).isAfter(second, granularity);

const minutesOfDate = (date: Moment) => {
    return date.minutes() + date.hours() * 60;
};
export const timeIsAfter = (first: Date, second: Date): boolean => {
    const firstTime = moment(first, 'hh:mm');
    const secondTime = moment(second, 'hh:mm');
    const result = minutesOfDate(firstTime) > minutesOfDate(secondTime);
    return result;
};
export const dateIsSameOrAfter = (
    first: Date,
    second: Date,
    granularity?: unitOfTime.StartOf
): boolean => moment(first).isSameOrAfter(second, granularity);

export const dateIsSame = (first: Date, second: Date, granularity?: unitOfTime.StartOf): boolean =>
    moment(first).isSame(second, granularity);
export const convertToISOString = (date: MomentInput) => {
    return moment(date).toISOString();
};

type ConvertToDateProps = Moment | Date | string;

export const convertToDate = (date: ConvertToDateProps | null) => {
    if (date) {
        return moment(date).toDate();
    }

    return moment().toDate();
};

export const combineDateAndTime = (date: Date, time: Date) => {
    const dateString = formatDate(date, 'YYYY/MM/DD', LanguageKeys.EN);
    const timeString = formatDate(time, 'HH:mm', LanguageKeys.EN);
    const combined = new Date(`${dateString} ${timeString}`);

    return combined;
};

export const generateMockDateForTests = (isoDate: string, RealDate: DateConstructor) => {
    const date = new Date(isoDate);

    const now_utc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes() + date.getTimezoneOffset(),
        date.getUTCSeconds()
    );
    const temp: any = class extends RealDate {
        constructor() {
            super();
            return new RealDate(now_utc);
        }
    };
    global.Date = temp;
};

/**
 * @param durations durations
 * @param durationUnit duration unit
 * @returns Date() after days, calculate from now.
 */
export const getDateAfterDuration = (
    durations: number,
    durationUnit: DurationInputArg2 = 'days',
    selectedDate: Date = new Date()
): Date => {
    return moment(selectedDate).add(durations, durationUnit).toDate();
};

export const getDateBeforeDuration = (
    durations: number,
    durationUnit: DurationInputArg2 = 'days',
    selectedDate: Date = new Date()
): Date => {
    return moment(selectedDate).subtract(durations, durationUnit).toDate();
};

export const getFirstDayOfMonth = (): Date => moment().startOf('month').toDate();

export const getLastDayOfMonth = (): Date => moment().endOf('month').toDate();

/**
 * Get date with specific offsets compared with current date
 * @param offset number
 * @returns Date
 */
export function getDateWithOffset(offset: number): Date {
    const currentDate = new Date();
    const newDate = new Date(new Date(currentDate).setDate(currentDate.getDate() + offset));
    return newDate;
}

/**
 * @param hourTime string example: 10:12
 * @returns Date() calculate from now with hour and time string.
 */
export const convertHoursTimeToDate = (hourTime: string): Date => {
    const hours = Number(hourTime.split(':')[0]);

    const time = Number(hourTime.split(':')[1]);

    const expectDate = new Date();
    expectDate.setHours(hours);
    expectDate.setTime(time);

    return expectDate;
};

export const getYesterday = (date: Date): Date => {
    return new Date(new Date().setDate(date.getDate() - 1));
};

export const getLastDayOfSpecificMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getTomorrow = (date: Date): Date => {
    return new Date(new Date().setDate(date.getDate() + 1));
};
