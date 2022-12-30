import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherShowsPreviewThumbnail(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const previewButton = new ByValueKey(TeacherKeys.previewButtonKey(false));
    await driver.tap(previewButton);
}

export async function teacherHidesPreviewThumbnail(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const previewButton = new ByValueKey(TeacherKeys.previewButtonKey(true));
    await driver.tap(previewButton);
}

export async function teacherSeesPdfSlide(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const pdfSlide = new ByValueKey(TeacherKeys.previewThumbnailList);
    await driver.waitFor(pdfSlide);
}

export async function teacherDoesNotSeePdfSlide(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const pdfSlide = new ByValueKey(TeacherKeys.previewThumbnailList);
    await driver.waitForAbsent(pdfSlide);
}

export async function teacherSeesThePageInSlide(
    teacher: TeacherInterface,
    index: number,
    active: boolean
) {
    const driver = teacher.flutterDriver!;
    const firstPage = new ByValueKey(TeacherKeys.itemPreviewThumbnail(index, active));
    await driver.waitFor(firstPage);
}
