import { menuItemLinkRoot } from '@legacy-step-definitions/cms-selectors/common';
import { aSchoolAdminOnCMSLoginPageAndSeeLoginForm } from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    aTeacherAtHomeScreenTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import { UserRole } from '@legacy-step-definitions/types/common';
import {
    numberOfUserGroupsAlias,
    staffProfileAlias,
    userGroupGrantedRoleList,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    createAStaffGRPCAndSetProfileToScenarioContext,
    forgotPasswordStaff,
    schoolAdminIsOnTheCreateStaffPage,
} from './user-create-staff-definitions';
import {
    assertAllowedSidebarMenu,
    assignStaffIdAndPasswordToStaffProfile,
    getUserGroupFromContext,
    schoolAdminChangeUserRoleInUserGroup,
    schoolAdminCreateAStaffWithUserGroups,
    schoolAdminGoesToEditUserGroupPage,
    StaffFormData,
    staffLoginsAfterForgotPassword,
    staffSeesScreensRelateOnCMS,
    staffSeesScreensRelateOnTeacherWeb,
} from './user-create-staff-with-user-group-definitions';
import { createAnUserGroupGRPC, UserGroupTypeAlias } from './user-create-user-group-definitions';
import { createRandomStaff } from './user-definition-utils';
import { schoolAdminRemovesGrantedPermission } from './user-edit-user-group-definitions';
import { loginCMSByUserNameAndPassWord } from './user-login-fail-by-wrong-username-or-password-definitions';
import { staffLoginsTeacherAppFailed } from './user-multi-tenant-create-staff-definitions';

When(
    'school admin creates a new staff with {string} user groups',
    async function (this: IMasterWorld, numOfUserGroupsStr: string) {
        const numOfUserGroups = Number(numOfUserGroupsStr);
        const context = this.scenario;
        const staffFormData = createRandomStaff(numOfUserGroups);

        await this.cms.instruction('Go to the add staff page', async function (this: CMSInterface) {
            await schoolAdminIsOnTheCreateStaffPage(this);
        });

        await this.cms.instruction(
            `school admin fill staff form with ${numOfUserGroups} user groups`,
            async function (this: CMSInterface) {
                await schoolAdminCreateAStaffWithUserGroups(this, context, staffFormData);
            }
        );
    }
);

Given(
    'school admin has created a new staff with {string} user groups',
    async function (this: IMasterWorld, userGroups: string) {
        const numOfUserGroup = Number(userGroups);
        const context = this.scenario;
        const cms = this.cms;
        context.set(numberOfUserGroupsAlias, numOfUserGroup);

        await this.cms.instruction('school admin create a staff by API', async function () {
            await createAStaffGRPCAndSetProfileToScenarioContext(cms, context);
        });
    }
);

When('school admin create staff {string}', async function (this: IMasterWorld, option: string) {
    const context = this.scenario;
    const cms = this.cms;

    await cms.instruction('Go to the add staff page', async function () {
        await schoolAdminIsOnTheCreateStaffPage(cms);
    });

    await cms.instruction(`school admin fill staff form ${option}`, async function () {
        let staffFormData: StaffFormData;
        if (option === 'with user group has no role') {
            const { userGroupName } = await createAnUserGroupGRPC(cms, false);
            staffFormData = createRandomStaff(1, [userGroupName]);
        } else {
            staffFormData = createRandomStaff(0);
        }

        await schoolAdminCreateAStaffWithUserGroups(cms, context, staffFormData);
    });
});

When(
    'school admin create staff with user group {string}',
    async function (this: IMasterWorld, grantedRole: UserRole) {
        const cms = this.cms;
        const context = this.scenario;

        await cms.instruction('Go to the add staff page', async function (cms) {
            await schoolAdminIsOnTheCreateStaffPage(cms);
        });

        await cms.instruction(
            `School admin fill staff form with user groups which has ${grantedRole}`,
            async function createStaffWithUserGroups(cms) {
                const userGroupGrantedRoles =
                    context.get<UserGroupTypeAlias[]>(userGroupGrantedRoleList);

                const userGroup = userGroupGrantedRoles.find(
                    (userGroup) => userGroup.grantedRole === grantedRole
                );

                if (!userGroup) {
                    throw Error('Can not find user group created from previous step');
                }

                const staffFormData = createRandomStaff(1, [userGroup?.name]);
                await schoolAdminCreateAStaffWithUserGroups(cms, context, staffFormData);
            }
        );
    }
);

