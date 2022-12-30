import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonMaterial } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { learnerSeesPdfOnLearnerApp } from 'test-suites/squads/virtual-classroom/step-definitions/learner-shares-file-definitions';
import {
    teacherSeesPdfOnTeacherApp,
    teacherSeesPdfVisibleOnTeacherApp,
    teacherSeesVideoVisibleOnTeacherApp,
} from 'test-suites/squads/virtual-classroom/step-definitions/teacher-shares-file-definitions';

Then('{string} sees pdf on Teacher App', async function (this: IMasterWorld, role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);

    const mediaId = this.scenario.get(aliasMaterialId['pdf']);

    await teacher.instruction(`${role} sees pdf on Teacher App`, async function () {
        await teacherSeesPdfOnTeacherApp(teacher, mediaId, false);
    });
});

Then(
    "{string} sees lesson's pdf on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId['pdf']);

        await teacher.instruction(`${role} sees lesson's pdf on Teacher App`, async function () {
            await teacherSeesPdfOnTeacherApp(teacher, mediaId, false);
        });
    }
);

Then(
    "{string} does not see lesson's pdf {string} on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles, pdfMaterial: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[pdfMaterial]);

        await teacher.instruction(
            `${role} does not see lesson's pdf ${pdfMaterial} on Teacher App`,
            async function () {
                await teacherSeesPdfOnTeacherApp(teacher, mediaId, true);
            }
        );
    }
);

Then(
    "{string} does not see lesson's {string} visible on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterial) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const mediaId = this.scenario.get(aliasMaterialId[material]);

        await teacher.instruction(
            `${role} does not see lesson's ${material} visible on Teacher App`,
            async function () {
                if (material.includes('pdf')) {
                    await teacherSeesPdfVisibleOnTeacherApp(teacher, mediaId, false);
                } else {
                    await teacherSeesVideoVisibleOnTeacherApp(teacher, mediaId, false);
                }
            }
        );
    }
);

Then('{string} sees pdf on Learner App', async function (this: IMasterWorld, role: AccountRoles) {
    const learner = getLearnerInterfaceFromRole(this, role);

    await learner.instruction(`${role} sees pdf on Learner App`, async function () {
        await learnerSeesPdfOnLearnerApp(learner, false);
    });
});

Then(
    '{string} does not see pdf on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);

        await learner.instruction(`${role} does not see pdf on Learner App`, async function () {
            await learnerSeesPdfOnLearnerApp(learner, true);
        });
    }
);
