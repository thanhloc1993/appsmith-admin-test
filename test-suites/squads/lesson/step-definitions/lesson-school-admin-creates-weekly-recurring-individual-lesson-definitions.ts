import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { CMSInterface, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { LessonSavingMethodType, LessonTimeValueType } from '../common/types';
import { ByValueKey } from 'flutter-driver-x';
import moment from 'moment';
import {
    aliasCourseId,
    aliasEndDate,
    aliasLessonId,
    aliasLessonIdList,
    aliasLocationName,
    aliasStartDate,
} from 'step-definitions/alias-keys/lesson';
import {
    schoolAdminApplyFilterAdvanced,
    schoolAdminOpenFilterAdvanced,
} from 'step-definitions/cms-common-definitions';
import { learnerGoToLesson } from 'step-definitions/lesson-learner-join-lesson-definitions';
import { changeDatePickerByDateRange } from 'step-definitions/lesson-management-utils';
import { chooseLessonTabOnLessonList } from 'step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import {
    teacherWaitForAbsentLessonItem,
    teacherWaitForLessonItem,
} from 'step-definitions/lesson-teacher-utils';
import { goToCourseDetailOnTeacherAppByCourseId } from 'step-definitions/lesson-teacher-verify-lesson-definitions';
import { TeacherKeys } from 'step-definitions/teacher-keys/teacher-keys';
import { getUserProfileFromContext } from 'step-definitions/utils';
import {
    filterAdvancedToDateV2,
    lessonDateV3,
    lessonEndDateV3,
    lessonLink,
    lessonTableRowWithTab,
    recurringSettingRadioButton,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    assertSeeLessonOnCMS,
    fillUpsertFormLessonOfLessonManagement,
    selectTeacherFormFilter,
    triggerSubmitLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    selectDayOfTheWeek,
    selectStartOrEndDate,
    selectStudent,
} from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';
import { searchLessonByStudentName as searchLessonByStudentNameUtil } from 'test-suites/squads/lesson/utils/lesson-list';

export async function selectRecurring(
    cms: CMSInterface,
    recurringSetting?: LessonSavingMethodType
) {
    const defaultRecurring: LessonSavingMethodType = 'CREATE_LESSON_SAVING_METHOD_RECURRENCE';
    const desireRecurringSetting = recurringSettingRadioButton(
        recurringSetting || defaultRecurring
    );
    await cms.page!.click(desireRecurringSetting);
}

export async function selectEndDateByDateRange(
    cms: CMSInterface,
    scenario: ScenarioContext,
    dateRange: number
) {
    const currentDate = await cms.page!.inputValue(lessonDateV3);
    const desireDate = moment(new Date(currentDate)).add(dateRange, 'day').endOf('day');

    await changeDatePickerByDateRange({
        cms,
        currentDate,
        datePickerSelector: lessonEndDateV3,
        dateRange,
    });

    scenario.set(aliasStartDate, currentDate);
    scenario.set(aliasEndDate, desireDate);
}

export async function selectEndDateWithCondition(cms: CMSInterface, lessonDateCondition: string) {
    const currentDate = await cms.page!.inputValue(lessonDateV3);

    switch (lessonDateCondition) {
        case 'end date < lesson date': {
            await changeDatePickerByDateRange({
                cms,
                currentDate,
                datePickerSelector: lessonEndDateV3,
                dateRange: -1,
            });
            break;
        }
        case 'end date = lesson date':
        default: {
            await changeDatePickerByDateRange({
                cms,
                currentDate,
                datePickerSelector: lessonEndDateV3,
                dateRange: 0,
            });
            break;
        }
    }
}

