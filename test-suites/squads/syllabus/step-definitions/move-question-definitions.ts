import { draftEditor } from '@legacy-step-definitions/cms-selectors/cms-keys';
import { questionGroupListRoot } from '@legacy-step-definitions/cms-selectors/syllabus';

import { CMSInterface } from '@supports/app-types';
import { MoveDirection } from '@supports/types/cms-types';

import {
    moveDownBase,
    moveUpBase,
    questionListTable,
    questionRow,
    tableBaseRow,
} from './cms-selectors/cms-keys';
import { questionListItemRoot } from './cms-selectors/syllabus';
import { checkIsQuestionGroupEnabled } from './syllabus-migration-temp';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

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
    const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();

    const moveSelector = direction === 'up' ? moveUpBase : moveDownBase;

    const questionRowSelector = isQuestionGroupEnabled ? questionListItemRoot : tableBaseRow;

    const questionRowElement = await cms.waitForSelectorHasText(questionRowSelector, questionName);

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
