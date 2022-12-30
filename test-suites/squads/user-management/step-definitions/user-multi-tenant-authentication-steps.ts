import {
    buttonByAriaLabel,
    snackBarContainer,
    submitButton,
} from '@legacy-step-definitions/cms-selectors/cms-keys';
import { aSchoolAdminLoginAsNormalInCMS } from '@legacy-step-definitions/credential-account-definitions';
import { loginOnLearnerApp } from '@legacy-step-definitions/learner-email-login-definitions';
import {
    aTeacherAlreadyLoginSuccessInTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import {
    getSchoolAdminTenantInterfaceFromRole,
    getTeacherTenantInterfaceFromRole,
    getLearnerTenantInterfaceFromRole,
    getAppInterface,
} from '@legacy-step-definitions/utils';
import {
    aliasFirstGrantedLocationWithAccountRoleSuffix,
    learnerTenantProfileAliasWithLearnerTenantRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import {
    IMasterWorld,
    CMSInterface,
    Tenant,
    LearnerRolesWithTenant,
    SchoolAdminRolesWithTenant,
    TeacherRolesWithTenant,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import { createARandomStaffFromGRPC } from './user-create-staff-definitions';
import {
    createARandomStudentGRPC,
    schoolAdminCreateNewStudent,
} from './user-create-student-definitions';
import { applyOrgForLocationSetting, userAuthenticationMultiTenant } from './user-definition-utils';
import {
    aSchoolAdminClickLogoutButton,
    aSchoolAdminClickOnProfileButton,
} from './user-login-fail-definitions';
import {
    aSchoolAdminOnLoginTenantPageCMS,
    checkUserAlreadyLogin,
    checkCorrectlyMenuTab,
    checkCorrectlyListStudent,
    loginAnotherAccountWithOtherTab,
    verifyAccountDifferent,
    aSchoolAdminLoginAsTenantInCMS,
    tenantIdentifiers,
    getAccountToLoginCMSMultiTenant,
    userVerifiesTextFieldOrgId,
    schoolAdminVerifiesStudentsListWithResourcePath,
    schoolAdminTenantRegisterFirstGrantedLocation,
} from './user-multi-tenant-authentication-definitions';

Given(
    '{string} logins with tenant on CMS',
    { timeout: 300000 },
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
        /// This function already had instruction inside
        await aSchoolAdminLoginAsTenantInCMS({
            masterWorld: this,
            role,
            shouldUseCmsInterfaceAsDefault: true,
        });
        await schoolAdminTenantRegisterFirstGrantedLocation(this, role);
    }
);

Given(
    'school admin {string} logins CMS',
    { timeout: 300000 },
    async function (this: IMasterWorld, tenant: Tenant) {
        /// This function already had instruction inside
        await aSchoolAdminLoginAsTenantInCMS({ masterWorld: this, role: `school admin ${tenant}` });
        await schoolAdminTenantRegisterFirstGrantedLocation(this, `school admin ${tenant}`);
    }
);

Given(
    '{string} has logged in with tenant on CMS',
    { timeout: 300000 },
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
        const isUserAuthenticationMultiTenant = await featureFlagsHelper.isEnabled(
            userAuthenticationMultiTenant
        );

        if (isUserAuthenticationMultiTenant) {
            /// This function already had instruction inside
            await aSchoolAdminLoginAsTenantInCMS({ masterWorld: this, role });
            await schoolAdminTenantRegisterFirstGrantedLocation(this, role);
        } else {
            /// This function already had instruction inside
            await aSchoolAdminLoginAsNormalInCMS(this, role);
        }
    }
);

Given(
    '{string} has created a student with {string}',
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant, tenant: string) {
        const scenarioContext = this.scenario;
        const cms = this.cms;

        /// This function already had instruction inside
        await aSchoolAdminLoginAsTenantInCMS({
            masterWorld: this,
            role,
            shouldUseCmsInterfaceAsDefault: true,
        });

        await schoolAdminTenantRegisterFirstGrantedLocation(this, role, true);

        const firstGrantedLocation = scenarioContext.get<LocationObjectGRPC>(
            aliasFirstGrantedLocationWithAccountRoleSuffix(role)
        );

        const response = await createARandomStudentGRPC(cms, { locations: [firstGrantedLocation] });
        const student = response.student;

        await cms.instruction(
            `${role} create a student: ${student.name} by calling API`,
            async function () {
                scenarioContext.set(tenant, student);
            }
        );

        await this.cms.instruction('Click on dropdown', async function (cms: CMSInterface) {
            await aSchoolAdminClickOnProfileButton(cms);
        });

        await this.cms.instruction('Click on logout button', async function (cms: CMSInterface) {
            await aSchoolAdminClickLogoutButton(cms);
        });
    }
);

