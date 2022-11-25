import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasContentBookLOQuestionQuantity,
    aliasFlashcardCurrentLearningIndex,
    aliasFlashcardSettingToggleType,
} from './alias-keys/syllabus';
import {
    studentFlipFlashcard,
    studentSeeAFlashcardByType,
    studentSeeFlashcardsByType,
} from './syllabus-flip-flashcard-definitions';

export type FlashcardSettingToggleType = 'term' | 'definition';

Given(
    `the card is showing {string}`,
    async function (
        this: IMasterWorld,
        flashcardSettingToggleType: FlashcardSettingToggleType
    ): Promise<void> {
        const learner = this.learner;
        const context = this.scenario;
        const flashcardCurrentLearningIndex =
            context.get<number>(aliasFlashcardCurrentLearningIndex) ?? 0;
        await this.learner.instruction(
            `Student see ${flashcardSettingToggleType} card at position ${flashcardCurrentLearningIndex}`,
            async () => {
                await studentSeeAFlashcardByType(
                    learner,
                    flashcardCurrentLearningIndex,
                    flashcardSettingToggleType
                );
                context.set(aliasFlashcardSettingToggleType, flashcardSettingToggleType);
            }
        );
    }
);

Given(
    `the card flips to {string}`,
    async function (
        this: IMasterWorld,
        flashcardSettingToggleType: FlashcardSettingToggleType
    ): Promise<void> {
        const learner = this.learner;
        const context = this.scenario;
        const reverseFlashcardSettingToggleType: FlashcardSettingToggleType =
            flashcardSettingToggleType == 'term' ? 'definition' : 'term';
        const flashcardCurrentLearningIndex =
            context.get<number>(aliasFlashcardCurrentLearningIndex) ?? 0;
        await this.learner.instruction(
            `Student flip card at position ${flashcardCurrentLearningIndex}`,
            async () => {
                await studentFlipFlashcard(
                    learner,
                    flashcardCurrentLearningIndex,
                    reverseFlashcardSettingToggleType
                );
            }
        );

        await this.learner.instruction(
            `Student see ${flashcardSettingToggleType} card at position ${flashcardCurrentLearningIndex}`,
            async () => {
                await studentSeeAFlashcardByType(
                    learner,
                    flashcardCurrentLearningIndex,
                    flashcardSettingToggleType
                );
                context.set(aliasFlashcardSettingToggleType, flashcardSettingToggleType);
            }
        );
    }
);

When(`student flips the card`, async function (): Promise<void> {
    const learner = this.learner;
    const context = this.scenario;
    const flashcardSettingToggleType = context.get<FlashcardSettingToggleType>(
        aliasFlashcardSettingToggleType
    );
    const flashcardCurrentLearningIndex =
        context.get<number>(aliasFlashcardCurrentLearningIndex) ?? 0;
    await this.learner.instruction(
        `Student flip ${flashcardSettingToggleType} card at position ${flashcardCurrentLearningIndex}`,
        async () => {
            await studentFlipFlashcard(
                learner,
                flashcardCurrentLearningIndex,
                flashcardSettingToggleType
            );
        }
    );
});

Then(
    `student sees the {string} of that card`,
    async function (
        this: IMasterWorld,
        flashcardSettingToggleType: FlashcardSettingToggleType
    ): Promise<void> {
        const learner = this.learner;
        const context = this.scenario;
        const flashcardCurrentLearningIndex =
            context.get<number>(aliasFlashcardCurrentLearningIndex) ?? 0;
        await this.learner.instruction(
            `Student see ${flashcardSettingToggleType} card at position ${flashcardCurrentLearningIndex}`,
            async () => {
                await studentSeeAFlashcardByType(
                    learner,
                    flashcardCurrentLearningIndex,
                    flashcardSettingToggleType
                );
            }
        );
    }
);

Then(
    `student can not see the {string} of other cards`,
    async function (
        this: IMasterWorld,
        flashcardSettingToggleType: FlashcardSettingToggleType
    ): Promise<void> {
        const learner = this.learner;
        const context = this.scenario;

        const flashcardCurrentLearningIndex =
            context.get<number>(aliasFlashcardCurrentLearningIndex) ?? 0;
        const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);
        const questionIndexes: number[] = [...Array(questionQuantity).keys()].filter(
            (value) => value != flashcardCurrentLearningIndex
        );

        await studentSeeFlashcardsByType(learner, questionIndexes, flashcardSettingToggleType);
    }
);
