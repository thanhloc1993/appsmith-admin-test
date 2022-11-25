import { formFilterAdvancedTextFieldSearchStaffInput } from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    aSchoolAdminAlreadyLoginSuccessInCMS,
    aSchoolAdminOnCMSLoginPageAndSeeLoginForm,
    clickLoginButtonAndWaitForEndpointInMultiTenant,
} from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAlreadyLoginFailedInTeacherWeb,
    aTeacherAtHomeScreenTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import { getRandomNumber } from '@legacy-step-definitions/utils';
import { staffProfileAliasWithMultiTenantAccountRoleSuffix } from '@user-common/alias-keys/user';
import { staffListStaffName } from '@user-common/cms-selectors/staff';
import { rowOption, rowsPerPage } from '@user-common/cms-selectors/student';

import {
    CMSInterface,
    LoginStatus,
    ScenarioContextInterface,
    TeacherInterface,
    Tenant,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';

import {
    staffLoginAccountFromTeacherWorld,
    schoolAdminCreateAStaff,
    schoolAdminIsOnTheCreateStaffPage,
    staffSeesTheirInfo,
} from './user-create-staff-definitions';
import {
    aSchoolAdminClickLogoutButton,
    aSchoolAdminClickOnProfileButton,
} from './user-login-fail-definitions';
import {
    aSchoolAdminOnLoginTenantPageCMS,
    fillTestAccountMultiTenantLoginInCMS,
    getSchoolAdminAccount,
} from './user-multi-tenant-authentication-definitions';

export async function tenantSchoolAdminCreateNewStaff(
    cms: CMSInterface,
    context: ScenarioContext,
    tenant: Tenant
) {
    const number = getRandomNumber();
    const staffName = `e2e-staff.${number}`;
    const staffEmail = `e2e-staff.${number}@manabie.com`;
    await cms.instruction('Go to the add staff page', async function (this: CMSInterface) {
        await schoolAdminIsOnTheCreateStaffPage(this);
    });
    const { organization } = getSchoolAdminAccount({
        schoolName: `school admin ${tenant}`,
    });
    const staffAlias = staffProfileAliasWithMultiTenantAccountRoleSuffix(`school admin ${tenant}`);

    await cms.instruction('School admin creates a staff', async function (this: CMSInterface) {
        await schoolAdminCreateAStaff({
            cms: this,
            context,
            staffName,
            staffEmail,
            organization,
            staffAlias,
        });
    });
}

export async function tenantSchoolAdminDoesNotSeeNewStaffInCMS(
    cms: CMSInterface,
    context: ScenarioContext,
    tenant: Tenant
) {
    const cmsPage = cms.page!;
    const { name: staffName } = await context.get<UserProfileEntity>(
        staffProfileAliasWithMultiTenantAccountRoleSuffix(`school admin ${tenant}`)
    );

    await cms.instruction(`Go to staff management page`, async function () {
        await cms.selectMenuItemInSidebarByAriaLabel(Menu.STAFF);
    });

    await cms.instruction(`Search staff name: ${staffName}`, async function () {
        await cmsPage.click(rowsPerPage);
        await cmsPage.click(rowOption('100'));

        await cmsPage.fill(formFilterAdvancedTextFieldSearchStaffInput, staffName);
        await cmsPage.keyboard.press('Enter');

        await cms.waitForSkeletonLoading();
    });

    await cms.instruction(`School Admin see nothing on staff management`, async function () {
        await cmsPage.waitForSelector(staffListStaffName, { state: 'hidden' });
    });
}

export async function schoolAdminLogoutCMS(cms: CMSInterface) {
    await cms.instruction('Click on dropdown', async function (cms: CMSInterface) {
        await aSchoolAdminClickOnProfileButton(cms);
    });

    await cms.instruction('Click on logout button', async function (cms: CMSInterface) {
        await aSchoolAdminClickLogoutButton(cms);
    });
}

export async function staffLoginsCMS({
    cms,
    context,
    staffAlias,
    organization,
    status,
}: {
    cms: CMSInterface;
    context: ScenarioContextInterface['context'];
    staffAlias: string;
    organization: string;
    status: LoginStatus;
}) {
    const { email: staffEmail, password: staffPassword } = await context.get(staffAlias);

    await cms.instruction(
        'User not login yet and go to login tenant page, ',
        async function (cms: CMSInterface) {
            await aSchoolAdminOnLoginTenantPageCMS(cms);
        }
    );

    await cms.instruction(
        `Fill username ${staffEmail}, password ${staffPassword}, and ${organization} organization in BO login page`,
        async function (cms: CMSInterface) {
            await fillTestAccountMultiTenantLoginInCMS(cms, {
                organization,
                username: staffEmail,
                password: staffPassword,
            });
        }
    );

    if (status === 'successfully') {
        await clickLoginButtonAndWaitForEndpointInMultiTenant(cms);

        await cms.instruction('Logged in, see home page', async function (cms: CMSInterface) {
            await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
        });
    } else {
        await cms.page?.click('button[type="submit"]');

        await cms.instruction(
            'Logged in failed on CMS, does not see home screen',
            async function (cms) {
                await aSchoolAdminOnCMSLoginPageAndSeeLoginForm(cms);
            }
        );
    }
}

export async function staffLoginsTeacherAppSuccessfully({
    teacher,
    context,
    staffAlias,
    organization,
}: {
    teacher: TeacherInterface;
    context: ScenarioContext;
    staffAlias: string;
    organization: string;
}) {
    await teacher.instruction(
        'Logged in, see home screen',
        async function (this: TeacherInterface) {
            await staffLoginAccountFromTeacherWorld({
                teacher: this,
                context,
                staffAlias,
                organization,
            });
        }
    );
    await teacher.instruction('Staff sees their info', async function (this: TeacherInterface) {
        await staffSeesTheirInfo(this, context, staffAlias);
    });
}

export async function staffLoginsTeacherAppFailed({
    teacher,
    context,
    staffAlias,
    organization,
}: {
    teacher: TeacherInterface;
    context: ScenarioContext;
    staffAlias: string;
    organization: string;
}) {
    const { email: staffEmail, password: staffPassword } =
        context.get<UserProfileEntity>(staffAlias);

    await teacher.instruction('User not login yet, see login form', async function () {
        await aTeacherAtHomeScreenTeacherWeb(teacher);
    });

    await teacher.instruction('Fill username, password in login page', async function () {
        await teacherEnterAccountInformation({
            teacher,
            username: staffEmail,
            password: staffPassword,
            defaultOrganization: organization,
        });
    });

    await teacher.instruction(
        'Logged in failed, does not see home screen',
        async function (teacher: TeacherInterface) {
            await aTeacherAlreadyLoginFailedInTeacherWeb(teacher);
        }
    );
}
