import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';
import { getLastDayOfSpecificMonth, getTomorrow, getYesterday } from '@supports/utils/time/time';

import { aliasLessonInfo } from './alias-keys/lesson';
import { schoolAdminOpenFilterAdvanced } from './cms-common-definitions';
import { retrieveLessonEndpoint } from './endpoints/lesson-management';
import { FilteredDateAndTimeOptions } from './lesson-filter-future-lesson-by-date-and-time-definitions';
import { applyTimePicker, changeTimePicker } from './lesson-management-utils';
import { teacherTapOnLessonItem } from './lesson-teacher-utils';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { isTeacherRole } from './utils';
import { ByValueKey } from 'flutter-driver-x';
import {
    datePickerWithValue,
    filterAdvancedEndTime,
    filterAdvancedFromDate,
    filterAdvancedStartTime,
    filterAdvancedToDate,
    lessonInfoLocation,
    lessonInfoCourseColumn,
    lessonInfoDayOfWeek,
    lessonInfoEndTime,
    lessonInfoGradeColumn,
    lessonInfoLessonDate,
    lessonInfoStartTime,
    lessonInfoStudentNameColumn,
    lessonInfoTeachers,
    lessonInfoTeachingMedium,
    lessonInfoTeachingMethod,
    LessonManagementLessonDetailTabNames,
    nextLessonMonth,
    previousLessonMonth,
    tableAddStudentSubscriptionAddButton,
    tableAddStudentSubscriptionCheckboxSelectAll,
    teachingMediumSelected,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    assertToSeeTheLessonOnTeacherApp,
    changeLessonTimeToEndOfDay,
    changeLessonTimeToMorning,
    openDialogAddStudentSubscription,
    selectCenterByPosition,
    selectTeacher,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { selectApplyButton } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';
import {
    LessonManagementLessonTime,
    LessonUpsertFields,
    TeachingMedium,
} from 'test-suites/squads/lesson/types/lesson-management';
import { changeLessonDateToTomorrow } from 'test-suites/squads/lesson/utils/lesson-management';
import { selectTeachingMedium } from 'test-suites/squads/lesson/utils/lesson-upsert';

type PotentialString = string | undefined | null;

export interface LessonManagementLessonData {
    lessonDate: PotentialString;
    dayOfWeek: PotentialString;
    startTime: PotentialString;
    endTime: PotentialString;
    teachingMedium: PotentialString;
    teachingMethod: PotentialString;
    center: PotentialString;
    teacherNames: PotentialString;
    studentNames: PotentialString[];
    studentCourses: PotentialString[];
    studentGrades: PotentialString[];
}

export async function getLessonDataOnLessonDetailPage(
    cms: CMSInterface
): Promise<LessonManagementLessonData> {
    const [
        lessonDate,
        dayOfWeek,
        startTime,
        endTime,
        teachingMedium,
        teachingMethod,
        center,
        teacherNames,
        studentNames,
        studentGrades,
        studentCourses,
    ] = await Promise.all([
        cms.page!.textContent(lessonInfoLessonDate),
        cms.page!.textContent(lessonInfoDayOfWeek),
        cms.page!.textContent(lessonInfoStartTime),
        cms.page!.textContent(lessonInfoEndTime),
        cms.page!.textContent(lessonInfoTeachingMedium),
        cms.page!.textContent(lessonInfoTeachingMethod),
        cms.page!.textContent(lessonInfoLocation),
        cms.page!.textContent(lessonInfoTeachers),
        cms.getTextContentMultipleElements(lessonInfoStudentNameColumn),
        cms.getTextContentMultipleElements(lessonInfoGradeColumn),
        cms.getTextContentMultipleElements(lessonInfoCourseColumn),
    ]);

    const result: LessonManagementLessonData = {
        lessonDate,
        dayOfWeek,
        startTime,
        endTime,
        teachingMedium,
        teachingMethod,
        center,
        teacherNames,
        studentNames,
        studentGrades,
        studentCourses,
    };

    return result;
}

export function getUserProfileAliasByRole(role: AccountRoles) {
    const isTeacher = isTeacherRole(role);
    const profileAlias = isTeacher
        ? staffProfileAliasWithAccountRoleSuffix(role)
        : learnerProfileAliasWithAccountRoleSuffix(role);

    return { isTeacher, profileAlias };
}

export async function compare2LessonData(params: {
    cms: CMSInterface;
    dataIsCompared: LessonManagementLessonData;
    shouldMatch?: boolean;
}) {
    const { cms, dataIsCompared, shouldMatch = true } = params;

    const currentData = await getLessonDataOnLessonDetailPage(cms);

    if (shouldMatch) {
        weExpect(currentData).toEqual(dataIsCompared);
        return;
    }

    weExpect(currentData).not.toEqual(dataIsCompared);
}

async function updateLessonStartTimeToStartOfDay(cms: CMSInterface) {
    await changeTimePicker({
        cms,
        timePickerSelector: filterAdvancedStartTime,
        hour: '00',
        minute: '15',
    });
}

async function updateLessonEndTimeToEndOfDay(cms: CMSInterface) {
    await changeTimePicker({
        cms,
        timePickerSelector: filterAdvancedEndTime,
        hour: '23',
        minute: '45',
    });
}

async function updateLessonStartDateToYesterday(cms: CMSInterface, startDate: Date) {
    const page = cms.page!;

    await page.click(filterAdvancedFromDate);

    const isStartOfMonth = startDate.getDate() === 1;
    if (isStartOfMonth) {
        await page.click(previousLessonMonth);
    }

    const date = getYesterday(startDate).getDate().toString();
    await page.click(datePickerWithValue(date));
    await applyTimePicker(cms);
}

async function updateLessonEndDateToTomorrow(cms: CMSInterface, endDate: Date) {
    const page = cms.page!;

    await page.click(filterAdvancedToDate);

    const lastDayOfMonth = getLastDayOfSpecificMonth(endDate).getDate();
    if (lastDayOfMonth === endDate.getDate()) {
        await page.click(nextLessonMonth);
    }

    const date = getTomorrow(endDate).getDate();
    await page.click(datePickerWithValue(date));
    await applyTimePicker(cms);
}

export async function updateAndApplyDateTimeFieldsOfLesson(
    cms: CMSInterface,
    lessonField: FilteredDateAndTimeOptions,
    scenarioContext: ScenarioContext
) {
    const lessonInfo = scenarioContext.get<CreateLessonRequestData>(aliasLessonInfo);
    const { startTime, endTime } = lessonInfo;

    await schoolAdminOpenFilterAdvanced(cms);

    switch (lessonField) {
        case 'Start Time':
            await updateLessonStartTimeToStartOfDay(cms);
            break;

        case 'End Time':
            await updateLessonEndTimeToEndOfDay(cms);
            break;

        case 'Lesson Start Date': {
            await updateLessonStartDateToYesterday(cms, startTime!);
            break;
        }

        default: {
            await updateLessonEndDateToTomorrow(cms, endTime!);
            break;
        }
    }

    await Promise.all([cms.waitForGRPCResponse(retrieveLessonEndpoint), selectApplyButton(cms)]);
}

export async function updateFieldOfLesson(
    cms: CMSInterface,
    lessonField: LessonUpsertFields,
    lessonTime: LessonManagementLessonTime = 'future'
) {
    const page = cms.page!;

    switch (lessonField) {
        case 'teaching medium': {
            const currentTeachingMedium = await page.inputValue(teachingMediumSelected);

            const teachingOffline: TeachingMedium = 'LESSON_TEACHING_MEDIUM_OFFLINE';
            const teachingOnline: TeachingMedium = 'LESSON_TEACHING_MEDIUM_ONLINE';
            const invertTeachingMediumValue =
                currentTeachingMedium === teachingOffline ? teachingOnline : teachingOffline;

            await selectTeachingMedium(cms, invertTeachingMediumValue);
            return;
        }

        case 'center': {
            await selectCenterByPosition(cms, 2);
            return;
        }

        case 'teaching method':
            return;

        case 'lesson date':
            await changeLessonDateToTomorrow(cms);
            return;

        case 'teacher':
            await selectTeacher(cms);
            return;

        case 'student': {
            await openDialogAddStudentSubscription(cms);

            await cms.instruction('Select all student of 1st page', async function () {
                await page.click(tableAddStudentSubscriptionCheckboxSelectAll);
                await page.click(tableAddStudentSubscriptionAddButton);
            });

            return;
        }

        case 'start time':
        case 'end time':
        default: {
            if (lessonTime === 'future') {
                await changeLessonTimeToEndOfDay(cms);
                return;
            }

            await changeLessonTimeToMorning(cms);
            return;
        }
    }
}

function getLessonDataKeywordByLessonField(
    lessonField: LessonUpsertFields
): keyof LessonManagementLessonData {
    switch (lessonField) {
        case 'lesson date':
            return 'lessonDate';

        case 'start time':
            return 'startTime';

        case 'end time':
            return 'endTime';

        case 'teaching medium':
            return 'teachingMedium';

        case 'teaching method':
            return 'teachingMethod';

        case 'teacher':
            return 'teacherNames';

        case 'center':
            return 'center';

        case 'student':
        default:
            return 'studentNames';
    }
}

export async function compareFieldOfLessonData(params: {
    cms: CMSInterface;
    dataIsCompared: LessonManagementLessonData;
    lessonField: LessonUpsertFields;
    shouldMatch?: boolean;
}) {
    const { cms, dataIsCompared, lessonField, shouldMatch = true } = params;

    const currentData = await getLessonDataOnLessonDetailPage(cms);
    const fieldIsCompared = getLessonDataKeywordByLessonField(lessonField);

    if (shouldMatch) {
        weExpect(dataIsCompared[fieldIsCompared]).toEqual(currentData[fieldIsCompared]);
        return;
    }

    weExpect(dataIsCompared[fieldIsCompared]).not.toEqual(currentData[fieldIsCompared]);
}

export async function assertStudentOnStudentListOfCourseOnTeacherApp(params: {
    teacher: TeacherInterface;
    courseId: string;
    lessonId: string;
    studentId: string;
    lessonTime: LessonManagementLessonTime;
    shouldBeOnList?: boolean;
}) {
    const { teacher, courseId, lessonId, studentId, lessonTime, shouldBeOnList = true } = params;
    const driver = teacher.flutterDriver!;

    await teacher.instruction('Teacher goes to student list of the lesson', async function () {
        await assertToSeeTheLessonOnTeacherApp({
            teacher,
            courseId,
            lessonTime,
            lessonId,
            lessonName: '',
        }); // Lesson of lesson management has no name
    });
    await teacherTapOnLessonItem(teacher, lessonId, ''); // Lesson of lesson management has no name

    await teacher.instruction('Teacher click on student tab', async function () {
        const studentTab = new ByValueKey(TeacherKeys.studentTab);
        await driver.tap(studentTab);
    });

    await teacher.instruction(
        `Assert student ${shouldBeOnList ? '' : 'not'} visible`,
        async function () {
            const student = new ByValueKey(TeacherKeys.student(studentId));
            shouldBeOnList ? await driver.waitFor(student) : await driver.waitForAbsent(student);
        }
    );
}

export async function chooseLessonDetailTab(
    cms: CMSInterface,
    tab: LessonManagementLessonDetailTabNames
) {
    await cms.instruction(`Choose ${tab} on lesson detail`, async function () {
        const desireTab = await cms.waitForTabListItem(tab);
        await desireTab!.click();
    });
}
