import { CMSInterface } from '@supports/app-types';

import {
    lessonFilterAdvancedSearchInput,
    lessonLinkWithTab,
    LessonListTabs,
    lessonOnListWithDataValue,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { waitRetrieveLessonsResponse } from 'test-suites/squads/lesson/utils/grpc-responses';
import { tableEmptyMessageV2 } from 'test-suites/squads/syllabus/step-definitions/cms-selectors/cms-keys';

export async function chooseLessonTabOnLessonList(params: {
    cms: CMSInterface;
    lessonTime: LessonTimeValueType;
}) {
    const { cms, lessonTime } = params;

    const desireTab =
        lessonTime === 'future' ? LessonListTabs.FUTURE_LESSONS : LessonListTabs.PAST_LESSONS;

    const lessonsTab = cms.page!.locator(desireTab);
    await lessonsTab.click();

    const state = await lessonsTab.getAttribute('aria-selected');
    weExpect(state, `Expect selected lesson tab is ${lessonTime} lessons`).toEqual('true');
}

export async function goToLessonsList(params: {
    cms: CMSInterface;
    lessonTime: LessonTimeValueType;
}) {
    const { cms, lessonTime } = params;

    await cms.instruction('Go to lesson management page', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
    });

    await cms.instruction(`Is being on ${lessonTime} lessons list`, async function () {
        await chooseLessonTabOnLessonList({ cms, lessonTime });
    });

    await waitForTableLessonRenderRows(cms, lessonTime);
}

export async function waitForTableLessonRenderRows(cms: CMSInterface, tab: LessonTimeValueType) {
    await cms.page!.waitForSelector(lessonLinkWithTab(tab), { timeout: 20000 });
}

export async function assertSeeLessonOnLessonManagementList(params: {
    cms: CMSInterface;
    lessonId: string;
    studentName: string;
    lessonTime: LessonTimeValueType;
    shouldSeeLesson?: boolean;
}) {
    const { cms, lessonId, studentName, lessonTime, shouldSeeLesson = true } = params;
    const page = cms.page!;
    await goToLessonsList({ cms, lessonTime });

    await searchLessonByStudentName({ cms, studentName, lessonTime });

    if (shouldSeeLesson) {
        await waitForTableLessonRenderRows(cms, lessonTime);
        await page.waitForSelector(lessonOnListWithDataValue(lessonId));
        return;
    } else {
        await page.waitForSelector(tableEmptyMessageV2);
    }
}

export async function searchLessonByStudentName(params: {
    cms: CMSInterface;
    studentName: string;
    lessonTime?: LessonTimeValueType;
}) {
    const { cms, studentName, lessonTime = 'future' } = params;

    const page = cms.page!;
    const searchInput = page.locator(lessonFilterAdvancedSearchInput(lessonTime));
    const currentValue = await searchInput.inputValue();

    await cms.instruction(`Searching student: ${studentName}`, async function () {
        // Only handle search when currentValue !== studentName
        if (currentValue !== studentName) {
            await searchInput.fill(studentName);
            await Promise.all([waitRetrieveLessonsResponse(cms), page.keyboard.press('Enter')]);
        } else {
            await searchInput.focus();
            await page.keyboard.press('Enter');
            // This else scope to make sure for the edge case the input has value but has not pressed Enter yet
        }
    });
}
