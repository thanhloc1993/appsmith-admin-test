import { clickOnOkButtonOnDatePickerFooter } from '@legacy-step-definitions/utils';

import { Locator } from 'playwright';

import { CMSInterface } from '@supports/app-types';

import {
    datePickerInput,
    muiPickersYearSelection,
    pickYearButton,
} from '../cms-selectors/date-picker';

export async function selectFullDate(
    cms: CMSInterface,
    date: Date | undefined,
    selector: string,
    index = 0,
    wrapperElement?: Locator
) {
    if (date) {
        await cms.instruction(`select date ${date}`, async () => {
            let _datePicker = cms.page!.locator(selector).nth(index);

            const selectData = new Date(date);
            if (wrapperElement) _datePicker = wrapperElement.locator(selector).nth(index);

            const dateValue = selector.includes('data-testid')
                ? await _datePicker.getByTestId(datePickerInput).inputValue()
                : await _datePicker.inputValue();
            const currentDate = dateValue ? new Date(dateValue) : new Date();
            const curMonth = currentDate.getMonth();
            const month = selectData.getMonth();

            await cms.selectDatePickerMonthAndDay({
                day: selectData.getDate(),
                monthDiff: month - curMonth,
                datePickerSelector: selector,
                elementSelector: _datePicker,
            });

            await selectYear(cms, selector, selectData.getFullYear());
        });
    }
}

export async function selectYear(cms: CMSInterface, selector: string, year: number) {
    await cms.instruction(`select year ${year}`, async () => {
        const page = cms.page!;

        await page.locator(selector).click();
        await page.click(pickYearButton);
        const pickersYearSelection = await page.waitForSelector(muiPickersYearSelection);
        const yearSelected = await pickersYearSelection?.waitForSelector(`text=${year}`);
        await yearSelected.click();

        await clickOnOkButtonOnDatePickerFooter(cms);
    });
}
