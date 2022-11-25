import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { userIsShownInListCameraOnTeacherApp } from './lesson-leave-lesson-definitions';
import { teacherTapOnLessonItem } from './lesson-teacher-utils';
import { goToCourseDetailOnTeacherAppByCourseId } from './lesson-teacher-verify-lesson-definitions';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey, delay } from 'flutter-driver-x';
import { teacherGoToLessonDetailOfLessonManagementOnTeacherApp } from 'step-definitions/lesson-edit-lesson-of-lesson-management-material-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

export async function whenTeacherJoinsLessonOfLessonManagement(params: {
    teacher: TeacherInterface;
    courseId: string;
    lessonId: string;
    lessonName: string;
    lessonTime: LessonManagementLessonTime;
    isFirstTeacher: boolean;
}) {
    const { teacher, isFirstTeacher } = params;

    await teacherGoToLessonDetailOfLessonManagementOnTeacherApp(params);
    await teacherJoinsLesson(teacher, isFirstTeacher);
}

export async function teacherJoinsLesson(teacher: TeacherInterface, isFirstTeacher: boolean) {
    const driver = teacher.flutterDriver!;
    // will create time for flutter driver command, and remove timeout later
    await teacher.instruction('Teacher join lesson', async function () {
        await driver.runUnsynchronized(async () => {
            const startLessonButton = new ByValueKey(TeacherKeys.startLessonButton);
            await driver.tap(startLessonButton);
            // fix on teacher web later
            await delay(500);
            const joinButton = new ByValueKey(TeacherKeys.joinButton(true, isFirstTeacher));
            await driver.waitFor(joinButton, 20000);
            await driver.tap(joinButton);
            await driver.waitForAbsent(joinButton, 20000);
        });
    });
}

export async function teacherJoinedLessonSuccess(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await teacher.instruction('Teacher go to live stream screen', async function () {
        await driver.waitFor(new ByValueKey(TeacherKeys.liveStreamScreen), 15000);
        await driver.waitForAbsent(new ByValueKey(TeacherKeys.waitingRoomBanner), 15000);
    });
}

export async function teacherSeesAllTeacherStreamInGalleryViewOnTeacherApp(
    teacher: TeacherInterface,
    userIds: string[]
) {
    for (const userId of userIds) {
        await userIsShownInListCameraOnTeacherApp(teacher, userId, true);
    }
}

export async function teacherDisplayParticipantCamera(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    await teacher.instruction('Teacher show list camera view', async function () {
        await driver.waitFor(new ByValueKey(TeacherKeys.liveLessonListCameraView));
    });
}

export async function teacherGotoLessonDetail(
    teacher: TeacherInterface,
    courseId: string,
    lessonId: string,
    lessonName: string
) {
    await goToCourseDetailOnTeacherAppByCourseId(teacher, courseId);
    await teacherTapOnLessonItem(teacher, lessonId, lessonName);
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

        // Now we are testing on synersia which disable shareScreen function.
        // const shareScreenButton = new ByValueKey(
        //     TeacherKeys.shareScreenButtonInteraction(interaction)
        // );
        // await driver.waitFor(shareScreenButton);
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
    lessonName: string;
    lessonTime: LessonManagementLessonTime;
}) {
    const teacher = params.teacher;
    const driver = teacher.flutterDriver!;

    await teacherGoToLessonDetailOfLessonManagementOnTeacherApp(params);

    await teacher.instruction('Teacher goes to lesson waiting room', async function () {
        const startLessonButton = new ByValueKey(TeacherKeys.startLessonButton);
        await driver.tap(startLessonButton);
    });
}
