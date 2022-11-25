import {
    getLearnerInterfaceFromRole,
    getStudentIdFromContextWithAccountRole,
} from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    parentConfirmConversationNoLongerAvailable,
    parentVerifyParentChatGroupIsRemoved,
} from './communication-parent-leave-conversation-definitions';

Then(
    '{string} sees parent chat group of {string} is removed on Learner App',
    async function (this: IMasterWorld, parentRole: AccountRoles, learnerRole: AccountRoles) {
        const parent = getLearnerInterfaceFromRole(this, parentRole);
        const studentId = getStudentIdFromContextWithAccountRole(this.scenario, learnerRole);

        await parent.instruction(
            `${parentRole} confirm conversation no longer available`,
            async () => {
                await parentConfirmConversationNoLongerAvailable(parent);
            }
        );

        await parent.instruction(`${parentRole} sees parent chat group is removed`, async () => {
            await parentVerifyParentChatGroupIsRemoved(parent, studentId);
        });
    }
);
