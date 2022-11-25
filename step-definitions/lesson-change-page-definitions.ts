import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function goesToPageByControlBarOnTeacherApp(
    teacher: TeacherInterface,
    page: string
): Promise<void> {
    const driver = teacher.flutterDriver!;
    const isNext = page === 'the next page';

    // Click Annotation Button
    const annotationButton = new ByValueKey(TeacherKeys.annotationButton);
    await driver.tap(annotationButton);

    await teacher.instruction(
        `teacher goes to ${page} page by main control bar`,
        async function () {
            if (isNext) {
                // Next Page
                const iconKey = TeacherKeys.liveLessonOnNextActionBar;
                const iconControlPage = new ByValueKey(iconKey);
                await driver.tap(iconControlPage);
            } else {
                // Next Page
                const iconNextPage = new ByValueKey(TeacherKeys.liveLessonOnNextActionBar);
                await driver.tap(iconNextPage);

                // Previous Page
                const iconKey = TeacherKeys.liveLessonOnPrevActionBar;
                const iconControlPage = new ByValueKey(iconKey);
                await driver.tap(iconControlPage);
            }
        }
    );
}

export async function seesPageOfSharingPdfOnTeacherApp(
    teacher: TeacherInterface,
    currentPage: number
): Promise<void> {
    const driver = teacher.flutterDriver!;

    await teacher.instruction(`teacher sees page ${currentPage} of sharing pdf`, async function () {
        const iconControlPage = new ByValueKey(TeacherKeys.liveLessonPageActionBar(currentPage));
        await driver.waitFor(iconControlPage, 10000);
    });
}

export async function seesPageOfSharingPdfOnLearnerApp(
    learner: LearnerInterface,
    currentPage: number
): Promise<void> {
    const driver = learner.flutterDriver!;

    await learner.instruction(`learner sees ${currentPage} page of sharing pdf`, async function () {
        const iconControlPage = new ByValueKey(LearnerKeys.liveLessonWhiteBoardIndex(currentPage));
        await driver.waitFor(iconControlPage, 300000);
    });
}
