import { loginOnLearnerApp } from '@legacy-step-definitions/learner-email-login-definitions';
import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    getCMSInterfaceByRole,
    getTeacherInterfaceFromRole,
    schoolAdminLoginToCMSJprep,
    syncStudentAndTeacherFromJPREPPartner,
    teacherLoginToTeacherAppJprep,
} from 'test-suites/squads/common/step-definitions/credential-account-definitions';

Given('system has synced teacher and student from partner', { timeout: 90000 }, async function () {
    const cms = getCMSInterfaceByRole(this, 'school admin');
    const scenarioContext = this.scenario;

    await cms.instruction('system has synced teacher and student from partner', async function () {
        await syncStudentAndTeacherFromJPREPPartner({ cms, scenarioContext });
    });
});

Given('school admin has logged in CMS Jprep', async function () {
    const cms = getCMSInterfaceByRole(this, 'school admin');

    await cms.instruction('school admin has logged in CMS Jprep', async function () {
        await schoolAdminLoginToCMSJprep(cms);
    });
});

Given('teacher has logged Teacher App Jprep', { timeout: 90000 }, async function () {
    const teacher = getTeacherInterfaceFromRole(this, 'school admin');
    const scenarioContext = this.scenario;

    await teacher.instruction('teacher has logged Teacher App Jprep', async function () {
        await teacherLoginToTeacherAppJprep({ teacher, scenarioContext });
    });
});

Then(
    'student logins Learner App successfully with credentials which school admin gives',
    async function (this: IMasterWorld) {
        const learner = this.learner!;
        const learnerProfile = this.scenario.get<UserProfileEntity>(learnerProfileAlias);

        /// Have instructions inside
        await loginOnLearnerApp({
            learner,
            email: learnerProfile.email,
            name: learnerProfile.name,
            password: learnerProfile.password,
        });
    }
);
