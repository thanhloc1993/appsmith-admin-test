import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasCurrentPDFPage } from './alias-keys/lesson';
import { currentPdfPage } from './cms-selectors/cms-keys';
import {
    goesToPageByControlBarOnTeacherApp,
    seesPageOfSharingPdfOnLearnerApp,
    seesPageOfSharingPdfOnTeacherApp,
} from './lesson-change-page-definitions';
import { getLearnerInterfaceFromRole, getTeacherInterfaceFromRole } from './utils';
import { aliasMaterialId } from 'test-suites/squads/lesson/common/alias-keys';
import { teacherSharesMaterialOnTeacherApp } from 'test-suites/squads/virtual-classroom/utils/lesson';

Given('{string} has shared pdf on Teacher App', async function (role: AccountRoles) {
    const teacher = getTeacherInterfaceFromRole(this, role);
    const mediaId = this.scenario.get(aliasMaterialId['pdf']);

    await teacher.instruction(`${role} has shared pdf on Teacher App`, async function () {
        await teacherSharesMaterialOnTeacherApp(teacher, mediaId);
    });
});

When(
    '{string} goes to {string} by main control bar on Teacher App',
    async function (role: AccountRoles, page: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} goes to ${page} by main control bar on Teacher App`,
            async function () {
                await goesToPageByControlBarOnTeacherApp(teacher, page);
            }
        );
    }
);

Given(
    '{string} has gone to {string} by main control bar on Teacher App',
    async function (role: AccountRoles, page: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} goes to ${page} by main control bar on Teacher App`,
            async function () {
                await goesToPageByControlBarOnTeacherApp(teacher, page);
            }
        );
    }
);

Then(
    '{string} sees {string} of sharing pdf on Teacher App',
    { timeout: 350000 },
    async function (role: AccountRoles, page: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const currentPage = currentPdfPage(page);
        this.scenario.set(aliasCurrentPDFPage, currentPage);

        await teacher.instruction(
            `${role} sees ${page} of sharing pdf on Teacher App`,
            async function () {
                await seesPageOfSharingPdfOnTeacherApp(teacher, currentPage);
            }
        );
    }
);

Then(
    '{string} sees {string} of sharing pdf on Learner App',
    { timeout: 350000 },
    async function (role: AccountRoles, page: string) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const currentPage = this.scenario.get<number>(aliasCurrentPDFPage);

        await learner.instruction(
            `${role} sees ${page} of sharing pdf on Learner App`,
            async function () {
                await seesPageOfSharingPdfOnLearnerApp(learner, currentPage);
            }
        );
    }
);
