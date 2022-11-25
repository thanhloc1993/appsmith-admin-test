import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getUserProfileFromContext,
} from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { DataTable, Given, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { learnerClickOnNotificationIcon } from './communication-common-definitions';
import {
    createNotificationWithQuestionnaireData,
    learnerClicksOnBackButtonOfNotificationDetailScreen,
    QuestionnaireDataTableRow,
    sendCreatedQuestionnaireNotificationByGrpc,
} from './communication-notification-questionnaire-definitions';
import {
    createParentWithTwoStudents,
    parentSeesTwoItemsInNotificationList,
    verifyStudentNameInNotificationDetailScreen,
} from './display-correct-student-name-in-notification-detail-definitions';

Given(
    '{string} has created a parent with two children are {string} and {string}',
    async function (
        this: IMasterWorld,
        adminRole: AccountRoles,
        student1Role: AccountRoles,
        student2Role: AccountRoles
    ) {
        const cms = getCMSInterfaceByRole(this, adminRole);
        const context = this.scenario;
        await cms.instruction(`Create a parent with 2 students`, async () => {
            await createParentWithTwoStudents(cms, context, student1Role, student2Role);
        });
    }
);
Given(
    '{string} sent a questionnaire notification to parent of {string} and {string}',
    async function (
        this: IMasterWorld,
        adminRole: AccountRoles,
        student1Role: AccountRoles,
        student2Role: AccountRoles,
        questionnaireDataTable: DataTable
    ) {
        const questionnaireData: QuestionnaireDataTableRow[] = questionnaireDataTable.hashes();
        const cms = getCMSInterfaceByRole(this, adminRole);
        const context = this.scenario;
        await cms.instruction(`Create a notification with questionnaire`, async function () {
            createNotificationWithQuestionnaireData(context, questionnaireData, true);
        });
        const learner1Profile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(student1Role)
        )!;
        const learner2Profile = getUserProfileFromContext(
            this.scenario,
            learnerProfileAliasWithAccountRoleSuffix(student2Role)
        )!;

        await cms.instruction(`Admin send notification to students`, async () => {
            const context = this.scenario;
            await sendCreatedQuestionnaireNotificationByGrpc(cms, context, [
                learner1Profile.id,
                learner2Profile.id,
            ]);
        });
    }
);

Then(
    '{string} sees two notification items in notification list',
    async function (this: IMasterWorld, parentRole: AccountRoles) {
        const parent = getLearnerInterfaceFromRole(this, parentRole);
        await parent.instruction(
            `Parent sees 2 notification items in notification list`,
            async () => {
                await parentSeesTwoItemsInNotificationList(parent);
            }
        );
    }
);

Then(
    '{string} sees student name in notification detail of each notification display correctly',
    async function (this: IMasterWorld, parentRole: AccountRoles) {
        const parent = getLearnerInterfaceFromRole(this, parentRole);

        await parent.instruction(
            `Parent sees student name of student 1 in notification detail `,
            async () => {
                const student1Profile = getUserProfileFromContext(
                    this.scenario,
                    learnerProfileAliasWithAccountRoleSuffix('student S1')
                )!;
                const student1NotiIndex = 0;
                await verifyStudentNameInNotificationDetailScreen(
                    parent,
                    student1NotiIndex,
                    student1Profile.name
                );
            }
        );

        await parent.instruction(
            `Parent clicks on back button of notification detail screen`,
            async () => {
                await learnerClicksOnBackButtonOfNotificationDetailScreen(parent);
            }
        );

        await parent.instruction(`Parent click on notification icon`, async () => {
            await learnerClickOnNotificationIcon(parent);
        });

        await parent.instruction(
            `Parent sees student name of student 1 in notification detail `,
            async () => {
                const student2NotiIndex = 1;
                const student2Profile = getUserProfileFromContext(
                    this.scenario,
                    learnerProfileAliasWithAccountRoleSuffix('student S2')
                )!;
                await verifyStudentNameInNotificationDetailScreen(
                    parent,
                    student2NotiIndex,
                    student2Profile.name
                );
            }
        );
    }
);
