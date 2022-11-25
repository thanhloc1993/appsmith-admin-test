import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { createLessonManagementIndividualLessonWithGRPC } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { aliasLessonName, aliasLessonId } from 'step-definitions/alias-keys/lesson';
import { LearnerKeys } from 'step-definitions/learner-keys/learner-key';
import { getCMSInterfaceByRole, getLearnerInterfaceFromRole } from 'step-definitions/utils';

Given(
    'school admin has created a lesson of lesson management that has been completed before 24 hours ago',
    async function (this: IMasterWorld) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            'school admin has created a lesson of lesson management that has been completed before 24 hours ago',
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'completed before 24 hours ago'
                );
            }
        );
    }
);

Then(
    '{string} {string} lesson in lesson list on Learner App',
    async function (
        this: IMasterWorld,
        learnerRole: AccountRoles,
        behavior: 'sees' | 'does not see'
    ) {
        const scenario = this.scenario;
        const learner = getLearnerInterfaceFromRole(this, learnerRole);

        const lessonName = scenario.get(aliasLessonName);
        const lessonId = scenario.get(aliasLessonId);

        const driver = learner.flutterDriver!;
        await learner.instruction(
            `${learnerRole} may see the lesson in lesson list`,
            async function () {
                const lesson = new ByValueKey(LearnerKeys.lessonItem(lessonId, lessonName));
                if (behavior === 'sees') {
                    await driver.waitFor(lesson);
                } else {
                    await driver.waitForAbsent(lesson);
                }
            }
        );
    }
);
