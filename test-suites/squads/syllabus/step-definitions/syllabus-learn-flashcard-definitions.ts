import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { FlashcardSettingToggleType } from './syllabus-flip-flashcard-steps';
import { ByValueKey } from 'flutter-driver-x';

export async function studentSwipeToLearnCard(
    learner: LearnerInterface,
    index: number,
    flashcardSettingToggleType: FlashcardSettingToggleType,
    isLearn: boolean
): Promise<void> {
    const driver = learner.flutterDriver!;

    const isShowingTerm = flashcardSettingToggleType == 'term' ? true : false;

    const flashcardKey = new ByValueKey(
        isShowingTerm
            ? SyllabusLearnerKeys.flashCardItemTerm(index)
            : SyllabusLearnerKeys.flashCardItemDefinition(index)
    );

    await driver.waitFor(flashcardKey);

    await driver.scroll(flashcardKey, isLearn ? 1000 : -1000, 0, 100, 60);

    await driver.waitForAbsent(flashcardKey);
}

export async function studentTapRestartLearningFlashcard(learner: LearnerInterface): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.tap(new ByValueKey(SyllabusLearnerKeys.flashcardRestartLearningButton));
}

export async function studentTapContinueLearningFlashcard(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.tap(new ByValueKey(SyllabusLearnerKeys.flashcardContinueLearningButton));
}

export async function studentSeeNiceWorkCardInFlashcardLearnScreen(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.flashcardUnfinishedAllLearned));
}

export async function studentSeeCongratulationsCardInFlashcardLearnScreen(
    learner: LearnerInterface
): Promise<void> {
    const driver = learner.flutterDriver!;

    await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.flashcardFinishedAllLearned));
}

export const teacherCheckFlashcardResultCompleted = async (
    teacher: TeacherInterface,
    flashcardName: string
) => {
    const studentFlashcardResultCompleted = new ByValueKey(
        SyllabusTeacherKeys.studentStudyPlanItemStatusCompleted(flashcardName)
    );

    const studyPlanListKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScrollView);

    try {
        await teacher.flutterDriver!.waitFor(studyPlanListKey);

        await teacher.flutterDriver!.waitFor(studentFlashcardResultCompleted, 20000);
    } catch (error) {
        throw Error(`Expect can view item ${flashcardName}`);
    }
};
