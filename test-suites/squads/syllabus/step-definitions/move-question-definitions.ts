import { draftEditor } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { questionGroupListRoot } from '@legacy-step-definitions/cms-selectors/syllabus';
import { randomInteger } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { MoveDirection } from '@supports/types/cms-types';

import {
    questionListTable,
    questionRow,
    quizMoveDown,
    quizMoveUp,
    tableBaseRow,
} from './cms-selectors/cms-keys';
import { checkIsQuestionGroupEnabled } from './syllabus-migration-temp';

export const schoolAdminGetQuestionWillBeMove = async (
    cms: CMSInterface,
    totalQuestions: number,
    direction: MoveDirection
) => {
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();

    let moveIndex = randomInteger(0, totalQuestions - 2);
    if (direction === 'up') moveIndex = randomInteger(1, totalQuestions - 1);

    const questionGroupList = await cms.page!.waitForSelector(
        isQuestionGroupEnabled ? questionGroupListRoot : questionListTable
    );

    const questionItems = await questionGroupList.$$(
        `${isQuestionGroupEnabled ? draftEditor : questionRow}`
    );

    const name = await questionItems[moveIndex].textContent();

    if (!name) throw new Error(`Cannot get the question content at index ${moveIndex}`);

    return { moveIndex, name };
};

export const schoolAdminMovesQuestionInQuizTable = async (
    cms: CMSInterface,
    questionName: string,
    direction: MoveDirection
) => {
    const moveSelector = direction === 'up' ? quizMoveUp : quizMoveDown;

    const questionRowElement = await cms.waitForSelectorHasText(tableBaseRow, questionName);

    const moveElement = await questionRowElement!.waitForSelector(moveSelector);

    await moveElement.click();
};

export const schoolAdminSeesQuestionAtIndexInQuizTable = async (
    cms: CMSInterface,
    questionName: string,
    index: number
) => {
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();
    const questionGroupListSelector = isQuestionGroupEnabled
        ? questionGroupListRoot
        : questionListTable;
    const questionItemSelector = `${isQuestionGroupEnabled ? draftEditor : questionRow}`;

    const questionGroupList = await cms.page!.waitForSelector(questionGroupListSelector);
    const questionItems = await questionGroupList.$$(questionItemSelector);

    await questionItems[index].waitForSelector(`:has-text("${questionName}")`);
};
