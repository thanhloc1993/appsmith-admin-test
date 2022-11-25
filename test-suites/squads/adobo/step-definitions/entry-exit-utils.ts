import * as StudentEntryExitKeys from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';

import { FilterTypes } from 'test-suites/squads/adobo/step-definitions/entry-exit-filter-records-in-learner-app-steps';

// Time picker
export enum Meridiem {
    AM = 'AM',
    PM = 'PM',
}

export async function selectMeridiem(cms: CMSInterface, meridiem: Meridiem) {
    //First click is to activate selection, second click is to select AM or PM
    await cms.page!.click(StudentEntryExitKeys.meridiemOnTimePicker(meridiem));
    await cms.page!.click(StudentEntryExitKeys.meridiemOnTimePicker(meridiem));
}

async function selectTimeWithValueOnTimePicker(
    cms: CMSInterface,
    value: string | number,
    type: 'hours' | 'minutes'
) {
    await cms.page!.click(StudentEntryExitKeys.timePickerWithValue(value, type), {
        force: true,
    });
}

export async function applyTimePicker(cms: CMSInterface) {
    await cms.page!.click(StudentEntryExitKeys.timePickerOKButton);
}

export async function changeTimePicker(params: {
    cms: CMSInterface;
    timePickerSelector: string;
    meridiem: Meridiem;
    hour: number | string;
    minute: number | string;
}) {
    const { cms, timePickerSelector, meridiem, hour, minute } = params;

    const page = cms.page!;

    await cms.instruction('Open time picker', async function () {
        await page.click(timePickerSelector);
    });

    await cms.instruction('Select meridiem', async function () {
        await selectMeridiem(cms, meridiem);
    });

    await cms.instruction('Select hour', async function () {
        await selectTimeWithValueOnTimePicker(cms, hour, 'hours');
    });

    await cms.instruction('Select minute', async function () {
        await selectTimeWithValueOnTimePicker(cms, minute, 'minutes');
    });

    await cms.instruction('Apply new time', async function () {
        await applyTimePicker(cms);
    });
}

export function getCorrectDateForEntryExit(currentDate: Date) {
    const correctDate = new Date();
    if (currentDate.getDate() === 1) return currentDate;

    //if it is 12 AM and not the first day of the month, we can use previous date and set time to 8 AM
    if (currentDate.getHours() === 0 && currentDate.getDate() !== 1) {
        correctDate.setDate(currentDate.getDate() - 1);
        correctDate.setHours(8);
        correctDate.setMinutes(0);
        return correctDate;
    } else return currentDate;
}

export function checkIfWithExitTime(givenDate: Date) {
    //if given date is first day of the month, and time is 12 AM, we don't subtract entry time, and don't add exit time
    if (givenDate.getDate() === 1 && givenDate.getHours() === 0) return false;
    else return true;
}

export function getMeridiemForTimePicker(hour: number) {
    return hour < 12 ? Meridiem.AM : Meridiem.PM;
}

export function getHourForTimePicker(hour: number) {
    return hour === 0 ? 12 : hour;
}

export function retrieveRecordDataByFilter(
    currentDate: Date,
    lastMonthDate: Date,
    thisYearDate: Date,
    filter: FilterTypes
) {
    const recordDate: Date[] = [];
    switch (filter) {
        case 'last month':
            recordDate.push(lastMonthDate);
            break;
        case 'this year':
            recordDate.push(currentDate, lastMonthDate, thisYearDate);
            break;
        default:
            recordDate.push(currentDate);
            break;
    }

    return recordDate;
}
