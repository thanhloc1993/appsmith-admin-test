import { aliasAssignmentName } from '@legacy-step-definitions/alias-keys/syllabus';
import { getLearnerInterfaceFromRole } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    learnerClickOnViewAssignmentButton,
    verifyAssignmentInfoInAssignmentDetail,
} from './communication-redirect-student-to-assignment-detail-definitions';

When(
    `{string} selects view assignment button`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} selects view assignment button`, async () => {
            await learnerClickOnViewAssignmentButton(learner);
        });
    }
);

Then(
    `{string} sees assignment info in assignment detail display correctly`,
    async function (this: IMasterWorld, role: AccountRoles) {
        const context = this.scenario;
        const learner = getLearnerInterfaceFromRole(this, role);
        const assignmentName = context.get<string>(aliasAssignmentName);
        await learner.instruction(`${role} verify assignment notification info`, async () => {
            await verifyAssignmentInfoInAssignmentDetail(learner, assignmentName);
        });
    }
);
