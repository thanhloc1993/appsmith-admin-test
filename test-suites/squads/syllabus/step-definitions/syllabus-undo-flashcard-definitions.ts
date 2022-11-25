import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function studentTapUndoLearnButtonInFlashcardLearn(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.tap(new ByValueKey(SyllabusLearnerKeys.flashcardUndoLearnButton(true)));
}
