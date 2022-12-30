import { Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';

import {
    buttonPreviousLessonReportGrp,
    dialogWithHeaderFooterTitle,
    dialogWithHeaderFooterWrapper,
    dynamicTableStudentName,
    groupLessonReportFormContainer,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonReportPageType } from 'test-suites/squads/lesson/common/types';

export const getButtonPreviousReportGrp = (page: Page, onPage: LessonReportPageType) => {
    const wrapper = onPage === 'upsert' ? page.locator(groupLessonReportFormContainer) : page;
    return wrapper.locator(buttonPreviousLessonReportGrp);
};

export const assertButtonPreviousReportGrpVisible = async (params: {
    page: Page;
    shouldBeEnabled: boolean;
    onPage: LessonReportPageType;
}) => {
    const { page, shouldBeEnabled, onPage } = params;
    const buttonPreviousReport = await getButtonPreviousReportGrp(page, onPage).elementHandle();
    const state = shouldBeEnabled ? 'enabled' : 'disabled';

    if (buttonPreviousReport) {
        await buttonPreviousReport.waitForElementState(state, {
            timeout: 3000,
        });
    } else {
        throw new Error('Can not find button previous report');
    }
};

export const assertSeeStudentInPreviousLessonReportGrp = async (params: {
    cms: CMSInterface;
    studentName: string;
}) => {
    const { cms, studentName } = params;
    const page = cms.page!;

    await cms.instruction(
        `Should see ${studentName} in student list in previous report dialog`,
        async function () {
            const dialogPreviousReport = page.locator(dialogWithHeaderFooterWrapper);

            const desireStudentNames = await dialogPreviousReport
                .locator(dynamicTableStudentName)
                .allTextContents();

            weExpect(desireStudentNames, `List student should contain ${studentName}`).toContain(
                studentName
            );
        }
    );
};

export const assertSeeDialogPreviousReportGrp = async (params: {
    cms: CMSInterface;
    onPage: LessonReportPageType;
}) => {
    const { cms, onPage } = params;

    const page = cms.page!;

    const buttonPreviousReport = getButtonPreviousReportGrp(page, onPage);
    await buttonPreviousReport.click();

    await cms.instruction('See dialog previous report on lesson detail', async function () {
        const dialogPreviousReportTitle = await page.waitForSelector(dialogWithHeaderFooterTitle);
        const titleContent = await dialogPreviousReportTitle.textContent();
        weExpect(titleContent, 'Title of dialog should be Previous report').toEqual(
            'Previous Report'
        );
    });
};
