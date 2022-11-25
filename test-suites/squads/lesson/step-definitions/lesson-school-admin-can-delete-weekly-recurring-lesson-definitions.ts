import { aliasLessonId } from '@legacy-step-definitions/alias-keys/lesson';
import * as CMSKeys from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    lessonDeleteOnlyThisLessonRadioButton,
    lessonDeleteThisAndFollowingRadioButton,
} from '@legacy-step-definitions/cms-selectors/lesson';
import {
    lessonLinkOfFirstRowOnLessonList,
    lessonLinkOfSecondRowOnLessonList,
} from '@legacy-step-definitions/cms-selectors/lesson-management';
import { goToLessonsList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { userIsOnLessonDetailPage } from '@legacy-step-definitions/lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { ActionOptions } from '@supports/types/cms-types';

import { CreateLessonSavingMethod } from 'manabuf/bob/v1/lessons_pb';
import { aliasDeletedLessonDate } from 'test-suites/squads/lesson/common/alias-keys';
import { lessonOnListWithDataValue } from 'test-suites/squads/lesson/common/cms-selectors';
import {
    LessonReportActionType,
    LessonTimeValueType,
} from 'test-suites/squads/lesson/common/types';
import { assertSeeLessonOnCMS } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    searchLessonByStudentName,
    waitForTableLessonRenderRows,
} from 'test-suites/squads/lesson/utils/lesson-list';
import {
    confirmSubmitIndLessonReport,
    saveDraftIndividualLessonReport,
    submitIndLessonReport,
} from 'test-suites/squads/lesson/utils/lesson-report';

export async function selectLessonLinkByLessonOrder(cms: CMSInterface, scenario: ScenarioContext) {
    const theLesson = await cms.page!.waitForSelector(lessonLinkOfSecondRowOnLessonList);

    const data = await cms.page!.getAttribute(lessonLinkOfSecondRowOnLessonList, 'data-value');
    scenario.set(aliasLessonId, data);
    await theLesson.click();
}

export async function selectLessonFirstLesson(cms: CMSInterface) {
    const theLesson = await cms.page!.waitForSelector(lessonLinkOfFirstRowOnLessonList);

    await theLesson.click();
}

export async function deleteRecurringLessonWithOption({
    cms,
    method,
}: {
    cms: CMSInterface;
    method: CreateLessonSavingMethod;
}) {
    await cms.selectActionButton(ActionOptions.DELETE, {
        target: 'actionPanelTrigger',
    });

    if (method === CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE)
        await cms.selectElementByDataTestId(lessonDeleteThisAndFollowingRadioButton);

    if (method === CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME)
        await cms.selectElementByDataTestId(lessonDeleteOnlyThisLessonRadioButton);

    await cms.confirmDialogAction();
}

export async function assertOtherLessonStillRemainInLesson({
    cms,
    studentName,
    lessonTime = 'future',
}: {
    cms: CMSInterface;
    studentName: string;
    lessonTime?: LessonTimeValueType;
}) {
    await searchLessonByStudentName({ cms, studentName, lessonTime });
    await waitForTableLessonRenderRows(cms, lessonTime);
}

export async function goToLessonDetailByLessonOrderOnLessonList(params: {
    cms: CMSInterface;
    lessonTime: LessonTimeValueType;
    lessonId: string;
    studentName: string;
    scenario: ScenarioContext;
}) {
    const { cms, lessonId, lessonTime, studentName, scenario } = params;

    await goToLessonsList(cms, lessonTime);

    await cms.instruction('See the new lesson on CMS', async function () {
        await assertSeeLessonOnCMS({ cms, lessonId, studentName, lessonTime });
    });

    await cms.instruction('Go to the lesson detail', async function () {
        await selectLessonLinkByLessonOrder(cms, scenario);
    });

    await cms.instruction('Is being on lesson detail', async function () {
        await cms.waitingForLoadingIcon();
        await userIsOnLessonDetailPage(cms);
    });
}

export async function assertSeeLessonOnCMSWithEmptyMessageTableV2(params: {
    cms: CMSInterface;
    lessonId: string;
    studentName: string;
    shouldSeeLesson: boolean;
}) {
    const { cms, lessonId, studentName, shouldSeeLesson } = params;
    const page = cms.page!;

    await searchLessonByStudentName({ cms, studentName, lessonTime: 'future' });
    if (shouldSeeLesson) {
        await waitForTableLessonRenderRows(cms, 'future');
        await page.waitForSelector(lessonOnListWithDataValue(lessonId));
        return;
    }

    await page.waitForSelector(CMSKeys.tableEmptyMessage);
}

export async function assertNotSeeLessonOnCMSWithEmptyMessageTableV2(params: {
    cms: CMSInterface;
    lessonId: string;
    studentName: string;
    lessonTime: LessonTimeValueType;
}) {
    const { cms, lessonId, studentName, lessonTime } = params;
    const page = cms.page!;

    await searchLessonByStudentName({ cms, studentName, lessonTime });
    await waitForTableLessonRenderRows(cms, lessonTime);

    const content = await page.$$(lessonOnListWithDataValue(lessonId));

    weExpect(content, 'Lesson item not exist in Lesson List').toHaveLength(0);
}

export async function assertNotSeeOtherLessonInChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    studentName: string
) {
    await searchLessonByStudentName({ cms, studentName, lessonTime: 'future' });

    const startTime = scenarioContext.get(aliasDeletedLessonDate);
    const isShowLessonInChain = await cms.page?.isVisible(`text='${startTime}'`);

    weExpect(isShowLessonInChain).toEqual(false);
}
export async function saveIndividualLessonReport(
    cms: CMSInterface,
    actionSaveLessonReport: LessonReportActionType
) {
    if (actionSaveLessonReport === 'Submit All') {
        await cms.instruction('Submit All individual lesson report', async function () {
            await submitIndLessonReport(cms.page!);
            await confirmSubmitIndLessonReport(cms.page!);
        });
        return;
    }
    await cms.instruction('Save draft individual lesson report', async function () {
        await saveDraftIndividualLessonReport(cms);
    });
}
