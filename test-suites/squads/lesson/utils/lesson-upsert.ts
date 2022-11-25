import { TeacherKeys } from '@common/teacher-keys';
import { assertSeeLessonOnTeacherApp } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { createSampleStudentWithCourseAndEnrolledStatus } from '@legacy-step-definitions/lesson-management-utils';
import {
    teacherOpenLocationFilterDialogOnTeacherApp,
    teacherSelectLocationsOnTeacherApp,
} from '@legacy-step-definitions/lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import {
    learnerProfileAlias,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import { footerDialogConfirmButtonSave } from '@user-common/cms-selectors/students-page';

import { Response } from 'playwright';

import { AccountRoles, CMSInterface, Tenant, TeacherInterface } from '@supports/app-types';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import lessonManagementService from '@supports/services/lessonmgmt';
import { CreateLessonRequestData } from '@supports/services/lessonmgmt/lesson-management-service';

import {
    openCreateLessonPage,
    saveLessonByLessonName,
    selectLessonDateWithType,
    selectMultiStudent,
    selectMultiTeacher,
    selectTeachingMethod,
    setupStudent,
    setupTeacher,
    StudentInfo,
    submitLessonWithMaterial,
    waitCreateLesson,
} from '../step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { selectCenterByName } from '../step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';
import { MaterialFile } from '../types/material';
import { getLessonDataOnLessonDetailPage } from './lesson-detail';
import { ByValueKey, delay } from 'flutter-driver-x';
import { CreateLessonResponse } from 'manabuf/bob/v1/lessons_pb';
import { LessonTeachingMedium, LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import {
    CreateLessonSavingMethod,
    LessonStatus,
    StudentAttendanceNotice,
    StudentAttendanceReason,
} from 'manabuf/lessonmgmt/v1/enums_pb';
import { Material, StudentAttendStatus } from 'manabuf/lessonmgmt/v1/lessons_pb';
import moment from 'moment-timezone';
import { getUsersFromContextByRegexKeys } from 'test-suites/common/step-definitions/user-common-definitions';
import {
    aliasClassId,
    aliasClassName,
    aliasCourseId,
    aliasCourseIdByStudent,
    aliasCourseName,
    aliasDuplicatedLessonId,
    aliasEndDate,
    aliasGroupLessonInfo,
    aliasIndividualLessonInfo,
    aliasLessonId,
    aliasLessonInfo,
    aliasLessonName,
    aliasLessonTime,
    aliasLocationId,
    aliasLocationName,
    aliasStartDate,
    aliasStudentInfoList,
    aliasTeachingMedium,
} from 'test-suites/squads/lesson/common/alias-keys';
import {
    checkBoxOfTableRow,
    chipAutocompleteIconDelete,
    classAutoCompleteInputV3,
    confirmApplyButton,
    courseAutoCompleteInputV3,
    lessonInfoClassNames,
    lessonInfoCourseNames,
    lessonInfoLocation,
    teachingMediumRadioButton,
    lessonInfoDayOfWeek,
    lessonInfoEndTime,
    lessonInfoLessonDate,
    lessonInfoStartTime,
    lessonInfoStudentNameColumn,
    lessonInfoTeachers,
    lessonInfoTeachingMedium,
    lessonInfoTeachingMethod,
    actionPanelTrigger,
    lessonManagementLessonSubmitButton,
    duplicateLessonMenuItemSelector,
    upsertLessonDialog,
    lessonDetailSavingOption,
    teacherAutocompleteV3,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    locationsLowestLevelAutocompleteInputV3,
    teacherAutocompleteInputV3,
} from 'test-suites/squads/lesson/common/cms-selectors';
import { endTimeUpdate, startTimeUpdate } from 'test-suites/squads/lesson/common/constants';
import { UserProfileEntity } from 'test-suites/squads/lesson/common/lesson-profile-entity';
import {
    AttendanceStatusValues,
    LessonSavingMethodType,
    LessonTimeValueType,
    LessonUpsertFields,
    MethodSavingType,
} from 'test-suites/squads/lesson/common/types';
import { createSampleStudentWithPackage } from 'test-suites/squads/lesson/services/student-service/student-service';
import {
    changeEndTimeLesson,
    changeStartTimeLesson,
    selectStudentSubscriptionV2,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import {
    selectEndDateByDateRange,
    selectRecurring,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-creates-weekly-recurring-individual-lesson-definitions';
import {
    filterLessonListByStudentName,
    OrderLessonInRecurringChain,
    selectLessonLinkByLessonOrder,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';
import {
    GroupLessonInfo,
    IndividualLessonInfo,
    LessonManagementLessonName,
    LessonManagementLessonTime,
    TeachingMedium,
    TeachingMediumValueType,
} from 'test-suites/squads/lesson/types/lesson-management';
import { waitRetrieveStudentSubscriptionResponse } from 'test-suites/squads/lesson/utils/grpc-responses';
import { goToLessonsList } from 'test-suites/squads/lesson/utils/lesson-list';
import { tableDeleteButton } from 'test-suites/squads/syllabus/step-definitions/cms-selectors/cms-keys';
import { staffProfileAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { createARandomStaffFromGRPC } from 'test-suites/squads/user-management/step-definitions/user-create-staff-definitions';
import { retry } from 'ts-retry-promise';

export type LessonReportStatusTag = 'Submitted' | 'Draft';
export type FillAutocompleteMode = 'without attendance status' | 'all';
export type CreateLessonTimeType =
    | LessonManagementLessonTime
    | 'within 10 minutes from now'
    | 'completed before 24 hours ago'
    | 'completed over 24 hours'
    | 'future weekly recurring'
    | 'past weekly recurring'
    | 'more than 10 minutes from now'
    | 'after future weekly recurring'
    | 'after past weekly recurring';

const teachingMediumObject: Record<TeachingMediumValueType, LessonTeachingMedium> = {
    Offline: LessonTeachingMedium.LESSON_TEACHING_MEDIUM_OFFLINE,
    Online: LessonTeachingMedium.LESSON_TEACHING_MEDIUM_ONLINE,
};

export const methodSavingObject: Record<MethodSavingType, CreateLessonSavingMethod> = {
    'One Time': CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
    'Weekly Recurring': CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE,
};

export const parseTeachingMediumObject: Record<TeachingMediumValueType, TeachingMedium> = {
    Online: 'LESSON_TEACHING_MEDIUM_ONLINE',
    Offline: 'LESSON_TEACHING_MEDIUM_OFFLINE',
};

export async function selectTeachingMedium(
    cms: CMSInterface,
    teachingMedium: TeachingMedium = 'LESSON_TEACHING_MEDIUM_ONLINE'
) {
    const desireTeachingMedium = teachingMediumRadioButton(teachingMedium);

    await cms.page!.click(desireTeachingMedium);
}

const setupLessonDateAndTime = (
    scenarioContext: ScenarioContext,
    createLessonTime: CreateLessonTimeType
) => {
    const startTime = new Date();
    const endTime = new Date();
    const recurrenceEndDate = new Date();

    switch (createLessonTime) {
        case 'within 10 minutes from now':
        case 'future':
            startTime.setMinutes(startTime.getMinutes() + 5);
            endTime.setMinutes(endTime.getMinutes() + 10);
            break;
        case 'more than 10 minutes from now':
            startTime.setHours(startTime.getHours() + 1);
            endTime.setMinutes(endTime.getMinutes() + 65);
            break;

        case 'completed before 24 hours ago':
        case 'past':
            startTime.setDate(startTime.getDate() - 1);
            startTime.setMinutes(startTime.getMinutes() - 10);

            endTime.setDate(endTime.getDate() - 1);
            endTime.setMinutes(endTime.getMinutes() - 5);
            break;

        case 'completed over 24 hours':
            startTime.setDate(startTime.getDate() - 1);
            startTime.setMinutes(startTime.getMinutes() + 5);

            endTime.setDate(endTime.getDate() - 1);
            endTime.setMinutes(endTime.getMinutes() + 10);
            break;

        case 'future weekly recurring':
            startTime.setMinutes(startTime.getMinutes() + 5);
            endTime.setMinutes(endTime.getMinutes() + 10);
            recurrenceEndDate.setDate(recurrenceEndDate.getDate() + 30);
            break;

        case 'past weekly recurring':
            startTime.setDate(startTime.getDate() - 30);
            startTime.setMinutes(startTime.getMinutes() - 10);

            endTime.setDate(endTime.getDate() - 30);
            endTime.setMinutes(endTime.getMinutes() - 5);
            recurrenceEndDate.setDate(recurrenceEndDate.getDate() - 1);
            break;
        case 'after future weekly recurring':
            startTime.setHours(startTime.getHours() + 1);
            endTime.setMinutes(endTime.getMinutes() + 65);
            recurrenceEndDate.setDate(recurrenceEndDate.getDate() + 30);
            break;
        case 'after past weekly recurring':
            startTime.setDate(startTime.getDate() - 30);
            startTime.setMinutes(startTime.getMinutes() + 5);

            endTime.setDate(endTime.getDate() - 30);
            endTime.setMinutes(endTime.getMinutes() + 10);
            recurrenceEndDate.setDate(recurrenceEndDate.getDate() - 1);
            break;

        default:
            break;
    }

    scenarioContext.set(aliasStartDate, startTime);
    scenarioContext.set(aliasEndDate, recurrenceEndDate);

    return {
        startTime,
        endTime,
        recurrenceEndDate,
    };
};

export interface CreateLessonWithGRPCProps {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    createLessonTime: CreateLessonTimeType;
    teachingMethod: LessonTeachingMethod;
    teachingMedium: TeachingMediumValueType;
    methodSavingOption?: CreateLessonSavingMethod;
    materialsList?: Material.AsObject[];
    schedulingStatus?: LessonStatus;
    teacherRole?: AccountRoles; // we create a lesson with only 1 teacher,
    addAttendanceStatusStudent?: StudentAttendStatus;
}

const setupTeacherInfo = async (params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    teacherRole?: AccountRoles;
}) => {
    const { cms, scenarioContext, teacherRole = 'teacher' } = params;
    const teacherIds: string[] = [];

    const teachers = getUsersFromContextByRegexKeys(
        scenarioContext,
        staffProfileAliasWithAccountRoleSuffix(teacherRole)
    );

    if (arrayHasItem(teachers)) {
        teachers.map((teacher) => teacherIds.push(teacher.id));
    } else {
        const teacher = await createARandomStaffFromGRPC(cms);
        teacherIds.push(teacher.id);

        const teacherProfileAliasKey = staffProfileAliasWithAccountRoleSuffix('teacher');
        scenarioContext.set(teacherProfileAliasKey, teacher);
    }

    return {
        teacherIds,
    };
};

const setupStudentInfo = async (params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    learners: UserProfileEntity[];
    teachingMethod: LessonTeachingMethod;
    addAttendanceStatusStudent?: StudentAttendStatus;
}) => {
    const {
        cms,
        scenarioContext,
        learners,
        teachingMethod,
        addAttendanceStatusStudent = StudentAttendStatus.STUDENT_ATTEND_STATUS_EMPTY,
    } = params;

    const learnerIds: string[] = [];

    if (arrayHasItem(learners)) {
        learners.forEach((learner) => learnerIds.push(learner.id));
    } else {
        const createStudentFunc =
            teachingMethod === LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
                ? createSampleStudentWithCourseAndEnrolledStatus
                : createSampleStudentWithPackage;

        const { student } = await createStudentFunc({
            cms,
            scenarioContext,
            studentRole: 'student',
        });

        await delay(2000); // Wait for the student course to be synced to the subscription

        learnerIds.push(student.id);
    }

    const locationIdFromContext = scenarioContext.get(aliasLocationId);

    const studentInfoList: CreateLessonRequestData['studentInfoListList'] = learnerIds.map(
        (learnerId) => {
            // Setup course for student
            const courseIdByLearnerIdFromContext = scenarioContext.get(
                aliasCourseIdByStudent(learnerId)
            );

            return {
                attendanceStatus: addAttendanceStatusStudent,
                courseId: courseIdByLearnerIdFromContext,
                studentId: learnerId,
                locationId: locationIdFromContext,
                attendanceNotice: StudentAttendanceNotice.NOTICE_EMPTY,
                attendanceReason: StudentAttendanceReason.REASON_EMPTY,
                attendanceNote: '',
            };
        }
    );
    scenarioContext.set(aliasStudentInfoList, studentInfoList);

    return {
        studentInfoList,
        locationId: locationIdFromContext,
    };
};

export async function createLessonWithGRPC(params: CreateLessonWithGRPCProps) {
    const {
        cms,
        scenarioContext,
        createLessonTime,
        teachingMethod,
        teachingMedium,
        methodSavingOption = CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
        materialsList = [],
        schedulingStatus = LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED,
        teacherRole,
        addAttendanceStatusStudent = StudentAttendStatus.STUDENT_ATTEND_STATUS_EMPTY,
    } = params;
    const cmsToken = await cms.getToken();

    const { startTime, endTime, recurrenceEndDate } = setupLessonDateAndTime(
        scenarioContext,
        createLessonTime
    );

    const { teacherIds } = await setupTeacherInfo({
        cms,
        scenarioContext,
        teacherRole,
    });

    const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);

    const { studentInfoList, locationId } = await setupStudentInfo({
        cms,
        scenarioContext,
        learners,
        teachingMethod,
        addAttendanceStatusStudent,
    });

    const courseIdAndClassId: Pick<CreateLessonRequestData, 'classId' | 'courseId'> =
        teachingMethod === LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
            ? {
                  classId: '',
                  courseId: '',
              }
            : {
                  classId: scenarioContext.get(aliasClassId),
                  courseId: scenarioContext.get(aliasCourseId),
              };

    const savingOption: CreateLessonRequestData['savingOption'] =
        methodSavingOption === CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME
            ? {
                  method: CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
              }
            : {
                  recurrence: {
                      endDate: recurrenceEndDate,
                  },
                  method: CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE,
              };

    // Call gRPC
    const lessonRequest: CreateLessonRequestData = {
        startTime: startTime,
        endTime: endTime,
        teacherIdsList: teacherIds,
        locationId,
        materialsList,
        studentInfoListList: studentInfoList,
        teachingMedium: teachingMediumObject[teachingMedium],
        teachingMethod,
        savingOption,
        schedulingStatus,
        timeZone: 'Asia/Saigon',
        ...courseIdAndClassId,
    };

    await retry(
        async function () {
            const lesson = await lessonManagementService.createLesson(cmsToken, lessonRequest);
            scenarioContext.set(aliasLessonInfo, lessonRequest);
            scenarioContext.set(aliasLessonId, lesson.response?.id);
            scenarioContext.set(aliasLessonName, '');
            scenarioContext.set(aliasLocationId, lessonRequest.locationId);
        },
        { retries: 2, delay: 5000 }
    )
        .catch(function (reason) {
            throw Error(`Create lesson error: ${JSON.stringify(reason)}`);
        })
        .finally(function () {
            setLessonTimeToContext(scenarioContext, createLessonTime);
        });
}

export function setLessonTimeToContext(
    scenarioContext: ScenarioContext,
    lessonTime: CreateLessonTimeType
) {
    switch (lessonTime) {
        case 'future':
        case 'within 10 minutes from now':
        case 'future weekly recurring':
        case 'more than 10 minutes from now':
        case 'after future weekly recurring':
            scenarioContext.set(aliasLessonTime, 'future');
            break;

        case 'past':
        case 'completed over 24 hours':
        case 'completed before 24 hours ago':
        case 'past weekly recurring':
        case 'after past weekly recurring':
            scenarioContext.set(aliasLessonTime, 'past');
            break;
    }
}

export async function searchTeacherV3(cms: CMSInterface, teacherName: string) {
    const page = cms.page!;
    const teacherInput = await page.waitForSelector(teacherAutocompleteInputV3);

    await cms.instruction(`Search teacher ${teacherName}`, async function () {
        await teacherInput.click();
        await teacherInput.fill(teacherName);
        await cms.waitingAutocompleteLoading();
    });
}

export async function selectCenterByNameV3(cms: CMSInterface, centerName: string) {
    const page = cms.page!;
    await cms.waitingAutocompleteLoading();
    await page.fill(locationsLowestLevelAutocompleteInputV3, centerName);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(centerName);
}

export async function selectTeacher(cms: CMSInterface, teacherName: string) {
    const page = cms.page!;

    await cms.instruction(`Select teacher ${teacherName}`, async function () {
        await cms.chooseOptionInAutoCompleteBoxByText(teacherName);
    });

    await page.keyboard.press('Escape');
}

export async function selectCourseByNameV3(cms: CMSInterface, courseName: string) {
    await cms.page!.fill(courseAutoCompleteInputV3, courseName);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(courseName);
}

export async function selectCourseByNameV3GroupLesson(cms: CMSInterface, courseName: string) {
    await cms.page!.fill(courseAutoCompleteInputV3, courseName);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(courseName);
    await cms.page!.click(footerDialogConfirmButtonSave);
}

export async function selectClassByNameV3(cms: CMSInterface, className: string) {
    await cms.page!.fill(classAutoCompleteInputV3, className);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(className);
    await Promise.all([
        cms.waitForHasuraResponse('StudentsMany', { timeout: 60000 }),
        cms.waitForHasuraResponse('CoursesMany', { timeout: 60000 }),
        waitRetrieveStudentSubscriptionResponse(cms),
    ]);
}

export async function selectClassByNameV3GroupLesson(cms: CMSInterface, className: string) {
    await cms.page!.fill(classAutoCompleteInputV3, className);
    await cms.waitingAutocompleteLoading();
    await cms.chooseOptionInAutoCompleteBoxByText(className);
    await cms.page!.click(footerDialogConfirmButtonSave);
    await Promise.all([
        cms.waitForHasuraResponse('StudentsMany', { timeout: 60000 }),
        cms.waitForHasuraResponse('CoursesMany', { timeout: 60000 }),
        waitRetrieveStudentSubscriptionResponse(cms),
    ]);
}

export function areMissingFieldsNotEqualToCertainField(
    missingFields: LessonUpsertFields[],
    checkedString: LessonUpsertFields
): boolean {
    return missingFields.every((field) => field !== checkedString);
}

export function areUpdatedFieldEqualToCertainField(
    updatedField: LessonUpsertFields[],
    checkedString: LessonUpsertFields
): boolean {
    return updatedField.every((field) => field === checkedString);
}

export async function fillUpsertFormLessonV3WithMissingFields(params: {
    cms: CMSInterface;
    teacherName?: string;
    studentNames?: string[];
    centerName?: string;
    courseName?: string;
    className?: string;
    missingFields: LessonUpsertFields[];
}) {
    const { cms, teacherName, studentNames, centerName, missingFields, courseName, className } =
        params;

    if (
        areMissingFieldsNotEqualToCertainField(missingFields, 'start time') &&
        areMissingFieldsNotEqualToCertainField(missingFields, 'end time')
    ) {
        await changeStartTimeLesson(cms, '07:00');
        await changeEndTimeLesson(cms, '09:00');
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'teaching medium')) {
        await selectTeachingMedium(cms, 'LESSON_TEACHING_MEDIUM_ONLINE');
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'teaching method')) {
        await selectTeachingMethod(cms, 'LESSON_TEACHING_METHOD_GROUP');
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'teacher') && !!teacherName) {
        await searchTeacherV3(cms, teacherName);
        await selectTeacher(cms, teacherName);
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'center') && !!centerName) {
        await selectCenterByNameV3(cms, centerName);
        await acceptConfirmDialogIfExist(cms);
    }

    if (areMissingFieldsNotEqualToCertainField(missingFields, 'course') && !!courseName) {
        await selectCourseByNameV3(cms, courseName);
        await acceptConfirmDialogIfExist(cms);

        if (areMissingFieldsNotEqualToCertainField(missingFields, 'class') && !!className) {
            await selectClassByNameV3(cms, className);
        }
    }

    if (
        areMissingFieldsNotEqualToCertainField(missingFields, 'student') &&
        arrayHasItem(studentNames)
    ) {
        for (const studentName of studentNames!) {
            await selectStudentSubscriptionV2({ cms, studentName });
        }
    }
}

