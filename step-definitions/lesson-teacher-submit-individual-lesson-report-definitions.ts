import {
    learnerProfileAlias,
    teacherProfileAlias,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import lessonManagementService from '@supports/services/bob-lesson-management';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';
import { usermgmtUserModifierService } from '@supports/services/usermgmt-student-service';
import NsUsermgmtUserModifierService from '@supports/services/usermgmt-student-service/request-types';

import {
    aliasLessonId,
    aliasLessonInfo,
    aliasLessonName,
    aliasLessonTime,
    aliasLocationId,
    aliasStudentInfoList,
    aliasCourseId,
    aliasCourseName,
    aliasCourseIdByStudent,
} from './alias-keys/lesson';
import * as CMSKeys from './cms-selectors/cms-keys';
import {
    fillAllInputOfLessonReport,
    selectValueForAllAutocompleteFields,
} from './lesson-report-utils';
import { userIsOnLessonDetailPage } from './lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import { arrayHasItem, delay, getUsersFromContextByRegexKeys } from './utils';
import {
    LessonStatus,
    StudentAttendStatus,
    CreateLessonSavingMethod,
    StudentAttendanceNotice,
    StudentAttendanceReason,
    Material,
} from 'manabuf/bob/v1/lessons_pb';
import { LessonTeachingMedium, LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import {
    aliasCourseId as aliasCourseIdSyllabus,
    aliasCourseName as aliasCourseNameSyllabus,
} from 'step-definitions/alias-keys/syllabus';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import { createSampleStudentWithCourseAndEnrolledStatus } from 'step-definitions/lesson-management-utils';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';
import {
    createACoursePromise,
    createStudentPackageProfiles,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';
import { retry } from 'ts-retry-promise';

export type LessonReportStatusTag = 'Submitted' | 'Draft';
export type FillAutocompleteMode = 'without attendance status' | 'all';
export type LessonManagementCreateLessonTime =
    | 'within 10 minutes from now'
    | 'more than 10 minutes from now'
    | 'completed over 24 hours'
    | 'completed within 24 hours'
    | 'completed before 24 hours ago'
    | 'a specific date'
    | 'in progress'
    | 'in the next week'
    | 'in the last week'
    | 'in the next month'
    | 'in the previous month'
    | 'in the next year'
    | 'in the last year'
    | 'start the last month and end date yesterday'
    | 'start current and end date in the next month';
export type TeachingMedium = 'Offline' | 'Online';

export type StudentCoursePackage = { courseId: string; studentId: string };

export async function addACourseForStudentsByGRPC(params: {
    cms: CMSInterface;
    scenario: ScenarioContext;
    studentId: string;
}) {
    const { cms, scenario, studentId } = params;

    let courseId = scenario.get(aliasCourseId);
    let courseName = scenario.get(aliasCourseName);
    let courseLocationIds: string[] = [];

    const token = await cms.getToken();

    if (!courseId || !courseName) {
        const { id, name, locations: randomLocations } = await createACoursePromise(cms);

        courseId = id;
        courseName = name;
        if (randomLocations) {
            courseLocationIds = randomLocations.map((location) => location.locationId);
        }
    }
    scenario.set(aliasCourseId, courseId);
    scenario.set(aliasCourseName, courseName);

    // For study plan
    scenario.set(aliasCourseIdSyllabus, courseId);
    scenario.set(aliasCourseNameSyllabus, courseName);

    const startTime = new Date();
    const endTime = new Date();
    startTime.setDate(startTime.getDate() - 1);
    endTime.setDate(endTime.getDate() + 1);

    const newCourses = await createStudentPackageProfiles(cms, {
        courseIds: [courseId],
        startTime,
        endTime,
    });

    const studentPackages: NsUsermgmtUserModifierService.StudentPackage[] = newCourses.map(
        (courseInfo) => ({
            courseId: courseInfo.courseId,
            studentPackageId: '',
            startTime: courseInfo.startTime,
            endTime: courseInfo.endTime,
            locationId: courseLocationIds[0],
        })
    );

    const { request } = await usermgmtUserModifierService.upsertStudentCoursePackageReq(token, {
        studentId,
        studentPackages,
    });

    return {
        courseId: request.studentPackageProfilesList[0].courseId,
        studentId: request.studentId,
    };
}

export async function createLessonManagementIndividualLessonWithGRPC(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonManagementCreateLessonTime,
    teachingMedium: TeachingMedium = 'Online',
    methodSavingOption?: CreateLessonSavingMethod,
    materialsList?: Material.AsObject[],
    schedulingStatus?: LessonStatus
) {
    const cmsToken = await cms.getToken();

    // Setup lesson date & time
    const startDate = new Date();
    const endDate = new Date();
    const timestampOneDay = 24 * 60 * 60 * 1000;
    const recurrenceEndDate = new Date(new Date().getTime() + 30 * timestampOneDay);

    switch (lessonTime) {
        case 'within 10 minutes from now':
            startDate.setMinutes(startDate.getMinutes() + 5);
            endDate.setMinutes(endDate.getMinutes() + 10);
            break;

        case 'more than 10 minutes from now':
            startDate.setHours(startDate.getHours() + 1);
            endDate.setMinutes(endDate.getMinutes() + 65);
            break;

        case 'completed within 24 hours':
            startDate.setHours(startDate.getHours() - 5);
            startDate.setMinutes(10);

            endDate.setHours(endDate.getHours() - 5);
            endDate.setMinutes(15);
            break;

        case 'completed over 24 hours':
            startDate.setDate(startDate.getDate() - 1);
            startDate.setMinutes(startDate.getMinutes() + 5);

            endDate.setDate(startDate.getDate());
            endDate.setMinutes(endDate.getMinutes() + 10);
            break;

        case 'completed before 24 hours ago':
            startDate.setDate(startDate.getDate() - 1);
            startDate.setMinutes(startDate.getMinutes() - 10);

            endDate.setDate(startDate.getDate());
            endDate.setMinutes(endDate.getMinutes() - 5);
            break;

        case 'a specific date':
            startDate.setDate(startDate.getDate() - 5);
            startDate.setMinutes(startDate.getMinutes() - 10);

            endDate.setDate(startDate.getDate());
            endDate.setMinutes(endDate.getMinutes() - 5);
            break;

        case 'in progress':
            endDate.setMinutes(endDate.getMinutes() + 5);
            break;

        case 'in the next week':
            startDate.setDate(startDate.getDate() + 7);
            endDate.setDate(endDate.getDate() + 7);
            endDate.setMinutes(endDate.getMinutes() + 5);
            break;

        case 'in the last week':
            startDate.setDate(startDate.getDate() - 7);
            startDate.setMinutes(endDate.getMinutes() - 5);
            endDate.setDate(endDate.getDate() - 7);
            break;

        case 'in the next month':
            startDate.setMonth(startDate.getMonth() + 1);
            startDate.setDate(1);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(1);
            endDate.setMinutes(endDate.getMinutes() + 5);
            break;

        case 'in the previous month':
            startDate.setMonth(startDate.getMonth() - 1);
            startDate.setDate(1);
            endDate.setMonth(endDate.getMonth() - 1);
            endDate.setDate(1);
            endDate.setMinutes(endDate.getMinutes() + 5);
            break;

        case 'in the next year':
            startDate.setFullYear(startDate.getFullYear() + 1);
            startDate.setMonth(1);
            endDate.setFullYear(endDate.getFullYear() + 1);
            endDate.setMonth(1);
            endDate.setMinutes(endDate.getMinutes() + 5);
            break;
        case 'in the last year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            startDate.setMonth(1);
            endDate.setFullYear(endDate.getFullYear() - 1);
            endDate.setMonth(1);
            endDate.setMinutes(endDate.getMinutes() + 5);
            break;
        case 'start current and end date in the next month':
            endDate.setMinutes(endDate.getMinutes() + 5);
            break;

        case 'start the last month and end date yesterday':
            startDate.setDate(startDate.getDate() - 30);
            endDate.setDate(endDate.getDate() - 1);
            endDate.setMinutes(endDate.getMinutes() + 5);

            recurrenceEndDate.setDate(new Date().getDate() - 1);
            break;

        default:
            return;
    }

    // Setup Teaching Medium
    const teachingMediumObject: Record<TeachingMedium, LessonTeachingMedium> = {
        Offline: LessonTeachingMedium.LESSON_TEACHING_MEDIUM_OFFLINE,
        Online: LessonTeachingMedium.LESSON_TEACHING_MEDIUM_ONLINE,
    };

    // Setup teacher info
    const teacherIds: string[] = [];

    const teachers = getUsersFromContextByRegexKeys(scenarioContext, teacherProfileAlias);
    if (arrayHasItem(teachers)) {
        teachers.map((teacher) => teacherIds.push(teacher.id));
    } else {
        const teacher = await createARandomStaffFromGRPC(cms);
        teacherIds.push(teacher.id);

        const teacherProfileAliasKey = staffProfileAliasWithAccountRoleSuffix('teacher');
        scenarioContext.set(teacherProfileAliasKey, teacher);
    }

    // Setup student info
    const learnerIds: string[] = [];
    const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);

    if (arrayHasItem(learners)) {
        learners.forEach((learner) => learnerIds.push(learner.id));
    } else {
        const { student } = await createSampleStudentWithCourseAndEnrolledStatus({
            cms,
            scenarioContext,
            studentRole: 'student',
        });
        learnerIds.push(student.id);
    }

    // Setup center info
    const locationIdFromContext = scenarioContext.get(aliasLocationId);

    const studentInfoListList: CreateLessonRequestData['studentInfoListList'] = learnerIds.map(
        (learnerId) => {
            // Setup course for student
            const courseIdFromContext = scenarioContext.get(aliasCourseIdByStudent(learnerId));

            return {
                attendanceStatus: StudentAttendStatus.STUDENT_ATTEND_STATUS_EMPTY,
                courseId: courseIdFromContext,
                studentId: learnerId,
                locationId: locationIdFromContext,
                attendanceNotice: StudentAttendanceNotice.NOTICE_EMPTY,
                attendanceReason: StudentAttendanceReason.REASON_EMPTY,
                attendanceNote: '',
            };
        }
    );
    scenarioContext.set(aliasStudentInfoList, studentInfoListList);

    // Call gRPC
    const lessonRequest: CreateLessonRequestData = {
        startTime: startDate,
        endTime: endDate,
        teacherIdsList: teacherIds,
        centerId: locationIdFromContext,
        materialsList: materialsList ? materialsList : [],
        studentInfoListList,
        teachingMedium: teachingMediumObject[teachingMedium],
        teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
        classId: '',
        courseId: '',
        savingOption: {
            recurrence: {
                endDate: recurrenceEndDate,
            },
            method:
                methodSavingOption || CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
        },
        schedulingStatus: schedulingStatus || LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED,
        timeZone: 'Asia/Saigon',
    };

    await retry(
        async function () {
            const lesson = await lessonManagementService.createLesson(cmsToken, lessonRequest);
            scenarioContext.set(aliasLessonInfo, lessonRequest);
            scenarioContext.set(aliasLessonId, lesson.response?.id);
            scenarioContext.set(aliasLessonName, '');
        },
        { retries: 2, delay: 5000 }
    )
        .catch(function (reason) {
            throw Error(`Create lesson error: ${JSON.stringify(reason)}`);
        })
        .finally(function () {
            setLessonTimeToContext(scenarioContext, lessonTime);
        });
}

export function setLessonTimeToContext(
    scenarioContext: ScenarioContext,
    lessonTime: LessonManagementCreateLessonTime
) {
    let createdLessonTime: LessonManagementLessonTime;

    switch (lessonTime) {
        case 'within 10 minutes from now':
        case 'more than 10 minutes from now':
        case 'in progress':
        case 'in the next week':
        case 'in the next month':
        case 'in the next year':
        case 'start current and end date in the next month':
            createdLessonTime = 'future';
            break;

        case 'completed over 24 hours':
        case 'completed within 24 hours':
        case 'completed before 24 hours ago':
        case 'a specific date':
        case 'in the last week':
        case 'in the previous month':
        case 'in the last year':
        case 'start the last month and end date yesterday':
            createdLessonTime = 'past';
            break;
    }

    scenarioContext.set(aliasLessonTime, createdLessonTime);
}

export async function goToLessonDetailByLinkWithLessonId(cms: CMSInterface, lessonId: string) {
    const newLessonLink = `/lesson/lesson_management/${lessonId}/show`;

    await cms.instruction(`Go to lesson by link ${newLessonLink}`, async function () {
        await cms.page!.goto(newLessonLink);
        await cms.waitingForLoadingIcon();
    });
}

export async function isLessonReportFulfilled(cms: CMSInterface) {
    const page = cms.page!;

    const allLessonReportDetailValueLabels = await page.$$(
        LessonManagementKeys.lessonReportDetailValueLabels
    );
    const allLessonReportDetailValues = await page.$$(
        LessonManagementKeys.lessonReportDetailValues
    );
    const allLessonReportDetailEmptyValues = await page.$$(
        LessonManagementKeys.lessonReportDetailEmptyValues
    );

    weExpect(allLessonReportDetailValues).toHaveLength(allLessonReportDetailValueLabels.length);
    weExpect(allLessonReportDetailEmptyValues).toHaveLength(0);
}

export async function chooseLessonTabOnLessonList(
    cms: CMSInterface,
    lessonTime: LessonManagementLessonTime
) {
    const desireTab =
        lessonTime === 'future'
            ? LessonManagementKeys.LessonManagementListTabNames.FUTURE_LESSONS
            : LessonManagementKeys.LessonManagementListTabNames.PAST_LESSONS;

    const lessonsTab = await cms.waitForTabListItem(desireTab);
    await lessonsTab!.click();

    await delay(2000); // Wait for changed tab
}

export async function checkLessonReportStatusTag(cms: CMSInterface, tag: LessonReportStatusTag) {
    await cms.page!.waitForSelector(LessonManagementKeys.lessonReportStatusTag(tag));
}

export async function seeAlertMessageMissingAttendanceStatus(cms: CMSInterface) {
    await cms.page!.waitForSelector(LessonManagementKeys.attendanceStatusMissingFieldMessage);
}

export async function seeErrorIconOnStudentListOfLessonReport(cms: CMSInterface) {
    const errorIconsList = await cms.page!.$$(LessonManagementKeys.errorIconOnStudentList);
    weExpect(errorIconsList.length).toBeGreaterThan(0);
}

export async function isOnLessonReportUpsertPage(cms: CMSInterface) {
    await cms.page!.waitForSelector(
        LessonManagementKeys.lessonManagementIndividualReportUpsertDialog
    );
}

export async function isOnLessonReportDetailPage(cms: CMSInterface) {
    await cms.page!.waitForSelector(LessonManagementKeys.lessonReportDetailPageContainer);
    await cms.waitForTabListItem(
        LessonManagementKeys.LessonManagementLessonDetailTabNames.LESSON_REPORT
    );
}

export async function clickSubmitAllLessonReport(cms: CMSInterface) {
    await cms.selectElementByDataTestId(LessonManagementKeys.lessonReportSubmitAllButton);
}

export async function submitIndividualLessonReport(cms: CMSInterface, shouldConfirm: boolean) {
    await clickSubmitAllLessonReport(cms);
    await cms.page!.waitForSelector(CMSKeys.dialogActions);

    if (shouldConfirm) {
        await Promise.all([
            cms.waitForHasuraResponse('LessonReportByLessonId'),
            cms.confirmDialogAction(),
        ]);
    } else {
        await cms.cancelDialogAction();
    }
}

export async function selectValueLessonReportAutocomplete(params: {
    cms: CMSInterface;
    chooseItemAt: number;
    shouldSelectAutocomplete: FillAutocompleteMode;
}) {
    const { cms, chooseItemAt, shouldSelectAutocomplete } = params;

    const autocompleteNeedToFill =
        shouldSelectAutocomplete === 'without attendance status'
            ? LessonManagementKeys.lessonReportAutocompleteInputsDynamicFieldOnly
            : LessonManagementKeys.allAutocompleteInputs;

    await selectValueForAllAutocompleteFields({
        cms,
        autocompleteInputSelector: autocompleteNeedToFill,
        chooseItemAt,
    });
}

export async function fillAllTextFields(cms: CMSInterface, content: string) {
    await fillAllInputOfLessonReport({
        cms,
        inputSelector: LessonManagementKeys.lessonReportTextField,
        fillContent: content,
    });
}

export async function fillAllPercentageFields(cms: CMSInterface, content: string | number) {
    await fillAllInputOfLessonReport({
        cms,
        inputSelector: LessonManagementKeys.lessonReportPercentageField,
        fillContent: content,
    });
}
export async function fillAllTextAreaFields(cms: CMSInterface, content: string) {
    await fillAllInputOfLessonReport({
        cms,
        inputSelector: LessonManagementKeys.lessonReportTextAreaField,
        fillContent: content,
    });
}

export async function openLessonReportUpsertDialog(cms: CMSInterface) {
    await cms.selectElementByDataTestId(LessonManagementKeys.createLessonReportButton);
    await cms.waitForDataTestId(LessonManagementKeys.lessonReportUpsertDialog);
}

export async function fulfillLessonReportInfo(cms: CMSInterface) {
    await cms.waitingForLoadingIcon();

    await selectValueLessonReportAutocomplete({
        cms,
        chooseItemAt: 1,
        shouldSelectAutocomplete: 'all',
    });
    await fillAllTextFields(cms, 'Sample Text');
    await fillAllPercentageFields(cms, 99);
    await fillAllTextAreaFields(cms, 'Sample Text');
}

export async function goToDetailedLessonInfoPage(cms: CMSInterface, lessonId: string) {
    await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');

    await retry(
        async function () {
            await goToLessonDetailByLinkWithLessonId(cms, lessonId);
            await userIsOnLessonDetailPage(cms);
        },
        { retries: 1 }
    ).catch(async function () {
        throw new Error('404 page not found error');
    });
}
