import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
    teacherProfileAlias,
    staffProfileAliasWithAccountRoleSuffix,
    staffProfileAlias,
} from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface, Tenant } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import masterCourseService from '@supports/services/master-course-service';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';
import { usermgmtUserModifierService } from '@supports/services/usermgmt-student-service';
import NsUsermgmtUserModifierService from '@supports/services/usermgmt-student-service/request-types';
import { LocationInfoGRPC } from '@supports/types/cms-types';

import {
    aliasCourseIdByStudent,
    aliasLessonId,
    aliasLessonName,
    aliasLessonTime,
    aliasLocationId,
    aliasLocationName,
    aliasRowsPerPage,
    aliasCourseId,
    aliasCourseName,
    aliasLocationIdWithTenant,
    aliasLocationNameWithTenant,
} from './alias-keys/lesson';
import {
    arrayHasItem,
    convertOneOfStringTypeToArray,
    genId,
    getNamesFromContext,
    getRandomDate,
    getRandomElement,
    getRandomNumber,
    getUserProfileFromContext,
    getUsersFromContextByRegexKeys,
    randomInteger,
    randomString,
    retrieveLowestLocations,
    getRandomGradeMaster,
} from './utils';
import { Country } from 'manabuf/common/v1/enums_pb';
import { Gender, StudentEnrollmentStatus } from 'manabuf/usermgmt/v2/enums_pb';
import moment from 'moment-timezone';
import {
    aliasCourseId as aliasCourseIdSyllabus,
    aliasCourseName as aliasCourseNameSyllabus,
} from 'step-definitions/alias-keys/syllabus';
import {
    buttonNextPageTable,
    buttonPreviousPageTable,
    tableBaseFooterSelect,
    tableRowItem,
} from 'step-definitions/cms-selectors/cms-keys';
import * as LessonManagementKeys from 'step-definitions/cms-selectors/lesson-management';
import { aliasCourse } from 'test-suites/squads/lesson/common/alias-keys';
import {
    getStudentInfoByUserProfile,
    StudentInfo,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';
import { createStudentPackageProfiles } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

// Time picker
export enum Meridiem {
    AM = 'AM',
    PM = 'PM',
}

export enum DayOfWeekType {
    SUNDAY = 'Sunday',
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
}

export type AttendanceStatus =
    | 'Attend'
    | 'Absent'
    | 'Late'
    | 'Leave Early'
    | 'Absent (informed)'
    | 'Late (informed)'
    | '';

export async function changeMeridiem(cms: CMSInterface, meridiem: Meridiem) {
    await cms.instruction(`Select ${meridiem}`, async function () {
        await cms.page!.click(LessonManagementKeys.meridiemOnTimePicker(meridiem));
    });
}

function toStringWith2DecimalUnit(value: number | string) {
    return String(value).padStart(2, '0');
}

async function selectTimeWithValueOnTimePicker(cms: CMSInterface, value: string | number) {
    await cms.page!.click(LessonManagementKeys.timePickerWithValueV2(value), {
        force: true,
    });
}

export async function clearInput(cms: CMSInterface, selector: string) {
    const page = cms.page!;
    const input = await page.waitForSelector(selector);
    await input.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');

    const currentInputValue = await page.inputValue(selector);
    weExpect(currentInputValue).toEqual('');
}

export async function applyTimePicker(cms: CMSInterface) {
    await cms.page!.click(LessonManagementKeys.timePickerOKButtonV2);
}

export async function changeDatePickerByDateRange(params: {
    cms: CMSInterface;
    datePickerSelector: string;
    currentDate: Date | string;
    dateRange: number;
}) {
    const { cms, datePickerSelector, currentDate, dateRange } = params;
    const page = cms.page!;

    const initialDate = moment(new Date(currentDate)).endOf('day');
    const desireDate = moment(new Date(currentDate)).add(dateRange, 'day').endOf('day');

    await cms.instruction('Open date picker', async function () {
        await page.click(datePickerSelector);
    });

    await cms.instruction('Select date', async function () {
        const needChangeMonth = desireDate.month() !== initialDate.month();

        if (needChangeMonth) await cms.selectAButtonByAriaLabel('Next month');

        await page.click(LessonManagementKeys.datePickerWithValueV2(desireDate.date()));
        await applyTimePicker(cms);
    });
}

export async function changeDatePickerByDateRangeV2(params: {
    cms: CMSInterface;
    datePickerSelector: string;
    currentDate: Date | string;
    dateRange: number;
}) {
    const { cms, datePickerSelector, currentDate, dateRange } = params;
    const page = cms.page!;

    const initialDate = moment(new Date(currentDate)).endOf('day');
    const desireDate = moment(new Date(currentDate)).add(dateRange, 'day').endOf('day');

    await cms.instruction('Open date picker', async function () {
        await page.click(datePickerSelector);
    });

    await cms.instruction('Select date', async function () {
        const needChangeMonth = desireDate.month() !== initialDate.month();

        if (needChangeMonth) await cms.selectAButtonByAriaLabel('Next month');

        await page.click(LessonManagementKeys.datePickerWithValueV2(desireDate.date()));
        await applyTimePicker(cms);
    });
}

function toValidHourTimePicker(hour: number) {
    if (hour === 0) return 12;
    if (hour > 12) return hour - 12;
    return hour;
}

function toValidMinuteTimePicker(minute: number) {
    /**
     * @instance minute = 3 return 5
     * @instance minute = 7 return 10
     * @instance minute = 15 return 20
     */
    const validMinute = (Math.floor(minute / 5) + 1) * 5;
    return validMinute > 55 ? 55 : validMinute;
}

function calcValidTimePicker(hour: number | string, minute: number | string) {
    const [desireHour, desireMinute] = [Number(hour), Number(minute)];

    const validMeridiem = desireHour < 12 ? Meridiem.AM : Meridiem.PM;
    const validHour = toValidHourTimePicker(desireHour);
    const validMinute = toValidMinuteTimePicker(desireMinute);

    return { validMeridiem, validHour, validMinute };
}

export async function changeTimePicker(params: {
    cms: CMSInterface;
    timePickerSelector: string;
    hour: number | string;
    minute: number | string;
}) {
    const { cms, timePickerSelector, hour, minute } = params;

    const { validMeridiem, validHour, validMinute } = calcValidTimePicker(hour, minute);

    const page = cms.page!;

    await cms.instruction('Open time picker', async function () {
        await page.click(timePickerSelector);
    });

    await cms.instruction('Select hour', async function () {
        await selectTimeWithValueOnTimePicker(cms, validHour);
    });

    await cms.instruction('Select minute', async function () {
        await selectTimeWithValueOnTimePicker(cms, toStringWith2DecimalUnit(validMinute));
    });

    await cms.instruction('Select meridiem', async function () {
        await changeMeridiem(cms, validMeridiem);
    });

    await cms.instruction('Apply new time', async function () {
        await applyTimePicker(cms);
    });
}

export function getRandomItemsFromExampleString(exampleString: string): string[] {
    const numberOfItems = Number(exampleString.charAt(0));
    const optionsArray = convertOneOfStringTypeToArray(exampleString);
    const randomItemsArray = optionsArray.sort(() => 0.5 - Math.random()).slice(0, numberOfItems);
    return randomItemsArray;
}

export type AliasTeacherAndStudentInfo = {
    teacherNames: string[];
    studentInfos: StudentInfo[];
};

export function setupAliasForCreateLessonOfLessonManagement(
    scenarioContext: ScenarioContext
): AliasTeacherAndStudentInfo {
    const teacherNames = getNamesFromContext(scenarioContext, teacherProfileAlias);

    const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
    const studentInfos = learners.map((learner) =>
        getStudentInfoByUserProfile(scenarioContext, learner)
    );

    return { teacherNames, studentInfos };
}

export function setupAliasForCreateLesson(
    scenarioContext: ScenarioContext
): AliasTeacherAndStudentInfo {
    const teacherNames = getNamesFromContext(scenarioContext, `${staffProfileAlias}-teacher`);

    const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias);
    const studentInfos = learners.map((learner) =>
        getStudentInfoByUserProfile(scenarioContext, learner)
    );

    return { teacherNames, studentInfos };
}

