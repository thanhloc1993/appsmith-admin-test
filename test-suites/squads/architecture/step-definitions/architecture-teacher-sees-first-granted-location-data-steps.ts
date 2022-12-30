import {
    teacherAppliesSelectedLocationOnTeacherApp,
    teacherOpenLocationFilterDialogOnTeacherApp,
} from '@legacy-step-definitions/lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import { getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';
import {
    staffProfileAliasWithAccountRoleSuffix,
    userGroupIdsListAlias,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    createCoursesWithFirstGrantedLocation,
    createLessonWithCourseUnderFirstGrantedLocation,
    createStudentWithCourseUnderFirstGrantedLocation,
    teacherDeselectLocationsOnTeacherApp,
    teacherMoveToLessonOrStudentTab,
    teacherSeesCheckmarkOnFirstGrantedLocation,
    teacherSeesCourseOnFirstGrantedLocation,
    teacherSeesErrorMessageSnackbar,
    teacherSeesFirstGrantedLocationOnTeacherApp,
    teacherSeesStudentOrLessonOnFirstGrantedLocation,
} from './architecture-teacher-sees-first-granted-location-data-definitions';
import { updateStaffByGRPC } from 'test-suites/squads/user-management/step-definitions/user-update-staff-definitions';

Given(
    `school admin has created a {string} with course under first granted location`,
    async function (this: IMasterWorld, type: string) {
        const cms = this.cms;
        const scenario = this.scenario;
        let func: Promise<void>;

        switch (type) {
            case 'student': {
                func = createStudentWithCourseUnderFirstGrantedLocation(cms, scenario);
                break;
            }
            case 'lesson': {
                func = createLessonWithCourseUnderFirstGrantedLocation(cms, scenario);
                break;
            }
            default: {
                func = createStudentWithCourseUnderFirstGrantedLocation(cms, scenario);
                break;
            }
        }

        await cms.instruction(
            `school admin creates a ${type} with course under first granted location`,
            async function () {
                await func;
            }
        );
    }
);

Given(
    `school admin has created a course under first granted location`,
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(
            `school admin creates a course under first granted location`,
            async function () {
                await createCoursesWithFirstGrantedLocation(cms, scenario);
            }
        );
    }
);

When(
    '{string} goes to {string} tab screen',
    async function (this: IMasterWorld, role: AccountRoles, type: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(`${role} goes to ${type} tab screen`, async () => {
            await teacherMoveToLessonOrStudentTab(teacher, type);
        });
    }
);

When(
    '{string} deselects all location in location dialog and saves on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenario = this.scenario;

        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} deselects all location in location dialog and saves on Teacher App`,
            async () => {
                await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                await teacherDeselectLocationsOnTeacherApp(teacher, scenario);
                await teacherAppliesSelectedLocationOnTeacherApp(teacher);
            }
        );
    }
);

Then(
    `{string} sees first granted location name under teacher's name on Teacher App`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await teacher.instruction(
            `${role} sees first granted location name under teacher's name on Teacher App`,
            async function () {
                await teacherSeesFirstGrantedLocationOnTeacherApp(teacher, scenario);
            }
        );
    }
);

Then(
    `{string} sees checkbox on the first granted location`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await teacher.instruction(
            `${role} sees checkbox on the first granted location`,
            async function () {
                await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                await teacherSeesCheckmarkOnFirstGrantedLocation(teacher, scenario);
            }
        );
    }
);

Then(
    `{string} sees the previously created course under first granted location`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} sees the previously created course under first granted location`,
            async function () {
                await teacherSeesCourseOnFirstGrantedLocation(teacher, scenario);
            }
        );
    }
);

Then(
    `{string} sees the previously created {string} under first granted location`,
    async function (this: IMasterWorld, role: AccountRoles, type: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        await teacher.instruction(
            `${role} sees the previously created ${type} under first granted location`,
            async function () {
                await teacherSeesStudentOrLessonOnFirstGrantedLocation(teacher, scenario, type);
            }
        );
    }
);

Then(
    `{string} sees an error message is displayed on snackbar`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees an error message is displayed on snackbar`,
            async function () {
                await teacherSeesErrorMessageSnackbar(teacher);
            }
        );
    }
);
Given('school admin has edited teacher user group', async function (this: IMasterWorld) {
    const cms = this.cms;
    const teacher = this.teacher;
    const context = this.scenario;
    const staff = context.get<UserProfileEntity>(staffProfileAliasWithAccountRoleSuffix('teacher'));
    const userGroupIdsList = context.get<string[]>(userGroupIdsListAlias);

    await cms.instruction(`school admin edits teacher user group`, async function () {
        await updateStaffByGRPC(cms, {
            user_id: staff.id,
            name: staff.name,
            userGroupIdsList: userGroupIdsList,
            email: staff.email,
            // TODO: @dvbtrung2302 update when integrate update staff with phonetic
            full_name_phonetic: '',
        });

        await teacher.instruction(`Teacher reloads the screen`, async () => {
            await teacher.flutterDriver!.reload();
        });
    });
});