export async function fillUpsertFormLessonV3Updated(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    updatedField: LessonUpsertFields[];
}) {
    const { cms, scenarioContext, updatedField } = params;

    if (
        areUpdatedFieldEqualToCertainField(updatedField, 'start time') &&
        areUpdatedFieldEqualToCertainField(updatedField, 'end time')
    ) {
        console.log('===== start time end time');
        await changeStartTimeLesson(cms, startTimeUpdate);
        await changeEndTimeLesson(cms, endTimeUpdate);
    }

    if (areUpdatedFieldEqualToCertainField(updatedField, 'teaching medium')) {
        console.log('===== teaching medium');
        await selectTeachingMedium(cms, 'LESSON_TEACHING_MEDIUM_OFFLINE');
        scenarioContext.set(aliasTeachingMedium, 'Offline');
    }

    if (areUpdatedFieldEqualToCertainField(updatedField, 'teacher')) {
        console.log('===== teacher');
        const account: UserProfileEntity = await createARandomStaffFromGRPC(cms);
        scenarioContext.set(staffProfileAliasWithAccountRoleSuffix('teacher T2'), account);
        await searchTeacherV3(cms, account.name);
        await selectTeacher(cms, account.name);
    }

    if (
        areUpdatedFieldEqualToCertainField(updatedField, 'center') ||
        areUpdatedFieldEqualToCertainField(updatedField, 'student') ||
        areUpdatedFieldEqualToCertainField(updatedField, 'course') ||
        areUpdatedFieldEqualToCertainField(updatedField, 'class')
    ) {
        console.log('===== center student course class');
        const centerName = scenarioContext.get(aliasLocationName);
        const courseName = scenarioContext.get(aliasCourseName);
        const className = scenarioContext.get(aliasClassName);
        await selectCenterByNameV3(cms, centerName);
        await acceptConfirmDialogIfExist(cms);
        await selectCourseByNameV3(cms, courseName!);
        await acceptConfirmDialogIfExist(cms);
        await selectClassByNameV3(cms, className!);
        await acceptConfirmDialogIfExist(cms);
    }
}

