import {
    aliasEndDate,
    aliasLessonId,
    aliasLessonInfo,
    aliasNewEndDate,
} from '@legacy-step-definitions/alias-keys/lesson';
import { goToLessonsList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { userIsOnLessonDetailPage } from '@legacy-step-definitions/lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import { addDayFromDate } from '@legacy-step-definitions/utils';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { CreateLessonRequestData } from '@services/bob-lesson-management/bob-lesson-management-service';

import {
    lessonDetailDuration,
    lessonEndDateV3,
    lessonIconPenEditDate,
    lessonInputLessonEndDateV3,
    lessonLinkByOrder,
    lessonLinkOfRowOnLessonListByOrderWithTab,
    lessonRowOnLessonListByOrderWithTab,
    lessonTableRowWithTab,
} from '../common/cms-selectors';
import { assertSeeLessonOnCMS } from './lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { applyTimePickerV3 } from './lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import moment from 'moment';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { waitForTableLessonRenderRows } from 'test-suites/squads/lesson/utils/lesson-list';
import { searchLessonByStudentName } from 'test-suites/squads/lesson/utils/lesson-list';

export interface EditEndDate {
    option: 'adding 7 days from the current end date' | 'removing 7 days from the current end date';
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
}

interface AssertAmountLessonItemInLessonList {
    cms: CMSInterface;
    studentName: string;
    countLessonTotal: number;
    role: AccountRoles;
    lessonTime: 'future' | 'past';
}

interface AssertLessonItemBetweenOldEndAndNewEndDate {
    scenarioContext: ScenarioContext;
    cms: CMSInterface;
    orderLessonItemCompare: number;
    isExisted: boolean;
}

interface SelectLessonByOrder {
    scenarioContext: ScenarioContext;
    cms: CMSInterface;
    order: number;
    lessonTime?: LessonTimeValueType;
}

export async function onchangeLessonEndDate(props: EditEndDate) {
    const { cms, option, scenarioContext } = props;
    switch (option) {
        case 'adding 7 days from the current end date':
            await cms.instruction(`Edit end date by ${option}`, async function () {
                const amountAddDate = 7;
                const lessonInfo = scenarioContext.get<CreateLessonRequestData>(aliasLessonInfo);

                const lessonEndDateUpdate = addDayFromDate(
                    lessonInfo.savingOption?.recurrence?.endDate,
                    amountAddDate
                );

                await changeLessonEndDateByValue(cms, lessonEndDateUpdate);

                scenarioContext.set(aliasEndDate, lessonInfo.savingOption?.recurrence?.endDate);
                scenarioContext.set(aliasNewEndDate, lessonEndDateUpdate);
            });
            break;
        case 'removing 7 days from the current end date':
            await cms.instruction(`Edit end date by ${option}`, async function () {
                const amountRemoveDate = -7;
                const lessonInfo = scenarioContext.get<CreateLessonRequestData>(aliasLessonInfo);

                const lessonEndDateUpdate = addDayFromDate(
                    lessonInfo.savingOption?.recurrence?.endDate,
                    amountRemoveDate
                );

                await changeLessonEndDateByValue(cms, lessonEndDateUpdate);

                scenarioContext.set(aliasEndDate, lessonInfo.savingOption?.recurrence?.endDate);
                scenarioContext.set(aliasNewEndDate, lessonEndDateUpdate);
            });
            break;
    }
}

export async function assertLessonEndDate(props: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
}) {
    const { cms, scenarioContext } = props;
    await cms.waitingForLoadingIcon();

    const duration = await cms.page!.textContent(lessonDetailDuration);
    const lessonEndDate = scenarioContext.get(aliasNewEndDate);

    const isEqualDuration = duration?.toString().includes(lessonEndDate!.toString());
    weExpect(isEqualDuration, 'LessonEndDate includes content lesson detail duration').toEqual(
        true
    );
}

export async function changeLessonEndDateByValue(cms: CMSInterface, endDate: string) {
    await cms.instruction('Open date picker', async function () {
        const page = cms.page!;
        await page.click(lessonEndDateV3);
        await page.click(lessonIconPenEditDate);
        await page.locator(lessonInputLessonEndDateV3).fill(endDate);

        await applyTimePickerV3(page);
    });
}

export async function assertAmountLessonItemInLessonList(
    props: AssertAmountLessonItemInLessonList
) {
    const { cms, studentName, countLessonTotal, role, lessonTime } = props;

    await cms.instruction(`${role} go to lesson list`, async function () {
        await goToLessonsList(cms, lessonTime);
    });

    await searchLessonByStudentName({ cms, studentName, lessonTime });

    await waitForTableLessonRenderRows(cms, lessonTime);
    const row = await cms.page!.$$(lessonTableRowWithTab(lessonTime));

    weExpect(row.length, `Assert lesson item show in UI to equal lesson updated`).toEqual(
        countLessonTotal
    );
}

export async function assertLessonItemBetweenOldEndDateAndNewEndDate(
    props: AssertLessonItemBetweenOldEndAndNewEndDate
) {
    const { scenarioContext, cms, orderLessonItemCompare, isExisted } = props;
    const lessonDate = await cms.page!.textContent(lessonLinkByOrder(orderLessonItemCompare));

    const oldEndDate = scenarioContext.get(aliasEndDate);
    const newEndDate = scenarioContext.get(aliasNewEndDate);

    const lessonEndDateConvert = moment(lessonDate).format('YYYY/MM/DD');
    const lessonOldConvert = moment(oldEndDate).format('YYYY/MM/DD');
    const lessonNewConvert = moment(newEndDate).format('YYYY/MM/DD');

    const isExistInChain = moment(lessonEndDateConvert).isBetween(
        lessonOldConvert,
        lessonNewConvert
    );

    weExpect(isExistInChain, `Have lesson existed in change is ${isExistInChain}`).toEqual(
        isExisted
    );
}

export async function goToLessonDetailByMiddleLesson(params: {
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
        const row = await cms.page!.$$(lessonTableRowWithTab(lessonTime));

        const orderMiddleLessonList = Math.floor(row.length / 2);

        await selectLessonByOrder({
            cms,
            scenarioContext: scenario,
            order: orderMiddleLessonList,
            lessonTime,
        });
    });

    await cms.instruction('Is being on lesson detail', async function () {
        await cms.waitingForLoadingIcon();
        await userIsOnLessonDetailPage(cms);
    });
}

export async function selectLessonByOrder(props: SelectLessonByOrder) {
    const { order, cms, scenarioContext, lessonTime = 'future' } = props;
    await cms.page!.waitForSelector(lessonRowOnLessonListByOrderWithTab(order, lessonTime));

    const lessonId = await cms.page!.getAttribute(
        lessonRowOnLessonListByOrderWithTab(order, lessonTime),
        'data-value'
    );

    scenarioContext.set(aliasLessonId, lessonId);
    await cms.instruction('Click lesson', async function () {
        await cms
            .page!.locator(lessonLinkOfRowOnLessonListByOrderWithTab(order, lessonTime))
            .click();
    });
}
