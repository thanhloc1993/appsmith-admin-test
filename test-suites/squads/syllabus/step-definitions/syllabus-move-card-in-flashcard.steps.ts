import { getExpectIndexAfterMoved } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { MoveDirection, Position } from '@supports/types/cms-types';

import {
    aliasContentBookLOQuestionQuantity,
    aliasCourseId,
    aliasFlashcardName,
} from './alias-keys/syllabus';
import {
    teacherGoToCourseStudentDetail,
    teacherWaitingForStudyPlanListVisible,
} from './create-course-studyplan-definitions';
import {
    studentSeesTermOrDefinitionOfCardInFlashCard,
    teacherSeesTermOfCardInFlashCard,
} from './syllabus-card-flashcard-common-definitions';
import { schoolAdminSeeTermOfCardInFlashcard } from './syllabus-create-card-in-flashcard-definition';
import { teacherGoesToStudyPlanItemDetails } from './syllabus-create-question-definitions';
import {
    getCardWillBeMoveInFlashcard,
    schoolAdminMoveCardInFlashcard,
} from './syllabus-move-card-in-flashcard.definitions';

const aliasCardInFlashcardNameMoved = `aliasCardInFlashcardNameMoved`;
const aliasCardIndexInFlashcardMoved = `aliasCardIndexInFlashcardMoved`;
const aliasCardExpectIndexInFlashcardMoved = `aliasCardExpectIndexInFlashcardMoved`;

When('the card is not at {string}', async function (position: Position) {
    const direction: MoveDirection = position === 'top' ? 'up' : 'down';

    const cardAvailableTotal = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);

    const { moveIndex, name } = await getCardWillBeMoveInFlashcard(
        this.cms,
        direction,
        cardAvailableTotal
    );

    this.scenario.set(aliasCardInFlashcardNameMoved, name);
    this.scenario.set(aliasCardIndexInFlashcardMoved, moveIndex);
    this.scenario.set(
        aliasCardExpectIndexInFlashcardMoved,
        getExpectIndexAfterMoved(moveIndex, direction)
    );
});

Then('school admin moves card {string}', async function (direction: MoveDirection) {
    const moveIndex = this.scenario.get<number>(aliasCardIndexInFlashcardMoved);
    const name = this.scenario.get(aliasCardInFlashcardNameMoved);

    const instruction = `User will move ${direction} card ${name} at index ${moveIndex}`;

    await this.cms.instruction(instruction, async () => {
        await schoolAdminMoveCardInFlashcard(this.cms, moveIndex, direction);
    });
});

Then('school admin sees card is moved {string} on CMS', async function (direction: MoveDirection) {
    const name = this.scenario.get(aliasCardInFlashcardNameMoved);
    const movedIndexExpect = this.scenario.get<number>(aliasCardExpectIndexInFlashcardMoved);

    const instruction = `User will see card ${name} at index ${movedIndexExpect} after move ${direction}`;

    await this.cms.instruction(instruction, async () => {
        await schoolAdminSeeTermOfCardInFlashcard(this.cms, name, movedIndexExpect);
    });
});

Then(
    'student sees card is moved {string} in Flashcard Detail screen',
    async function (direction: MoveDirection) {
        const name = this.scenario.get(aliasCardInFlashcardNameMoved);
        const movedIndexExpect = this.scenario.get<number>(aliasCardExpectIndexInFlashcardMoved);

        const instruction = `Student sees card ${name} at index ${movedIndexExpect} after move ${direction}`;

        await this.learner.instruction(instruction, async () => {
            await studentSeesTermOrDefinitionOfCardInFlashCard(
                this.learner,
                'term',
                name,
                movedIndexExpect
            );
        });
    }
);

Then(
    'teacher sees card is moved {string} on Teacher App',
    async function (direction: MoveDirection) {
        const courseId = await this.scenario.get(aliasCourseId);
        const flashcardName = this.scenario.get(aliasFlashcardName);
        const name = this.scenario.get(aliasCardInFlashcardNameMoved);
        const movedIndexExpect = this.scenario.get<number>(aliasCardExpectIndexInFlashcardMoved);

        const learnerProfile = await this.learner.getProfile();

        await this.teacher.instruction(
            `Teacher goes to the course student detail: ${learnerProfile.name}`,
            async () => {
                await teacherGoToCourseStudentDetail(this.teacher, courseId, learnerProfile.id);
                await teacherWaitingForStudyPlanListVisible(this.teacher);
            }
        );

        await this.teacher.instruction(`Teacher open flashcard detail`, async () => {
            await teacherGoesToStudyPlanItemDetails(this.teacher, flashcardName);
        });

        const instruction = `Teacher sees card ${name} at index ${movedIndexExpect} after move ${direction}`;

        await this.teacher.instruction(instruction, async () => {
            await teacherSeesTermOfCardInFlashCard(this.teacher, name, movedIndexExpect);
        });
    }
);