async function acceptConfirmDialogIfExist(cms: CMSInterface) {
    const confirmButton = await cms.page!.$(confirmApplyButton);
    if (confirmButton) {
        await confirmButton.click();
    }
}

async function teacherConfirmAcceptApplyingLocation(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const selectLocationDialogApplyButtonKey = new ByValueKey(
        TeacherKeys.selectLocationDialogApplyButtonKey
    );
    await driver.tap(selectLocationDialogApplyButtonKey);
}

async function applyLocationInDialogOnTeacherApp(teacher: TeacherInterface, locationId: string) {
    await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
    await teacherSelectLocationsOnTeacherApp(teacher, [locationId]);
    await teacherConfirmAcceptApplyingLocation(teacher);
}

export async function assertNewLessonOnTeacherApp(params: {
    teacher: TeacherInterface;
    lessonId: string;
    courseId: string;
    locationId: string;
    lessonTime: LessonTimeValueType;
    shouldDisplay: boolean;
}) {
    const { teacher, lessonId, courseId, locationId, lessonTime, shouldDisplay } = params;
    await applyLocationInDialogOnTeacherApp(teacher, locationId);
    await assertSeeLessonOnTeacherApp({
        teacher,
        lessonTime,
        courseId,
        lessonId,
        lessonName: '',
        shouldDisplay,
    });
}