export function setupAliasForCreateLessonByRoles(params: {
    scenarioContext: ScenarioContext;
    teacherRoles?: AccountRoles[];
    studentRoles?: AccountRoles[];
}): AliasTeacherAndStudentInfo {
    const { scenarioContext, teacherRoles = [], studentRoles = [] } = params;

    const teacherNames: string[] = [];
    const studentInfos: StudentInfo[] = [];

    if (arrayHasItem(teacherRoles)) {
        teacherRoles.forEach((role) => {
            const { name: teacherName } = getUserProfileFromContext(
                scenarioContext,
                staffProfileAliasWithAccountRoleSuffix(role)
            );

            teacherNames.push(teacherName);
        });
    }

    if (arrayHasItem(studentRoles)) {
        studentRoles.forEach((role) => {
            const learner = getUserProfileFromContext(
                scenarioContext,
                learnerProfileAliasWithAccountRoleSuffix(role)
            );

            const studentInfo = getStudentInfoByUserProfile(scenarioContext, learner);
            studentInfos.push(studentInfo);
        });
    }

    return { teacherNames, studentInfos };
}

export function getCreatedLessonInfoOfLessonManagement(scenarioContext: ScenarioContext) {
    const courseId = scenarioContext.get(aliasCourseId);
    const lessonId = scenarioContext.get(aliasLessonId);
    const lessonName = scenarioContext.get(aliasLessonName);
    const lessonTime = scenarioContext.get<LessonManagementLessonTime>(aliasLessonTime);

    return { lessonId, lessonName, courseId, lessonTime };
}

