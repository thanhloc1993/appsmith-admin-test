import { questionListItemByText } from '@legacy-step-definitions/cms-selectors/syllabus';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { aliasQuizQuestionName, aliasQuizQuestionNames } from './alias-keys/syllabus';
import {
    optionsButton,
    questionListTable,
    saveButton,
    tableRowByText,
} from './cms-selectors/cms-keys';
import { quizPreviewDeleteBtn } from './cms-selectors/syllabus';
import {
    getQuizTypeNumberFromModel,
    studentDoesQuizQuestion,
    studentSubmitsQuizAnswer,
    teacherDoesNotSeeQuizQuestion,
    teacherGoesToSeeNextQuizQuestion,
    teacherSeesQuizQuestion,
} from './syllabus-create-question-definitions';
import { checkIsQuestionGroupEnabled } from './syllabus-migration-temp';
import { getQuizTypeValue } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export const schoolAdminClicksQuestionOptions = async (cms: CMSInterface, questionName: string) => {
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();
    const selector = isQuestionGroupEnabled
        ? questionListItemByText(questionName)
        : tableRowByText(questionListTable, questionName);

    const questionOptionsButton = await cms
        .page!.waitForSelector(selector)
        .then((questionRow) => questionRow.waitForSelector(optionsButton));

    await questionOptionsButton.click();
};

export const schoolAdminDeletesAQuestion = async (cms: CMSInterface, confirm = true) => {
    await cms.selectAButtonByAriaLabel(`Delete`);
    if (confirm) await cms.page!.click(saveButton);
};

export const schoolAdminWaitingDeleteQuestionDialogHidden = async (cms: CMSInterface) => {
    await cms.page?.waitForSelector(saveButton, { state: 'detached' });
};

export async function schoolAdminDoesNotSeeQuestion(
    cms: CMSInterface,
    questionName: string
): Promise<void> {
    try {
        const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();
        const selector = isQuestionGroupEnabled
            ? questionListItemByText(questionName)
            : tableRowByText(questionListTable, questionName);

        await cms.page!.waitForSelector(selector, {
            timeout: 500,
        });
        throw new Error(`Question ${questionName} should not be seen on CMS`);
    } catch (e) {
        console.log(`Deleted question ${questionName} disappears on CMS`);
    }
}

export async function studentDoesNotSeeQuestion(
    learner: LearnerInterface,
    scenario: ScenarioContext
): Promise<void> {
    const driver = learner.flutterDriver!;
    const bookQuestionNames = scenario.get<string[]>(aliasQuizQuestionNames);
    const deletedQuestionName = scenario.get<string>(aliasQuizQuestionName);

    for (const questionName of bookQuestionNames) {
        try {
            await driver.waitForAbsent(
                new ByValueKey(SyllabusLearnerKeys.quiz_screen(deletedQuestionName))
            );
        } catch (e) {
            throw new Error(`Student still see the deleted question ${deletedQuestionName}`);
        }

        const quizNumber = getQuizTypeNumberFromModel(scenario, questionName);
        await studentDoesQuizQuestion(learner, quizNumber!, questionName);
        await studentSubmitsQuizAnswer(learner, questionName);
    }
}

export async function teacherDoesNotSeeQuestion(
    teacher: TeacherInterface,
    scenario: ScenarioContext
): Promise<void> {
    const bookQuestionNames = scenario.get<string[]>(aliasQuizQuestionNames);
    const deletedQuestionName = scenario.get<string>(aliasQuizQuestionName);

    for (let i = 0; i < bookQuestionNames.length; i++) {
        const questionName = bookQuestionNames[i];
        const quizTypeNumber = getQuizTypeNumberFromModel(scenario, questionName);
        const { quizTypeTitle } = getQuizTypeValue({ quizTypeNumber });
        const quizTitle = quizTypeTitle;

        // Does not see deleted question
        await teacherDoesNotSeeQuizQuestion(teacher, deletedQuestionName, quizTitle);

        // Can see and do question in book content
        await teacherSeesQuizQuestion(teacher, questionName, quizTitle);

        if (i < bookQuestionNames.length - 1) {
            await teacherGoesToSeeNextQuizQuestion(teacher);
        }
    }
}

export const schoolAdminSelectsDeleteQuestionInReview = async (cms: CMSInterface) => {
    await cms.selectElementByDataTestId(quizPreviewDeleteBtn);
};
