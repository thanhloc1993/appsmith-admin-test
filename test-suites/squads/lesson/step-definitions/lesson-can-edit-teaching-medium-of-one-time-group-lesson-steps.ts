import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { TeachingMediumValueType } from '../types/lesson-management';
import { parseTeachingMediumObject } from '../utils/lesson-upsert';
import { userIsOnLessonDetailPage } from '../utils/navigation';
import { openEditingLessonPage } from './lesson-can-edit-teaching-medium-of-one-time-group-lesson-definitions';
import { selectTeachingMedium } from './lesson-create-future-and-past-lesson-of-lesson-management-definitions';

Given('{string} has opened editing lesson page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} has opened editing lesson page`, async function () {
        await openEditingLessonPage(cms);
    });
});

When(
    '{string} edits teaching medium to {string}',
    async function (role: AccountRoles, teachingMedium: TeachingMediumValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} edits teaching medium to ${teachingMedium}`,
            async function () {
                await selectTeachingMedium(cms, parseTeachingMediumObject[teachingMedium]);
            }
        );
    }
);

Then(
    '{string} sees updated {string} teaching medium on CMS',
    async function (role: AccountRoles, teachingMedium: TeachingMediumValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} sees updated ${teachingMedium} teaching medium on CMS`,
            async function () {
                await cms.waitingForLoadingIcon();
                await userIsOnLessonDetailPage(cms);
            }
        );
    }
);
