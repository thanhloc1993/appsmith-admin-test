import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    assertStaffHasOneAutoCreatedTimesheet,
    create2DraftLessonsWithSameDate,
    getLessonKeyByIndex,
} from './auto-created-timesheet-has-multi-same-lesson-definitions';
import {
    LessonContextData,
    publishLesson,
} from './flag-off-to-on-auto-create-timesheet-definition';
import { getLessonContextKey } from './switch-state-without-reverse-definitions';

Given(
    '{string} creates 2 draft lessons for today with start time 10 minutes from now',
    { timeout: 120000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(
            `${role} creates 2 draft lessons for today 10 minutes from now`,
            async () => {
                await create2DraftLessonsWithSameDate(cms, role, context);
            }
        );
    }
);

When(
    '{string} publishes 2 recently created lessons',
    { timeout: 120000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        for (let i = 0; i < 2; i++) {
            const lessonKey = getLessonKeyByIndex(role, i);
            await cms.instruction(`${role} publishes the lesson ${lessonKey}`, async () => {
                const { id: lessonId } = context.get<LessonContextData>(
                    getLessonContextKey(lessonKey)
                );
                await publishLesson(cms, lessonId);
            });
        }
    }
);

Then(
    '{string} sees only 1 timesheet auto created',
    { timeout: 120000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;

        await cms.instruction(`${role} sees only 1 timesheet auto created`, async () => {
            await assertStaffHasOneAutoCreatedTimesheet(cms, context, role);
        });
    }
);
