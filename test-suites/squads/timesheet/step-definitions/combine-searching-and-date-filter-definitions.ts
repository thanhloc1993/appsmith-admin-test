import { tableCellIndex } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { CMSInterface } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';
import { getFirstDayOfMonth, getLastDayOfMonth, dateIsSame } from '@supports/utils/time/time';

import * as LocationsListSelectors from 'test-suites/squads/timesheet/common/cms-selectors/locations-list';

export const changeFromDateFilter = async (
    cms: CMSInterface,
    defaultFromDate: Date,
    selectFromDate: Date
) => {
    await cms.instruction(
        `Change from date to ${formatDate(selectFromDate, 'YYYY/MM/DD')}`,
        async function () {
            await cms.selectDatePickerMonthAndDay({
                day: selectFromDate.getDate(),
                monthDiff: selectFromDate.getMonth() - defaultFromDate.getMonth(),
                datePickerSelector: LocationsListSelectors.locationsFromDateFilter,
            });
        }
    );
};

export const changeToDateFilter = async (
    cms: CMSInterface,
    defaultToDate: Date,
    selectToDate: Date
) => {
    await cms.instruction(
        `Change to date to ${formatDate(selectToDate, 'YYYY/MM/DD')}`,
        async function () {
            await cms.selectDatePickerMonthAndDay({
                day: selectToDate.getDate(),
                monthDiff: selectToDate.getMonth() - defaultToDate.getMonth(),
                datePickerSelector: LocationsListSelectors.locationsToDateFilter,
            });
        }
    );
};

export const changeDateFilterForLocationsList = async ({
    cms,
    selectFromDate = getFirstDayOfMonth(),
    selectToDate = getLastDayOfMonth(),
}: {
    cms: CMSInterface;
    selectFromDate?: Date;
    selectToDate?: Date;
}) => {
    const defaultFromDate = getFirstDayOfMonth();
    const defaultToDate = getLastDayOfMonth();

    if (!dateIsSame(selectFromDate, defaultFromDate)) {
        await changeFromDateFilter(cms, defaultFromDate, selectFromDate);
    }

    if (!dateIsSame(selectToDate, defaultToDate)) {
        await changeToDateFilter(cms, defaultToDate, selectToDate);
    }
};

export const assertTableOnFirstPage = async (cms: CMSInterface) => {
    const page = cms.page!;
    const tableCells = await page.$$(tableCellIndex);
    const firstRowNumberCellText = await tableCells[1].textContent();

    weExpect(firstRowNumberCellText).toEqual('1');
};

export const assertLocationsListRowsMatchTheSearchKeyword = async (
    cms: CMSInterface,
    keyword: string
) => {
    const locationNameRows = await cms.page!.$$(LocationsListSelectors.locationNameCell);

    for (let i = 0; i < locationNameRows.length; i++) {
        const locationNameText = await locationNameRows[i]?.textContent();
        const locationName = locationNameText?.toLowerCase();
        const partialKeyword = keyword.toLowerCase();
        weExpect(locationName?.includes(partialKeyword)).toBeTruthy();
    }

    if (!locationNameRows.length) {
        throw new Error('Cannot retrieve locations');
    }
};
