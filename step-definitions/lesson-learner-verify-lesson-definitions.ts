import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { learnerGoToLesson } from './lesson-learner-join-lesson-definitions';
import { learnerIsInWaitingRoom } from './lesson-student-interacts-in-lesson-waiting-room-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function seesTheNewLessonOnLearnerApp(
    learner: LearnerInterface,
    lessonNames: string[]
) {
    await learnerGoToLesson(learner);

    await seesTheLessonOnLearnerApp(learner, lessonNames);
}

export async function seesTheLessonOnLearnerApp(learner: LearnerInterface, lessonNames: string[]) {
    const driver = learner.flutterDriver!;

    // We need map all lessons to string and use it to check on App
    const names = lessonNames.join('');

    await learner.instruction(`Learner sees the lessons have names ${names}`, async function () {
        const listLessonName = new ByValueKey(LearnerKeys.listLessonsName(names));
        await driver.waitFor(listLessonName);
    });
}

export async function seesWaitingRoomIconOnLearnerApp(learner: LearnerInterface) {
    await learner.instruction('Sees waiting room icon', async function () {
        await learnerIsInWaitingRoom(learner);
    });
}
