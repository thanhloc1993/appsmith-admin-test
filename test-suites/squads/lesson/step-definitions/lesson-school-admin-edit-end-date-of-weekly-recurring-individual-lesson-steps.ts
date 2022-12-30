import { aliasLessonId } from '@legacy-step-definitions/alias-keys/lesson';
import { getCMSInterfaceByRole, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    assertAmountLessonItemInLessonList,
    assertLessonEndDate,
    assertLessonItemBetweenOldEndDateAndNewEndDate,
    EditEndDate,
    onchangeLessonEndDate,
    goToLessonDetailByMiddleLesson,
} from './lesson-school-admin-edit-end-date-of-weekly-recurring-individual-lesson-definitions';
import { LessonStatusType, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { assertLessonStatusOrderBy } from 'test-suites/squads/lesson/step-definitions/auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';

When(
    '{string} edits End date by {string}',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: EditEndDate['option']) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(`${role} has applied location setting`, async function () {
            await onchangeLessonEndDate({ cms, option: lessonTime, scenarioContext });
        });
    }
);

Given(
    '{string} has opened editing lesson page of the lesson in the middle of the recurring chain',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} has opened editing lesson page of the lesson in the recurring chain`,
            async function () {
                await goToLessonDetailByMiddleLesson({
                    cms,
                    studentName,
                    scenario,
                    lessonId,
                    lessonTime: 'future',
                });
                await cms.selectAButtonByAriaLabel('Edit');
            }
        );
    }
);

Then('{string} sees updated end date', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;
    await cms.instruction(`${role} has applied location setting`, async function () {
        await assertLessonEndDate({ cms, scenarioContext });
    });
});

Then(
    '{string} sees newly created {string} {string} lessons falling on the period between old and new end date',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        status: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        const scenario = this.scenario;

        const countLessonRecurring = 5;
        const countLessonAdded = 1;
        const countLessonTotal = countLessonRecurring + countLessonAdded;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            'Assert amount lesson item when updated add end date 7 day',
            async function () {
                await assertAmountLessonItemInLessonList({
                    countLessonTotal: countLessonTotal,
                    cms,
                    studentName,
                    role,
                    lessonTime,
                });
            }
        );

        await cms.instruction(
            'Assert Lesson just added have lesson time between old end date and new end date',
            async function () {
                await assertLessonItemBetweenOldEndDateAndNewEndDate({
                    cms,
                    scenarioContext: scenario,
                    orderLessonItemCompare: 5,
                    isExisted: true,
                });

                await assertLessonStatusOrderBy({
                    cms,
                    scenarioContext: scenario,
                    lessonTime,
                    startIndex: 0,
                    lessonStatus: status,
                    endIndex: 5,
                });
            }
        );
    }
);

Then(
    '{string} sees {string} {string} lessons in chain created between new end date and old end date will be deleted',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const scenario = this.scenario;
        const cms = this.cms;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            'Assert amount lesson item when updated add end date 7 day',
            async function () {
                await assertAmountLessonItemInLessonList({
                    countLessonTotal: 4,
                    cms,
                    studentName,
                    role,
                    lessonTime,
                });
            }
        );

        await cms.instruction(
            `${role} sees lessons in chain created between new end date and old end date will be deleted`,
            async function () {
                await assertLessonItemBetweenOldEndDateAndNewEndDate({
                    cms,
                    scenarioContext: scenario,
                    orderLessonItemCompare: 3,
                    isExisted: false,
                });

                await assertLessonStatusOrderBy({
                    cms,
                    scenarioContext: scenario,
                    lessonTime,
                    startIndex: 0,
                    lessonStatus,
                    endIndex: 3,
                });
            }
        );
    }
);

Given(
    '{string} has opened editing lesson page of the {string} lesson in the middle of the recurring chain',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} has opened editing lesson page of the lesson in the recurring chain`,
            async function () {
                await goToLessonDetailByMiddleLesson({
                    cms,
                    studentName,
                    scenario,
                    lessonId,
                    lessonTime,
                });
                await cms.selectAButtonByAriaLabel('Edit');
            }
        );
    }
);
