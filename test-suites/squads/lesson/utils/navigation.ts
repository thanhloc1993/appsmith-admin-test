import { CMSInterface } from '@supports/app-types';

import {
    lessonDetailGeneralInfo,
    lessonDetailMaterialInfo,
    lessonDetailStudentsTable,
    LessonDetailTabs,
    lessonInfoPageContainer,
    lessonLinkOnLessonList,
    lessonListFuture,
    lessonListPast,
    upsertLessonDialog,
} from '../common/cms-selectors';
import { assertSeeLessonOnCMS } from '../step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { goToLessonsList } from './lesson-list';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';

export async function userIsOnLessonDetailPage(cms: CMSInterface) {
    const page = cms.page!;

    await Promise.all([
        page.waitForSelector(LessonDetailTabs.LESSON_INFO),
        page.waitForSelector(lessonInfoPageContainer),
        page.waitForSelector(lessonDetailGeneralInfo),
        page.waitForSelector(lessonDetailStudentsTable),
        page.waitForSelector(lessonDetailMaterialInfo),
        page.waitForSelector(upsertLessonDialog, { state: 'detached' }),
    ]);
}

export async function goToLessonDetailByLessonIdOnLessonList(params: {
    cms: CMSInterface;
    lessonTime: LessonTimeValueType;
    lessonId: string;
    studentName: string;
}) {
    const { cms, lessonId, lessonTime, studentName } = params;

    await goToLessonsList({ cms, lessonTime });

    await cms.instruction('See the new lesson on CMS', async function () {
        await assertSeeLessonOnCMS({ cms, lessonId, studentName, lessonTime });
    });

    await cms.instruction('Go to the lesson detail', async function () {
        await selectLessonLinkByLessonId(cms, lessonId, lessonTime);
    });

    await cms.instruction('Is being on lesson detail', async function () {
        await cms.waitingForLoadingIcon();
        await userIsOnLessonDetailPage(cms);
    });
}

export async function selectLessonLinkByLessonId(
    cms: CMSInterface,
    lessonId: string,
    lessonTime: LessonTimeValueType
) {
    const tabLessonList = lessonTime === 'future' ? lessonListFuture : lessonListPast;
    const theLesson = await cms.page!.waitForSelector(
        `${tabLessonList} ${lessonLinkOnLessonList(lessonId)}`
    );

    await theLesson.click();
}
