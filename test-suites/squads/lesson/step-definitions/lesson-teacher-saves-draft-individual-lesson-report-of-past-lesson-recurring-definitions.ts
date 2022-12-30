import { CMSInterface } from '@supports/app-types';

import {
    lessonLink,
    lessonListFuture,
    lessonListPast,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { searchLessonByStudentName } from 'test-suites/squads/lesson/utils/lesson-list';
import { goToLessonsList } from 'test-suites/squads/lesson/utils/lesson-list';
import { userIsOnLessonDetailPage } from 'test-suites/squads/lesson/utils/navigation';

export async function userGoToMiddleLessonInChain(params: {
    cms: CMSInterface;
    lessonTime: LessonTimeValueType;
    studentName: string;
}) {
    const { cms, lessonTime, studentName } = params;
    const page = cms.page!;

    await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    await goToLessonsList({ cms, lessonTime });
    await searchLessonByStudentName({ cms, studentName, lessonTime });

    const lessonTableLocator =
        lessonTime === 'future' ? page.locator(lessonListFuture) : page.locator(lessonListPast);

    const lessonLinkLocator = lessonTableLocator.locator(lessonLink);
    const middleLessonLinkInChain = lessonLinkLocator.nth(1);
    await middleLessonLinkInChain.click();
    await userIsOnLessonDetailPage(cms);
}
