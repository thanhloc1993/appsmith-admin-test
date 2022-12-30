import { Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';

import { cmsForm } from 'test-suites/squads/syllabus/cms-locators/components/form';
import {
    ManualGrading,
    ShowingAnswerKey,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/exam-lo-settings';
import { getTestId } from 'test-suites/squads/syllabus/utils/common';

const formControlSelector = '[class*=MuiFormControl-root]';
const nameSelector = getTestId('ExamUpsertForm__name');
const instructionSelector = getTestId('ExamUpsertForm__instruction');
const manualGradingOnSelector = getTestId('Radio__on');
const manualGradingOffSelector = getTestId('Radio__off');
const gradeToPassSelector = getTestId('ExamUpsertForm__gradeToPass');
const timeLimitSelector = getTestId('ExamUpsertForm__timeLimit');
const submissionAttemptSelector = getTestId('ExamUpsertForm__submissionAttempt');
const disabledRadioSelector = 'role=radio[disabled=true]';
const showAnswerKeyImmediatelySelector = getTestId('Radio__immediately');
const showAnswerKeyAfterDueDateSelector = getTestId('Radio__afterDueDate');

const fillName = async (page: Page, value: string) => {
    await page.fill(nameSelector, value);
};

const fillInstruction = async (page: Page, value: string) => {
    await page.fill(instructionSelector, value);
};

const selectManualGrading = async (page: Page, value: ManualGrading) => {
    await page.click(
        value === ManualGrading.On ? manualGradingOnSelector : manualGradingOffSelector
    );
};

const fillTimeLimit = async (page: Page, value?: number) => {
    await page.fill(timeLimitSelector, value?.toString() ?? '');
};

const fillSubmissionAttempt = async (page: Page, value?: number) => {
    await page.fill(submissionAttemptSelector, value?.toString() ?? '');
};

const fillGradeToPass = async (page: Page, value?: number) => {
    await page.fill(gradeToPassSelector, value?.toString() ?? '');
};

const selectShowingAnswerKey = async (page: Page, value: ShowingAnswerKey) => {
    await page.click(
        value === ShowingAnswerKey.Immediately
            ? showAnswerKeyImmediatelySelector
            : showAnswerKeyAfterDueDateSelector
    );
};

const findValidationError = async (cms: CMSInterface, message: string) => {
    await cmsForm.findValidationError(cms, { wrapper: formControlSelector, message: message });
};

const waitForInstruction = async (page: Page) => {
    await page.waitForSelector(instructionSelector);
};

const findManualGradingRadio = async (page: Page) => {
    const radioOnEl = await page.waitForSelector(manualGradingOnSelector);
    const radioOffEl = await page.waitForSelector(manualGradingOffSelector);

    await radioOnEl.waitForSelector(disabledRadioSelector);
    await radioOffEl.waitForSelector(disabledRadioSelector);
};

const getShowingAnswerKeyLabel = (page: Page, target: ShowingAnswerKey) => {
    const input = page
        .locator(
            target === ShowingAnswerKey.Immediately
                ? showAnswerKeyImmediatelySelector
                : showAnswerKeyAfterDueDateSelector
        )
        .locator('input');

    return input.getAttribute('name');
};

const getManualGradingLabel = (page: Page, target: ManualGrading) => {
    const input = page
        .locator(target === ManualGrading.On ? manualGradingOnSelector : manualGradingOffSelector)
        .locator('input');

    return input.getAttribute('name');
};

export const cmsExamForm = {
    fillName,
    fillInstruction,
    selectManualGrading,
    fillTimeLimit,
    fillSubmissionAttempt,
    fillGradeToPass,
    selectShowingAnswerKey,
    findValidationError,
    waitForInstruction,
    findManualGradingRadio,
    getShowingAnswerKeyLabel,
    getManualGradingLabel,
};
