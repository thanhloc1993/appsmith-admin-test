import { Page } from 'playwright';

import { CMSInterface } from '@supports/app-types';

import { getTestId } from 'test-suites/squads/syllabus/utils/common';

const nameSelector = getTestId('ExamDetailInstruction__examNameLabelValue');
const instructionSelector = getTestId('ExamDetailInstruction__examInstructionLabelValue');
const manualGradingSelector = getTestId('ExamDetailInstruction__manualGradingValue');
const gradeToPassSelector = getTestId('ExamDetailInstruction__gradeToPassValue');
const timeLimitSelector = getTestId('ExamDetailInstruction__timeLimitValue');
const questionTabSelector = getTestId('ExamDetail__questionsTab');
const detailTabSelector = getTestId('ExamDetail__detailsTab');
const addQuestionSelector = getTestId('ExamQuestions__buttonAddQuestions');
const showingAnswerKeySelector = getTestId('ExamDetailInstruction__showAnswerKeyValue');
const submissionAttemptSelector = getTestId('ExamDetailInstruction__submissionAttemptValue');

const findName = async (cms: CMSInterface, value: string) => {
    await cms.waitForSelectorHasText(nameSelector, value);
};

const findInstruction = async (cms: CMSInterface, value: string) => {
    await cms.waitForSelectorHasText(instructionSelector, value);
};

const findManualGrading = async (cms: CMSInterface, value: string) => {
    await cms.waitForSelectorHasText(manualGradingSelector, value);
};

const findSettingValue = async (cms: CMSInterface, selector: string, value?: number) => {
    if (value === undefined) {
        await cms.waitForSelectorHasText(selector, '--');

        return;
    }

    await cms.waitForSelectorHasText(selector, value.toString());
};

const findGradeToPass = async (cms: CMSInterface, value?: number) => {
    await findSettingValue(cms, gradeToPassSelector, value);
};

const findTimeLimit = async (cms: CMSInterface, value?: number) => {
    await findSettingValue(cms, timeLimitSelector, value);
};

const selectQuestionTab = async (page: Page) => {
    await page.click(questionTabSelector);
};

const selectDetailTab = async (page: Page) => {
    await page.click(detailTabSelector);
};

const waitForQuestionTab = async (page: Page) => {
    await page.waitForSelector(questionTabSelector);
};

const clickAddQuestion = async (page: Page) => {
    await page.click(addQuestionSelector);
};

const findShowingAnswerKey = async (cms: CMSInterface, value: string) => {
    await cms.waitForSelectorHasText(showingAnswerKeySelector, value);
};

const findSubmissionAttempt = async (cms: CMSInterface, value?: number) => {
    await findSettingValue(cms, submissionAttemptSelector, value);
};

export const cmsExamDetail = {
    findName,
    findInstruction,
    findManualGrading,
    findGradeToPass,
    findTimeLimit,
    selectQuestionTab,
    selectDetailTab,
    waitForQuestionTab,
    clickAddQuestion,
    findShowingAnswerKey,
    findSubmissionAttempt,
};
