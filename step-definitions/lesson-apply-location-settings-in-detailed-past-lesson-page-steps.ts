import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { checkExistLesson } from './lesson-apply-location-settings-for-lesson-list-definitions';
import { getCMSInterfaceByRole } from './utils';
import { chooseLessonTabOnLessonList } from 'step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

Then(
    `{string} sees lesson which has location is included in {string} lessons list page in selected location settings`,
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;
        const scenario = this.scenario;
        await cms.instruction(
            `${role} sees lesson which has location is included in ${lessonTime} lessons list page in selected location settings`,
            async function () {
                await chooseLessonTabOnLessonList(cms, lessonTime);
                await checkExistLesson(page, scenario);
            }
        );
    }
);
