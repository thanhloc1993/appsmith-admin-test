import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { FlashcardSettingToggleType } from './syllabus-flip-flashcard-steps';
import { ByValueKey } from 'flutter-driver-x';

export async function studentSeeFlashcardSettingToggle(
    learner: LearnerInterface,
    flashcardSettingToggleType: FlashcardSettingToggleType
): Promise<void> {
    const driver = learner.flutterDriver!;

    const isShowingTerm = flashcardSettingToggleType == 'term' ? true : false;

    await driver.waitFor(
        new ByValueKey(SyllabusLearnerKeys.flashCardToggleCardList(isShowingTerm))
    );
}

export async function studentSwitchFlashcardSettingToggle(
    learner: LearnerInterface,
    flashcardSettingToggleType: FlashcardSettingToggleType
): Promise<void> {
    const driver = learner.flutterDriver!;

    const switchToTerm = flashcardSettingToggleType == 'term' ? true : false;

    await driver.tap(new ByValueKey(SyllabusLearnerKeys.flashCardToggleCardList(!switchToTerm)));
}
