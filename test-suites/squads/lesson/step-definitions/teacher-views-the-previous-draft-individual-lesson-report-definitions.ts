import { CMSInterface } from '@supports/app-types';

import {
    buttonPreviousLessonReportInd,
    dialogWithHeaderFooterTitle,
    listStudentItemButton,
    upsertDialogLessonReportInd,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonReportPageType } from 'test-suites/squads/lesson/common/types';

export const selectStudentInListReport = async (
    cms: CMSInterface,
    studentName: string,
    onPage: LessonReportPageType
) => {
    const page = cms.page!;
    const pageWrapper = onPage === 'upsert' ? page.locator(upsertDialogLessonReportInd) : page;
    await pageWrapper
        .locator(listStudentItemButton, {
            hasText: studentName,
        })
        .click();
};

export const getButtonPreviousReport = (cms: CMSInterface, onPage: LessonReportPageType) => {
    const page = cms.page!;
    const wrapper = onPage === 'upsert' ? page.locator(upsertDialogLessonReportInd) : page;
    return wrapper.locator(buttonPreviousLessonReportInd);
};

export const assertButtonPreviousReportIndVisible = async (
    cms: CMSInterface,
    shouldBeEnabled: boolean,
    onPage: LessonReportPageType
) => {
    const buttonPreviousReport = await getButtonPreviousReport(cms, onPage).elementHandle();
    const state = shouldBeEnabled ? 'enabled' : 'disabled';

    if (buttonPreviousReport) {
        await buttonPreviousReport.waitForElementState(state, {
            timeout: 3000,
        });
    } else {
        throw new Error('Can not find button previous report');
    }
};

export const assertSeeDialogPreviousReportInd = async (
    cms: CMSInterface,
    onPage: LessonReportPageType
) => {
    const page = cms.page!;

    const buttonPreviousReport = getButtonPreviousReport(cms, onPage);
    await buttonPreviousReport.click();

    await cms.instruction('See dialog previous report on lesson detail', async function () {
        const dialogPreviousReportTitle = await page.waitForSelector(dialogWithHeaderFooterTitle);
        const titleContent = await dialogPreviousReportTitle.textContent();
        weExpect(titleContent, 'Title of dialog should be Previous report').toEqual(
            'Previous Report'
        );
    });
};
