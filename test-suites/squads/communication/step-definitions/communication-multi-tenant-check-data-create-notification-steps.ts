import { getSchoolAdminTenantInterfaceFromRole } from '@legacy-step-definitions/utils';
import { learnerTenantProfileAliasWithLearnerTenantRoleSuffix } from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import {
    AccountAction,
    CourseWithTenant,
    IMasterWorld,
    LearnerRolesWithTenant,
    SchoolAdminRolesWithTenant,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import NsMasterCourseService from '@supports/services/master-course-service/request-types';

import {
    goToNotificationsPage,
    openComposeMessageDialog,
} from './communication-common-definitions';
import {
    verifyStudentAtAutocompleteIndividualRecipient,
    searchStudentAtAutoCompleteIndividualRecipient,
    searchCourseOnComposeDialog,
    verifyCourseAtCourseAutocomplete,
} from './communication-multi-tenant-check-data-create-notification-definitions';
import { schoolAdminGetFirstGrantedLocation } from 'test-suites/squads/architecture/step-definitions/architecture-auto-select-first-granted-location-definitions';
import { schoolAdminCreateNewStudent } from 'test-suites/squads/user-management/step-definitions/user-create-student-definitions';

Given(
    `{string} opens compose dialog`,
    async function (schoolAdminRoles: SchoolAdminRolesWithTenant) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRoles);

        await cms.instruction(`${schoolAdminRoles} go to notifications page`, async function () {
            await goToNotificationsPage(cms);
        });

        await cms.instruction(`${schoolAdminRoles} opens compose dialog`, async function () {
            await openComposeMessageDialog(cms);
        });
    }
);

When(
    `{string} search name of {string} at individual recipient`,
    async function (
        schoolAdminRoles: SchoolAdminRolesWithTenant,
        learnRoles: LearnerRolesWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRoles);

        const scenarioContext = this.scenario;
        const { name } = scenarioContext.get<UserProfileEntity>(
            learnerTenantProfileAliasWithLearnerTenantRoleSuffix(learnRoles)
        );

        await cms.instruction(
            `${schoolAdminRoles} search student with the name as ${name} and the role as ${learnRoles} at individual recipient`,
            async () => await searchStudentAtAutoCompleteIndividualRecipient(cms, name)
        );
    }
);

Then(
    `{string} {string} {string} at individual recipient`,
    async function (
        schoolAdminRoles: SchoolAdminRolesWithTenant,
        seesOrNotSee: AccountAction,
        learnRoles: LearnerRolesWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRoles);

        const scenarioContext = this.scenario;
        const { name: learnerName } = scenarioContext.get<UserProfileEntity>(
            learnerTenantProfileAliasWithLearnerTenantRoleSuffix(learnRoles)
        );

        await cms.attach(
            `Search student with the name as ${learnerName} and the role as ${learnRoles} at individual recipient`
        );

        await cms.instruction(
            `${schoolAdminRoles} ${seesOrNotSee} student with the name as ${learnerName} and the role as ${learnRoles} at individual recipient`,
            async () => {
                await verifyStudentAtAutocompleteIndividualRecipient(
                    cms,
                    learnerName,
                    seesOrNotSee
                );
            }
        );
    }
);

When(
    `{string} search {string} at select course`,
    async function (schoolAdminRoles: SchoolAdminRolesWithTenant, courseTenant: CourseWithTenant) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRoles);

        const scenarioContext = this.scenario;
        const course =
            scenarioContext.get<NsMasterCourseService.UpsertCoursesRequest>(courseTenant);

        await cms.instruction(
            `${schoolAdminRoles} search course with the name as ${course.name} and the role as ${courseTenant} at course autocomplete`,
            async () => await searchCourseOnComposeDialog(cms, course.name)
        );
    }
);

Then(
    `{string} {string} {string} at select course`,
    async function (
        schoolAdminRoles: SchoolAdminRolesWithTenant,
        seesOrNotSee: AccountAction,
        courseTenant: CourseWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRoles);

        const scenarioContext = this.scenario;
        const course =
            scenarioContext.get<NsMasterCourseService.UpsertCoursesRequest>(courseTenant);

        await cms.attach(
            `Search course with the name as ${course.name} and the role as ${courseTenant} at course autocomplete`
        );

        await cms.instruction(
            `${schoolAdminRoles} ${seesOrNotSee} course with the name as ${course.name} and the role as ${courseTenant} at course autocomplete`,
            async () => {
                await verifyCourseAtCourseAutocomplete(cms, course.name, seesOrNotSee);
            }
        );
    }
);

Given(
    '{string} has created {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        studentRole: LearnerRolesWithTenant
    ) {
        const scenarioContext = this.scenario;
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const firstGrantedLocation = await schoolAdminGetFirstGrantedLocation(cms, scenarioContext);

        const studentData = (
            await schoolAdminCreateNewStudent(cms, scenarioContext, 1, [firstGrantedLocation])
        ).student;

        await cms.instruction(
            `Get learner new credentials after create account successfully`,
            async function () {
                scenarioContext.set(
                    learnerTenantProfileAliasWithLearnerTenantRoleSuffix(studentRole),
                    studentData
                );
            }
        );

        await cms.instruction(
            `${schoolAdminRole} created a student ${studentRole}: ${studentData.name} by calling API`,
            async function () {
                scenarioContext.set(studentRole, studentData);
            }
        );
    }
);
