import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { createStudentWithCourseAndGrade, UserGroupType } from './communication-common-definitions';
import { sendAndReceiveNotification } from './communication-send-notification-for-selected-recipient-definitions';

// Increase the timeout of the step as it have to take time to log out and log in for maximum of 5 account which will took over 60s in the step
const timeoutForSteps = 600 * 1000;

When(
    'school admin has created {string} with created course {string}, grade and {string} info',
    async function (
        this: IMasterWorld,
        studentSuffix: AccountRoles,
        course: string,
        parents: string
    ) {
        const scenario = this.scenario;
        const cms = this.cms;
        const parentLength = parents.split(', ').length;

        await cms.waitForSkeletonLoading();

        await cms.instruction(
            `Create ${studentSuffix} with course ${course}, grade and parent info using gRPC`,
            async function () {
                await createStudentWithCourseAndGrade(cms, scenario, parentLength, studentSuffix);
            }
        );
    }
);

Then(
    'school admin sends a notification to the {string} list in {string} that the recipients will received',
    { timeout: timeoutForSteps },
    async function (this: IMasterWorld, type: UserGroupType, studentAccount: string) {
        const learner = this.learner;
        const parent = this.parent;
        const scenario = this.scenario;

        await this.cms.instruction(
            `Send notification on combinations:
            - type: ${type}
            - student: ${studentAccount}`,
            async function (cms) {
                await sendAndReceiveNotification(
                    cms,
                    learner,
                    parent,
                    scenario,
                    type,
                    studentAccount
                );
            }
        );
    }
);
