import { LearnerKeys } from '@common/learner-key';
import { submitButton } from '@legacy-step-definitions/cms-selectors/cms-keys';
import {
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    aLearnerAtAuthSearchOrganizationScreenLearnerWeb,
    fillOrganization,
    fillUserNameAndPasswordLearnerWeb,
} from '@legacy-step-definitions/learner-email-login-definitions';
import {
    aSchoolAdminAlreadyLoginSuccessInCMS,
    clickLoginButtonAndWaitForEndpointInMultiTenant,
} from '@legacy-step-definitions/school-admin-email-login-definitions';
import {
    aTeacherAlreadyLoginFailedInTeacherWeb,
    teacherEnterAccountInformation,
} from '@legacy-step-definitions/teacher-email-login-definitions';
import { getAppInterface } from '@legacy-step-definitions/utils';
import {
    aliasFirstGrantedLocationWithAccountRoleSuffix,
    staffProfileAliasWithMultiTenantAccountRoleSuffix,
    userGroupIdsListAlias,
} from '@user-common/alias-keys/user';

import {
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    MultiTenantAccountType,
    Platform,
    TeacherInterface,
    Tenant,
} from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ScenarioContext } from '@supports/scenario-context';
import { CreateStudentResponseEntity } from '@supports/services/usermgmt-student-service/entities/create-student-response';
import { LocationObjectGRPC } from '@supports/types/cms-types';

import {
    createARandomStaffFromGRPC,
    staffLoginAccountFromTeacherWorld,
    staffSeesTheirInfo,
} from './user-create-staff-definitions';
import {
    checkKidChartStatistic,
    createARandomStudentGRPC,
    findLearnerOnSwitchKidComponent,
} from './user-create-student-definitions';
import { schoolAdminCreateUserGroups } from './user-create-user-group-definitions';
import {
    getUserProfileWithTennantFromContext,
    setUserProfileWithTennantToContext,
} from './user-definition-utils';
import {
    aSchoolAdminLoginAsTenantInCMS,
    aSchoolAdminOnLoginTenantPageCMS,
    fillTestAccountMultiTenantLoginInCMS,
    getSchoolAdminAccount,
    schoolAdminTenantRegisterFirstGrantedLocation,
} from './user-multi-tenant-authentication-definitions';
import { schoolAdminLogoutCMS } from './user-multi-tenant-create-staff-definitions';

export async function schoolAdminCreateANewStudentWithTenantGRPC({
    cms,
    context,
    tenant,
    parentLength,
}: {
    cms: CMSInterface;
    context: ScenarioContext;
    tenant: Tenant;
    parentLength?: number;
}) {
    const firstGrantedLocation = context.get<LocationObjectGRPC>(
        aliasFirstGrantedLocationWithAccountRoleSuffix(`school admin ${tenant}`)
    );

    const response: CreateStudentResponseEntity = await createARandomStudentGRPC(cms, {
        parentLength,
        locations: [firstGrantedLocation],
    });
    await cms.instruction(`School admin created a student: ${response.student.name}`, async () => {
        setUserProfileWithTennantToContext({
            context,
            accountType: 'student',
            data: response.student,
            tenant,
        });
    });
    if (parentLength) {
        await cms.instruction(
            `School admin created a parent: ${response.parents[0].name}`,
            async () => {
                setUserProfileWithTennantToContext({
                    context,
                    accountType: 'parent',
                    data: response.parents,
                    tenant,
                });
            }
        );
    }
}

export async function schoolAdminCreateANewStaffWithTenantGRPC({
    cms,
    context,
    tenant,
}: {
    cms: CMSInterface;
    context: ScenarioContext;
    tenant: Tenant;
}) {
    let staff: UserProfileEntity;
    if (tenant === 'Tenant S2') {
        await cms.instruction(
            `School admin creates 1 user group with granted permission`,
            async function () {
                await schoolAdminCreateUserGroups(cms, context, 1);
            }
        );
        const userGroupsIdList = context.get<string[] | undefined>(userGroupIdsListAlias);

        staff = await createARandomStaffFromGRPC(cms, userGroupsIdList);
    } else {
        staff = await createARandomStaffFromGRPC(cms);
    }

    await cms.instruction(`School admin created a staff: ${staff.name}`, async () => {
        context.set(staffProfileAliasWithMultiTenantAccountRoleSuffix(`school admin ${tenant}`), {
            ...staff,
            staffName: staff.name,
            staffEmail: staff.email,
            staffId: staff.id,
            staffPassword: staff.password,
        });
    });
}

