import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface } from '../supports/app-types';
import { LearnerKeys } from './learner-keys/learner-key';
import { learnerJoinsLessonSuccessfully } from './lesson-student-interacts-in-lesson-waiting-room-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerJoinsLesson(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
): Promise<void> {
    await learnerGoToLesson(learner);
    await learnerClickJoinLesson(learner, lessonId, lessonName);
}

export async function interactiveEndLessonLearner(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    await learner.instruction('learner ends lesson', async function () {
        const endLessonButton = new ByValueKey(LearnerKeys.endLessonButton);
        await driver.tap(endLessonButton);

        const endLessonDialog = new ByValueKey(LearnerKeys.endLessonDialog);
        await driver.waitFor(endLessonDialog);

        const endNowButton = new ByValueKey(LearnerKeys.endNowButton);
        await driver.tap(endNowButton);
    });
}

export async function learnerGoToLesson(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    if (!driver.isApp()) {
        await learner.instruction('learner tap drawer', async function () {
            const drawerButton = new ByValueKey(LearnerKeys.homeScreenDrawerButton);
            await driver.tap(drawerButton);
        });
    }

    await learner.instruction('learner tap lesson tab', async function () {
        const lessonTab = new ByValueKey(LearnerKeys.lesson_tab);
        await driver.tap(lessonTab);
    });
}

export async function learnerClickJoinLesson(
    learner: LearnerInterface,
    lessonId: string,
    lessonName: string
) {
    const driver = learner.flutterDriver!;
    await learner.instruction(
        `learner tap join lesson ${lessonName}, ID: ${lessonId}`,
        async function () {
            const lessonItem = new ByValueKey(
                VirtualClassroomKeys.liveLessonItem(lessonId, lessonName)
            );
            await driver.waitFor(lessonItem, 20000);

            const joinLessonButton = new ByValueKey(
                VirtualClassroomKeys.joinLiveLessonButton(lessonId, lessonName, true)
            );
            await driver.tap(joinLessonButton);
        }
    );
}

export async function learnerDisplayAllTeacherCamera(this: LearnerInterface): Promise<void> {
    const driver = this.flutterDriver!;
    await this.instruction('learner join lesson has teacher started', async function (learner) {
        await learnerJoinsLessonSuccessfully(learner);
    });

    await this.instruction('learner join lesson has teacher started', async function () {
        await driver.waitFor(new ByValueKey(LearnerKeys.listCameraView), 20000);
    });
}
