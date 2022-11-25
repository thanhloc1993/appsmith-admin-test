import { Given, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasLessonTime } from 'test-suites/squads/lesson/common/alias-keys';
import {
    ActionCanSee,
    LessonTimeValueType,
    ComparePosition,
} from 'test-suites/squads/lesson/common/types';
import {
    assertNotSeeDeletedLessonOnCMS,
    assertSeeLessonStillRemainInRecurringChain,
} from 'test-suites/squads/lesson/step-definitions/school-admin-can-delete-weekly-recurring-future-group-lesson-definitions';
import {
    goToLessonInRecurringChainByOrder,
    OrderLessonInRecurringChain,
} from 'test-suites/squads/lesson/step-definitions/school-admin-edits-lesson-date-of-weekly-recurring-individual-lesson-definitions';

Given(
    '{string} has gone to detailed lesson info page of the 2nd lesson in the chain',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);

        await cms.instruction(
            `${role} has gone to detailed lesson info page of the 2nd lesson in the chain`,
            async function () {
                await goToLessonInRecurringChainByOrder(
                    cms,
                    scenarioContext,
                    OrderLessonInRecurringChain.SECOND,
                    lessonTime
                );
            }
        );
    }
);

Then(
    '{string} does not see the deleted lesson on {string} lesson list on CMS',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} does not see the deleted lesson on ${lessonTime} lesson list on CMS`,
            async function () {
                await assertNotSeeDeletedLessonOnCMS({
                    cms,
                    scenarioContext,
                    lessonTime,
                });
            }
        );
    }
);

Then(
    '{string} can {string} other lessons in chain {string} deleted lesson',
    async function (role: AccountRoles, action: ActionCanSee, position: ComparePosition) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const shouldBeSee = action === 'see';
        const order =
            position === 'before'
                ? OrderLessonInRecurringChain.FIRST
                : OrderLessonInRecurringChain.SECOND;
        // Check other lessons in chain before deleted lesson is remained by check the first lesson in chain
        // Check other lessons in chain after deleted lesson is remained by check the second lesson in chain

        await cms.instruction(
            `${role} can ${action} other lessons in chain from deleted lesson`,
            async function () {
                await assertSeeLessonStillRemainInRecurringChain({
                    cms,
                    scenarioContext,
                    order,
                    shouldSeeLesson: shouldBeSee,
                });
            }
        );
    }
);

Then(
    '{string} can see other lessons in the recurring chain still remain',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} can see other lessons in the recurring chain still remain`,
            async function () {
                await assertSeeLessonStillRemainInRecurringChain({
                    cms,
                    scenarioContext,
                    order: OrderLessonInRecurringChain.FIRST,
                    shouldSeeLesson: true,
                });
                await assertSeeLessonStillRemainInRecurringChain({
                    cms,
                    scenarioContext,
                    order: OrderLessonInRecurringChain.SECOND,
                    shouldSeeLesson: true,
                });
            }
        );
    }
);