export async function userLoginsLearnerAppWithTenant({
    masterWorld,
    accountType,
    tenant,
}: {
    masterWorld: IMasterWorld;
    accountType: MultiTenantAccountType;
    tenant: Tenant;
}) {
    const learner = masterWorld.learner!;
    const scenarioContext = masterWorld.scenario;

    let userProfile = getUserProfileWithTennantFromContext<UserProfileEntity>({
        context: scenarioContext,
        accountType: 'student',
        tenant,
    });

    if (accountType === 'parent') {
        userProfile = getUserProfileWithTennantFromContext<Array<UserProfileEntity>>({
            context: scenarioContext,
            accountType,
            tenant,
        })[0];
    }

    const { organization } = getSchoolAdminAccount({
        schoolName: `school admin ${tenant}`,
    });

    await learner.instruction(
        `${accountType} logins Learner App with tenant: ${tenant}`,
        async () => {
            await fillUserNameAndPasswordLearnerWeb({
                learner,
                username: userProfile.email,
                password: userProfile.password,
                defaultOrganization: organization,
            });
            await learner.instruction(
                `Verify ${userProfile.name} is at HomeScreen after login successfully`,
                async function () {
                    await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
                }
            );
        }
    );
}

export async function staffLoginsWithTenant({
    masterWorld,
    platform,
    tenant,
}: {
    masterWorld: IMasterWorld;
    platform: Platform;
    tenant: Tenant;
}) {
    const cms = masterWorld.cms!;
    const staffAlias = staffProfileAliasWithMultiTenantAccountRoleSuffix(`school admin ${tenant}`);
    const context = masterWorld.scenario;
    const { organization } = getSchoolAdminAccount({
        schoolName: `school admin ${tenant}`,
    });

    if (platform === 'Teacher App') {
        const teacher = masterWorld.teacher!;

        await cms.instruction(`Staff logins Teacher App with tenant: ${tenant}`, async () => {
            await staffLoginAccountFromTeacherWorld({
                teacher,
                context,
                staffAlias,
                organization,
            });
        });
    }

    if (platform === 'CMS') {
        const { email: staffEmail, password: staffPassword } =
            context.get<UserProfileEntity>(staffAlias);

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

        await clickLoginButtonAndWaitForEndpointInMultiTenant(cms);
    }
}

export async function staffLoginsWithTenantOnTeacherApp({
    masterWorld,
    tenant,
}: {
    masterWorld: IMasterWorld;
    tenant: Tenant;
}) {
    const staffAlias = staffProfileAliasWithMultiTenantAccountRoleSuffix(`school admin ${tenant}`);
    const teacher = getAppInterface(masterWorld, 'teacher', tenant) as TeacherInterface;

    const context = masterWorld.scenario;
    const { organization } = getSchoolAdminAccount({
        schoolName: `school admin ${tenant}`,
    });

    await staffLoginAccountFromTeacherWorld({
        teacher,
        context,
        staffAlias,
        organization,
    });
}

export async function schoolAdminSwitchBetweenTenants(
    masterWorld: IMasterWorld,
    currentTenant: Tenant,
    nextTenant: Tenant
) {
    const cms = masterWorld.cms!;

    await cms.instruction(`School admin tenant ${currentTenant} logout CMS`, async () => {
        await schoolAdminLogoutCMS(cms);
    });

    await cms.instruction(`School admin logins CMS with tenant: ${nextTenant}`, async () => {
        await aSchoolAdminLoginAsTenantInCMS({
            masterWorld,
            role: `school admin ${nextTenant}`,
            shouldUseCmsInterfaceAsDefault: true,
        });
    });
    await schoolAdminTenantRegisterFirstGrantedLocation(
        masterWorld,
        `school admin ${nextTenant}`,
        true
    );
}