export async function changeRowsPerPageForVirtualizedTable(
    cms: CMSInterface,
    scenario: ScenarioContext,
    numberOfRowPerPage: string
) {
    const page = cms.page!;

    let rowsPerPageValue: string;

    const isRandomValue = numberOfRowPerPage.includes('of');

    if (!isRandomValue) rowsPerPageValue = numberOfRowPerPage;
    else {
        const rowOptions = convertOneOfStringTypeToArray(numberOfRowPerPage);
        rowsPerPageValue = getRandomElement(rowOptions);
    }

    await page.click(tableBaseFooterSelect);
    await page.click(tableRowItem(+rowsPerPageValue));

    scenario.set(aliasRowsPerPage, rowsPerPageValue);
}

interface SampleStudentCourseReturn {
    course: {
        courseId: string;
        courseName: string;
    };
    student: UserProfileEntity;
}

export const prefixStudentName = 'e2e-student';

export async function createSampleStudentWithCourseAndEnrolledStatus(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    studentRole: AccountRoles;
    tenant?: Tenant;
    isAddNewLocation?: boolean;
    indexOfGetLocation?: number;
}): Promise<SampleStudentCourseReturn> {
    const {
        cms,
        scenarioContext,
        studentRole,
        tenant,
        isAddNewLocation,
        indexOfGetLocation = 0,
    } = params;

    const token = await cms.getToken();
    const { iconUrl, schoolId } = await cms.getContentBasic();

    // Setup location
    const locations: LocationInfoGRPC[] = [];

    const locationIdAliasKey = tenant ? aliasLocationIdWithTenant(tenant) : aliasLocationId;
    const locationNameAliasKey = tenant ? aliasLocationNameWithTenant(tenant) : aliasLocationName;

    const locationIdFromContext = scenarioContext.get(locationIdAliasKey);
    const locationNameFromContext = scenarioContext.get(locationNameAliasKey);

    if (isAddNewLocation || !locationIdFromContext || !locationNameFromContext) {
        const locationsListFromAPI = await retrieveLowestLocations(cms);

        if (!arrayHasItem(locationsListFromAPI)) throw Error('There are no locations from API');
        locations.push(locationsListFromAPI[indexOfGetLocation]);
    } else {
        locations.push({
            locationId: locationIdFromContext,
            name: locationNameFromContext,
        });
    }

    // Setup student
    const studentName = `${prefixStudentName}.${getRandomNumber()}.${randomString(10)}@manabie.com`;
    const grade = randomInteger(1, 12);
    const gradeMaster = await getRandomGradeMaster(cms);
    const password = '123456789';

    const enrollmentStatus = 'STUDENT_ENROLLMENT_STATUS_ENROLLED';
    const countryCode = Country.COUNTRY_JP;

    const birthday = getRandomDate();
    const gender = Gender.MALE;

    const locationIdsList = [locations[0].locationId];

    const studentProfileReq: NsUsermgmtUserModifierService.CreateStudentProfile = {
        email: studentName,
        name: studentName,
        password,
        countryCode,
        grade,
        gradeId: gradeMaster?.grade_id,
        enrollmentStatus: StudentEnrollmentStatus[enrollmentStatus],
        phoneNumber: '',
        studentExternalId: '',
        studentNote: '',
        birthday,
        gender,
        locationIdsList,
        enrollmentStatusStr: enrollmentStatus,
        firstName: '',
        lastName: '',
        firstNamePhonetic: '',
        lastNamePhonetic: '',
        tagIdsList: [],
    };

    const { response: studentResponse } = await usermgmtUserModifierService.createStudent(token, {
        schoolId,
        studentProfile: studentProfileReq,
        schoolHistoriesList: [],
        userAddressesList: [],
        enrollmentStatusHistoriesList: [],
    });
    if (!studentResponse) throw Error('Create a student failed');

    const userProfile = studentResponse.studentProfile?.student?.userProfile;
    if (!userProfile) throw Error('There is no user information');

    // Setup course
    const id = genId();
    const course: NsMasterCourseService.UpsertCoursesRequest = {
        id,
        name: `Course Name ${id}`,
        displayOrder: 1,
        bookIdsList: [],
        icon: iconUrl,
        schoolId,
        locationIdsList,
        courseType: '',
    };
    scenarioContext.set(aliasCourse, course);
    await masterCourseService.upsertCourses(token, [course]);

    // Setup student package
    const startTime = new Date();
    const endTime = new Date();
    startTime.setDate(startTime.getDate() - 30);
    endTime.setDate(endTime.getDate() + 60);

    const newCourses = await createStudentPackageProfiles(cms, {
        courseIds: [course.id],
        startTime,
        endTime,
    });

    const studentPackages: NsUsermgmtUserModifierService.StudentPackage[] = newCourses.map(
        (courseInfo) => ({
            courseId: courseInfo.courseId,
            studentPackageId: '',
            startTime: courseInfo.startTime,
            endTime: courseInfo.endTime,
            locationId: locations[0].locationId,
        })
    );

    await usermgmtUserModifierService.upsertStudentCoursePackageReq(token, {
        studentId: userProfile.userId,
        studentPackages,
    });

    const result: SampleStudentCourseReturn = {
        student: {
            avatar: '',
            phoneNumber: '',
            email: userProfile.email,
            givenName: userProfile.givenName,
            id: userProfile.userId,
            name: userProfile.name,
            password,
            locations,
            gradeValue: grade,
        },
        course: {
            courseId: course.id,
            courseName: course.name,
        },
    };

    setupAliasStudentCourse({
        scenarioContext,
        studentRole,
        student: result.student,
        course: result.course,
        tenant,
    });

    return result;
}

