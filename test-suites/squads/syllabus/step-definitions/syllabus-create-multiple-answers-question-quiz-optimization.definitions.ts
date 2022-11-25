import { asyncForEach, createNumberArrayWithLength } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';

import {
    quizAnswerCorrectCheckboxNth,
    quizAnswerEditorInput,
    quizAnswerDeleteBtnNth,
    quizAnswerAddMoreBtnV2,
    quizDifficultSelect,
} from './cms-selectors/cms-keys';
import { schoolAdminSelectTaggedLOsOfQuiz } from './syllabus-create-question-definitions';
import { schoolAdminChooseToCreateQuizWithTypeV2 } from './syllabus-question-utils';
import { QuizBaseInfo } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export const schoolAdminCountAnswerInput = async (cms: CMSInterface) => {
    const elements = await cms.page?.$$(quizAnswerEditorInput);
    return elements?.length || 0;
};

export const schoolAdminDeleteInputAnswers = async (cms: CMSInterface, indexes: number[]) => {
    await asyncForEach(indexes, async (indexValue) => {
        await cms.page?.click(quizAnswerDeleteBtnNth(indexValue + 1));
    });
};

export const schoolAdminSelectCorrectAnswer = async (cms: CMSInterface, index: number) => {
    await cms.page?.locator(quizAnswerCorrectCheckboxNth(index)).check();
};

export const schoolAdminDeselectAllCorrectAnswer = async (cms: CMSInterface) => {
    const totalAnswerInput = await schoolAdminCountAnswerInput(cms);

    await asyncForEach(createNumberArrayWithLength(totalAnswerInput), async (_, index) => {
        await cms.page?.locator(quizAnswerCorrectCheckboxNth(index + 1)).uncheck();
    });
};

export const schoolAdminClickAddMoreAnswer = async (cms: CMSInterface, totalClick: number) => {
    const list = createNumberArrayWithLength(totalClick);

    await asyncForEach<number, void>(list, async () => {
        await cms.selectElementByDataTestId(quizAnswerAddMoreBtnV2);
    });
};

const schoolAdminSelectQuizDifficult = async (
    cms: CMSInterface,
    level: QuizBaseInfo['difficultyLevel']
) => {
    const select = await cms.page?.waitForSelector(quizDifficultSelect);

    await select!.click();

    await cms.chooseOptionInAutoCompleteBoxByDataValue(level.toString());
};

export const schoolAdminFillQuizBaseInfo = async (cms: CMSInterface, baseInfo: QuizBaseInfo) => {
    const { kind, difficultyLevel, taggedLONames } = baseInfo;

    await schoolAdminSelectQuizDifficult(cms, difficultyLevel);

    await schoolAdminChooseToCreateQuizWithTypeV2(cms, kind);

    await schoolAdminSelectTaggedLOsOfQuiz(cms, taggedLONames);
};
