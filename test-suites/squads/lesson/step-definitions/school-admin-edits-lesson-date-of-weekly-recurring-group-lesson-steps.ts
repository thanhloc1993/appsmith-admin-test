import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import {
    assertFirstLessonsInRecurringChainRemainingLessonEndDate,
    assertLessonIsRemovedInRecurringChain,
    assertOtherLessonInChainNoUpdate,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-group-lesson-definitions';
import { OrderLessonInRecurringChain } from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';

Then(
    `{string} sees other lessons in chain before edited lesson have end date is lesson date of last lesson old chain`,
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        await cms.instruction(
            `${role} sees other lessons in chain before edited lesson have end date is lesson date of last lesson old chain`,
            async function () {
                await assertFirstLessonsInRecurringChainRemainingLessonEndDate(
                    cms,
                    context,
                    'future'
                );
            }
        );
    }
);

Then(
    `{string} sees other lessons in chain from edited lesson had removed in the {string}`,
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        await cms.instruction(
            `${role} sees other lessons in chain from edited lesson had removed in the ${lessonTime}`,
            async function () {
                await assertLessonIsRemovedInRecurringChain(
                    cms,
                    context,
                    lessonTime,
                    OrderLessonInRecurringChain.FOURTH
                );
            }
        );
    }
);

Then(
    `{string} sees other lessons in chain no update in the {string}`,
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        await cms.instruction(
            `${role} sees other lessons in chain no update in the ${lessonTime}`,
            async function () {
                await assertOtherLessonInChainNoUpdate(cms, context, lessonTime);
            }
        );
    }
);
