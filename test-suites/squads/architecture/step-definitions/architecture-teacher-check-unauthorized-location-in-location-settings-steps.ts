import { teacherOpenLocationFilterDialogOnTeacherApp } from '@legacy-step-definitions/lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import { getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';
import {
    staffProfileAliasWithAccountRoleSuffix,
    userGroupIdsListAlias,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';

import {
    createUserGroup,
    teacherSeesUnAuthorizedLocations,
} from './architecture-teacher-check-unauthorized-location-in-location-settings-definition';
import { schoolAdminGoesToCreateUserGroupPage } from 'test-suites/squads/user-management/step-definitions/user-create-user-group-definitions';
import { Role } from 'test-suites/squads/user-management/step-definitions/user-edit-user-group-definitions';
import { updateStaffByGRPC } from 'test-suites/squads/user-management/step-definitions/user-update-staff-definitions';

When('{string} opens location dialog on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} opens location dialog on Teacher App`, async function () {
        await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
    });
});

When('{string} reloads Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    await teacher.instruction(`${role} reloads Teacher App`, async function () {
        await teacher.flutterDriver!.reload();
    });
});

Then(
    '{string} sees {string} in location dialog as unauthorized location and unable to select',
    async function (role: AccountRoles, location: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        await teacher.instruction(
            `${role} sees ${location} in location dialog as unauthorized location and unable to select`,
            async function () {
                await teacherSeesUnAuthorizedLocations(teacher, location);
            }
        );
    }
);

Given('school admin has updated the teacher user group', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenario = this.scenario;
    const staff = scenario.get<UserProfileEntity>(
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );

    const userGroupIdsList = scenario.get<string[]>(userGroupIdsListAlias);

    await cms.instruction(`school admin has updated the teacher user group`, async function () {
        await updateStaffByGRPC(cms, {
            user_id: staff.id,
            name: staff.name,
            email: staff.email,
            userGroupIdsList: userGroupIdsList,
        });
    });
});

Given(
    'school admin has created user group with location {string} with role {string}',
    async function (this: IMasterWorld, location: string, role: Role) {
        const cms = this.cms!;
        const context = this.scenario;

        await cms.instruction('School admin goes to the user group page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.USER_GROUP, 'User Group');
        });

        await cms.instruction('School admin goes to the create user group page', async function () {
            await schoolAdminGoesToCreateUserGroupPage(cms, context);
        });

        await cms.instruction(
            `School admin creates a user group with location ${location} with role ${role}`,
            async function () {
                await createUserGroup(cms, context, location, role);
            }
        );
    }
);
