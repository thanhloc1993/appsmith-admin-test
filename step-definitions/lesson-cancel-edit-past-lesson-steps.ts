import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    cancelEditLesson,
    updateAllLessonFields,
} from './lesson-cancel-edit-past-lesson-definitions';
import {
    compare2LessonData,
    LessonManagementLessonData,
} from './lesson-edit-lesson-by-updating-and-adding-definitions';
import { userIsOnLessonDetailPage } from './lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import { getCMSInterfaceByRole } from './utils';
import { aliasLessonData } from 'step-definitions/alias-keys/lesson';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

Given(
    '{string} has updated all fields of {string} lesson',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} updates all fields of the lesson`, async function () {
            await updateAllLessonFields(cms, lessonTime);
        });
    }
);

When(
    '{string} cancels leaving editing lesson page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} cancels leaving editing past lesson page`,
            async function () {
                await cancelEditLesson(cms, false);
            }
        );
    }
);

When(
    '{string} leaves editing lesson page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} leaves editing lesson page`, async function () {
            await cancelEditLesson(cms, true);
        });
    }
);

Then(
    '{string} does not see updated lesson on CMS',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const previousLessonData: LessonManagementLessonData = scenario.get(aliasLessonData);

        await cms.instruction(`${role} sees updated lesson on CMS`, async function () {
            await userIsOnLessonDetailPage(cms);

            await compare2LessonData({
                cms,
                dataIsCompared: previousLessonData,
                shouldMatch: true,
            });
        });
    }
);