export async function userSwitchBetweenTenants({
    masterWorld,
    userType,
    currentTenant,
    nextTenant,
}: {
    masterWorld: IMasterWorld;
    userType: MultiTenantAccountType;
    currentTenant: Tenant;
    nextTenant: Tenant;
}) {
    const userInterface = masterWorld.learner!;
    const scenarioContext = masterWorld.scenario;

    await userInterface.instruction(
        `${userType} tenant ${currentTenant} logout Learner App`,
        async function () {
            await userInterface.logout();
        }
    );

    let userProfile = getUserProfileWithTennantFromContext<UserProfileEntity>({
        context: scenarioContext,
        accountType: 'student',
        tenant: nextTenant,
    });

    if (userType === 'parent') {
        userProfile = getUserProfileWithTennantFromContext<Array<UserProfileEntity>>({
            context: scenarioContext,
            accountType: 'parent',
            tenant: nextTenant,
        })[0];
    }

    const { organization } = getSchoolAdminAccount({
        schoolName: `school admin ${nextTenant}`,
    });

    await userInterface.instruction(
        `${userType} logins Learner App with tenant: ${nextTenant}`,
        async () => {
            await fillUserNameAndPasswordLearnerWeb({
                learner: userInterface,
                username: userProfile.email,
                password: userProfile.password,
                defaultOrganization: organization,
            });

            await userInterface.instruction(
                `Verify ${userProfile.name} is at HomeScreen after login successfully`,
                async function () {
                    await aLearnerAlreadyLoginSuccessInLearnerWeb(userInterface);
                }
            );
        }
    );
}

export async function staffSwitchBetweenTenants({
    masterWorld,
    platform,
    currentTenant,
    nextTenant,
}: {
    masterWorld: IMasterWorld;
    platform: Platform;
    currentTenant: Tenant;
    nextTenant: Tenant;
}) {
    const cms = masterWorld.cms!;
    const context = masterWorld.scenario;
    const staffAlias = staffProfileAliasWithMultiTenantAccountRoleSuffix(
        `school admin ${nextTenant}`
    );
    const { organization } = getSchoolAdminAccount({
        schoolName: `school admin ${nextTenant}`,
    });
    if (platform === 'Teacher App') {
        const teacher = masterWorld.teacher!;

        await teacher.instruction(
            `Staff tenant ${currentTenant} logout Teacher App`,
            async function () {
                await teacher.logout();
            }
        );

        await cms.instruction(`Staff logins Teacher App with tenant: ${nextTenant}`, async () => {
            await staffLoginAccountFromTeacherWorld({
                teacher,
                context,
                staffAlias,
                organization,
            });
        });
    }

    if (platform === 'CMS') {
        const { email: staffEmail, password: staffPassword } =
            context.get<UserProfileEntity>(staffAlias);

        await cms.instruction(`School admin tenant ${currentTenant} logout CMS`, async () => {
            await schoolAdminLogoutCMS(cms);
        });

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

        await clickLoginButtonAndWaitForEndpointInMultiTenant(cms);
    }
}

export async function studentLoginsLearnerAppSuccessfully(
    masterWorld: IMasterWorld,
    tenant: Tenant
) {
    const learner = masterWorld.learner!;
    const scenarioContext = masterWorld.scenario;

    const learnerProfile = getUserProfileWithTennantFromContext<UserProfileEntity>({
        context: scenarioContext,
        accountType: 'student',
        tenant,
    });

    await learner.instruction(
        `Verify name: ${learnerProfile.name} on Learner App`,
        async function () {
            await learner.checkUserName(learnerProfile.name);
        }
    );
}

export async function parentLoginsLearnerAppSuccessfully(
    masterWorld: IMasterWorld,
    tenant: Tenant
) {
    const parent = masterWorld.learner!;
    const scenarioContext = masterWorld.scenario;

    const parentProfile = getUserProfileWithTennantFromContext<Array<UserProfileEntity>>({
        context: scenarioContext,
        accountType: 'parent',
        tenant,
    })[0];

    await parent.instruction(
        `Verify name: ${parentProfile.name} on Learner App`,
        async function () {
            await parent.checkUserName(parentProfile.name);
        }
    );

    await parent.instruction(
        `Parent sees student's stats of ${tenant} on Learner App`,
        async function () {
            const learnerProfile = getUserProfileWithTennantFromContext<UserProfileEntity>({
                context: scenarioContext,
                accountType: 'student',
                tenant,
            });
            await parent.openHomeDrawer();

            await parent.instruction(`Click on Stats tab`, async function () {
                await parent.clickOnTab(LearnerKeys.stats_tab, LearnerKeys.stats_page);
            });

            await parent.instruction(`Find first kid: ${learnerProfile.name}`, async function () {
                await findLearnerOnSwitchKidComponent(parent, learnerProfile);
            });

            // TODO: Need to check details chart later
            await parent.instruction(
                `Check first kid chart statistic: ${learnerProfile.name}`,
                async function () {
                    await checkKidChartStatistic(parent);
                }
            );
        }
    );
}

