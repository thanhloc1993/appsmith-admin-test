import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { FlashcardSettingToggleType } from './syllabus-flip-flashcard-steps';
import { ByValueKey } from 'flutter-driver-x';

export async function studentFlipFlashcard(
    learner: LearnerInterface,
    index: number,
    flashcardSettingToggleType: FlashcardSettingToggleType
): Promise<void> {
    const driver = learner.flutterDriver!;
    const flashcardItemKey =
        flashcardSettingToggleType == 'term'
            ? SyllabusLearnerKeys.flashCardItemTerm(index)
            : SyllabusLearnerKeys.flashCardItemDefinition(index);
    await driver.tap(new ByValueKey(flashcardItemKey));
}

export async function studentSeeAFlashcardByType(
    learner: LearnerInterface,
    index: number,
    flashcardSettingToggleType: FlashcardSettingToggleType
): Promise<void> {
    const driver = learner.flutterDriver!;
    const flashcardItemKey =
        flashcardSettingToggleType == 'term'
            ? SyllabusLearnerKeys.flashCardItemTerm(index)
            : SyllabusLearnerKeys.flashCardItemDefinition(index);
    await driver.waitFor(new ByValueKey(flashcardItemKey));
}

export async function studentSeeFlashcardsByType(
    learner: LearnerInterface,
    checkingIndexes: number[],
    flashcardSettingToggleType: FlashcardSettingToggleType
): Promise<void> {
    const driver = learner.flutterDriver!;
    const isTerm = flashcardSettingToggleType == 'term' ? true : false;

    for (let index = 0; index < checkingIndexes.length; index++) {
        const element = checkingIndexes[index];
        await learner.instruction(
            `Student don't see ${flashcardSettingToggleType} cards at position ${element}`,
            async function () {
                const termKey = SyllabusLearnerKeys.flashCardItemTerm(element);
                const definitionKey = SyllabusLearnerKeys.flashCardItemDefinition(element);
                await driver.waitForAbsent(new ByValueKey(isTerm ? termKey : definitionKey));
                await driver.waitFor(new ByValueKey(isTerm ? definitionKey : termKey));
            }
        );
    }
}