export async function waitForLessonUpsertDialogClosed(cms: CMSInterface) {
    await cms.instruction('Sees lesson upsert dialog is closed', async function () {
        await cms.page!.waitForSelector(upsertLessonDialog, {
            state: 'detached',
        });
    });
}

export async function removeTeacherFromLesson(cms: CMSInterface, teacherName: string) {
    const page = cms.page!;

    await page
        .locator(`[role="button"][aria-label="${teacherName}"]`)
        .locator(chipAutocompleteIconDelete)
        .click();
}

export async function removeStudentFromLesson(cms: CMSInterface, studentName: string) {
    const page = cms.page!;
    const upsertDialog = page.locator(upsertLessonDialog);
    const cell = upsertDialog.locator('td', {
        hasText: studentName,
    });
    await cms.instruction(`Click checkbox action of Student ${studentName}`, async function () {
        await cell.locator(checkBoxOfTableRow).click();
    });

    await cms.instruction('Click button remove', async function () {
        await upsertDialog.locator(tableDeleteButton).click();
    });
}

export async function createLessonByUI(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    lessonTime?: LessonManagementLessonTime;
    lessonName?: LessonManagementLessonName;
    teacherNames?: string[];
    studentInfos?: StudentInfo[];
    materials?: MaterialFile[];
    tenant?: Tenant;
    teachingMedium?: TeachingMedium;
    teachingMethod: LessonTeachingMethod;
    recurringSetting?: MethodSavingType;
}) {
    const {
        cms,
        scenarioContext,
        lessonTime = 'now',
        lessonName,
        teacherNames = [],
        studentInfos = [],
        materials,
        tenant,
        teachingMedium = 'LESSON_TEACHING_MEDIUM_ONLINE',
        teachingMethod,
        recurringSetting,
    } = params;

    const teachingMethodValue =
        teachingMethod === LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
            ? 'LESSON_TEACHING_METHOD_INDIVIDUAL'
            : 'LESSON_TEACHING_METHOD_GROUP';

    scenarioContext.set(aliasLessonTime, lessonTime);

    await cms.instruction('Open create lesson page on CMS', async function () {
        await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
        await openCreateLessonPage(cms);
    });

    // Setup of teachers
    await cms.instruction('Setup Teachers', async function () {
        await setupTeacher(cms, scenarioContext, teacherNames);
    });

    // Setup for students
    await cms.instruction('Setup Students', async function () {
        await setupStudent({ cms, scenarioContext, teachingMethod, tenant, studentInfos });
    });

    await cms.instruction(`Select lesson date in ${lessonTime}`, async function () {
        await selectLessonDateWithType(cms, scenarioContext);
    });

    if (recurringSetting) {
        const currentDate = new Date();
        const numberOfDateForNextMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0
        ).getDate();
        await cms.instruction(`Select Recurring Setting: ${recurringSetting}`, async function () {
            const setting: LessonSavingMethodType =
                recurringSetting === 'One Time'
                    ? 'CREATE_LESSON_SAVING_METHOD_ONE_TIME'
                    : 'CREATE_LESSON_SAVING_METHOD_RECURRENCE';
            await selectRecurring(cms, setting);
        });
        if (recurringSetting === 'Weekly Recurring') {
            await cms.instruction(
                `Selects end date is lesson date of next month`,
                async function () {
                    await selectEndDateByDateRange(cms, scenarioContext, numberOfDateForNextMonth);
                }
            );
        }
    }

    // Select teaching medium
    await cms.instruction(
        `Select option ${teachingMedium} in field Teaching Medium`,
        async function () {
            await selectTeachingMedium(cms, teachingMedium);
        }
    );

    // Select teaching method
    await cms.instruction(
        `Select option ${teachingMethod} in field Teaching Method`,
        async function () {
            await selectTeachingMethod(cms, teachingMethodValue);
        }
    );

    // Add teachers
    await cms.instruction('Select multi teacher', async function () {
        await selectMultiTeacher(cms, scenarioContext);
    });

    const studentsContext: Array<StudentInfo> = scenarioContext.get(aliasStudentInfoList);

    // Select first center of list
    await cms.instruction('Select location', async function () {
        await selectCenterByName(cms, studentsContext[0].locationName);
    });

    // Add students
    if (teachingMethod === LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL) {
        await cms.instruction('Select multi student', async function () {
            await selectMultiStudent(cms, scenarioContext);
        });
    }

    // Setup of course and class
    if (teachingMethod === LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP) {
        await cms.instruction('Setup course', async function () {
            const courseName = scenarioContext.get<string>(aliasCourseName);
            await selectCourseByNameV3(cms, courseName);
        });
        await cms.instruction('Setup class', async function () {
            const className = scenarioContext.get<string>(aliasClassName);
            await selectClassByNameV3(cms, className);
        });
    }

    scenarioContext.set(aliasLessonName, ''); // Lesson of lesson management has no name
    scenarioContext.set(aliasLocationId, studentsContext[0].locationId);

    await cms.instruction('Submit lesson', async function () {
        await submitLessonWithMaterial({ cms, scenarioContext, materials, lessonName });
    });

    await cms.instruction('Save Lesson info by lesson name', async function () {
        await saveLessonByLessonName({
            scenarioContext,
            lessonName,
        });
    });
}

