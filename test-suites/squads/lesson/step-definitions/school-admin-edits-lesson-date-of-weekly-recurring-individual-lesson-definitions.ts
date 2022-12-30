import { goToLessonsList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { getLessonDataOnLessonDetailPage } from '@legacy-step-definitions/lesson-edit-lesson-by-updating-and-adding-definitions';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';

import {
    aliasEndDate,
    aliasEndDateOfEditedLessonOnRecurringChain,
    aliasOrderEditLessonWeeklyRecurring,
    aliasLessonDateOfEditedLessonOnRecurringChain,
    aliasLessonInfo,
    aliasWeeklyDayOfEditedLessonOnRecurringChain,
} from '../common/alias-keys';
import * as LessonManagementKeys from '../common/cms-selectors';
import moment from 'moment-timezone';
import { getUsersFromContextByRegexKeys } from 'test-suites/common/step-definitions/user-common-definitions';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { assertLessonDate } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import {
    calcDateRange,
    changeDatePickerByDateRange,
} from 'test-suites/squads/lesson/utils/date-picker';
import { searchLessonByStudentName } from 'test-suites/squads/lesson/utils/lesson-list';
import { userIsOnLessonDetailPage } from 'test-suites/squads/lesson/utils/navigation';

export type LessonDateWeeklyRecurring =
    | 'current date < lesson date < End date'
    | 'current date > lesson date < End date'
    | 'lesson date = end date';

export enum OrderLessonInRecurringChain {
    FIRST = 1,
    SECOND = 2,
    MIDDLE = 3,
    FOURTH = 4,
    LAST = 5,
}

export async function getFirstStudentInfo(scenario: ScenarioContext): Promise<UserProfileEntity> {
    const students = getUsersFromContextByRegexKeys(
        scenario,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    return students[0];
}

export async function filterLessonListByStudentName(
    cms: CMSInterface,
    studentName: string,
    lessonTime: LessonTimeValueType
) {
    await searchLessonByStudentName({ cms, studentName, lessonTime });
}

export async function selectLessonLinkByLessonOrder(
    cms: CMSInterface,
    order: number,
    lessonTime: LessonTimeValueType
) {
    const lessonLink = await cms.page!.waitForSelector(
        LessonManagementKeys.lessonLinkOnLessonListByOrder(order, lessonTime)
    );

    await lessonLink.click();
}

export async function changeLessonDateOfLessonInRecurringChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonDateWillBeChange: LessonDateWeeklyRecurring
) {
    const currentDateInput = await cms.page!.inputValue(LessonManagementKeys.lessonDateV3);

    const currentDate = new Date(currentDateInput);

    let dateRange;

    switch (lessonDateWillBeChange) {
        case 'current date < lesson date < End date':
            dateRange = 1;
            break;
        case 'current date > lesson date < End date':
            dateRange = -1;
            break;
        case 'lesson date = end date': {
            const endDate = scenarioContext.get(aliasEndDate);
            dateRange = moment(endDate).endOf('day').diff(moment(currentDate).endOf('day'), 'days');
        }
    }

    await changeDatePickerByDateRange({
        cms,
        currentDate,
        datePickerSelector: LessonManagementKeys.lessonDateV3,
        dateRange,
    });

    const desireDate = new Date(currentDate.getTime() + 24 * 3600 * 1000 * dateRange);

    scenarioContext.set(aliasLessonDateOfEditedLessonOnRecurringChain, desireDate);
}

export async function goToLessonInRecurringChainByOrder(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    order: number,
    lessonTime: LessonTimeValueType
) {
    await cms.instruction(
        `Go to lesson management and change to tab ${lessonTime} lessons list`,
        async function () {
            await goToLessonsList(cms, lessonTime);
        }
    );

    await cms.instruction(
        `Go to lesson that has order ${order} in recurring chain`,
        async function () {
            const studentInfo = await getFirstStudentInfo(scenarioContext);
            await filterLessonListByStudentName(cms, studentInfo.name, lessonTime);
            await selectLessonLinkByLessonOrder(cms, order, lessonTime);
        }
    );

    await cms.instruction('User is on lesson detail page', async function () {
        await userIsOnLessonDetailPage(cms);
    });
}

export async function assertLessonDateRangeOfLessonInRecurringChain(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    orderInChain: OrderLessonInRecurringChain;
    lessonTime: LessonTimeValueType;
    orderInChainOfEditedLesson: OrderLessonInRecurringChain;
    deviatedDate?: number;
}) {
    const {
        cms,
        scenarioContext,
        orderInChain,
        lessonTime,
        orderInChainOfEditedLesson,
        deviatedDate = 0,
    } = params;
    await goToLessonInRecurringChainByOrder(cms, scenarioContext, orderInChain, lessonTime);

    const expectDateRange =
        (orderInChain - orderInChainOfEditedLesson) * 7 * (lessonTime === 'future' ? 1 : -1) +
        deviatedDate;
    // (orderInChain - orderInChainOfEditedLesson) * 7 is date range of two lesson in recurring chain
    // lessonTime === 'future' ? 1 : -1 because in lesson future list, the lesson will be sorted by lesson date asc
    // in part lesson list, the lesson will be sorted by lesson date desc
    // deviatedDate just be deviated date of the lesson after edited

    const { lessonDate } = await getLessonDataOnLessonDetailPage(cms);

    if (!lessonDate) {
        throw Error(`Cannot find lesson date of lesson`);
    }

    const editedLessonDate = scenarioContext.get<Date>(
        aliasLessonDateOfEditedLessonOnRecurringChain
    );

    const dateRangeWithEditedDate = calcDateRange(new Date(lessonDate), new Date(editedLessonDate));

    weExpect(dateRangeWithEditedDate).toEqual(expectDateRange);
}

