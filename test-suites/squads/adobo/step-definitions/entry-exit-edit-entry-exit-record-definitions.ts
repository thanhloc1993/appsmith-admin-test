import * as studentPageSelectors from '@user-common/cms-selectors/students-page';

import { CMSInterface } from '@supports/app-types';

import {
    changeTimePicker,
    checkIfWithExitTime,
    getCorrectDateForEntryExit,
    getHourForTimePicker,
    getMeridiemForTimePicker,
} from './entry-exit-utils';

export async function editEntryExitRecordOnCms(cms: CMSInterface) {
    const page = cms.page!;

    const currentDate = new Date();
    const correctDate = getCorrectDateForEntryExit(currentDate);

    const entryDate = new Date(correctDate);
    if (checkIfWithExitTime(entryDate)) entryDate.setHours(correctDate.getHours() - 1);

    const entryHour = getHourForTimePicker(entryDate.getHours());
    const exitHour = getHourForTimePicker(entryDate.getHours());
    const entryMeridiem = getMeridiemForTimePicker(currentDate.getHours());
    const exitMeridiem = getMeridiemForTimePicker(currentDate.getHours());

    await cms.instruction(
        `Click edit in action panel trigger to open edit dialog box`,
        async function () {
            const entryExitTable = await page.waitForSelector(
                studentPageSelectors.entryExitRecordsTable,
                {
                    timeout: 5000,
                }
            );
            const entryExitRecordMenuTrigger = await entryExitTable.waitForSelector(
                studentPageSelectors.entryExitRecordActionPanelTrigger,
                {
                    timeout: 5000,
                }
            );
            await entryExitRecordMenuTrigger!.click();

            await cms.selectAButtonByAriaLabel('Edit');
        }
    );

    await cms.instruction(
        `Edit out entry time ${entryHour}:00, and exit time ${exitHour}:05, and save the record`,
        async function (this: CMSInterface) {
            await changeTimePicker({
                cms,
                timePickerSelector: studentPageSelectors.entryTimePicker,
                meridiem: entryMeridiem,
                hour: entryHour <= 12 ? `${entryHour}` : `${entryHour - 12}`,
                minute: '00',
            });

            await changeTimePicker({
                cms,
                timePickerSelector: studentPageSelectors.exitTimePicker,
                meridiem: exitMeridiem,
                hour: exitHour <= 12 ? `${exitHour}` : `${exitHour - 12}`,
                minute: '05',
            });

            await page?.click(studentPageSelectors.notifyParentsCheckbox);

            await cms.selectAButtonByAriaLabel('Save');
            await cms.waitForSkeletonLoading();
        }
    );
}
