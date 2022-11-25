import { aliasLessonId } from '@legacy-step-definitions/alias-keys/lesson';
import { goToLessonsList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import {
    lessonTimeTableWithNth,
    lessonDetailDuration,
    lessonInfoEndTime,
    lessonInfoStartTime,
    lessonLinkByOrder,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import {
    searchLessonByStudentName,
    waitForTableLessonRenderRows,
} from 'test-suites/squads/lesson/utils/lesson-list';

interface AssertLessonEndTimeAndStartTime {
    cms: CMSInterface;
    endTime: string;
    startTime: string;
    role?: AccountRoles;
}

interface SelectLessonByIndex {
    scenarioContext: ScenarioContext;
    cms: CMSInterface;
    order: number;
}

interface AssertLessonInChainChangeStartEndTime extends AssertLessonEndTimeAndStartTime {
    lessonTime: LessonTimeValueType;
    studentName: string;
    indexOfChains: number[];
}

type AssertLessonEndDateRecurringChains = Omit<
    AssertLessonInChainChangeStartEndTime,
    'endTime' | 'startTime'
> & {
    endDate: string;
    scenarioContext: ScenarioContext;
};

export async function assertLessonEndTimeAndStartTime(props: AssertLessonEndTimeAndStartTime) {
    const { cms, endTime, startTime } = props;
    await cms.waitingForLoadingIcon();
    const startTimeContent = await cms.page!.textContent(lessonInfoStartTime);
    const endTimeContent = await cms.page!.textContent(lessonInfoEndTime);

    weExpect(startTimeContent, 'Start time in detail to equal startTime').toEqual(startTime);
    weExpect(endTimeContent, 'End time in detail to equal endTime').toEqual(endTime);
}

export async function assertLessonInChainChangeStartEndTime(
    props: AssertLessonInChainChangeStartEndTime
) {
    const { endTime, startTime, cms, role, lessonTime, studentName, indexOfChains } = props;

    await cms.instruction(`${role} go to lesson list`, async function () {
        await goToLessonsList(cms, lessonTime);
    });

    await searchLessonByStudentName({ cms, studentName, lessonTime });

    await waitForTableLessonRenderRows(cms, lessonTime);

    for (let i = 0; i < indexOfChains.length; i++) {
        const lessonTime: string | null = await cms.page!.textContent(
            lessonTimeTableWithNth(indexOfChains[i])
        );
        const isIncludeEndTime = lessonTime?.includes(endTime);
        const isIncludeStartTime = lessonTime?.includes(startTime);
        weExpect(isIncludeEndTime, 'Assert lesson time in table includes end time').toEqual(true);
        weExpect(isIncludeStartTime, 'Assert lesson time in table includes start time').toEqual(
            true
        );
    }
}

export async function assertLessonEndDate(props: { cms: CMSInterface; endDate: string }) {
    const { cms, endDate } = props;
    await cms.waitingForLoadingIcon();

    const duration = await cms.page!.textContent(lessonDetailDuration);

    const isEqualDuration = duration?.toString().includes(endDate);
    weExpect(isEqualDuration, 'LessonEndDate includes content lesson detail duration').toEqual(
        true
    );
}

export async function assertLessonEndDateInChains(props: AssertLessonEndDateRecurringChains) {
    const { cms, indexOfChains, endDate, role, lessonTime, studentName, scenarioContext } = props;

    for (let i = 0; i < indexOfChains.length; i++) {
        await cms.instruction(`${role} go to lesson list`, async function () {
            await goToLessonsList(cms, lessonTime);
        });

        await searchLessonByStudentName({ cms, studentName, lessonTime });

        await waitForTableLessonRenderRows(cms, lessonTime);

        await selectLessonByIndex({ cms, order: indexOfChains[i], scenarioContext });

        await cms.instruction(`${role} Assert Lesson End Date`, async function () {
            await assertLessonEndDate({ cms, endDate });
        });
    }
}

export async function selectLessonByIndex(props: SelectLessonByIndex) {
    const { order, cms, scenarioContext } = props;
    const theLesson = await cms.page!.waitForSelector(lessonLinkByOrder(order));

    const data = await cms.page!.getAttribute(lessonLinkByOrder(order), 'data-value');
    scenarioContext.set(aliasLessonId, data);
    await theLesson.click();
}
