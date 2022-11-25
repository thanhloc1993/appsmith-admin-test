import {
    getRandomElementsWithLength,
    getSchoolAdminTenantInterfaceFromRole,
} from '@legacy-step-definitions/utils';
import { learnerTenantProfileAliasWithLearnerTenantRoleSuffix } from '@user-common/alias-keys/user';
import { tabLayoutStudent } from '@user-common/cms-selectors/students-page';

import { Given } from '@cucumber/cucumber';

import {
    CourseWithTenant,
    IMasterWorld,
    LearnerRolesWithTenant,
    SchoolAdminRolesWithTenant,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    createRandomCoursesWithLocations,
    schoolAdminGoesToStudentDetailPage,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';
import { addCourseWhenEditStudent } from 'test-suites/squads/user-management/step-definitions/user-modify-course-of-student-definitions';

Given(
    '{string} creates a course {string} for {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        courseTenant: CourseWithTenant,
        studentRole: LearnerRolesWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const scenarioContext = this.scenario;

        const student = scenarioContext.get<UserProfileEntity>(
            learnerTenantProfileAliasWithLearnerTenantRoleSuffix(studentRole)
        );

        const newCourse = (await createRandomCoursesWithLocations(cms)).request[0];

        await schoolAdminGoesToStudentDetailPage(cms, student);

        await cms.selectTabButtonByText(tabLayoutStudent, 'Course');

        await cms.waitForSkeletonLoading();

        await cms.selectAButtonByAriaLabel('Edit');

        const studentCourseLocations = student.locations?.filter((_) =>
            newCourse.locationIdsList?.includes(_.locationId)
        );
        const randomLocation = getRandomElementsWithLength(studentCourseLocations || [], 1)[0];

        await addCourseWhenEditStudent(cms, 'available', newCourse.name, randomLocation);

        scenarioContext.set(courseTenant, newCourse);
    }
);

Given(
    '{string} creates a course {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        courseTenant: CourseWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const scenarioContext = this.scenario;

        const newCourse = (await createRandomCoursesWithLocations(cms)).request[0];

        scenarioContext.set(courseTenant, newCourse.id);
    }
);
