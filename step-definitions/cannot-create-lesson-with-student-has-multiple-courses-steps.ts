import { Given, Then, When } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { AccountRoles } from '@supports/app-types';

import {
    addCourseForStudent,
    createStudentWithEnrollmentStatus,
    fillAllRemainOfLessonManagementUpsertFormExcludeStudent,
    selectStudentWithCourseInCreateLessonDialog,
} from './cannot-create-lesson-with-student-has-multiple-courses-definitions';
import * as CMSKeys from './cms-selectors/cms-keys';
import * as LessonManagementKeys from './cms-selectors/lesson-management';
import {
    aLearnerAlreadyLoginSuccessInLearnerWeb,
    aLearnerAtAuthMultiScreenLearnerWeb,
    aLearnerAtHomeScreenLearnerWeb,
    fillUserNameAndPasswordLearnerWeb,
} from './learner-email-login-definitions';
import { getCMSInterfaceByRole, getLearnerInterfaceFromRole } from './utils';
import {
    userAuthenticationLearnerRememberedAccount,
    userAuthenticationMultiTenant,
} from 'test-suites/squads/user-management/step-definitions/user-definition-utils';

Given('{string} with enrolled status has logged Learner App', async function (role: AccountRoles) {
    const cms = this.cms;
    const scenario = this.scenario;
    const learner = getLearnerInterfaceFromRole(this, role);

    const isEnabledMultiTenantLogin = await featureFlagsHelper.isEnabled(
        userAuthenticationMultiTenant
    );

    const isEnabledRemoveRememberedAccount = await featureFlagsHelper.isEnabled(
        userAuthenticationLearnerRememberedAccount
    );

    if (!isEnabledMultiTenantLogin && !isEnabledRemoveRememberedAccount) {
        await learner.instruction('User not login yet, show auth multi screen', async function () {
            await aLearnerAtAuthMultiScreenLearnerWeb(learner);
        });
    }

    await learner.instruction('Fill username, password in login page', async function () {
        const student = await createStudentWithEnrollmentStatus(cms, scenario, role);

        await fillUserNameAndPasswordLearnerWeb({
            learner,
            username: student.email,
            password: student.password,
            isMultiTenantLogin: isEnabledMultiTenantLogin,
        });
    });

    await learner.instruction(
        'Logged in, see welcome screen and press start button then see home page',
        async function () {
            await aLearnerAlreadyLoginSuccessInLearnerWeb(learner);
            return await aLearnerAtHomeScreenLearnerWeb(learner);
        }
    );
});

Given(
    '{string} has added course C1 for {string}',
    async function (role: AccountRoles, student: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(`${role} add course C1 for ${student}`, async function () {
            await addCourseForStudent(cms, scenario, student);
        });
    }
);

Given(
    '{string} has added course C2 for {string}',
    async function (role: AccountRoles, student: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(`${role} add course C2 for ${student}`, async function () {
            await addCourseForStudent(cms, scenario, student);
        });
    }
);

Given(
    '{string} has added {string} with course C1',
    async function (role: AccountRoles, student: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(`${role} add ${student} with course C1`, async function () {
            await selectStudentWithCourseInCreateLessonDialog(cms, scenario, student);
        });
    }
);

Given(
    '{string} has added {string} with course C2',
    async function (role: AccountRoles, student: AccountRoles) {
        const cms = this.cms;
        const scenario = this.scenario;

        await cms.instruction(`${role} add ${student} with course C2`, async function () {
            await selectStudentWithCourseInCreateLessonDialog(cms, scenario, student);
        });
    }
);

Given(
    '{string} has filled all remain fields exclude student field',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(`${role} has filled all remain fields`, async function () {
            await fillAllRemainOfLessonManagementUpsertFormExcludeStudent(cms, scenario);
        });
    }
);

When('{string} clicks save button of lesson management', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(
        `${role} trigger save button on Lesson Management upsert dialog`,
        async function () {
            await cms.page!.click(LessonManagementKeys.lessonManagementLessonSubmitButton);
        }
    );
});

Then('{string} sees error message', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    await cms.instruction(`${role} sees snackbar error message`, async function () {
        await cms.page!.waitForSelector(CMSKeys.snackBarError);
    });
});
