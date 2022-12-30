import {
    genId,
    getRandomDate,
    getRandomGradeMaster,
    getRandomNumber,
    randomString,
} from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { toTimestampServerTimezone } from '@supports/services/common/request';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';
import NsUsermgmtUserModifierService from '@supports/services/usermgmt-student-service/request-types';

import { Country } from 'manabuf/common/v1/enums_pb';
import { Gender, StudentEnrollmentStatus } from 'manabuf/usermgmt/v2/enums_pb';
import {
    aliasCourseEndDate,
    aliasCourseStartDate,
    aliasLessonDate,
} from 'test-suites/squads/lesson/common/alias-keys';
import { CourseDuration } from 'test-suites/squads/lesson/services/student-service/types';

export async function createStudentRequest(params: {
    cms: CMSInterface;
    locationIds: string[];
}): Promise<Required<NsUsermgmtUserModifierService.CreateStudentReq>> {
    const { cms, locationIds } = params;

    const { schoolId } = await cms.getContentBasic();

    const studentName = `e2e-student.${getRandomNumber()}.${randomString(10)}@manabie.com`;
    const gradeMaster = await getRandomGradeMaster(cms);

    const birthday = getRandomDate();
    const gender = Gender.MALE;

    const enrollmentStatusStr = 'STUDENT_ENROLLMENT_STATUS_ENROLLED';
    const grade = 12;

    const studentProfile: NsUsermgmtUserModifierService.CreateStudentProfile = {
        email: studentName,
        name: studentName,
        birthday,
        gender,
        enrollmentStatusStr,
        grade,
        password: '123456789',
        locationIdsList: locationIds,
        countryCode: Country.COUNTRY_JP,
        gradeId: gradeMaster?.grade_id,
        enrollmentStatus: StudentEnrollmentStatus[enrollmentStatusStr],
        phoneNumber: '',
        studentExternalId: '',
        studentNote: '',
        firstName: '',
        lastName: '',
        firstNamePhonetic: '',
        lastNamePhonetic: '',
        tagIdsList: [],
    };

    return {
        schoolId,
        studentProfile,
        schoolHistoriesList: [],
        userAddressesList: [],
        enrollmentStatusHistoriesList: [],
    };
}

export async function upsertCourseRequest(params: {
    cms: CMSInterface;
    locationIds: string[];
}): Promise<NsMasterCourseService.UpsertCoursesRequest> {
    const { cms, locationIds } = params;

    const { schoolId } = await cms.getContentBasic();
    const id = genId();

    return {
        id,
        name: `Course Name ${id}`,
        displayOrder: 1,
        locationIdsList: locationIds,
        bookIdsList: [],
        schoolId,
        icon: '',
        courseType: '',
    };
}

export async function studentPackageProfileRequest(params: {
    cms: CMSInterface;
    scenarioContext: ScenarioContext;
    courseId: string;
    locationId: string;
    classId: string;
    courseDuration?: CourseDuration;
}): Promise<NsUsermgmtUserModifierService.StudentPackage> {
    const { cms, scenarioContext, courseId, locationId, classId, courseDuration } = params;

    const timezone = await cms.getTimezone();
    const startTime = new Date();
    const endTime = new Date();

    switch (courseDuration) {
        case 'within 30 days since now':
            endTime.setDate(endTime.getDate() + 30);
            break;

        case 'start date < lesson date < end date': {
            const lessonDate = new Date(scenarioContext.get<Date>(aliasLessonDate));

            startTime.setDate(lessonDate.getDate() - 1);
            endTime.setDate(lessonDate.getDate() + 1);
            break;
        }

        case 'end date = lesson date': {
            const lessonDate = new Date(scenarioContext.get<Date>(aliasLessonDate));

            startTime.setDate(lessonDate.getDate() - 1);
            endTime.setDate(lessonDate.getDate());
            break;
        }

        default:
            startTime.setDate(startTime.getDate() - 30);
            endTime.setDate(endTime.getDate() + 60);
            break;
    }

    scenarioContext.set(aliasCourseStartDate, startTime);
    scenarioContext.set(aliasCourseEndDate, endTime);

    return {
        courseId,
        locationId,
        startTime: toTimestampServerTimezone({
            originDate: startTime,
            timeSlice: 'start',
            typeSlice: 'date',
            timezone: timezone.value,
        }),
        endTime: toTimestampServerTimezone({
            originDate: endTime,
            timeSlice: 'end',
            typeSlice: 'date',
            timezone: timezone.value,
        }),
        studentPackageId: '',
        classId,
    };
}
