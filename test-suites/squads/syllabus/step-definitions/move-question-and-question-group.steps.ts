import { getExpectIndexAfterMoved, randomOneOfStringType } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import {
    aliasMovedDirection,
    aliasMovedIndex,
    aliasQuestionGroupName,
    aliasQuestionName,
} from './alias-keys/syllabus';
import {
    schoolAdminChooseQuestionsGroupToSwitch,
    schoolAdminChooseQuestionsToSwitch,
    schoolAdminMoveQuestionGroupInDirection,
    schoolAdminMoveQuestionInsideQuestionGroupInDirection,
    schoolAdminSeeQuestionGroupMovedToIndex,
    schoolAdminSeeQuestionsMoveAccordingly,
} from './question-group.definition';
import { MoveDirection } from './types/cms-types';

When(
    'school admin moves the question inside question group in {string} direction',
    async function (directions: string) {
        const moveDirection = randomOneOfStringType<MoveDirection>(directions);

        const { moveIndex, selectedQuestionName, selectedQuestionGroupName } =
            await schoolAdminChooseQuestionsToSwitch(this.cms, moveDirection);

        await this.cms.instruction(
            `School admin chooses the question to be moved at index ${moveIndex} (${selectedQuestionName}) of question group "${selectedQuestionGroupName}"`,
            async () => {
                this.scenario.set(aliasMovedIndex, moveIndex);
                this.scenario.set(aliasQuestionName, selectedQuestionName);
                this.scenario.set(aliasQuestionGroupName, selectedQuestionGroupName);
                this.scenario.set(aliasMovedDirection, moveDirection);
            }
        );

        await this.cms.instruction(
            `School admin moves the question "${selectedQuestionName}" ${moveDirection}`,
            async () => {
                await schoolAdminMoveQuestionInsideQuestionGroupInDirection(
                    this.cms,
                    selectedQuestionName,
                    selectedQuestionGroupName,
                    moveDirection
                );
            }
        );
    }
);

Then('school admin sees questions inside question group are moved accordingly', async function () {
    const currentQuestionGroupIndex = this.scenario.get<number>(aliasMovedIndex);
    const selectedQuestionGroupName = this.scenario.get<string>(aliasQuestionGroupName);
    const selectedQuestionName = this.scenario.get<string>(aliasQuestionName);
    const moveDirection = this.scenario.get<MoveDirection>(aliasMovedDirection);

    const expectedQuestionGroupIndex = getExpectIndexAfterMoved(
        currentQuestionGroupIndex,
        moveDirection
    );

    await this.cms.instruction(
        `School admin sees the question "${selectedQuestionName}" of question group "${selectedQuestionGroupName}" at index ${currentQuestionGroupIndex} is moved to index ${expectedQuestionGroupIndex}`,
        async () => {
            await schoolAdminSeeQuestionsMoveAccordingly(
                this.cms,
                selectedQuestionGroupName,
                selectedQuestionName,
                expectedQuestionGroupIndex
            );
        }
    );
});

When(
    'school admin moves the question group in {string} direction',
    async function (directions: MoveDirection) {
        const moveDirection = randomOneOfStringType<MoveDirection>(directions);

        const { selectedQuestionGroupName, moveIndex } =
            await schoolAdminChooseQuestionsGroupToSwitch(this.cms, moveDirection);

        await this.cms.instruction(
            `School admin chooses the question group to be moved at index ${moveIndex} (${selectedQuestionGroupName})`,
            async () => {
                this.scenario.set(aliasMovedIndex, moveIndex);
                this.scenario.set(aliasQuestionName, selectedQuestionGroupName);
                this.scenario.set(aliasMovedDirection, moveDirection);
            }
        );

        await this.cms.instruction(
            `School admin moves question group "${selectedQuestionGroupName}" at index ${moveIndex} ${moveDirection}`,
            async () => {
                await schoolAdminMoveQuestionGroupInDirection(
                    this.cms,
                    selectedQuestionGroupName,
                    moveDirection
                );
            }
        );
    }
);

Then('school admin sees the question group is moved accordingly', async function () {
    const currentQuestionGroupIndex = this.scenario.get<number>(aliasMovedIndex);
    const selectedQuestionGroupName = this.scenario.get(aliasQuestionName);
    const moveDirection = this.scenario.get<MoveDirection>(aliasMovedDirection);

    const expectedQuestionGroupIndex = getExpectIndexAfterMoved(
        currentQuestionGroupIndex,
        moveDirection
    );

    await this.cms.instruction(
        `School admin sees the question group "${selectedQuestionGroupName}" at index ${currentQuestionGroupIndex} is moved to index ${expectedQuestionGroupIndex}`,
        async () => {
            await schoolAdminSeeQuestionGroupMovedToIndex(
                this.cms,
                selectedQuestionGroupName,
                expectedQuestionGroupIndex
            );
        }
    );
});
