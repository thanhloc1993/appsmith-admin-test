import { LearnerKeys } from '@common/learner-key';
import { TeacherKeys } from '@common/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { teacherSeesCameraViewInGalleryViewOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/turn-on-speaker-and-camera-definitions';
import {
    goToLiveLessonDetailOnTeacherApp,
    teacherJoinsLesson,
} from 'test-suites/squads/virtual-classroom/utils/navigation';

export async function whenTeacherJoinsLessonOfLessonManagement(params: {
    teacher: TeacherInterface;
    courseId: string;
    lessonId: string;
    isFirstTeacher: boolean;
}) {
    const { teacher, isFirstTeacher, courseId, lessonId } = params;

    await goToLiveLessonDetailOnTeacherApp({ teacher, courseId, lessonId });
    await teacherJoinsLesson(teacher, isFirstTeacher);
}

export async function teacherJoinedLessonSuccess(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await teacher.instruction('Teacher go to live stream screen', async function () {
        await driver.waitFor(new ByValueKey(TeacherKeys.liveStreamScreen), 15000);
        await driver.waitForAbsent(new ByValueKey(TeacherKeys.waitingRoomBanner), 15000);
    });
}

export async function teacherSeesItselfStreamInGalleryViewOnTeacherApp(
    teacher: TeacherInterface,
    userId: string
) {
    await teacherSeesCameraViewInGalleryViewOnTeacherApp(teacher, userId, true);
}

export async function interactiveEndLessonTeacher(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await teacher.instruction('Teacher leaves lesson', async function () {
        const endLessonButton = new ByValueKey(TeacherKeys.endLessonButton);
        await driver.tap(endLessonButton);

        const endLessonDialog = new ByValueKey(TeacherKeys.endLessonDialog);
        await driver.waitFor(endLessonDialog);

        const leaveButton = new ByValueKey(TeacherKeys.leaveLessonButton);
        await driver.tap(leaveButton);
    });
}

export async function teacherInteractOnTeacherApp(teacher: TeacherInterface, interaction: boolean) {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(`Teacher can interact: ${interaction}`, async function () {
        const microButton = new ByValueKey(
            TeacherKeys.microButtonLiveLessonInteraction(interaction)
        );
        await driver.waitFor(microButton);

        const shareMaterialButton = new ByValueKey(
            TeacherKeys.shareMaterialButtonInteraction(interaction)
        );
        await driver.waitFor(shareMaterialButton);

        const userButton = new ByValueKey(TeacherKeys.userButtonInteraction(interaction));
        await driver.waitFor(userButton);

        const cameraButton = new ByValueKey(
            TeacherKeys.cameraButtonLiveLessonInteraction(interaction)
        );
        await driver.waitFor(cameraButton);

        const shareScreenButton = new ByValueKey(
            TeacherKeys.shareScreenButtonInteraction(interaction)
        );
        await driver.waitFor(shareScreenButton);
    });
}

export async function learnerInteractOnLearnerApp(learner: LearnerInterface, interaction: boolean) {
    const driver = learner.flutterDriver!;

    await learner.instruction(`Learner can interact: ${interaction}`, async function () {
        const microButton = new ByValueKey(
            LearnerKeys.microButtonLiveLessonInteraction(interaction)
        );
        await driver.waitFor(microButton);

        const cameraButton = new ByValueKey(
            LearnerKeys.cameraButtonLiveLessonInteraction(interaction)
        );
        await driver.waitFor(cameraButton);

        // temporary hard code for raise hand button. Will check later
        const raiseHandButton = new ByValueKey(LearnerKeys.raiseHandButton([false]));
        await driver.waitFor(raiseHandButton);
    });
}

export async function goesToLessonWaitingRoomOnTeacherApp(params: {
    teacher: TeacherInterface;
    courseId: string;
    lessonId: string;
}) {
    const { teacher, courseId, lessonId } = params;
    const driver = teacher.flutterDriver!;

    await goToLiveLessonDetailOnTeacherApp({ teacher, courseId, lessonId });

    await teacher.instruction('Teacher goes to lesson waiting room', async function () {
        const startLessonButton = new ByValueKey(TeacherKeys.startLessonButton);
        await driver.tap(startLessonButton);
    });
}
