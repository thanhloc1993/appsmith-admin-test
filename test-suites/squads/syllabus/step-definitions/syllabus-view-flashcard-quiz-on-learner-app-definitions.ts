import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { studentWaitingQuizScreen } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function studentSeesFlashcardQuizScreen(
    learner: LearnerInterface,
    flashcardName: string
): Promise<void> {
    await studentWaitingQuizScreen(learner, flashcardName);
}

export async function studentSeesNthCardInFlashcardQuizScreen(
    learner: LearnerInterface,
    index: number
): Promise<void> {
    const driver = learner.flutterDriver!;
    const currentQuizNumber = new ByValueKey(SyllabusLearnerKeys.currentQuizNumber(index));

    await driver.runUnsynchronized(async () => {
        await driver.waitFor(currentQuizNumber);
    });
}
