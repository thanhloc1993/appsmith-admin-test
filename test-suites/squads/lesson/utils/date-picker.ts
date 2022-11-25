import { CMSInterface } from '@supports/app-types';

import moment from 'moment-timezone';
import {
    datePickerWithValueV2,
    timePickerOKButtonV2,
} from 'test-suites/squads/lesson/common/cms-selectors';

export async function applyTimePicker(cms: CMSInterface) {
    await cms.page!.click(timePickerOKButtonV2);
}

const convertLabelChangeMonth = (
    desireDate: moment.Moment,
    initialDate: moment.Moment
): 'Next month' | 'Previous month' => {
    if (desireDate.month() > initialDate.month()) return 'Next month';
    return 'Previous month';
};

export async function changeDatePickerByDateRange(params: {
    cms: CMSInterface;
    datePickerSelector: string;
    currentDate: Date | string;
    dateRange: number;
}) {
    const { cms, datePickerSelector, currentDate, dateRange } = params;
    const page = cms.page!;

    const initialDate = moment(new Date(currentDate)).endOf('day');
    const desireDate = moment(new Date(currentDate)).add(dateRange, 'day').endOf('day');

    await cms.instruction('Open date picker', async function () {
        await page.click(datePickerSelector);
    });

    await cms.instruction('Select date', async function () {
        if (desireDate.month() !== initialDate.month()) {
            const labelChangeMonth = convertLabelChangeMonth(desireDate, initialDate);
            await cms.selectAButtonByAriaLabel(labelChangeMonth);
        }

        await page.click(datePickerWithValueV2(desireDate.date()));
        await applyTimePicker(cms);
    });
}

export function calcDateRange(firstDate: Date, secondDate: Date): number {
    const difference = firstDate.getTime() - secondDate.getTime();
    const dateRange = Math.ceil(difference / (1000 * 3600 * 24));
    return dateRange;
}
