import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { defaultPollingOptions } from '@supports/constants';

import {
    getLearnerInterfaceFromRole,
    splitRolesStringToAccountRoles,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonMaterial } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { assertStatusOfShareMaterialButton } from 'test-suites/squads/virtual-classroom/step-definitions/teacher-can-see-active-share-material-and-polling-icon-in-lesson-waiting-room-definitions';
import {
    learnerSeesOptionsOnLearnerApp,
    learnerSeesPollingAnswerBarOnLearnerApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-create-polling-definitions';
import {
    teacherDoesNotSeeSharingMaterialOnTeacherApp,
    teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-shares-file-definitions';
import {
    teacherEndsPollingOnTeacherApp,
    teacherIsInPollingStatsPageOnTeacherApp,
    teacherStopsPollingOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-stop-and-end-polling-definitions';
import { ButtonStatus } from 'test-suites/squads/virtual-classroom/utils/types';

Given('{string} has stopped polling on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} has stopped polling on Teacher App`, async function () {
        await teacherStopsPollingOnTeacherApp(teacher);
    });
});

When('{string} stops polling on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} stops polling on Teacher App`, async function (teacher) {
        await teacherStopsPollingOnTeacherApp(teacher);
    });
});

Then('{string} is still in Stats page on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} is still in Stats page on Teacher App`, async function () {
        await teacherIsInPollingStatsPageOnTeacherApp(teacher);
    });
});

Then(
    '{string} still sees {string} polling icon on Teacher App',
    async function (role: AccountRoles, status: ButtonStatus) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} still sees Poll Button With ${status} Status on Teacher App`,
            async function () {
                await assertStatusOfShareMaterialButton(teacher, status);
            }
        );
    }
);

Then(
    '{string} see {string} polling icon on Teacher App',
    async function (roles: string, status: ButtonStatus) {
        const teacherRoles = splitRolesStringToAccountRoles(roles);

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            await teacher.instruction(
                `${teacherRole} see ${status} polling icon on Teacher App`,
                async function () {
                    await assertStatusOfShareMaterialButton(teacher, status);
                }
            );
        }
    }
);

Then(
    '{string} still sees answer bar with 4 options on Learner App',
    async function (role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(
            `${role} still sees answer bar with 4 options on Learner App`,
            async function () {
                await learnerSeesPollingAnswerBarOnLearnerApp(learner, true);
                await learnerSeesOptionsOnLearnerApp(learner, defaultPollingOptions);
            }
        );
    }
);

When('{string} ends polling on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    await teacher.instruction(`${role} ends polling on Teacher App`, async function (teacher) {
        await teacherEndsPollingOnTeacherApp(teacher);
    });
});

Then('{string} still does not share material on Teacher App', async function (role: AccountRoles) {
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
});

Then(
    "{string} still shares lesson's {string} on Teacher App",
    async function (role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(`${role} see sharing ${material}`, async function () {
            await teacherSeesSharingLessonMaterialOfLessonManagementOnTeacherApp(
                teacher,
                material,
                mediaId
            );
        });
    }
);
