import { Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';

import {
    tableValueGroupReport,
    textAreaValueGroupReport,
    closeIcon,
    autocompleteInput,
    lessonReportTextAreaField,
    lessonReportTextField,
    lessonReportPercentageField,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { updatedText } from 'test-suites/squads/lesson/common/constants';
import { IndividualLessonReportField } from 'test-suites/squads/lesson/common/types';
import { getDivElementByLabel } from 'test-suites/squads/lesson/utils/lesson-report';

export const assertLessonReportDetailUpdated = async (page: Page) => {
    const textAreaContents = await page.locator(textAreaValueGroupReport).allTextContents();
    const tableValueContents = await page.locator(tableValueGroupReport).allTextContents();

    const areContentsUpdated = [...textAreaContents, ...tableValueContents].every(
        (content) => content === updatedText
    );

    weExpect(areContentsUpdated, `Expect all of values are ${updatedText}`).toEqual(true);
};

export const clearFieldLessonReportInd = async (params: {
    page: Page;
    field: IndividualLessonReportField;
}) => {
    const { page, field } = params;
    const fieldLocator = getDivElementByLabel({ page, label: field });
    switch (field) {
        case 'Attendance Status':
        case 'Attendance Notice':
        case 'Reason':
        case 'Understanding': {
            await fieldLocator.hover();
            await fieldLocator.locator(closeIcon).click();
            const inputValue = await fieldLocator.locator(autocompleteInput).inputValue();
            weExpect(inputValue, `${field} input is not has value`).toEqual('');
            break;
        }

        case 'Content':
        case 'Announcement':
        case 'Remark':
        case 'Homework': {
            const textAreaField = fieldLocator.locator(lessonReportTextAreaField);
            await textAreaField.fill('');
            const inputValue = await textAreaField.inputValue();
            weExpect(inputValue, `${field} input is not has value`).toEqual('');
            break;
        }

        case 'Attendance Note': {
            const textField = fieldLocator.locator(lessonReportTextField);
            await textField.fill('');
            const inputValue = await textField.inputValue();
            weExpect(inputValue, `${field} input is not has value`).toEqual('');
            break;
        }

        case 'In-lesson Quiz': {
            const percentageField = fieldLocator.locator(lessonReportPercentageField);
            await percentageField.fill('');
            const inputValue = await percentageField.inputValue();
            weExpect(inputValue, `${field} input is not has value`).toEqual('');
            break;
        }
    }
};

export async function assertAlertMessageBelowIndReportField(params: {
    cms: CMSInterface;
    reportIndField: IndividualLessonReportField;
    completedLesson?: boolean;
}) {
    const { cms, reportIndField, completedLesson = false } = params;
    const page = cms.page!;

    const textErrorMsg =
        reportIndField === 'Attendance Status' && completedLesson
            ? 'Attendance field is required for “Completed” lesson'
            : 'This field is required';

    const fieldLocator = getDivElementByLabel({ page, label: reportIndField });
    await fieldLocator.getByText(textErrorMsg).waitFor();
    await cms.attach(`See alert message below ${reportIndField}`);
}
