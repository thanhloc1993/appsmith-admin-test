import { Given, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { ActionOptions } from '@supports/types/cms-types';

import { clickSubmitOrder } from './payment-order-management-common-definitions';
import { aliasLearnerProfile } from 'step-definitions/alias-keys/payment';
import { createStudentWithCourseAndGrade } from 'step-definitions/payment-common-definitions';
import { getCMSInterfaceByRole } from 'step-definitions/utils';
import { schoolAdminGoesToStudentDetailPage } from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

When('school admin goes to creates order for created student', async function () {
    const cms = this.cms;
    const scenario = this.scenario;

    const student = scenario.get<UserProfileEntity>(aliasLearnerProfile);

    await schoolAdminGoesToStudentDetailPage(cms, student, true);

    await cms.instruction(
        `School admin clicks on Create Order at student id: ${student.id}, name: ${student.name}`,
        async () => {
            await cms.selectActionButton(ActionOptions.CREATE_ORDER, {
                target: 'actionPanelTrigger',
            });
        }
    );
});

When('school admin submits the order', async function () {
    await clickSubmitOrder(this.cms);
});

Given(
    '{string} has created a student with grade, course',
    async function (role: AccountRoles): Promise<void> {
        const cms = getCMSInterfaceByRole(this, role);
        await createStudentWithCourseAndGrade(cms, this.scenario);
    }
);
