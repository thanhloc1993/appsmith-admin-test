import {
    getLearnerInterfaceFromRoleWithTenant,
    getSchoolAdminTenantInterfaceFromRole,
} from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import {
    AccountAction,
    LearnerInterfaceWithTenant,
    LearnerRolesWithTenant,
    ParentRolesWithTenant,
    SchoolAdminRolesWithTenant,
} from '@supports/app-types';
import { MenuUnion } from '@supports/enum';

import {
    clickUpsertAndSendNotification,
    learnerClickOnNotificationIcon,
    learnerDontSeeNotificationItem,
    learnerSeesNotificationItem,
} from './communication-common-definitions';
import { openAndInputNotificationDataToComposeFormWithTenant } from './communication-multi-tenant-create-and-send-notification-definitions';
import { createStudentAndParentWithTenantRoleSuffix } from './communication-multi-tenant-user-definitions';

Given(
    '{string} creates {string} and {string} for this student',
    async function (
        schoolAdminRole: SchoolAdminRolesWithTenant,
        studentRole: LearnerRolesWithTenant,
        parentRole: ParentRolesWithTenant
    ) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const context = this.scenario;

        await cms.instruction(
            `${schoolAdminRole} create student with role as ${studentRole} and parent with role as ${parentRole} for this student`,
            async () => {
                await createStudentAndParentWithTenantRoleSuffix(
                    cms,
                    context,
                    studentRole,
                    parentRole
                );
            }
        );
    }
);

Given(
    '{string} is at {string} page with tenant on CMS',
    async function (
        schoolAdminRole: SchoolAdminRolesWithTenant,
        menuType: MenuUnion
    ): Promise<void> {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);

        await cms.instruction(`Navigate to ${menuType} page`, async () => {
            await cms.selectMenuItemInSidebarByAriaLabel(menuType);
        });
    }
);

When(
    `{string} sends notification with All Course and All Grade`,
    async function (schoolAdminRole: SchoolAdminRolesWithTenant) {
        const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);
        const scenario = this.scenario;

        await cms.instruction(
            `${schoolAdminRole} open compose dialog and input All Course and All grade`,
            async () => {
                await openAndInputNotificationDataToComposeFormWithTenant(cms, scenario);
            }
        );

        await cms.instruction(
            `${schoolAdminRole} click send button on the compose dialog`,
            async () => {
                await clickUpsertAndSendNotification(cms, scenario);
            }
        );
    }
);

Then(
    '{string} {string} new notification on Learner Web',
    async function (learnerRole: LearnerInterfaceWithTenant, action: AccountAction) {
        const learner = getLearnerInterfaceFromRoleWithTenant(this, learnerRole);

        await learner.instruction(`${learnerRole} click on notification button`, async () => {
            await learnerClickOnNotificationIcon(learner);
        });

        await learner.instruction(
            `${learnerRole} ${action} new notification on notification bell`,
            async () => {
                if (action === 'sees') {
                    await learnerSeesNotificationItem(learner);
                }
                if (action === 'does not see') {
                    await learnerDontSeeNotificationItem(learner);
                }
            }
        );
    }
);

//TODO: Add search notification if not find result it correct data
// Then(
//     '{string} {string} new notification record in notification table',
//     async function (schoolAdminRole: SchoolAdminRolesWithTenant, action: AccountAction) {
//         const context = this.scenario;
//         const cms = getSchoolAdminTenantInterfaceFromRole(this, schoolAdminRole);

//         const notificationId = context.get(aliasCreatedNotificationID);

//         await cms.instruction(
//             `${schoolAdminRole} ${action} new notification record with id ${notificationId} in notification table`,
//             async () => {
//                 if (action === 'sees') {
//                     weExpect(newNotificationRowInTable).not.toBeNull();
//                 }
//                 if (action === 'does not see') {
//                     weExpect(newNotificationRowInTable).toBeNull();
//                 }
//             }
//         );
//     }
// );