export function getLessonInfoFromContext(scenarioContext: ScenarioContext, alias: string) {
    return scenarioContext.get<CreateLessonRequestData>(alias);
}

export function getEndDateFromLessonInfo(scenario: ScenarioContext): string {
    const { savingOption } = getLessonInfoFromContext(scenario, aliasLessonInfo);
    return moment(savingOption?.recurrence?.endDate).format('YYYY/MM/DD');
}

export function getStartDateFromLessonInfo(scenario: ScenarioContext): string {
    const { startTime } = getLessonInfoFromContext(scenario, aliasLessonInfo);
    return moment(startTime).format('YYYY/MM/DD');
}

export function arrayHasItem<T>(arr?: T[] | T | null): boolean {
    return Array.isArray(arr) && arr.length > 0;
}

export async function getGroupLessonDataOnLessonDetailPage(
    cms: CMSInterface
): Promise<GroupLessonInfo> {
    const page = cms.page!;

    const courseNameLocator = page.locator(lessonInfoCourseNames);
    const classNameLocator = page.locator(lessonInfoClassNames);
    const lessonDateLocator = page.locator(lessonInfoLessonDate);
    const dayOfWeekLocator = page.locator(lessonInfoDayOfWeek);
    const startTimeLocator = page.locator(lessonInfoStartTime);
    const endTimeLocator = page.locator(lessonInfoEndTime);
    const teachingMediumLocator = page.locator(lessonInfoTeachingMedium);
    const teachingMethodLocator = page.locator(lessonInfoTeachingMethod);
    const locationLocator = page.locator(lessonInfoLocation);
    const teacherNamesLocator = page.locator(lessonInfoTeachers);
    const studentNamesLocator = page.locator(lessonInfoStudentNameColumn);
    const savingOptionLocator = page.locator(lessonDetailSavingOption);

    const [
        courseName,
        className,
        lessonDate,
        dayOfWeek,
        startTime,
        endTime,
        teachingMedium,
        teachingMethod,
        location,
        teacherNames,
        studentNames,
        recurringSettings,
    ] = await Promise.all([
        courseNameLocator.textContent(),
        classNameLocator.textContent(),
        lessonDateLocator.textContent(),
        dayOfWeekLocator.textContent(),
        startTimeLocator.textContent(),
        endTimeLocator.textContent(),
        teachingMediumLocator.textContent(),
        teachingMethodLocator.textContent(),
        locationLocator.textContent(),
        teacherNamesLocator.textContent(),
        studentNamesLocator.allTextContents(),
        savingOptionLocator.textContent(),
    ]);

    const result: GroupLessonInfo = {
        courseName,
        className,
        lessonDate,
        dayOfWeek,
        startTime,
        endTime,
        teachingMedium,
        teachingMethod,
        location,
        teacherNames,
        studentNames,
        recurringSettings,
    };

    return result;
}

