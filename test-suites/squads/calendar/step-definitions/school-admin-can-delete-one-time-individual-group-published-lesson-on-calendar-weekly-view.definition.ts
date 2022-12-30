import { delay } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { openCreateLessonPage } from './school-admin-can-view-draft-one-time-lessons-on-calendar-weekly-view-definitions';
import {
    aliasLessonId,
    aliasLessonInfo,
    aliasLocationName,
} from 'test-suites/squads/calendar/common/alias-keys';
import {
    deleteLessonOptionOnetime,
    deleteLessonOptionRecurrence,
    deleteMenuItem,
    dialogButtonSave,
    dialogDeleteLessonOnetime,
    dialogDeleteLessonRecurrence,
    drawerHeaderSelector,
    optionsButton,
} from 'test-suites/squads/calendar/common/cms-selectors';
import { DeleteLessonType, LessonType } from 'test-suites/squads/calendar/common/types';
import { courseAutoCompleteInputV3 } from 'test-suites/squads/lesson/common/cms-selectors';
import { checkTeachingMethod } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import {
    selectTeacher,
    selectTeachingMethod,
    triggerSubmitLesson,
    waitCreateLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { changeTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import { selectCenterByNameV3 } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { parseCreateLessonResponse } from 'test-suites/squads/timesheet/step-definitions/auto-create-not-created-by-draft-lessons-definition';

export async function selectCourse(cms: CMSInterface, courseName?: string) {
    const page = cms.page!;
    const courseInput = await page.waitForSelector(courseAutoCompleteInputV3);
    await courseInput.click();

    if (courseName) {
        await cms.instruction(`Select course ${courseName}`, async function () {
            await courseInput.fill(courseName);
            await cms.waitingAutocompleteLoading();
            await cms.chooseOptionInAutoCompleteBoxByText(courseName);
        });
    } else {
        const randomOrder = Math.floor(Math.random() * 3 + 1);
        await cms.instruction(
            `Select course at position ${randomOrder} on list`,
            async function () {
                await cms.chooseOptionInAutoCompleteBoxByOrder(randomOrder);
            }
        );
    }
}

export async function checkLessonItemVisible(
    cms: CMSInterface,
    context: ScenarioContext,
    expected: boolean
) {
    const page = cms.page!;
    const lessonId = context.get(aliasLessonId);

    const isLessonItemVisible = await page.isVisible(`[data-lesson-id="${lessonId}"]`);
    weExpect(isLessonItemVisible).toEqual(expected);
}

export async function checkLessonDrawerVisible(cms: CMSInterface, expected: boolean) {
    const page = cms.page!;
    const isDrawerHeaderVisible = await page.isVisible(drawerHeaderSelector);
    weExpect(isDrawerHeaderVisible).toEqual(expected);
}

export async function cancelDeleteLesson(cms: CMSInterface) {
    const page = cms.page!;
    const actionPanel = await page.waitForSelector(`${drawerHeaderSelector} ${optionsButton}`);
    await actionPanel.click();

    await cms.page!.waitForSelector(deleteMenuItem);
    await cms.selectAButtonByAriaLabel('Delete');
    await cms.selectAButtonByAriaLabel('Cancel');
}

export async function deleteLesson(cms: CMSInterface, deleteRecurringOption?: DeleteLessonType) {
    const page = cms.page!;
    const actionPanel = await page.waitForSelector(`${drawerHeaderSelector} ${optionsButton}`);
    await actionPanel.click();

    await page.click(deleteMenuItem);
    if (deleteRecurringOption === 'this lesson only') {
        await page.click(deleteLessonOptionOnetime);
        await page.click(`${dialogDeleteLessonRecurrence} ${dialogButtonSave}`);
    } else if (deleteRecurringOption === 'this and following lesson') {
        await page.click(deleteLessonOptionRecurrence);
        await page.click(`${dialogDeleteLessonRecurrence} ${dialogButtonSave}`);
    } else {
        await page.click(`${dialogDeleteLessonOnetime} ${dialogButtonSave}`);
    }
    await cms.waitingForLoadingIcon();
    await delay(3000);
}

export async function openLessonDrawer(cms: CMSInterface, context: ScenarioContext) {
    const page = cms.page!;
    const lessonId = context.get(aliasLessonId);
    const lessonItem = await page.waitForSelector(`[data-lesson-id="${lessonId}"]`);
    await lessonItem.click();
}

export async function fillLessonPublishForm(
    context: ScenarioContext,
    cms: CMSInterface,
    lessonType: LessonType
) {
    const locationName = context.get(aliasLocationName);
    const teachingMethodKey =
        lessonType === 'group'
            ? 'LESSON_TEACHING_METHOD_GROUP'
            : 'LESSON_TEACHING_METHOD_INDIVIDUAL';

    await openCreateLessonPage(cms);
    await changeTimeLesson(cms, '12:00', '13:00');
    await selectCenterByNameV3(cms, locationName);
    await checkTeachingMethod(cms);
    await selectTeachingMethod(cms, teachingMethodKey);
    await selectTeacher(cms);
    if (teachingMethodKey === 'LESSON_TEACHING_METHOD_GROUP') {
        await selectCourse(cms);
    }
}

export async function savePublishLesson(cms: CMSInterface, context: ScenarioContext) {
    const locationName = context.get(aliasLocationName);
    const [createLessonResponse] = await Promise.all([
        waitCreateLesson(cms),
        triggerSubmitLesson(cms),
    ]);

    const lessonId = await parseCreateLessonResponse(createLessonResponse);
    context.set(aliasLessonId, lessonId);
    context.set(aliasLessonInfo, {
        id: lessonId,
        location: locationName,
        startTime: new Date().setHours(12),
        endTime: new Date().setHours(13),
    });
}
