import { aliasAssignmentName } from '@legacy-step-definitions/alias-keys/syllabus';
import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    verifyAssignmentReturnNotificationInNotificationDetail,
    verifyAssignmentReturnNotificationItem,
} from './communication-check-assignment-notification-information-definitions';
import { firstIndex } from './communication-common-definitions';

Then(
    `{string} sees {string} title and assignment name in notification list display correctly`,
    async function (this: IMasterWorld, role: AccountRoles, assignmentTitle: string) {
        const context = this.scenario;
        const learner = getLearnerInterfaceFromRole(this, role);
        const assignmentName = context.get<string>(aliasAssignmentName);

        await learner.instruction(`${role} verify assignment notification info`, async () => {
            await verifyAssignmentReturnNotificationItem(
                learner,
                firstIndex,
                assignmentTitle,
                assignmentName
            );
        });
    }
);

Then(
    `{string} sees {string} title and assignment name in notification detail display correctly`,
    async function (this: IMasterWorld, role: AccountRoles, assignmentTitle: string) {
        const context = this.scenario;
        const learner = getLearnerInterfaceFromRole(this, role);
        const assignmentName = context.get<string>(aliasAssignmentName);

        await learner.instruction(`${role} verify assignment notification info`, async () => {
            await verifyAssignmentReturnNotificationInNotificationDetail(
                learner,
                assignmentTitle,
                assignmentName
            );
        });
    }
);
