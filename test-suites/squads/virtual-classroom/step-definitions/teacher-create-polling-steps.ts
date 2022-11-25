import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { defaultPollingOptions } from '@supports/constants';

import { getLearnerInterfaceFromRole } from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { learnerSeesVideoOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/learner-shares-file-definitions';
import {
    assertStatusOfPollingButton,
    learnerSeesOptionsOnLearnerApp,
    learnerSeesPollingAnswerBarOnLearnerApp,
    teacherSeesSetUpPollingPageWithFourDefaultOptionsOnTeacherApp,
    teacherSelectPollingButtonOnTeacherApp,
    teacherSetPollingOptionOnTeacherApp,
    teacherStartPollingOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-create-polling-definitions';
import { teacherDoesNotSeeSharingMaterialOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-shares-file-definitions';
import { teacherIsInPollingStatsPageOnTeacherApp } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-stop-and-end-polling-definitions';
import { ButtonStatus } from 'test-suites/squads/virtual-classroom/utils/types';

Given('{string} does not share material on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    const { scenario } = this!;
    const pdfMediaId = scenario.get(aliasMaterialId['pdf 1']);
    const videoMediaId = scenario.get(aliasMaterialId['video 1']);
    const pdf2MediaId = scenario.get(aliasMaterialId['pdf 2']);
    const video2MediaId = scenario.get(aliasMaterialId['video 2']);

    await teacher.instruction(
        `${role} can't see material content when teacher does not share material`,
        async function () {
            await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, pdfMediaId);
            await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, videoMediaId);
            await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, pdf2MediaId);
            await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, video2MediaId);
        }
    );
});

Given(
    "{string} has not shared lesson's material on Teacher App",
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const { scenario } = this!;
        const pdfMediaId = scenario.get(aliasMaterialId['pdf 1']);
        const videoMediaId = scenario.get(aliasMaterialId['video 1']);
        const pdf2MediaId = scenario.get(aliasMaterialId['pdf 2']);
        const video2MediaId = scenario.get(aliasMaterialId['video 2']);

        await teacher.instruction(
            `${role} can't see material content when teacher does not share material`,
            async function (teacher) {
                await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, pdfMediaId);
                await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, videoMediaId);
                await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, pdf2MediaId);
                await teacherDoesNotSeeSharingMaterialOnTeacherApp(teacher, video2MediaId);
            }
        );
    }
);

When('{string} opens polling on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} opens polling on Teacher App`, async function (teacher) {
        await teacherSelectPollingButtonOnTeacherApp(teacher);
    });
});

Then(
    '{string} sees set up polling page with 4 default options on Teacher App',
    async function (role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} sees set up polling page with 4 default options on Teacher App`,
            async function () {
                await teacherSeesSetUpPollingPageWithFourDefaultOptionsOnTeacherApp(teacher);
            }
        );
    }
);

Then(
    '{string} sees {string} polling icon on Teacher App',
    async function (role: AccountRoles, status: ButtonStatus) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} sees Poll Button With ${status} Status on Teacher App`,
            async function () {
                await assertStatusOfPollingButton(teacher, status);
            }
        );
    }
);

Then('{string} sees video on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);

    await learner.instruction(`${role} sees video on Learner App`, async function () {
        await learnerSeesVideoOnLearnerApp(learner, false);
    });
});

Then('{string} does not see answer bar on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);

    await learner.instruction(`${role} does not see answer bar on Learner App`, async function () {
        await learnerSeesPollingAnswerBarOnLearnerApp(learner, false);
    });
});

Given('{string} has opened polling on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} has opened polling on Teacher App`, async function () {
        await teacherSelectPollingButtonOnTeacherApp(teacher);
    });
});

When(
    '{string} sets correct answer is {string} option',
    async function (role: AccountRoles, optionName: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} sets correct answer is ${optionName} option`,
            async function () {
                await teacherSetPollingOptionOnTeacherApp(teacher, optionName, true);
            }
        );
    }
);

When('{string} starts polling on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} starts polling on Teacher App`, async function (teacher) {
        await teacherStartPollingOnTeacherApp(teacher);
    });
});

Then('{string} is redirected to Stats page on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(
        `${role} is redirected to Stats page on Teacher App`,
        async function () {
            await teacherIsInPollingStatsPageOnTeacherApp(teacher);
        }
    );
});

Then('{string} sees answer bar with 4 options on Learner App', async function (role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);

    await learner.instruction(
        `${role} sees answer bar with 4 options on Learner App`,
        async function () {
            await learnerSeesPollingAnswerBarOnLearnerApp(learner, true);
            await learnerSeesOptionsOnLearnerApp(learner, defaultPollingOptions);
        }
    );
});