Given(
    '{string} has created a student {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        studentRole: LearnerRolesWithTenant
    ) {
        const scenarioContext = this.scenario;
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);

        //Create with random location
        const studentData = (await schoolAdminCreateNewStudent(cms, scenarioContext)).student;

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

Given(
    '{string} creates a teacher {string}',
    async function (
        this: IMasterWorld,
        schoolAdminRole: SchoolAdminRolesWithTenant,
        teacherRole: TeacherRolesWithTenant
    ) {
        const scenarioContext = this.scenario;
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);

        const teacher = await createARandomStaffFromGRPC(cms);

        await cms.instruction(
            `${schoolAdminRole} create a teacher ${teacherRole}: ${teacher.name} by calling API`,
            async function () {
                scenarioContext.set(teacherRole, teacher);
            }
        );
    }
);

Given(
    '{string} has logged in with tenant on Teacher Web',
    async function (this: IMasterWorld, teacherRole: TeacherRolesWithTenant) {
        const scenarioContext = this.scenario;
        const teacher = getTeacherTenantInterfaceFromRole(this, teacherRole);
        const tenant: Tenant = teacherRole == 'teacher Tenant S1' ? 'Tenant S1' : 'Tenant S2';

        const teacherProfile: UserProfileEntity = scenarioContext.get(teacherRole);
        await teacher.instruction(
            'Login by the teacher username and password on Teacher App',
            async () => {
                await teacherEnterAccountInformation({
                    teacher: teacher,
                    username: teacherProfile.email,
                    password: teacherProfile.password,
                    defaultOrganization: tenantIdentifiers[tenant],
                });
            }
        );

        await teacher.instruction('Login successfully on Teacher App', async () => {
            await aTeacherAlreadyLoginSuccessInTeacherWeb(teacher);
        });
    }
);

Given(
    '{string} has logged in with tenant on Learner Web',
    async function (this: IMasterWorld, learnerRole: LearnerRolesWithTenant) {
        const scenarioContext = this.scenario;
        const learner = getLearnerTenantInterfaceFromRole(this, learnerRole);
        const tenant: Tenant = learnerRole == 'student Tenant S1' ? 'Tenant S1' : 'Tenant S2';

        const studentProfile = scenarioContext.get<UserProfileEntity>(
            learnerTenantProfileAliasWithLearnerTenantRoleSuffix(learnerRole)
        );

        /// Have instructions inside
        await loginOnLearnerApp({
            learner: learner,
            email: studentProfile.email,
            name: studentProfile.name,
            password: studentProfile.password,
            organization: tenantIdentifiers[tenant],
        });
    }
);

When(
    `{string} switch to {string}`,
    async function (
        this: IMasterWorld,
        currentRole: SchoolAdminRolesWithTenant,
        nextRole: SchoolAdminRolesWithTenant
    ) {
        const cms = this.cms!;

        await cms.instruction(`User ${currentRole} already login`, async (cms: CMSInterface) => {
            await checkUserAlreadyLogin(cms, currentRole);
        });

        await cms.instruction('Click on dropdown', async function (cms: CMSInterface) {
            await aSchoolAdminClickOnProfileButton(cms);
        });

        await cms.instruction('Click on logout button', async function (cms: CMSInterface) {
            await aSchoolAdminClickLogoutButton(cms);
        });

        /// This function already had instruction inside
        await aSchoolAdminLoginAsTenantInCMS({
            masterWorld: this,
            role: nextRole,
            shouldUseCmsInterfaceAsDefault: true,
        });
        await schoolAdminTenantRegisterFirstGrantedLocation(this, nextRole, true);
    }
);

Then(
    '{string} can see correctly menu tab of tenant',
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
        await this.cms.instruction(
            `Check correctly menu tab of ${role}`,
            async function (cms: CMSInterface) {
                await checkCorrectlyMenuTab(cms);
            }
        );
    }
);

Then(
    '{string} can see correctly list student of {string}',
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant, tenant: string) {
        const scenarioContext = this.scenario;
        await this.cms.instruction(
            `${role} see correctly list student of ${tenant}`,
            async function (cms: CMSInterface) {
                await checkCorrectlyListStudent(cms, scenarioContext, tenant);
            }
        );
    }
);

When(
    '{string} logins by another tab',
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
        const cms = this.cms;
        const newPage = await cms.page!.context().newPage();

        await this.cms.instruction(`User opens an other tab CMS`, async function () {
            await newPage?.goto(cms.origin);
        });

        await this.cms.instruction(
            `User logins with account ${role} at other tab CMS`,
            async () => {
                await loginAnotherAccountWithOtherTab({
                    cms,
                    newPage,
                    role,
                });
            }
        );
    }
);

Then('{string} can refresh', async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
    const cms = this.cms;

    await this.cms.instruction(`${role} refresh tab CMS`, async function () {
        await cms.page!.reload();
    });
});

