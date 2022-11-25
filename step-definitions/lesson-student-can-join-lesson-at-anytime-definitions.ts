import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerCanJoinLiveLesson(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = learner.flutterDriver!;
    const lessonItem = new ByValueKey(LearnerKeys.lessonItem(lessonId, lessonName));
    await driver.waitFor(lessonItem, 20000);

    const joinLessonButton = new ByValueKey(
        LearnerKeys.joinLiveLessonButton(lessonId, lessonName, true)
    );
    await driver.waitFor(joinLessonButton);
}
