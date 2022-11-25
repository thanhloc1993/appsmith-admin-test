import { Given } from '@cucumber/cucumber';

import { createLessonManagementIndividualLessonWithGRPC } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    'school admin has created an offline lesson of lesson management with start date&time is within 10 minutes from now',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created an offline lesson of lesson management with start date&time is within 10 minutes from now`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'within 10 minutes from now',
                    'Offline'
                );
            }
        );
    }
);

Given(
    'school admin has created an online lesson of lesson management with start date&time is within 10 minutes from now',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created an online lesson of lesson management with start date&time is within 10 minutes from now`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'within 10 minutes from now',
                    'Online'
                );
            }
        );
    }
);