When(
    '{string} logins without tenant identifier',
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
        /// This function already had instruction inside
        await aSchoolAdminLoginAsTenantInCMS({
            masterWorld: this,
            role,
            shouldVerifiedLoggedIn: false,
            withoutTenant: true,
            shouldUseCmsInterfaceAsDefault: true,
        });

        await this.cms.instruction(`Button submit is disable`, async function (cms: CMSInterface) {
            await cms.page?.isDisabled(submitButton);
        });
    }
);

Then(
    '{string} can not login on CMS',
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
        await this.cms.instruction(
            `${role} still see login form`,
            async function (cms: CMSInterface) {
                await aSchoolAdminOnLoginTenantPageCMS(cms);
            }
        );
    }
);

Given(
    '{string} of {string} have different account info with {string}',
    async function (
        this: IMasterWorld,
        currentRole: SchoolAdminRolesWithTenant,
        tenant: string,
        anotherRole: SchoolAdminRolesWithTenant
    ) {
        await this.cms.instruction(
            `${currentRole} of ${tenant} have different account info with ${anotherRole}`,
            async () => {
                await verifyAccountDifferent(currentRole, anotherRole);
            }
        );
    }
);

When(
    '{string} logins with tenant identifier {string}',
    async function (this: IMasterWorld, currentRole: SchoolAdminRolesWithTenant, tenant: Tenant) {
        /// This function already had instruction inside
        await aSchoolAdminLoginAsTenantInCMS({
            masterWorld: this,
            role: currentRole,
            tenant,
            shouldVerifiedLoggedIn: false,
            shouldUseCmsInterfaceAsDefault: true,
        });

        await this.cms.instruction(`Click submit button`, async function (cms: CMSInterface) {
            await cms.page?.click(submitButton);
            await cms.page?.isDisabled(submitButton);
            await cms.page?.isEnabled(submitButton);
        });

        await this.cms.instruction(`See error snackbar`, async function (cms: CMSInterface) {
            const snackbar = cms.page!.locator(snackBarContainer);
            await snackbar.waitFor({ state: 'attached' });
        });
    }
);

Then(
    'school admin {string} sees student list and staff list display correctly',
    async function (this: IMasterWorld, tenant: Tenant) {
        const cms = getAppInterface(this, 'school admin', tenant) as CMSInterface;

        await cms.instruction(
            'school admin selects org location on location setting',
            async function () {
                await applyOrgForLocationSetting(cms);
                const confirmBtn = cms.page!.locator(buttonByAriaLabel('Confirm'));
                if (await confirmBtn.isVisible()) await confirmBtn.click();
            }
        );

        await cms.instruction(
            `school admin ${tenant} sees student list display correctly`,
            async () => {
                await schoolAdminVerifiesStudentsListWithResourcePath(cms);
            }
        );
    }
);

When(
    '{string} logout on CMS',
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
        await this.cms.instruction(`${role} logout on CMS`, async function (cms: CMSInterface) {
            await cms.instruction('Click on dropdown', async function (cms: CMSInterface) {
                await aSchoolAdminClickOnProfileButton(cms);
            });

            await cms.instruction('Click on logout button', async function (cms: CMSInterface) {
                await aSchoolAdminClickLogoutButton(cms);
            });
        });
    }
);

Then(
    '{string} can see Org ID is still in Back office',
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
        const cms = this.cms;

        const { organization } = await getAccountToLoginCMSMultiTenant({
            masterWorld: this,
            role,
            shouldUseCmsInterfaceAsDefault: true,
        });

        await cms.instruction(
            `${role} not login yet and go to login tenant page`,
            async function (cms: CMSInterface) {
                await aSchoolAdminOnLoginTenantPageCMS(cms);
            }
        );

        await cms.instruction(
            `${role} see org ID is still in text field Organization ID`,
            async function (cms: CMSInterface) {
                await userVerifiesTextFieldOrgId({
                    cms,
                    expectValue: organization,
                    errorMessage: `text field Organization ID should have org ID same with current org ID (${organization})`,
                });
            }
        );
    }
);

Then(
    '{string} can not see Org ID remembered',
    async function (this: IMasterWorld, role: SchoolAdminRolesWithTenant) {
        const cms = this.cms;

        await this.cms.instruction(`${role} refresh login tenant page`, async function () {
            await cms.page!.reload();
        });

        await cms.instruction(
            `${role} not login yet and go to login tenant page`,
            async function (cms: CMSInterface) {
                await aSchoolAdminOnLoginTenantPageCMS(cms);
            }
        );

        await cms.instruction(
            `${role} not see org ID in text field Organization ID`,
            async function (cms: CMSInterface) {
                await userVerifiesTextFieldOrgId({
                    cms,
                    expectValue: '',
                    errorMessage: 'text field Organization ID should not have org ID',
                });
            }
        );
    }
);
