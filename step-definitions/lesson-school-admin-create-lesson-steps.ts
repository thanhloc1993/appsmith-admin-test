import { Given } from '@cucumber/cucumber';

import { createLessonManagementIndividualLessonWithGRPC } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from './utils';

Given(
    'school admin has created a lesson management with start date&time is more than 10 minutes from now',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            'school admin has created a lesson management with start date&time is more than 10 minutes from now',
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'more than 10 minutes from now'
                );
            }
        );
    }
);

Given(
    'school admin has created a lesson management with start date&time is in the next week',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created a lesson management with start date&time is in the next week`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'in the next week'
                );
            }
        );
    }
);

Given(
    'school admin has created a lesson management with start date&time is in the last week',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created a lesson management with start date&time is in the last week`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'in the last week'
                );
            }
        );
    }
);

Given(
    'school admin has created a lesson management with start date&time is in the next month',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created a lesson management with start date&time in the next month`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'in the next month'
                );
            }
        );
    }
);

Given(
    'school admin has created a lesson management with start date&time is in the previous month',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created a lesson management with start date&time is in the previous month`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'in the previous month'
                );
            }
        );
    }
);

Given(
    'school admin has created a lesson management with start date&time is in the next year',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created a lesson management with start date&time is in the next year`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'in the next year'
                );
            }
        );
    }
);

Given(
    'school admin has created a lesson management with start date&time is in the last year',
    async function () {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has created a lesson management with start date&time is in the last year`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'in the last year'
                );
            }
        );
    }
);
