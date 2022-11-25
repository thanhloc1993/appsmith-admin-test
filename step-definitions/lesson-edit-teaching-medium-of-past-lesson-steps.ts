import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import {
    schoolAdminEditsTeachingMedium,
    schoolAdminSeesTeachingMedium,
} from './lesson-edit-teaching-medium-of-past-lesson-definitions';
import {
    createLessonManagementIndividualLessonWithGRPC,
    TeachingMedium,
} from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    'school admin has created an offline lesson of lesson management that has been completed over 24 hours',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created an offline lesson of lesson management that has been completed over 24 hours`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'completed over 24 hours',
                    'Offline'
                );
            }
        );
    }
);

Given(
    'school admin has created an online lesson of lesson management that has been completed over 24 hours',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created an online lesson of lesson management that has been completed over 24 hours`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'completed over 24 hours',
                    'Online'
                );
            }
        );
    }
);

When(
    '{string} edits to {string} teaching medium',
    async function (role: AccountRoles, teachingMedium: TeachingMedium) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} edits to ${teachingMedium} teaching medium`,
            async function () {
                await schoolAdminEditsTeachingMedium(cms, teachingMedium);
            }
        );
    }
);

Then(
    '{string} sees {string} teaching medium in detailed lesson page',
    async function (role: AccountRoles, teachingMedium: TeachingMedium) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees ${teachingMedium} teaching medium in detailed lesson page`,
            async function () {
                await schoolAdminSeesTeachingMedium(cms, teachingMedium);
            }
        );
    }
);
