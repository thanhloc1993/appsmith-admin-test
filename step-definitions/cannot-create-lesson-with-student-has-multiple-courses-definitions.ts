import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { AccountRoles, CMSInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import { LocationInfoGRPC } from '@supports/types/cms-types';
import { genId } from '@supports/utils/ulid';

import masterCourseService from '@services/master-course-service';
import NsMasterCourseService from '@services/master-course-service/request-types';
import { usermgmtUserModifierService } from '@services/usermgmt-student-service';
import NsUsermgmtUserModifierService from '@services/usermgmt-student-service/request-types';

import { aliasLocationId, aliasLocationName } from './alias-keys/lesson';
import { startTimeInput, endTimeInput } from './cms-selectors/lesson-management';
import { changeTimePicker } from './lesson-management-utils';
import { getUserProfileFromContext } from './utils';
import { StudentEnrollmentStatus } from 'manabuf/usermgmt/v2/enums_pb';
import {
    selectStudentSubscription,
    selectTeacher,
    selectTeachingMethod,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { selectCenterByName } from 'test-suites/squads/lesson/step-definitions/lesson-remove-chip-filter-result-for-future-lesson-definitions';
import { selectTeachingMedium } from 'test-suites/squads/lesson/utils/lesson-upsert';
import {
    createAStudentPromise,
    createStudentPackageProfiles,
} from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

export async function createStudentWithEnrollmentStatus(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    accountRoleSuffix: AccountRoles,
    defaultEnrollmentStatus: keyof typeof StudentEnrollmentStatus = 'STUDENT_ENROLLMENT_STATUS_ENROLLED'
): Promise<UserProfileEntity> {
    const studentKey = learnerProfileAliasWithAccountRoleSuffix(accountRoleSuffix);

    await cms.attach(`Create a student with enrollment status by gRPC`);

    const newStudent = await createAStudentPromise(cms, {
        defaultEnrollmentStatus,
    });

    const location: LocationInfoGRPC | undefined = newStudent.locations?.[0];
    if (!location) throw Error('Student locations is no information');

    // Set student and location info
    scenarioContext.set(studentKey, newStudent);
    scenarioContext.set(aliasLocationId, location.locationId);
    scenarioContext.set(aliasLocationName, location.name);

    return newStudent;
}

export async function addCourseForStudent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    accountRoleSuffix: AccountRoles
): Promise<void> {
    const studentKey = learnerProfileAliasWithAccountRoleSuffix(accountRoleSuffix);
    const student = scenarioContext.get<UserProfileEntity>(studentKey);
    if (!student) throw Error('There is no user information');

    const token = await cms.getToken();
    const { iconUrl, schoolId } = await cms.getContentBasic();
    const locationId = scenarioContext.get(aliasLocationId);

    // Setup course
    const id = genId();
    const course: NsMasterCourseService.UpsertCoursesRequest = {
        id,
        name: `Course Name ${id}`,
        displayOrder: 1,
        bookIdsList: [],
        icon: iconUrl,
        schoolId,
        locationIdsList: [locationId],
        courseType: '',
    };

    await masterCourseService.upsertCourses(token, [course]);

    // Setup student package
    const startTime = new Date();
    const endTime = new Date();
    startTime.setDate(startTime.getDate() - 1);
    endTime.setDate(endTime.getDate() + 1);

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
            locationId,
        })
    );

    await usermgmtUserModifierService.upsertStudentCoursePackageReq(token, {
        studentId: student.id,
        studentPackages,
    });

    const { id: courseId, name: courseName } = course;
    await cms.attach(`Add course ${courseId}/${courseName} for student ${student.email} by gRPC`);
}

export async function selectStudentWithCourseInCreateLessonDialog(
    cms: CMSInterface,
    scenarioContext: ScenarioContext,
    accountRoleSuffix: AccountRoles
) {
    const { name: studentName } = getUserProfileFromContext(
        scenarioContext,
        learnerProfileAliasWithAccountRoleSuffix(accountRoleSuffix)
    );
    await selectStudentSubscription({ cms, studentName });
}

export async function fillAllRemainOfLessonManagementUpsertFormExcludeStudent(
    cms: CMSInterface,
    scenarioContext: ScenarioContext
) {
    const centerName = scenarioContext.get(aliasLocationName);
    await changeTimePicker({
        cms,
        timePickerSelector: startTimeInput,
        hour: 0,
        minute: 0,
    });

    await changeTimePicker({
        cms,
        timePickerSelector: endTimeInput,
        hour: 11,
        minute: 55,
    });

    await selectTeachingMedium(cms, 'LESSON_TEACHING_MEDIUM_ONLINE');
    await selectTeachingMethod(cms, 'LESSON_TEACHING_METHOD_INDIVIDUAL');
    await selectTeacher(cms);
    await selectCenterByName(cms, centerName);
}
