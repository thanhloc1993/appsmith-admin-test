import { aSchoolAdminAlreadyLoginSuccessInCMS } from '@legacy-step-definitions/school-admin-email-login-definitions';
import { UserRole } from '@legacy-step-definitions/types/common';
import { getRandomNumber } from '@legacy-step-definitions/utils';
import {
    staffProfileAlias,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';
import { staffListStaffName } from '@user-common/cms-selectors/staff';
import { isEnabledFeatureFlag } from '@user-common/helper/feature-flag';
import {
    StaffInfo,
    UpsertStaffConditionType,
    UpsertStaffErrorMessage,
} from '@user-common/types/staff';

import { Given, When, Then } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface, IMasterWorld, TeacherInterface } from '@supports/app-types';
import { UserCredentials, UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';

import {
    schoolAdminCreateAStaff,
    schoolAdminSeesNewStaffInCMS,
    staffLoginAccountFromTeacherWorld,
    schoolAdminIsOnTheCreateStaffPage,
    staffSeesTheirInfo,
    forgotPasswordStaff,
    discardStaffUpsertForm,
    StaffRequiredFields,
    assertNotificationLoginResult,
    schoolAdminFillsStaffForm,
    assertStaffOnStaffList,
    getStaffOnStaffList,
    assertStaffOnStaffDetail,
    createARandomStaffFromGRPC,
    createRandomStaffByGRPC,
} from './user-create-staff-definitions';
import { staffWithAdminRoleForgotPassword } from './user-create-staff-with-user-group-definitions';
import { GrantedRoleTable } from './user-create-user-group-definitions';
import {
    applyOrgForLocationSetting,
    createRandomStaffData,
    userAuthenticationMultiTenant,
} from './user-definition-utils';
import { loginCMSByUserNameAndPassWord } from './user-login-fail-by-wrong-username-or-password-definitions';
import { staffLoginsTeacherAppFailed } from './user-multi-tenant-create-staff-definitions';
import { searchStaffOnCMS } from './user-search-for-staff-definitions';

When(
    'school admin creates a staff with {string}',
    async function (this: IMasterWorld, condition: UpsertStaffConditionType) {
        const cms = this.cms;
        const context = this.scenario;
        const staffFormData = createRandomStaffData();
        const createStaffOptions = {
            fillLocationOnEmpty: true,
            fillUserGroupOnEmpty: true,
        };
        switch (condition) {
            case 'only mandatory inputs':
                staffFormData.primaryPhoneNumber = '';
                staffFormData.secondaryPhoneNumber = '';
                staffFormData.birthday = null;
                staffFormData.gender = 'NONE';
                staffFormData.userGroup = [];
                staffFormData.startDate = null;
                staffFormData.endDate = null;
                staffFormData.userGroup = [];
                staffFormData.remarks = '';
                createStaffOptions.fillUserGroupOnEmpty = false;
                break;
            case 'empty name':
                staffFormData.name = '';
                break;
            case 'empty email':
                staffFormData.email = '';
                break;
            case 'empty location':
                staffFormData.location = [];
                createStaffOptions.fillLocationOnEmpty = false;
                break;
            case 'invalid email format':
                staffFormData.email = staffFormData.name;
                break;
            case 'invalid phone number format':
                staffFormData.primaryPhoneNumber = '123456';
                staffFormData.secondaryPhoneNumber = '123456';
                break;
            case 'duplicate phone number':
                staffFormData.secondaryPhoneNumber = staffFormData.primaryPhoneNumber;
                break;
            case 'existed email': {
                const existedStaff = await createARandomStaffFromGRPC(cms);
                staffFormData.email = existedStaff.email;
                break;
            }
        }
        await cms.instruction(
            'School admin goes to the add staff page',
            async function (this: CMSInterface) {
                await schoolAdminIsOnTheCreateStaffPage(this);
            }
        );

        await cms.instruction('School admin creates a staff', async function (this: CMSInterface) {
            const createdStaff = await schoolAdminFillsStaffForm(
                cms,
                staffFormData,
                createStaffOptions
            );
            context.set(staffProfileAlias, createdStaff);
        });
    }
);

Then('school admin sees newly created staff on CMS', async function (this: IMasterWorld) {
    const context = this.scenario;

    await this.cms.instruction(
        'Go to the list staff page and see new staff',
        async function (this: CMSInterface) {
            await schoolAdminSeesNewStaffInCMS(this, context);
        }
    );
});

Then(
    'school admin sees newly created staff with {string} on CMS',
    async function (this: IMasterWorld, _option: string) {
        const context = this.scenario;
        const cms = this.cms;
        const isEnableStaffLocation = await isEnabledFeatureFlag('STAFF_MANAGEMENT_STAFF_LOCATION');
        const staffInfo = context.get<StaffInfo>(staffProfileAlias);
        await cms.instruction('School admin goes to staff page', async function () {
            await cms.schoolAdminIsOnThePage(Menu.STAFF, 'Staff Management');
        });
        if (isEnableStaffLocation) {
            await cms.instruction(
                'School admin selects org location on location setting',
                async function () {
                    await applyOrgForLocationSetting(cms);
                }
            );
        }
        await searchStaffOnCMS(cms, staffInfo.name);

        const staffLocator = await getStaffOnStaffList(cms, staffInfo.name);

        await cms.instruction(
            'School admin sees created staff is displayed correctly on staff list',
            async function () {
                await assertStaffOnStaffList(cms, staffLocator, staffInfo);
            }
        );

        await cms.instruction('School admin goes to staff detail', async function () {
            const staffName = staffLocator.locator(staffListStaffName);
            await staffName.click();
        });

        await cms.instruction(
            'School admin sees created staff is displayed correctly on staff detail',
            async function () {
                await assertStaffOnStaffDetail(cms, staffInfo);
            }
        );
    }
);

Then(
    'school admin sees the {string} message',
    async function (this: IMasterWorld, message: UpsertStaffErrorMessage) {
        const cms = this.cms;
        const page = cms.page!;
        const errorMessage = page.getByText(message, { exact: true }).first();
        await errorMessage.waitFor({ state: 'visible' });
    }
);

Then(
    'staff logins Teacher App successfully after forgot password',
    async function (this: IMasterWorld) {
        const context = this.scenario;

        await this.cms.instruction(
            'Forget password teacher account',
            async function (this: CMSInterface) {
                await forgotPasswordStaff(this, context);
            }
        );

        await this.teacher.instruction(
            'Logged in, see home screen',
            async function (this: TeacherInterface) {
                await staffLoginAccountFromTeacherWorld({
                    teacher: this,
                    context,
                });
            }
        );

        await this.teacher.instruction(
            'Staff sees their info',
            async function (this: TeacherInterface) {
                await staffSeesTheirInfo(this, context);
            }
        );
    }
);

Given('school admin has created a staff', async function (this: IMasterWorld) {
    const context = this.scenario;
    const cms = this.cms;
    await this.cms.instruction(
        'school admin create a staff by API',
        async function (this: CMSInterface) {
            const createdStaff = await createRandomStaffByGRPC(cms);
            context.set(staffProfileAlias, createdStaff);
        }
    );
});

When('school admin creates staff with a registered email', async function (this: IMasterWorld) {
    const context = this.scenario;
    const { email, name } = this.scenario.get<UserProfileEntity>(
        staffProfileAliasWithAccountRoleSuffix('teacher')
    );

    await this.cms.instruction('Go to the add staff page', async function (this: CMSInterface) {
        await schoolAdminIsOnTheCreateStaffPage(this);
    });

    await this.cms.instruction(
        'School admin creates a staff with a registered email',
        async function (this: CMSInterface) {
            await schoolAdminCreateAStaff({
                cms: this,
                context,
                staffName: `new-${name}`,
                staffEmail: email,
            });
        }
    );
});

Then('school admin sees email exists error message', async function (this: IMasterWorld) {
    await this.cms.instruction(`school admin sees error message`, async () => {
        await this.cms.assertTypographyWithTooltip('p', 'Email address already exists');
    });
});

Then('school admin can not create a new staff', async function (this: IMasterWorld) {
    const { name } =
        this.scenario.get<UserProfileEntity>(staffProfileAliasWithAccountRoleSuffix('teacher')) ||
        {};

    await this.cms.instruction(
        `School admin goes back Staff Management screen using cancel button`,
        async (cms: CMSInterface) => {
            await discardStaffUpsertForm(cms, 'cancel');
        }
    );

    await this.cms.instruction(
        `School admin goes back Staff Management screen using leave button`,
        async (cms: CMSInterface) => {
            await cms.selectAButtonByAriaLabel('Leave');
        }
    );

    await this.cms.instruction(
        `School admin checks the staff does not exist in the staff list`,
        async function (cms: CMSInterface) {
            await cms.page!.waitForSelector(`text="new-${name}"`, {
                state: 'hidden',
            });
        }
    );
});

When(
    'school admin creates staff with missing {string}',
    async function (this: IMasterWorld, missingField: StaffRequiredFields) {
        const context = this.scenario;
        const randomNumber = getRandomNumber();
        const newStaffName = `e2e-staff.${randomNumber}`;
        const newStaffEmail = `e2e-staff.${randomNumber}@manabie.com`;
        const formattedMissingField = missingField.toLocaleLowerCase();
        const staffMissingFormData =
            formattedMissingField === 'all'
                ? {
                      name: '',
                      email: '',
                  }
                : {
                      [formattedMissingField]: '',
                  };
        const staffFormData = {
            name: newStaffName,
            email: newStaffEmail,
            ...staffMissingFormData,
        };

        await this.cms.instruction('Go to the add staff page', async function (this: CMSInterface) {
            await schoolAdminIsOnTheCreateStaffPage(this);
        });

        await this.cms.instruction(
            `school admin fill staff form with missing ${missingField}`,
            async function (this: CMSInterface) {
                await schoolAdminCreateAStaff({
                    cms: this,
                    context,
                    staffName: staffFormData.name,
                    staffEmail: staffFormData.email,
                });
            }
        );
    }
);

Then('school admin sees the required field error message', async function (this: IMasterWorld) {
    await this.cms.instruction(`school admin sees error message`, async () => {
        await this.cms.assertTypographyWithTooltip('p', 'This field is required');
    });
});

Then(
    'staff {string} login to Teacher App after forgot password',
    async function (this: IMasterWorld, ability: string) {
        const context = this.scenario;
        const cms = this.cms;
        const teacher = this.teacher;

        await cms.instruction('Forget password staff account', async function (this: CMSInterface) {
            await forgotPasswordStaff(this, context);
        });

        await teacher.instruction(
            `Staff ${ability} login`,
            async function (this: TeacherInterface) {
                const canStaffLogin = ability === 'can';

                if (canStaffLogin) {
                    await staffLoginAccountFromTeacherWorld({
                        teacher: this,
                        context,
                    });
                } else {
                    const organization = 'e2e';
                    const staffAlias = staffProfileAlias;
                    await staffLoginsTeacherAppFailed({
                        teacher,
                        context,
                        staffAlias,
                        organization,
                    });
                }
            }
        );
    }
);

Then(
    `staff {string} login to CMS {string} after forgot password`,
    async function (this: IMasterWorld, ability: string, option: string) {
        const cms = this.cms;
        const cms2 = this.cms2;
        const context = this.scenario;

        const staffCredentials = context.get<UserProfileEntity>(staffProfileAlias);

        await cms.instruction(
            `staff logins CMS with email = ${staffCredentials.email} and password = ${staffCredentials.password}`,
            async function () {
                await loginCMSByUserNameAndPassWord(
                    cms2,
                    staffCredentials.email,
                    staffCredentials.password
                );
            }
        );

        if (ability === 'can') {
            await cms.instruction('Logged in, see home page', async function () {
                await aSchoolAdminAlreadyLoginSuccessInCMS(cms2);
            });
        } else {
            await cms.instruction(
                'Logged in failed on CMS, does not see home screen',
                async function () {
                    await assertNotificationLoginResult(cms2, option);
                }
            );
        }
    }
);

Then(
    'staff logins CMS successfully after forgot password for {string}',
    async function (this: IMasterWorld, grantedRole: GrantedRoleTable['role']) {
        const cms = this.cms;
        const cms2 = this.cms2;
        const context = this.scenario;
        const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        await cms.instruction(
            `Forget password for staff account with ${grantedRole} role`,
            async function () {
                switch (grantedRole) {
                    case UserRole.SCHOOL_ADMIN:
                    case 'Both roles': // School Admin and Teacher
                        await staffWithAdminRoleForgotPassword(
                            cms2,
                            context,
                            isEnabledMultiTenantLogin
                        );
                        break;
                    case UserRole.TEACHER:
                        await forgotPasswordStaff(cms, context);
                        break;
                }
            }
        );

        await cms2.instruction('Staff logins successfully with new password', async function () {
            const { email, password } = context.get<UserCredentials & { organization: string }>(
                staffProfileAlias
            );
            await loginCMSByUserNameAndPassWord(cms2, email, password);
        });
    }
);