export function setupAliasStudentCourse(params: {
    scenarioContext: ScenarioContext;
    studentRole: AccountRoles;
    student: SampleStudentCourseReturn['student'];
    course: SampleStudentCourseReturn['course'];
    tenant?: Tenant;
}) {
    const { scenarioContext, studentRole, student, course, tenant } = params;

    scenarioContext.set(learnerProfileAliasWithAccountRoleSuffix(studentRole), student);

    const locations = student.locations;
    if (!locations || !arrayHasItem(locations)) throw Error('There is no location for student');

    const { locationId, name: locationName } = locations[0];

    scenarioContext.set(aliasLocationId, locationId);
    scenarioContext.set(aliasLocationName, locationName);

    if (tenant) {
        scenarioContext.set(aliasLocationIdWithTenant(tenant), locationId);
        scenarioContext.set(aliasLocationNameWithTenant(tenant), locationName);
    }

    const { courseId, courseName } = course;

    // For lesson
    scenarioContext.set(aliasCourseId, courseId);
    scenarioContext.set(aliasCourseName, courseName);

    // For study plan
    scenarioContext.set(aliasCourseIdSyllabus, courseId);
    scenarioContext.set(aliasCourseNameSyllabus, courseName);

    // For multiple students
    scenarioContext.set(aliasCourseIdByStudent(student.id), course.courseId);
}

export async function waitForTableLessonRenderRows(cms: CMSInterface) {
    await cms.page!.waitForSelector(LessonManagementKeys.lessonLink, { timeout: 20000 });
}

export async function userNavigateTable(cms: CMSInterface, action: 'NEXT PAGE' | 'PREV PAGE') {
    const page = cms.page!;

    switch (action) {
        case 'NEXT PAGE': {
            const buttonNextPage = await page.waitForSelector(buttonNextPageTable);
            const isButtonDisabled = await buttonNextPage.isDisabled();

            if (isButtonDisabled)
                throw Error('Button next page is disabled. Maybe data is not enough to next page');

            await buttonNextPage.click();
            break;
        }

        case 'PREV PAGE': {
            const buttonPreviousPage = await page.waitForSelector(buttonPreviousPageTable);
            const isButtonDisabled = await buttonPreviousPage.isDisabled();

            if (isButtonDisabled)
                throw Error(
                    'Button previous page is disabled. Maybe it is on the first result page'
                );

            await buttonPreviousPage.click();
            break;
        }
    }
}
