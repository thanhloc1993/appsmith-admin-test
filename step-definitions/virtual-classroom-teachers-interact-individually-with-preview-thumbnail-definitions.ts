import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSelectsThePageInSlide(
    teacher: TeacherInterface,
    index: number,
    active: boolean
) {
    const driver = teacher.flutterDriver!;
    const page = new ByValueKey(TeacherKeys.itemPreviewThumbnail(index, active));
    await driver.tap(page);
}

export async function teacherSeesExactlyPagePDF(
    teacher: TeacherInterface,
    mediaId: string,
    page: number
) {
    const driver = teacher.flutterDriver!;
    const pdfView = TeacherKeys.liveLessonWhiteBoardView + mediaId;
    await driver.waitFor(new ByValueKey(pdfView));

    const pageNumber = TeacherKeys.liveLessonPageActionBar(page);
    await driver.waitFor(new ByValueKey(pageNumber));
}

export async function learnerSeesExactlyPagePDF(learner: LearnerInterface, page: number) {
    const driver = learner.flutterDriver!;
    const pageNumber = LearnerKeys.liveLessonWhiteBoardIndex(page);
    await driver.waitFor(new ByValueKey(pageNumber));
}
