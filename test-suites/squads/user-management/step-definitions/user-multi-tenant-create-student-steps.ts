import {
    loginLearnerAccountFailed,
    loginOnLearnerApp,
} from '@legacy-step-definitions/learner-email-login-definitions';
import { getAppInterface } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { studentPackagesAlias } from '@user-common/alias-keys/user';

import { Given, Then } from '@cucumber/cucumber';

import {
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    LoginStatus,
    MultiTenantAccountType,
    Tenant,
    AccountAction,
} from '@supports/app-types';
import { StudentCoursePackageEntity } from '@supports/entities/student-course-package-entity';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { checkKidChartStatistic } from './user-create-student-definitions';
import { getUserProfileWithTennantFromContext, openMenuPopupOnWeb } from './user-definition-utils';
import { getSchoolAdminAccount } from './user-multi-tenant-authentication-definitions';
import { notSeeNewlyCreatedStudentOnCMS } from './user-multi-tenant-create-student-definitions';
import { schoolAdminCreateANewStudentWithTenantGRPC } from './user-multi-tenant-organization-authentication-definitions';
import { tapOnSwitchStudent } from './user-switch-student-definitions';
import { seeNewlyCreatedStudentOnCMS } from './user-view-student-details-definitions';
import { ByValueKey } from 'flutter-driver-x';

Given(
    'school admin {string} creates a new student and parent info on {string}',
    { timeout: 300000 },
    async function (this: IMasterWorld, tenant: Tenant, tenantInterface: Tenant) {
        const cms = getAppInterface(this, 'school admin', tenantInterface) as CMSInterface;
        const scenarioContext = this.scenario;

        await schoolAdminCreateANewStudentWithTenantGRPC({
            cms,
            context: scenarioContext,
            tenant,
            parentLength: 1,
        });
    }
);

Then(
    'school admin {string} {string} newly created student {string} and parent on CMS',
    async function (
        this: IMasterWorld,
        schoolAdminTenant: Tenant,
        action: AccountAction,
        studentTenant: Tenant
    ) {
        const appInterface = getAppInterface(
            this,
            'school admin',
            schoolAdminTenant
        ) as CMSInterface;
        const scenarioContext = this.scenario;

        const learnerProfile = getUserProfileWithTennantFromContext<UserProfileEntity>({
            context: scenarioContext,
            accountType: 'student',
            tenant: studentTenant,
        });

        const parents =
            getUserProfileWithTennantFromContext<Array<UserProfileEntity>>({
                context: scenarioContext,
                accountType: 'parent',
                tenant: studentTenant,
            }) ?? [];

        const studentCoursePackages =
            this.scenario.get<Array<StudentCoursePackageEntity>>(studentPackagesAlias) ?? [];

        if (action === 'sees') {
            /// Have instructions inside
            await seeNewlyCreatedStudentOnCMS({
                cms: appInterface,
                data: {
                    learnerProfile,
                    parents,
                    studentCoursePackages,
                },
            });
        } else {
            await notSeeNewlyCreatedStudentOnCMS(appInterface, learnerProfile.name);
        }
    }
);

Then(
    '{string} {string} logins Learner App {string} with credentials of {string} which school admin gives',
    async function (
        this: IMasterWorld,
        accountType: MultiTenantAccountType,
        learnerTenant: Tenant,
        status: LoginStatus,
        tenant: Tenant
    ) {
        const appInterface = getAppInterface(this, accountType, tenant) as LearnerInterface;

        const scenarioContext = this.scenario;

        let learnerProfile: Array<UserProfileEntity> | UserProfileEntity;
        if (accountType === 'parent') {
            learnerProfile = getUserProfileWithTennantFromContext<Array<UserProfileEntity>>({
                context: scenarioContext,
                accountType: 'parent',
                tenant: learnerTenant,
            })[0];
        } else {
            learnerProfile = getUserProfileWithTennantFromContext<UserProfileEntity>({
                context: scenarioContext,
                accountType: 'student',
                tenant: learnerTenant,
            });
        }

        const { organization } = getSchoolAdminAccount({
            schoolName: `school admin ${tenant}`,
        });

        if (status === 'successfully') {
            /// Have instructions inside
            await loginOnLearnerApp({
                learner: appInterface,
                email: learnerProfile.email,
                name: learnerProfile.name,
                password: learnerProfile.password,
                organization,
            });
        } else {
            /// Have instructions inside
            await loginLearnerAccountFailed({
                learner: appInterface,
                email: learnerProfile.email,
                password: learnerProfile.password,
                organization,
            });
        }
    }
);

Then(
    "parent {string} {string} student's {string} stats on Learner App",
    async function (
        this: IMasterWorld,
        parentTenant: Tenant,
        action: AccountAction,
        studentTenant: Tenant
    ) {
        const parent = getAppInterface(this, 'parent', parentTenant) as LearnerInterface;
        const driver = parent.flutterDriver!;
        const scenarioContext = this.scenario;

        const learnerProfile = getUserProfileWithTennantFromContext<UserProfileEntity>({
            context: scenarioContext,
            accountType: 'student',
            tenant: studentTenant,
        });

        if (action === 'sees') {
            await parent.openHomeDrawer();

            await parent.instruction(`Click on Stats tab`, async function () {
                await parent.clickOnTab(
                    SyllabusLearnerKeys.stats_tab,
                    SyllabusLearnerKeys.stats_page
                );
            });

            // TODO: Need to check details chart later
            await parent.instruction(
                `Check first kid chart statistic: ${learnerProfile.name}`,
                async function () {
                    await checkKidChartStatistic(parent);
                }
            );
            await openMenuPopupOnWeb(parent);
            await tapOnSwitchStudent(parent);

            const learner = new ByValueKey(
                SyllabusLearnerKeys.switchStudentKidTile(learnerProfile.id, 0)
            );
            await driver.waitFor(learner);
        } else {
            await parent.instruction(
                `Does not see student: ${learnerProfile.name}`,
                async function () {
                    const entity = await parent.getKidsOfParent();
                    const kids = entity.kidsOfParent;

                    const studentIndex = kids.findIndex((kid) => kid.id === learnerProfile.id);

                    weExpect(studentIndex).toBe(-1);
                }
            );
        }
    }
);