export async function schoolAdminClicksDuplicateGroupLessonButtonOption(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const page = cms.page!;
    const groupLessonInfo = await getGroupLessonDataOnLessonDetailPage(cms);
    context.set(aliasGroupLessonInfo, groupLessonInfo);
    await page.locator(actionPanelTrigger).click();
    await page.locator(duplicateLessonMenuItemSelector).click();
}

export async function schoolAdminClicksDuplicateIndividualLessonButtonOption(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const page = cms.page!;
    const individualLessonInfo = await getLessonDataOnLessonDetailPage(cms);
    context.set(aliasIndividualLessonInfo, individualLessonInfo);
    await page.locator(actionPanelTrigger).click();
    await page.locator(duplicateLessonMenuItemSelector).click();
}

export async function schoolAdminPublishesDuplicatedLesson(
    cms: CMSInterface,
    context: ScenarioContext
) {
    const page = cms.page!;
    const [duplicatedLessonResponse] = await Promise.all([
        waitCreateLesson(cms),
        page.locator(lessonManagementLessonSubmitButton).click(),
    ]);
    await saveDuplicatedLessonResponse(context, duplicatedLessonResponse);
}

export async function saveDuplicatedLessonResponse(
    scenarioContext: ScenarioContext,
    response: Response
) {
    const decoder = createGrpcMessageDecoder(CreateLessonResponse);
    const encodedResponseText = await response.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);

    const { id: lessonId } = decodedResponse?.toObject() || { id: '' };
    scenarioContext.set(aliasDuplicatedLessonId, lessonId);
}

export async function getTeacherNamesFromTeacherAutoCompleteV3(cms: CMSInterface) {
    const page = cms.page!;
    const teacherNamesLocators = page.locator(teacherAutocompleteV3).locator('[role="button"]');
    const teacherNames: string[] = [];
    const autoCompletes = await teacherNamesLocators.elementHandles();
    for (const autocomplete of autoCompletes) {
        const name = await autocomplete.getAttribute('aria-label');
        teacherNames.push(name!);
    }
    return teacherNames;
}

