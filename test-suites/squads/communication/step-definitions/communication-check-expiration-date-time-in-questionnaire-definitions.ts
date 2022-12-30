import { CMSInterface } from '@supports/app-types';
import { formatDate, getDateAfterDuration } from '@supports/utils/time/time';

import * as CommunicationSelectors from './cms-selectors/communication';
import { InvalidDateTimeType } from './communication-common-definitions';
import { checkErrorMessageInDatePicker } from './communication-common-questionnaire-definitions';

export interface GetDateTimeProps {
    scheduleDate: Date;
    scheduleTime: string;
    expirationDate: Date;
    expirationTime: string;
}

export function getScheduleAndExpirationDateTime(
    invalidField: InvalidDateTimeType
): GetDateTimeProps {
    return invalidField === 'Date'
        ? getExpirationDateBeforeScheduleDate()
        : getExpirationTimeBeforeScheduleTime();
}

export function getExpirationDateBeforeScheduleDate(): GetDateTimeProps {
    return {
        scheduleDate: getDateAfterDuration(2),
        scheduleTime: formatDate(new Date(), 'HH:mm'),
        expirationDate: getDateAfterDuration(1),
        expirationTime: formatDate(new Date(), 'HH:mm'),
    };
}

export function getExpirationTimeBeforeScheduleTime(): GetDateTimeProps {
    return {
        scheduleDate: getDateAfterDuration(1),
        scheduleTime: '23:00',
        expirationDate: getDateAfterDuration(1),
        expirationTime: '22:00',
    };
}

export async function checkInvalidExpirationDay(cms: CMSInterface) {
    const expirationDatePicker = await cms.page!.waitForSelector(
        CommunicationSelectors.expirationDatePicker
    );

    await checkErrorMessageInDatePicker(cms, expirationDatePicker, 'Invalid Expiration Date');
}

export async function checkInvalidExpirationTime(cms: CMSInterface) {
    const expirationTimePickerInput = await cms.page!.waitForSelector(
        CommunicationSelectors.expirationTimePickerInput
    );

    await checkErrorMessageInDatePicker(cms, expirationTimePickerInput, 'Invalid Expiration Time');
}
