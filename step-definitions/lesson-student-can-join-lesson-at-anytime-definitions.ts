import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function learnerCanJoinLiveLesson(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = learner.flutterDriver!;
    const lessonItem = new ByValueKey(VirtualClassroomKeys.liveLessonItem(lessonId, lessonName));
    await driver.waitFor(lessonItem, 20000);

    const joinLessonButton = new ByValueKey(
        VirtualClassroomKeys.joinLiveLessonButton(lessonId, lessonName, true)
    );
    await driver.waitFor(joinLessonButton);
}
