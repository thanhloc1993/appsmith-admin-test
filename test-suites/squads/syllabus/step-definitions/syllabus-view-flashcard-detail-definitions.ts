import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { FlashcardSettingToggleType } from './syllabus-flip-flashcard-steps';
import { ByValueKey } from 'flutter-driver-x';

export async function studentSeeFlashcardDetailScreen(
    learner: LearnerInterface,
    flashcardName: string,
    flashcardQuizLength: number
): Promise<void> {
    const driver = learner.flutterDriver!;

    await learner.instruction(
        `student see flashcard detail screen with ${flashcardName}`,
        async function () {
            await driver.waitFor(
                new ByValueKey(SyllabusLearnerKeys.flash_card_preview_screen(flashcardName))
            );
        }
    );

    await learner.instruction(
        `student see ${flashcardQuizLength} card as total card`,
        async function () {
            await driver.waitFor(
                new ByValueKey(SyllabusLearnerKeys.flashCardTotalCard(flashcardQuizLength))
            );
            await driver.waitFor(
                new ByValueKey(SyllabusLearnerKeys.flashCardListWithTotalCard(flashcardQuizLength))
            );
        }
    );

    await learner.instruction(`student see TERM card list as default`, async function () {
        await studentSeeFlashcardListWithType(learner, 'term');
    });
}

export async function studentSeeFlashcardListWithType(
    learner: LearnerInterface,
    flashcardSettingToggleType: FlashcardSettingToggleType
): Promise<void> {
    const driver = learner.flutterDriver!;
    await driver.waitFor(
        new ByValueKey(
            SyllabusLearnerKeys.flashCardToggleCardList(flashcardSettingToggleType == 'term')
        )
    );
}

export async function studentSelectsTestButtonInFlashcardDetailPage(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    const testButtonKey = new ByValueKey(SyllabusLearnerKeys.next_quiz_button);

    await driver.tap(testButtonKey);
}
