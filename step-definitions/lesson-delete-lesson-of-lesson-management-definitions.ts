import * as LessonManagementKeys from '@legacy-step-definitions/cms-selectors/lesson-management';
import {
    teacherSeesLessonInActiveListOnTeacherApp,
    teacherSeesLessonInCompletedListOnTeacherApp,
} from '@legacy-step-definitions/lesson-live-icon-on-teacher-app-definitions';
import { userIsOnLessonDetailPage } from '@legacy-step-definitions/lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import { chooseLessonTabOnLessonList } from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { goToCourseDetailOnTeacherAppByCourseId } from '@legacy-step-definitions/lesson-teacher-verify-lesson-definitions';

import { CMSInterface, TeacherInterface } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import {
    assertLessonListByLessonTime,
    assertSeeLessonOnCMS,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

export async function selectLessonLinkByLessonId(cms: CMSInterface, lessonId: string) {
    const theLesson = await cms.page!.waitForSelector(
        LessonManagementKeys.lessonLinkOnLessonList(lessonId)
    );

    await theLesson.click();
}

export async function goToLessonsList(cms: CMSInterface, lessonTime: LessonManagementLessonTime) {
    await cms.instruction('Go to lesson management page', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    });

    await cms.instruction(`Is being on ${lessonTime} lessons list`, async function () {
        await chooseLessonTabOnLessonList(cms, lessonTime);
        await assertLessonListByLessonTime(cms, lessonTime);
    });
}

export async function goToLessonDetailByLessonIdOnLessonList(params: {
    cms: CMSInterface;
    lessonTime: LessonTimeValueType;
    lessonId: string;
    studentName: string;
}) {
    const { cms, lessonId, lessonTime, studentName } = params;

    await goToLessonsList(cms, lessonTime);

    await cms.instruction('See the new lesson on CMS', async function () {
        await assertSeeLessonOnCMS({ cms, lessonId, studentName, lessonTime });
    });

    await cms.instruction('Go to the lesson detail', async function () {
        await selectLessonLinkByLessonId(cms, lessonId);
    });

    await cms.instruction('Is being on lesson detail', async function () {
        await cms.waitingForLoadingIcon();
        await userIsOnLessonDetailPage(cms);
    });
}

export async function deleteLessonOfLessonManagement(
    cms: CMSInterface,
    action: 'confirm' | 'cancel'
) {
    await cms.selectActionButton(ActionOptions.DELETE, {
        target: 'actionPanelTrigger',
    });

    if (action === 'confirm') await cms.confirmDialogAction();
    else await cms.cancelDialogAction();
}

export async function assertSeeLessonOnTeacherApp(params: {
    teacher: TeacherInterface;
    lessonTime: LessonManagementLessonTime;
    courseId: string;
    lessonId: string;
    lessonName: string;
    shouldDisplay?: boolean;
}) {
    const { teacher, lessonTime, courseId, lessonId, lessonName, shouldDisplay = true } = params;

    await teacher.instruction('Go to the course of the lesson', async function () {
        await goToCourseDetailOnTeacherAppByCourseId(teacher, courseId);
    });

    switch (lessonTime) {
        case 'future':
            await teacherSeesLessonInActiveListOnTeacherApp(
                teacher,
                lessonId,
                lessonName,
                shouldDisplay
            );
            return;

        case 'past':
        default:
            await teacherSeesLessonInCompletedListOnTeacherApp(
                teacher,
                lessonId,
                lessonName,
                shouldDisplay
            );
            return;
    }
}