export async function selectAttendanceStatus(
    cms: CMSInterface,
    attendanceValue: AttendanceStatusValues,
    selectorInput: string
) {
    const page = cms.page!;

    await page.click(selectorInput);
    await cms.chooseOptionInAutoCompleteBoxByText(attendanceValue);

    const changedValue = await page.inputValue(selectorInput);
    weExpect(
        changedValue,
        `Expect attendance input have value of selected option (${attendanceValue})`
    ).toEqual(attendanceValue);
}

export async function assertUpdatedIndividualLessonFieldOfOtherLessonInChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType,
    field: LessonUpsertFields
) {
    const users = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);

    let studentName = users[0].name;

    if (field === 'center' || field === 'student') {
        studentName = users[1].name;
    }

    await goToLessonsList({ cms, lessonTime });
    await filterLessonListByStudentName(cms, studentName, lessonTime);
    await selectLessonLinkByLessonOrder(cms, OrderLessonInRecurringChain.MIDDLE, lessonTime);
    await assertIndividualLessonUpsertFieldUpdated(cms, scenarioContext, field);
}

export async function assertUpdatedGroupLessonFieldOfOtherLessonInChain(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    lessonTime: LessonTimeValueType,
    field: LessonUpsertFields
) {
    const users = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);

    let studentName = users[0].name;

    if (field === 'center' || field === 'course' || field === 'class' || field === 'student') {
        studentName = users[1].name;
    }

    await goToLessonsList({ cms, lessonTime });
    await filterLessonListByStudentName(cms, studentName, lessonTime);
    await selectLessonLinkByLessonOrder(cms, OrderLessonInRecurringChain.MIDDLE, lessonTime);
    await assertGroupLessonUpsertFieldUpdated(cms, scenarioContext, field);
}

export async function assertIndividualLessonUpsertFieldUpdated(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    field: LessonUpsertFields
) {
    const groupLessonInfo = await getLessonDataOnLessonDetailPage(cms);

    switch (field) {
        case 'start time': {
            weExpect(groupLessonInfo.startTime, `Start time is ${startTimeUpdate}`).toEqual(
                startTimeUpdate
            );
            break;
        }
        case 'end time': {
            weExpect(groupLessonInfo.endTime, `End time is ${endTimeUpdate}`).toEqual(
                endTimeUpdate
            );
            break;
        }
        case 'lesson date': {
            const lessonDate = scenarioContext.get<Date>(aliasStartDate);
            const parseLessonDate = moment(lessonDate).format('YYYY/MM/DD');
            weExpect(groupLessonInfo.lessonDate, `Lesson Date is ${parseLessonDate}`).toEqual(
                parseLessonDate
            );
            break;
        }
        case 'teaching medium': {
            const teachingMedium = scenarioContext.get(aliasTeachingMedium);
            weExpect(groupLessonInfo.teachingMedium, `Lesson Date is ${teachingMedium}`).toEqual(
                teachingMedium
            );
            break;
        }
        case 'teacher': {
            const users = getUsersFromContextByRegexKeys(scenarioContext, staffProfileAlias);
            weExpect(
                groupLessonInfo.teacherNames?.includes(users[1].name),
                `Teacher ${users[1].name} is updated`
            ).toEqual(true);
            break;
        }
        case 'center': {
            const locationName = scenarioContext.get(aliasLocationName);
            weExpect(
                groupLessonInfo.location?.includes(locationName),
                `Location ${locationName} is updated`
            ).toEqual(true);
            break;
        }
        case 'student': {
            const users = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
            weExpect(
                groupLessonInfo.studentNames?.includes(users[1].name),
                `Student ${users[1].name} is updated`
            ).toEqual(true);
            break;
        }
    }
}

export async function assertGroupLessonUpsertFieldUpdated(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    field: LessonUpsertFields
) {
    const groupLessonInfo = await getGroupLessonDataOnLessonDetailPage(cms);

    switch (field) {
        case 'start time': {
            weExpect(groupLessonInfo.startTime, `Start time is ${startTimeUpdate}`).toEqual(
                startTimeUpdate
            );
            break;
        }
        case 'end time': {
            weExpect(groupLessonInfo.endTime, `End time is ${endTimeUpdate}`).toEqual(
                endTimeUpdate
            );
            break;
        }
        case 'lesson date': {
            const lessonDate = scenarioContext.get<Date>(aliasStartDate);
            const parseLessonDate = moment(lessonDate).format('YYYY/MM/DD');
            weExpect(groupLessonInfo.lessonDate, `Lesson Date is ${parseLessonDate}`).toEqual(
                parseLessonDate
            );
            break;
        }
        case 'teaching medium': {
            const teachingMedium = scenarioContext.get(aliasTeachingMedium);
            weExpect(groupLessonInfo.teachingMedium, `Lesson Date is ${teachingMedium}`).toEqual(
                teachingMedium
            );
            break;
        }
        case 'teacher': {
            const users = getUsersFromContextByRegexKeys(scenarioContext, staffProfileAlias);
            weExpect(
                groupLessonInfo.teacherNames?.includes(users[1].name),
                `Teacher ${users[1].name} is updated`
            ).toEqual(true);
            break;
        }
        case 'center': {
            const locationName = scenarioContext.get(aliasLocationName);
            weExpect(
                groupLessonInfo.location?.includes(locationName),
                `Location ${locationName} is updated`
            ).toEqual(true);
            break;
        }
        case 'student': {
            const users = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
            weExpect(
                groupLessonInfo.studentNames?.includes(users[1].name),
                `Student ${users[1].name} is updated`
            ).toEqual(true);
            break;
        }
        case 'course': {
            const courseName = scenarioContext.get(aliasCourseName);
            weExpect(
                groupLessonInfo.courseName?.includes(courseName),
                `Course ${courseName} is updated`
            ).toEqual(true);
            break;
        }
        case 'class': {
            const className = scenarioContext.get(aliasClassName);
            weExpect(
                groupLessonInfo.className?.includes(className),
                `Class ${className} is updated`
            ).toEqual(true);
            break;
        }
    }
}

