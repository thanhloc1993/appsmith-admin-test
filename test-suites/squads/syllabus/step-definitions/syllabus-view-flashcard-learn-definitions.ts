import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { waitForLoadingAbsent } from './syllabus-utils';
import { FlashcardUndoLearnButtonStatus } from './syllabus-view-flashcard-learn-steps';
import { ByValueKey } from 'flutter-driver-x';

export async function studentGoesToFlashcardLearnPage(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    const learnButtonKey = new ByValueKey(SyllabusLearnerKeys.flashcardLearnButton);

    await driver.tap(learnButtonKey);

    await waitForLoadingAbsent(driver, 20000);
}

export async function studentGoesToFlashcardPracticePage(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    const practiceButtonKey = new ByValueKey(SyllabusLearnerKeys.next_quiz_button);

    await driver.tap(practiceButtonKey);
}

export async function studentSeeFlashcardLearnScreen(
    learner: LearnerInterface,
    flashcardName: string
): Promise<void> {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        `student see Flashcard Learn screen with ${flashcardName}`,
        async function (this: LearnerInterface) {
            await driver.waitFor(
                new ByValueKey(SyllabusLearnerKeys.flash_card_practice_screen(flashcardName))
            );
        }
    );

    await learner.instruction(
        `student see 1st card with showing definition as default`,
        async function (this: LearnerInterface) {
            await studentSeeFlashcardPracticeAtPosition(learner, 0, false);
        }
    );
}

export async function studentSeeFlashcardPracticeAtPosition(
    learner: LearnerInterface,
    cardPosition: number,
    isTerm: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    const flashcardItemKey = isTerm
        ? SyllabusLearnerKeys.flashCardItemTerm(cardPosition)
        : SyllabusLearnerKeys.flashCardItemDefinition(cardPosition);

    await driver.waitFor(new ByValueKey(flashcardItemKey));
}

export async function studentSeeProgressFlashcard(
    learner: LearnerInterface,
    currentProgress: number,
    totalLength: number
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitFor(
        new ByValueKey(SyllabusLearnerKeys.flashcardHeaderProgress(currentProgress, totalLength))
    );
}

export async function studentSeeSkippedTotalCards(
    learner: LearnerInterface,
    skippedCards: number
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitFor(
        new ByValueKey(SyllabusLearnerKeys.flashCardTotalSkippedCards(skippedCards))
    );
}

export async function studentSeeRememberedTotalCards(
    learner: LearnerInterface,
    rememberedCards: number
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitFor(
        new ByValueKey(SyllabusLearnerKeys.flashCardTotalRememberedCards(rememberedCards))
    );
}

export async function studentOpenOptionsSectionInFlashcardLearn(
    learner: LearnerInterface
): Promise<void> {
    await studentTapOptionsBottomButtonInFlashcardLearn(learner);

    await studentSeeOptionsBottomModalInFlashcardLearn(learner);
}

export async function studentDoesNotSeeOptionsBottomButtonInFlashcardLearn(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitForAbsent(new ByValueKey(SyllabusLearnerKeys.flashcardOptionsBottomButton));
}

export async function studentTapOptionsBottomButtonInFlashcardLearn(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.tap(new ByValueKey(SyllabusLearnerKeys.flashcardOptionsBottomButton));
}

export async function studentSeeOptionsBottomModalInFlashcardLearn(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.flashcardOptionsBottomModal));
}

export async function studentSeeStatusFlashcardUndoButton(
    learner: LearnerInterface,
    flashcardUndoLearnButtonStatus: FlashcardUndoLearnButtonStatus
): Promise<void> {
    const driver = learner.flutterDriver!;

    switch (flashcardUndoLearnButtonStatus) {
        case 'enabled':
            await driver.waitFor(
                new ByValueKey(SyllabusLearnerKeys.flashcardUndoLearnButton(true))
            );
            break;
        case 'disabled':
            await driver.waitFor(
                new ByValueKey(SyllabusLearnerKeys.flashcardUndoLearnButton(false))
            );
            break;
        case 'disappeared':
            await driver.waitForAbsent(
                new ByValueKey(SyllabusLearnerKeys.flashcardUndoLearnButton(true))
            );
            await driver.waitForAbsent(
                new ByValueKey(SyllabusLearnerKeys.flashcardUndoLearnButton(false))
            );
            break;
    }
}

export async function studentSelectsTestButtonInFlashcardLearnPage(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    const testButtonKey = new ByValueKey(SyllabusLearnerKeys.flashcardTestMemoryButton);

    await driver.tap(testButtonKey);
}