Given(
    'school admin has created staff with user group {string}',
    async function (this: IMasterWorld, grantedRole: UserGroupTypeAlias['grantedRole']) {
        const cms = this.cms;
        const context = this.scenario;

        await cms.instruction('School Admin goes to the create staff page', async function () {
            await schoolAdminIsOnTheCreateStaffPage(cms);
        });

        await cms.instruction(
            `School admin create staff with user groups which has ${grantedRole} role`,
            async function () {
                const userGroup = getUserGroupFromContext(context, grantedRole);
                const staffFormData = createRandomStaff(1, [userGroup!.name]);

                const [createStaffGRPCResp] = await Promise.all([
                    cms.waitForGRPCResponse('usermgmt.v2.StaffService/CreateStaff'),
                    await schoolAdminCreateAStaffWithUserGroups(cms, context, staffFormData),
                ]);

                await assignStaffIdAndPasswordToStaffProfile(cms, context, createStaffGRPCResp);
            }
        );
    }
);

Given(
    'staff can see screens related with user group {string}',
    async function (this: IMasterWorld, grantedRole: UserRole) {
        const teacher = this.teacher;
        const context = this.scenario;

        await staffSeesScreensRelateOnCMS(this, grantedRole);
        await staffSeesScreensRelateOnTeacherWeb(teacher, context, grantedRole);
    }
);

Then(
    'staff sees screens related with user group {string}',
    async function (this: IMasterWorld, grantedRole: UserRole) {
        const cms2 = this.cms2;
        const cms2Page = cms2.page;

        await cms2.instruction(
            `Staff can see screens related with user group ${grantedRole}`,
            async function () {
                const menuItems = cms2Page?.locator(menuItemLinkRoot);
                const menuItemsText = await menuItems?.allTextContents();

                assertAllowedSidebarMenu(menuItemsText, grantedRole);
            }
        );
    }
);

When(
    'school admin change role of this user group from {string} to {string}',
    async function (this: IMasterWorld, oldRole: UserRole, newRole: UserRole) {
        const cms = this.cms;
        const cms2 = this.cms2;
        const cms2Page = cms2.page;
        const context = this.scenario;
        const teacher = this.teacher;

        await schoolAdminChangeUserRoleInUserGroup(this, oldRole, newRole);

        if (newRole === UserRole.SCHOOL_ADMIN) {
            // For the change in the user group to take effect
            await cms2Page?.reload();
        } else {
            // To handle the case where user role change from School Admin to Teacher
            // Because we can not reissue the password for School Admin in the first place, so we do it after the change
            await forgotPasswordStaff(cms, context);

            await cms2.instruction(
                'New staff logins CMS2 successfully with new password',
                async function () {
                    await staffLoginsAfterForgotPassword(context, cms2);
                }
            );

            await teacher.instruction(
                'Teacher logins success in Teacher Web',
                async function (teacher: TeacherInterface) {
                    const { email, password } = context.get<UserProfileEntity>(staffProfileAlias);
                    await teacherEnterAccountInformation({
                        teacher,
                        username: email,
                        password: password,
                    });
                    await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
                }
            );
        }
    }
);

Then('staff got kicked out of Teacher App', async function (this: IMasterWorld) {
    const teacher = this.teacher;

    await teacher.instruction('Staff refresh the current page', async function () {
        await teacher.flutterDriver?.reload();
    });

    await teacher.instruction('Staff see the login page', async function () {
        await aTeacherAtHomeScreenTeacherWeb(teacher);
    });
});

When('school admin delete all role of this user group', async function (this: IMasterWorld) {
    const cms = this.cms;
    const context = this.scenario;

    await schoolAdminGoesToEditUserGroupPage(cms, context, 'Both roles');

    await cms.instruction('school admin delete all role of this user group', async function () {
        await schoolAdminRemovesGrantedPermission(cms, context, 'all');
    });
});

Then('staff can not logins Teacher App', async function (this: IMasterWorld) {
    const teacher = this.teacher;
    const context = this.scenario;

    await teacher.instruction('Staff can not login Teacher App', async function () {
        await staffLoginsTeacherAppFailed({
            teacher,
            context,
            staffAlias: staffProfileAlias,
            organization: 'e2e',
        });
    });
});

Then('staff got kicked out of CMS', async function (this: IMasterWorld) {
    const cms2 = this.cms2;

    await cms2.instruction('Staff reload the current page', async function () {
        await cms2.page?.reload();
    });

    await cms2.instruction('Staff see login page', async function () {
        await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms2);
    });
});

Then('staff can not logins CMS', async function (this: IMasterWorld) {
    const cms2 = this.cms2;
    const context = this.scenario;

    await cms2.instruction('New staff logins CMS2 failed', async function () {
        const { email, password } = context.get<UserProfileEntity>(staffProfileAlias);
        await loginCMSByUserNameAndPassWord(cms2, email, password);
        await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms2);
    });
});