export async function assertUpdatedLessonDate(cms: CMSInterface, scenarioContext: ScenarioContext) {
    await cms.page!.waitForSelector(LessonManagementKeys.upsertLessonDialog, {
        state: 'detached',
    });
    // wait for lesson upsert dialog closed

    const { lessonDate, dayOfWeek } = await getLessonDataOnLessonDetailPage(cms);

    if (!lessonDate) {
        throw Error(`Cannot find lesson date of lesson`);
    }

    const editedLessonDate = scenarioContext.get<Date>(
        aliasLessonDateOfEditedLessonOnRecurringChain
    );

    const newLessonDate = new Date(lessonDate);

    weExpect(newLessonDate).toEqual(new Date(editedLessonDate));

    scenarioContext.set(aliasWeeklyDayOfEditedLessonOnRecurringChain, dayOfWeek);

    const duration = await cms.page!.textContent(LessonManagementKeys.lessonDetailDuration);
    if (!duration) {
        throw Error('Cannot find duration of lesson');
    }
    const endDate = duration.split('until ')[1];

    scenarioContext.set(aliasEndDateOfEditedLessonOnRecurringChain, endDate);
}

export async function assertWeeklyDayOfLessonInRecurringChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    order: number,
    lessonTime: LessonTimeValueType
) {
    await goToLessonInRecurringChainByOrder(cms, scenarioContext, order, lessonTime);

    await compareWeeklyDayOfLessonsInRecurringChain(cms, scenarioContext, order);
}

export async function compareWeeklyDayOfLessonsInRecurringChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    orderInChain: number
) {
    const dayOfWeekOfEditedLesson = scenarioContext.get(
        aliasWeeklyDayOfEditedLessonOnRecurringChain
    );

    const duration = await cms.page!.textContent(LessonManagementKeys.lessonDetailDuration);

    if (!duration) {
        throw Error('Cannot find duration of lesson');
    }

    if (orderInChain >= OrderLessonInRecurringChain.MIDDLE) {
        const isEqualWeeklyDay = duration.includes(dayOfWeekOfEditedLesson);
        weExpect(isEqualWeeklyDay).toEqual(true);
    }
}

export async function assertEndDateOfLateLessonsInRecurringChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    await goToLessonInRecurringChainByOrder(
        cms,
        scenarioContext,
        OrderLessonInRecurringChain.FOURTH,
        lessonTime
    );

    const endDateOfEditedLesson = scenarioContext.get(aliasEndDateOfEditedLessonOnRecurringChain);
    const duration = await cms.page!.textContent(LessonManagementKeys.lessonDetailDuration);
    if (!duration) {
        throw Error('Cannot find duration of lesson');
    }

    const isEqualEndDate = duration.includes(endDateOfEditedLesson);
    weExpect(isEqualEndDate).toEqual(true);
}

export async function assertEndDateOfSecondLessonsInRecurringChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    await goToLessonInRecurringChainByOrder(
        cms,
        scenarioContext,
        OrderLessonInRecurringChain.SECOND,
        lessonTime
    );

    await assertLessonDate(cms);
}
export async function assertEndDateLessonsInRecurringChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    const orderEditLessonRecurringChain = scenarioContext.get(aliasOrderEditLessonWeeklyRecurring);

    if (orderEditLessonRecurringChain === '2nd') {
        // Go to FIRST lesson because when update edit lesson 2nd with "this and following"
        // Lesson 1st will update

        await goToLessonInRecurringChainByOrder(
            cms,
            scenarioContext,
            OrderLessonInRecurringChain.FIRST,
            lessonTime
        );
    } else {
        await goToLessonInRecurringChainByOrder(
            cms,
            scenarioContext,
            OrderLessonInRecurringChain.MIDDLE,
            lessonTime
        );
    }
    await assertLessonDate(cms);
}

export async function assertFirstLessonsInRecurringChainRemainingLessonDate(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    await goToLessonInRecurringChainByOrder(
        cms,
        scenarioContext,
        OrderLessonInRecurringChain.FIRST,
        lessonTime
    );

    const lessonInfo = scenarioContext.get<CreateLessonRequestData>(aliasLessonInfo);

    const lessonDate = moment(lessonInfo.startTime).format('YYYY/MM/DD');

    const content = await cms.page!.textContent(LessonManagementKeys.lessonDetailTitle);
    weExpect(content).toEqual(lessonDate);
}
