import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function learnerCanNotJoinLessonOnLearnerApp(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
): Promise<void> {
    const driver = learner.flutterDriver!;
    const lessonItem = new ByValueKey(VirtualClassroomKeys.liveLessonItem(lessonId, lessonName));
    await driver.waitFor(lessonItem);

    const joinLessonButton = new ByValueKey(
        VirtualClassroomKeys.joinLiveLessonButton(lessonId, lessonName, false)
    );
    await driver.waitFor(joinLessonButton);
}