export async function staffLoginsTeacherAppSuccessfully(
    masterWorld: IMasterWorld,
    platform: Platform,
    tenant: Tenant
) {
    const cms = masterWorld.cms!;
    const context = masterWorld.scenario;

    if (platform === 'Teacher App') {
        const teacher = masterWorld.teacher!;
        const staffAlias = staffProfileAliasWithMultiTenantAccountRoleSuffix(
            `school admin ${tenant}`
        );

        await teacher.instruction('Staff sees their info', async function (this: TeacherInterface) {
            await staffSeesTheirInfo(this, context, staffAlias);
        });
    }
    if (platform === 'CMS') {
        await cms.instruction('Logged in, see home page', async function (cms: CMSInterface) {
            await aSchoolAdminAlreadyLoginSuccessInCMS(cms);
        });
    }
}

export async function schoolAdminLoginsWithoutTenant(masterWorld: IMasterWorld, tenant: Tenant) {
    /// This function already had instruction inside
    await aSchoolAdminLoginAsTenantInCMS({
        masterWorld,
        role: `school admin ${tenant}`,
        shouldVerifiedLoggedIn: false,
        withoutTenant: true,
        shouldUseCmsInterfaceAsDefault: true,
    });

    await masterWorld.cms.instruction(
        `Button submit is disable`,
        async function (cms: CMSInterface) {
            await cms.page?.isDisabled(submitButton);
        }
    );
}

export async function userLoginsLearnerAppWithoutTenant(
    masterWorld: IMasterWorld,
    accountType: MultiTenantAccountType
) {
    const learner = masterWorld.learner!;

    await learner.instruction(`${accountType} logins Learner App without tenant`, async () => {
        await learner.instruction(
            'User not login yet, show auth search organization screen',
            async function () {
                await aLearnerAtAuthSearchOrganizationScreenLearnerWeb(learner);
            }
        );

        await learner.instruction(
            'Fill organization in auth search organization page',
            async function () {
                await fillOrganization(learner, '');
            }
        );
    });
}

export async function staffLoginsWithoutTenant({
    masterWorld,
    platform,
    tenant,
}: {
    masterWorld: IMasterWorld;
    platform: Platform;
    tenant: Tenant;
}) {
    const cms = masterWorld.cms!;
    const staffAlias = staffProfileAliasWithMultiTenantAccountRoleSuffix(`school admin ${tenant}`);
    const context = masterWorld.scenario;

    if (platform === 'Teacher App') {
        const teacher = masterWorld.teacher!;

        const { email: staffEmail, password: staffPassword } =
            context.get<UserProfileEntity>(staffAlias);

        await teacher.instruction(
            'Login without tenant on Teacher App',
            async function (this: TeacherInterface) {
                await teacherEnterAccountInformation({
                    teacher: this,
                    username: staffEmail,
                    password: staffPassword,
                    defaultOrganization: '',
                });
            }
        );
    }

    if (platform === 'CMS') {
        const { email: staffEmail, password: staffPassword } =
            context.get<UserProfileEntity>(staffAlias);

        await cms.instruction(
            `Fill username ${staffEmail} and password ${staffPassword} organization in BO login page`,
            async function (cms: CMSInterface) {
                await fillTestAccountMultiTenantLoginInCMS(cms, {
                    organization: '',
                    username: staffEmail,
                    password: staffPassword,
                });
            }
        );

        await masterWorld.cms.instruction(
            `Button submit is disable`,
            async function (cms: CMSInterface) {
                await cms.page?.isDisabled(submitButton);
            }
        );
    }
}

export async function schoolAdminLoginsCMSFailed(masterWorld: IMasterWorld, tenant: Tenant) {
    const cms = masterWorld.cms!;

    await cms.instruction(
        `school admin ${tenant} still see login form`,
        async function (cms: CMSInterface) {
            await aSchoolAdminOnLoginTenantPageCMS(cms);
        }
    );
}

export async function userLoginsLearnerAppFailed(masterWorld: IMasterWorld) {
    const learner = masterWorld.learner!;
    await learner.instruction(
        'Logged in failed, does not see home screen',
        async function (this: LearnerInterface) {
            await aLearnerAtAuthSearchOrganizationScreenLearnerWeb(this);
        }
    );
}

export async function staffLoginsTeacherAppFailed(
    masterWorld: IMasterWorld,
    platform: Platform,
    tenant: Tenant
) {
    if (platform === 'Teacher App') {
        const teacher = masterWorld.teacher!;
        await teacher.instruction(
            'Logged in failed, does not see home screen',
            async function (teacher: TeacherInterface) {
                await aTeacherAlreadyLoginFailedInTeacherWeb(teacher);
            }
        );
    }
    if (platform === 'CMS') {
        await schoolAdminLoginsCMSFailed(masterWorld, tenant);
    }
}
