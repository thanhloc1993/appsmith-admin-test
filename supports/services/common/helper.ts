import moment, { MomentInput } from 'moment-timezone';

// This file only support for common/request.ts

/**
 * Convert datetime to another timezone, keep datetime. if timezone is null, it will convert to UTC time
 * @param {string} date
 * @param {string} timezone
 * */
export const keepTimeMove2AnotherTimezone = (
    date: MomentInput = '',
    timezone = 'UTC'
): moment.Moment => {
    return moment(date).tz(toDefaultTimezone(timezone), true);
};

export function toDefaultTimezone(timezone: string | null) {
    return timezone || 'UTC';
}

export const convertToServerTimezone = (date: MomentInput): string => {
    return moment.utc(date).toISOString();
};
