import { getExpectIndexAfterMoved } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { MoveDirection, Position } from '@supports/types/cms-types';

import { aliasQuizQuestionNames } from './alias-keys/syllabus';
import {
    schoolAdminGetQuestionWillBeMove,
    schoolAdminMovesQuestionInQuizTable,
    schoolAdminSeesQuestionAtIndexInQuizTable,
} from './move-question-definitions';
import { schoolAdminWaitingQuizTableInTheLODetail } from './syllabus-question-utils';

const aliasQuestionNameMoved = `aliasQuestionNameMoved`;
const aliasQuestionIndexMoved = `aliasQuestionIndexMoved`;
const aliasQuestionExpectIndexMoved = `aliasQuestionExpectIndexMoved`;

Given('school admin selects a question is not at {string}', async function (position: Position) {
    const questionNames = this.scenario.get<string[]>(aliasQuizQuestionNames);

    const direction: MoveDirection = position === 'top' ? 'up' : 'down';

    await schoolAdminWaitingQuizTableInTheLODetail(this.cms);
    await this.cms.waitForSkeletonLoading();

    const { moveIndex, name } = await schoolAdminGetQuestionWillBeMove(
        this.cms,
        questionNames.length,
        direction
    );

    await this.cms.instruction(
        `school admin selects ${name} at index ${moveIndex} to move ${direction}`,
        async () => {
            this.scenario.set(aliasQuestionIndexMoved, moveIndex);
            this.scenario.set(aliasQuestionNameMoved, name);
        }
    );
});

When('school admin moves that question {string}', async function (direction: MoveDirection) {
    const moveIndex = this.scenario.get<number>(aliasQuestionIndexMoved);
    const questionName = this.scenario.get(aliasQuestionNameMoved);

    await this.cms.instruction(
        `school admin moves ${questionName} at index ${moveIndex} ${direction}`,
        async () => {
            await schoolAdminMovesQuestionInQuizTable(this.cms, questionName, direction);
        }
    );

    await this.cms.waitForSkeletonLoading();

    this.scenario.set(
        aliasQuestionExpectIndexMoved,
        getExpectIndexAfterMoved(moveIndex, direction)
    );
});

Then(
    'school admin sees that question is moved {string} on CMS',
    async function (direction: MoveDirection) {
        const questionName = this.scenario.get(aliasQuestionNameMoved);
        const expectIndex = this.scenario.get<number>(aliasQuestionExpectIndexMoved);

        await this.cms.instruction(
            `school admin sees ${questionName} moved ${direction} at index ${expectIndex}`,
            async () => {
                await schoolAdminSeesQuestionAtIndexInQuizTable(
                    this.cms,
                    questionName,
                    expectIndex
                );
            }
        );
    }
);
