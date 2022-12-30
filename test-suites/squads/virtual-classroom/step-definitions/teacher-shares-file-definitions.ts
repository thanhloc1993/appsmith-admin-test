import { TeacherKeys } from '@common/teacher-keys';
import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { TeacherInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';
import { liveLessonScreenVisible } from 'step-definitions/teacher-keys/lesson';
import { LessonMaterial } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { ButtonStatus } from 'test-suites/squads/virtual-classroom/utils/types';

export async function teacherStopShareMaterialOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const stopShareMaterialButton = TeacherKeys.stopShareMaterialButton;
    const shareMaterialButton = TeacherKeys.shareMaterialButtonInteraction(true);

    await driver.tap(new ByValueKey(shareMaterialButton));
    await driver.tap(new ByValueKey(stopShareMaterialButton));
}

export async function checkStatusShareMaterialButtonOnTeacherApp(
    teacher: TeacherInterface,
    buttonStatus: ButtonStatus
) {
    const driver = teacher.flutterDriver!;

    const isActiveButton = buttonStatus === 'active';
    const shareMaterialButton = TeacherKeys.shareMaterialButtonActive(isActiveButton);

    await driver.waitFor(new ByValueKey(shareMaterialButton));
}

export async function teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp(
    teacher: TeacherInterface,
    material: LessonMaterial,
    mediaId: string
) {
    const driver = teacher.flutterDriver!;

    if (material.includes('video')) {
        const videoView = TeacherKeys.videoLiveLessonView(mediaId);
        await driver.waitFor(new ByValueKey(videoView));
        return;
    }

    const pdfView = TeacherKeys.liveLessonWhiteBoardView + mediaId;
    await driver.waitFor(new ByValueKey(pdfView));
}

export async function teacherDoesNotSeeSharingMaterialOnTeacherApp(
    teacher: TeacherInterface,
    mediaId: string
) {
    const driver = teacher.flutterDriver!;

    const videoView = TeacherKeys.videoLiveLessonView(mediaId);
    const pdfView = TeacherKeys.liveLessonWhiteBoardView + mediaId;

    await driver.waitForAbsent(new ByValueKey(videoView));
    await driver.waitForAbsent(new ByValueKey(pdfView));
}

export async function teacherSeesPdfOnTeacherApp(
    teacher: TeacherInterface,
    mediaId: string,
    hidden: boolean
) {
    const driver = teacher.flutterDriver!;
    const pdfView = TeacherKeys.liveLessonWhiteBoardView + mediaId;
    if (hidden) {
        await driver.waitForAbsent(new ByValueKey(pdfView));
    } else {
        await driver.waitFor(new ByValueKey(pdfView));
    }
}

export async function teacherSeesPdfVisibleOnTeacherApp(
    teacher: TeacherInterface,
    mediaId: string,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const pdfView = new ByValueKey(TeacherKeys.liveLessonWhiteBoardView + mediaId);
    const pdfViewVisible = new ByValueKey(
        VirtualClassroomKeys.liveLessonScreenVisible(liveLessonScreenVisible['whiteBoardView'])
    );

    await driver.waitFor(pdfView, 10000);

    if (visible) {
        await driver.waitFor(pdfViewVisible);
    } else {
        await driver.waitForAbsent(pdfViewVisible);
    }
}

export async function teacherSeesVideoVisibleOnTeacherApp(
    teacher: TeacherInterface,
    mediaId: string,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const videoView = new ByValueKey(TeacherKeys.videoLiveLessonView(mediaId));
    const videoViewVisible = new ByValueKey(
        VirtualClassroomKeys.liveLessonScreenVisible(liveLessonScreenVisible['videoView'])
    );

    await driver.waitFor(videoView, 10000);

    if (visible) {
        await driver.waitFor(videoViewVisible);
    } else {
        await driver.waitForAbsent(videoViewVisible);
    }
}

export async function teacherSeesVideoOnTeacherApp(
    teacher: TeacherInterface,
    mediaId: string,
    hidden: boolean
) {
    const driver = teacher.flutterDriver!;
    const videoView = TeacherKeys.videoLiveLessonView(mediaId);

    if (hidden) {
        await driver.waitForAbsent(new ByValueKey(videoView));
    } else {
        await driver.waitFor(new ByValueKey(videoView), 10000);
    }
}
