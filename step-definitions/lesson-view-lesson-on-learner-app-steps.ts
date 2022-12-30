import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';

import { aliasLessonId, aliasLessonInfo, aliasLessonName } from './alias-keys/lesson';
import { ByValueKey } from 'flutter-driver-x';
import { createLessonManagementIndividualLessonWithGRPC } from 'step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { getLearnerInterfaceFromRole } from 'step-definitions/utils';
import {
    learnerOpensCalendarOnLearnerApp,
    learnerSelectsRespectiveLessonDateOnTheCalendar,
} from 'test-suites/squads/virtual-classroom/utils/lesson';

Given(
    'school admin has created a lesson of lesson management on a specific date',
    async function (this: IMasterWorld) {
        const { cms, scenario } = this!;

        await cms.instruction(
            `school admin has created a lesson on a specific date`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenario,
                    'a specific date'
                );
            }
        );
    }
);

Given(
    '{string} has opened calendar on Learner App',
    async function (this: IMasterWorld, learnerRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        await learner.instruction(
            `${learnerRole} has opened calendar on Learner App`,
            async function () {
                await learnerOpensCalendarOnLearnerApp(learner);
            }
        );
    }
);

When(
    '{string} opens calendar on Learner App',
    async function (this: IMasterWorld, learnerRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        await learner.instruction(
            `${learnerRole} opens calendar on Learner App`,
            async function () {
                await learnerOpensCalendarOnLearnerApp(learner);
            }
        );
    }
);

When(
    "{string} chooses desired lesson's date to view lesson",
    async function (this: IMasterWorld, learnerRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        const lessonInfo = this.scenario.get<CreateLessonRequestData>(aliasLessonInfo);

        await learner.instruction('student select date on the calendar', async function () {
            await learnerSelectsRespectiveLessonDateOnTheCalendar(learner, lessonInfo.startTime);
        });
    }
);

Then(
    '{string} sees lesson in lesson list on Learner App',
    async function (this: IMasterWorld, learnerRole: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, learnerRole);
        const lessonId = this.scenario.get(aliasLessonId);
        const lessonName = this.scenario.get(aliasLessonName);

        await learner.instruction('student sees lesson on learner app', async function () {
            const lessonItem = new ByValueKey(
                VirtualClassroomKeys.liveLessonItem(lessonId, lessonName)
            );
            await learner.flutterDriver!.waitFor(lessonItem);
        });
    }
);
