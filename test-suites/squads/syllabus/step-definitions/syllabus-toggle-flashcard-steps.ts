import { Given, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasFlashcardSettingToggleType } from './alias-keys/syllabus';
import { FlashcardSettingToggleType } from './syllabus-flip-flashcard-steps';
import {
    studentSeeFlashcardSettingToggle,
    studentSwitchFlashcardSettingToggle,
} from './syllabus-toggle-flashcard-definitions';
import { studentOpenOptionsSectionInFlashcardLearn } from './syllabus-view-flashcard-learn-definitions';

Given(
    `the toggle is showing {string}`,
    async function (
        this: IMasterWorld,
        flashcardSettingToggleType: FlashcardSettingToggleType
    ): Promise<void> {
        const learner = this.learner;
        const context = this.scenario;

        await learner.instruction(
            `student see the toggle is showing ${flashcardSettingToggleType}`,
            async () => {
                await studentSeeFlashcardSettingToggle(learner, flashcardSettingToggleType);
                context.set(aliasFlashcardSettingToggleType, flashcardSettingToggleType);
            }
        );
    }
);

Given(
    `the toggle switches to {string}`,
    async function (
        this: IMasterWorld,
        flashcardSettingToggleType: FlashcardSettingToggleType
    ): Promise<void> {
        const learner = this.learner;
        const context = this.scenario;

        await learner.instruction(
            `student switch the toggle to ${flashcardSettingToggleType}`,
            async () => {
                await studentSwitchFlashcardSettingToggle(learner, flashcardSettingToggleType);
                context.set(aliasFlashcardSettingToggleType, flashcardSettingToggleType);
            }
        );
    }
);

When(
    `student switches the toggle to {string}`,
    async function (
        this: IMasterWorld,
        flashcardSettingToggleType: FlashcardSettingToggleType
    ): Promise<void> {
        const learner = this.learner;
        const context = this.scenario;

        await learner.instruction(
            `student switches the toggle to ${flashcardSettingToggleType}`,
            async () => {
                await studentSwitchFlashcardSettingToggle(learner, flashcardSettingToggleType);
                context.set(aliasFlashcardSettingToggleType, flashcardSettingToggleType);
            }
        );
    }
);

When(
    `student switches the toggle to {string} in Options section`,
    async function (
        this: IMasterWorld,
        flashcardSettingToggleType: FlashcardSettingToggleType
    ): Promise<void> {
        const learner = this.learner;
        const context = this.scenario;

        await learner.instruction(`student opens Options Section`, async () => {
            await studentOpenOptionsSectionInFlashcardLearn(learner);
        });

        await learner.instruction(
            `student switches the toggle to ${flashcardSettingToggleType}`,
            async () => {
                await studentSwitchFlashcardSettingToggle(learner, flashcardSettingToggleType);
                context.set(aliasFlashcardSettingToggleType, flashcardSettingToggleType);
            }
        );
    }
);
