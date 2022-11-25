import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';

import { ByValueKey, delay } from 'flutter-driver-x';
import {
    examErrorHelper,
    timeLimitInput,
    timeLimitValue,
} from 'test-suites/squads/syllabus/step-definitions/cms-selectors/exam-lo';
import { RequiredProperty } from 'test-suites/squads/syllabus/step-definitions/create-exam-with-manual-grading-definitions';
import {
    ExamLODetail,
    schoolAdminFillExamLOInstruction,
    schoolAdminFillExamLOName,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-create-definitions';

export const schoolAdminFillsExamWithTimeLimit = async (
    cms: CMSInterface,
    { name, instruction, timeLimit }: RequiredProperty<ExamLODetail, 'name' | 'instruction'>
) => {
    await schoolAdminFillExamLOName(cms, name);
    await schoolAdminFillExamLOInstruction(cms, instruction);
    await schoolAdminFillsTimeLimit(cms, timeLimit);
};

export const schoolAdminFillsTimeLimit = async (cms: CMSInterface, timeLimit?: number) => {
    await cms.page!.fill(timeLimitInput, timeLimit?.toString() ?? '');
};

export const schoolAdminSeesTimeLimit = async (cms: CMSInterface, timeLimit?: number) => {
    if (timeLimit === undefined) {
        await cms.waitForSelectorHasText(timeLimitValue, '--');
        return;
    }
    await cms.waitForSelectorHasText(timeLimitValue, timeLimit.toString());
};

export const schoolAdminSeesTimeLimitValidationErrorMessage = async (
    cms: CMSInterface,
    message: string
) => {
    await cms.waitForSelectorHasText(examErrorHelper, message);
};

export const studentSeeTimeLimit = async (
    learner: LearnerInterface,
    timeLimit: number | undefined
) => {
    if (timeLimit === undefined) {
        await learner.flutterDriver!.waitForAbsent(
            new ByValueKey(SyllabusLearnerKeys.examLOTimeLimit)
        );
    } else {
        await learner.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.examLOTimeLimit));
        await learner.flutterDriver!.waitFor(
            new ByValueKey(SyllabusLearnerKeys.examLOTimeLimitWithValue(timeLimit))
        );
    }
};

export const studentSeeTimeLimitCountingDownWithKey = async (
    learner: LearnerInterface,
    key: string
) => {
    await learner.flutterDriver!.waitFor(new ByValueKey(key));

    const timeCountText1 = await learner.flutterDriver!.getText(new ByValueKey(key));
    const timeCount1 = convertTimeStringToNumSeconds(timeCountText1);
    await delay(5000);
    const timeCountText2 = await learner.flutterDriver!.getText(new ByValueKey(key));
    const timeCount2 = convertTimeStringToNumSeconds(timeCountText2);
    weExpect(timeCount1 - timeCount2, 'time counting working clearly').toBeLessThanOrEqual(8);
};

export const studentSeesSubmitConfirmationTimeLimit = async (learner: LearnerInterface) => {
    await learner.flutterDriver!.waitFor(
        new ByValueKey(SyllabusLearnerKeys.examLOSubmitBottomSheet)
    );
};

export const studentSeesQuestionContentInSubmitConfirmationTimeLimit = async (
    learner: LearnerInterface,
    finishedQuestionCount: number,
    questionQuantity: number
) => {
    const text = await learner.flutterDriver!.getText(
        new ByValueKey(SyllabusLearnerKeys.examLOTimerQuestionsContent)
    );
    const regex = new RegExp(/(\d{0,2})\/(\d{0,2})/);
    const resultArray = regex.exec(text);
    const actualFinishedQuestionCount = parseInt(resultArray![1]);
    const actualQuestionQuantity = parseInt(resultArray![2]);

    weExpect(actualFinishedQuestionCount).toEqual(finishedQuestionCount);
    weExpect(actualQuestionQuantity).toEqual(questionQuantity);
};

export const studentSeesTimeContentInSubmitConfirmationTimeLimit = async (
    learner: LearnerInterface,
    timeExpected: number
) => {
    const timeCountText = await learner.flutterDriver!.getText(
        new ByValueKey(SyllabusLearnerKeys.examLOTimerTimeLeftContent)
    );
    const timeCount = convertTimeStringToNumSeconds(timeCountText);
    weExpect(timeCount, 'Time must equals').toEqual(timeExpected);
};

//Example: 00:00:00, 00:12:59
export const convertTimeStringToNumSeconds = (text: string): number => {
    const regex = new RegExp(/(\d{0,2}):(\d{0,2}):(\d{0,2})/);
    const resultArray = regex.exec(text);
    const sec = parseInt(resultArray![3]);
    const min = parseInt(resultArray![2]);
    const hour = parseInt(resultArray![1]);

    return sec + min * 60 + hour * 3600;
};