export async function filterLessonList(cms: CMSInterface, scenario: ScenarioContext) {
    const { name: studentName } = getUserProfileFromContext(
        scenario,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    const { name: teacherName } = getUserProfileFromContext(
        scenario,
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );

    const startDate = new Date(scenario.get(aliasStartDate));
    const endDate = new Date(scenario.get(aliasEndDate));

    if (!startDate || !endDate) throw Error('Lesson start time or end time is not valid');

    await schoolAdminOpenFilterAdvanced(cms);

    await cms.instruction(`Filter student ${studentName}`, async function () {
        await selectStudent(cms, studentName);
    });

    await cms.instruction(`Filter teacher ${teacherName}`, async function () {
        await selectTeacherFormFilter(cms, teacherName);
    });

    await cms.instruction(
        `Filters start date: ${startDate} and end date: ${endDate}`,
        async function () {
            const startMoment = moment(startDate);
            const endMoment = moment(endDate);

            await selectStartOrEndDate(cms, `${startDate.getDate()}`, 'start');
            await changeDatePickerByDateRange({
                cms,
                currentDate: startDate,
                datePickerSelector: filterAdvancedToDateV2,
                dateRange: endMoment.diff(startMoment, 'days'),
            });
        }
    );

    await cms.instruction(`Filters lesson day of the week: ${startDate}`, async function () {
        await selectDayOfTheWeek(cms, scenario, Number(startDate.getDay()) + 1);
    });

    await schoolAdminApplyFilterAdvanced(cms);
    await cms.page!.keyboard.press('Escape');
    await cms.waitForSkeletonLoading();
}

export async function lessonRecurringOnLessonList(
    cms: CMSInterface,
    scenario: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    switch (lessonTime) {
        case 'past': {
            const lessonId = scenario.get(aliasLessonId);
            const { name: studentName } = getUserProfileFromContext(
                scenario,
                learnerProfileAliasWithAccountRoleSuffix('student')
            );

            await assertSeeLessonOnCMS({
                cms,
                lessonId,
                studentName,
                shouldSeeLesson: true,
                lessonTime,
            });

            break;
        }
        case 'future':
        default: {
            const startDate = new Date(scenario.get(aliasStartDate));
            const endDate = new Date(scenario.get(aliasEndDate));
            const startMoment = moment(startDate);
            const endMoment = moment(endDate);

            const page = cms.page!;
            await page.waitForSelector(lessonLink);

            const allLesson = await page.$$(lessonTableRowWithTab(lessonTime));
            const lessonId = scenario.get(aliasLessonId);
            const lessonIdList = await Promise.all(
                allLesson.map((lesson) => lesson.getAttribute('data-value'))
            );

            scenario.set(aliasLessonIdList, lessonIdList);

            const numberFutureLesson =
                endMoment.diff(startMoment, 'weeks') + (lessonIdList.includes(lessonId) ? 1 : 0);

            weExpect(allLesson).toHaveLength(numberFutureLesson);
            break;
        }
    }
}

export async function seeLessonRecurringOnLessonList(
    cms: CMSInterface,
    scenario: ScenarioContext,
    lessonTime: LessonTimeValueType
) {
    await cms.instruction(`Go to ${lessonTime} list page`, async function () {
        await chooseLessonTabOnLessonList(cms, lessonTime);
    });
    const { name: studentName } = getUserProfileFromContext(
        scenario,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );

    await cms.instruction('Search student', async function () {
        await searchLessonByStudentNameUtil({ cms, studentName, lessonTime });
    });

    await lessonRecurringOnLessonList(cms, scenario, lessonTime);
}

export async function shouldDisplayLessonOnTeacherApp(
    teacher: TeacherInterface,
    courseId: string,
    lessonId: string,
    shouldDisplay = true
) {
    await teacher.instruction(
        `${
            shouldDisplay ? '' : 'does not'
        } sees created lesson ${lessonId} with course ${courseId}`,
        async function () {
            if (shouldDisplay) {
                await teacherWaitForLessonItem(teacher, lessonId, '');
            } else {
                await teacherWaitForAbsentLessonItem(teacher, lessonId, '');
            }
        }
    );
}

export async function shouldDisplayLessonOnLeanerApp(
    learner: LearnerInterface,
    lessonId: string,
    shouldDisplay = true
) {
    await learner.instruction(
        `${shouldDisplay ? '' : 'does not'} sees created lesson ${lessonId}`,
        async function () {
            const driver = learner.flutterDriver!;
            const lesson = new ByValueKey(VirtualClassroomKeys.liveLessonItem(lessonId, ''));

            if (shouldDisplay) {
                const scrollViewFinder = new ByValueKey(
                    VirtualClassroomKeys.liveLessonItem(lessonId, '')
                );
                await driver.scrollUntilVisible(scrollViewFinder, lesson, 0.0, 0.0, -100);
            } else await driver.waitForAbsent(lesson);
        }
    );
}

export async function assertLessonRecurringOnTeacherApp(
    teacher: TeacherInterface,
    scenario: ScenarioContext,
    lessonTime: LessonManagementLessonTime,
    shouldDisplay = true
) {
    const courseId = scenario.get(aliasCourseId);
    const driver = teacher.flutterDriver!;

    if (!driver.webDriver?.page.url().includes('courseDetail')) {
        await teacher.instruction('Go to the course of the lesson', async function () {
            await goToCourseDetailOnTeacherAppByCourseId(teacher, courseId);
        });
    }

    switch (lessonTime) {
        case 'past': {
            const lessonId = scenario.get(aliasLessonId);

            await teacher.instruction('Select Complete tab', async function () {
                const completeLessonTab = new ByValueKey(TeacherKeys.lessonCompletedTab);
                await driver.tap(completeLessonTab);
            });

            await shouldDisplayLessonOnTeacherApp(teacher, courseId, lessonId, shouldDisplay);

            break;
        }
        case 'future':
        default: {
            const lessonIdList = scenario.get<string[]>(aliasLessonIdList);

            await teacher.instruction('Select Active tab', async function () {
                const driver = teacher.flutterDriver!;
                const activeLessonTab = new ByValueKey(TeacherKeys.lessonActiveTab);
                await driver.tap(activeLessonTab, 20000);
            });

            for (const lessonId of lessonIdList) {
                await shouldDisplayLessonOnTeacherApp(teacher, courseId, lessonId, shouldDisplay);
            }

            break;
        }
    }
}

export async function assertLessonRecurringOnLeanerApp(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    shouldDisplay = true
) {
    const lessonIdList = scenario.get(aliasLessonIdList);

    await learner.instruction('Go to the course of the lesson', async function () {
        await learnerGoToLesson(learner);
    });

    for (const lessonId of lessonIdList) {
        await shouldDisplayLessonOnLeanerApp(learner, lessonId, shouldDisplay);
    }
}

export async function createRecurringLessonWithMissingEndDateField(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    const { name: teacherName } = getUserProfileFromContext(
        scenario,
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );
    const { name: studentName } = getUserProfileFromContext(
        scenario,
        learnerProfileAliasWithAccountRoleSuffix('student')
    );
    const centerName = scenario.get(aliasLocationName);

    await cms.instruction('has selected weekly recurring', async function () {
        await selectRecurring(cms);
    });

    await cms.instruction('fill other field', async function () {
        await fillUpsertFormLessonOfLessonManagement({
            cms,
            teacherName,
            studentName,
            centerName,
            missingFields: [],
        });
    });

    await cms.instruction('saves lesson of lesson management`', async function () {
        await triggerSubmitLesson(cms);
    });
}