export async function assertOtherIndividualLessonInChainNoChanged(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const currentLessonInfo = await getLessonDataOnLessonDetailPage(cms);
    const lessonInfo = scenarioContext.get<IndividualLessonInfo>(aliasIndividualLessonInfo);

    weExpect(currentLessonInfo.startTime, `Start time is ${lessonInfo.startTime}`).toEqual(
        lessonInfo.startTime
    );

    weExpect(currentLessonInfo.endTime, `End time is ${lessonInfo.endTime}`).toEqual(
        lessonInfo.endTime
    );

    weExpect(
        currentLessonInfo.teachingMedium,
        `Teaching Medium is ${lessonInfo.teachingMedium}`
    ).toEqual(lessonInfo.teachingMedium);

    weExpect(currentLessonInfo.teacherNames, `Teacher names is ${lessonInfo.teacherNames}`).toEqual(
        lessonInfo.teacherNames
    );

    weExpect(currentLessonInfo.location, `Location is ${lessonInfo.location}`).toEqual(
        lessonInfo.location
    );

    weExpect(currentLessonInfo.studentNames, `Student names is ${lessonInfo.studentNames}`).toEqual(
        lessonInfo.studentNames
    );
}

export async function assertOtherGroupLessonInChainNoChanged(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const currentLessonInfo = await getGroupLessonDataOnLessonDetailPage(cms);
    const lessonInfo = scenarioContext.get<GroupLessonInfo>(aliasGroupLessonInfo);

    weExpect(currentLessonInfo.startTime, `Start time is ${lessonInfo.startTime}`).toEqual(
        lessonInfo.startTime
    );

    weExpect(currentLessonInfo.endTime, `End time is ${lessonInfo.endTime}`).toEqual(
        lessonInfo.endTime
    );

    weExpect(currentLessonInfo.lessonDate, `Lesson Date is ${lessonInfo.lessonDate}`).toEqual(
        lessonInfo.lessonDate
    );
    weExpect(
        currentLessonInfo.teachingMedium,
        `Teaching Medium is ${lessonInfo.teachingMedium}`
    ).toEqual(lessonInfo.teachingMedium);

    weExpect(currentLessonInfo.teacherNames, `Teacher names is ${lessonInfo.teacherNames}`).toEqual(
        lessonInfo.teacherNames
    );

    weExpect(currentLessonInfo.location, `Location is ${lessonInfo.location}`).toEqual(
        lessonInfo.location
    );

    weExpect(currentLessonInfo.studentNames, `Student names is ${lessonInfo.studentNames}`).toEqual(
        lessonInfo.studentNames
    );

    weExpect(currentLessonInfo.courseName, `Course names is ${lessonInfo.courseName}`).toEqual(
        lessonInfo.courseName
    );

    weExpect(currentLessonInfo.className, `Class names is ${lessonInfo.className}`).toEqual(
        lessonInfo.className
    );

    weExpect(
        currentLessonInfo.recurringSettings,
        `Recurring Settings is ${lessonInfo.recurringSettings}`
    ).toEqual(lessonInfo.recurringSettings);
}

export async function assertGroupLessonUpsertFieldNoChanged(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    field: LessonUpsertFields
) {
    const currentLessonInfo = await getGroupLessonDataOnLessonDetailPage(cms);
    const lessonInfo = scenarioContext.get<GroupLessonInfo>(aliasGroupLessonInfo);
    switch (field) {
        case 'start time': {
            weExpect(currentLessonInfo.startTime, `Start time is ${lessonInfo.startTime}`).toEqual(
                lessonInfo.startTime
            );
            break;
        }
        case 'end time': {
            weExpect(currentLessonInfo.endTime, `End time is ${lessonInfo.endTime}`).toEqual(
                lessonInfo.endTime
            );
            break;
        }
        case 'teaching medium': {
            weExpect(
                currentLessonInfo.teachingMedium,
                `Teaching Medium is ${lessonInfo.teachingMedium}`
            ).toEqual(lessonInfo.teachingMedium);
            break;
        }
        case 'teacher': {
            weExpect(
                currentLessonInfo.teacherNames,
                `Teacher names is ${lessonInfo.teacherNames}`
            ).toEqual(lessonInfo.teacherNames);
            break;
        }
        case 'center': {
            weExpect(currentLessonInfo.location, `Location is ${lessonInfo.location}`).toEqual(
                lessonInfo.location
            );
            break;
        }
        case 'student': {
            weExpect(
                currentLessonInfo.studentNames,
                `Student names is ${lessonInfo.studentNames}`
            ).toEqual(lessonInfo.studentNames);
            break;
        }
        case 'course': {
            weExpect(
                currentLessonInfo.courseName,
                `Course names is ${lessonInfo.courseName}`
            ).toEqual(lessonInfo.courseName);
            break;
        }
        case 'class': {
            weExpect(currentLessonInfo.className, `Class names is ${lessonInfo.className}`).toEqual(
                lessonInfo.className
            );
            break;
        }
    }
}

export async function saveLessonInfo(cms: CMSInterface, scenarioContext: ScenarioContext) {
    try {
        const groupLessonInfo = await getGroupLessonDataOnLessonDetailPage(cms);
        scenarioContext.set(aliasGroupLessonInfo, groupLessonInfo);
    } catch (e) {
        const individualLessonInfo = await getLessonDataOnLessonDetailPage(cms);
        scenarioContext.set(aliasIndividualLessonInfo, individualLessonInfo);
    }
}
