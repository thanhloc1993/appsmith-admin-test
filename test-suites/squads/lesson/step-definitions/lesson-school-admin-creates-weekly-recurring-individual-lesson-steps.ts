import { saveDialogButton } from '@legacy-step-definitions/cms-selectors/cms-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { LessonManagementLessonTime } from '../types/lesson-management';
import {
    assertLessonRecurringOnLeanerApp,
    assertLessonRecurringOnTeacherApp,
    createRecurringLessonWithMissingEndDateField,
    seeLessonRecurringOnLessonList,
    selectEndDateByDateRange,
    selectEndDateWithCondition,
    selectRecurring,
} from './lesson-school-admin-creates-weekly-recurring-individual-lesson-definitions';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
} from 'step-definitions/utils';
import {
    ActionCanSee,
    LessonStatusType,
    LessonTimeValueType,
    TeachingMediumValueType,
    TeachingMethodValueType,
} from 'test-suites/squads/lesson/common/types';
import { assertLessonStatusOrderBy } from 'test-suites/squads/lesson/step-definitions/auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';
import { selectTeachingMethod } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { changeTimeLesson } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';
import { fillRemainingLessonFields } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-creates-a-group-lesson-definitions';
import {
    parseTeachingMediumObject,
    parseTeachingMethodObject,
    saveFilledLessonUpsertFields,
    selectLessonDateByLessonTime,
    selectTeachingMedium,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has filled date&time in the {string}',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has filled date&time in the ${lessonTime}`,
            async function () {
                await selectLessonDateByLessonTime({ cms, scenarioContext, lessonTime });
                await changeTimeLesson(cms, '23:00', '23:45');

                saveFilledLessonUpsertFields({
                    scenarioContext,
                    lessonField: ['lesson date', 'start time', 'end time'],
                });
            }
        );
    }
);

Given(
    '{string} has selected teaching medium is {string}',
    async function (role: AccountRoles, teachingMedium: TeachingMediumValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has selected teaching medium is ${teachingMedium}`,
            async function () {
                await selectTeachingMedium(cms, parseTeachingMediumObject[teachingMedium]);

                saveFilledLessonUpsertFields({
                    scenarioContext,
                    lessonField: ['teaching medium'],
                });
            }
        );
    }
);

Given(
    '{string} has selected teaching method is {string}',
    async function (role: AccountRoles, teachingMethod: TeachingMethodValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has selected teaching method is ${teachingMethod}`,
            async function () {
                await selectTeachingMethod(cms, parseTeachingMethodObject[teachingMethod]);

                saveFilledLessonUpsertFields({
                    scenarioContext,
                    lessonField: ['teaching method'],
                });
            }
        );
    }
);

Given('{string} has filled remain individual lesson fields', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;

    await cms.instruction(`${role} has filled remain individual lesson fields`, async function () {
        await fillRemainingLessonFields({
            cms,
            scenarioContext,
            missingFields: ['course', 'class'],
        });
    });
});

Given(
    '{string} has selected weekly recurring',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} has selected weekly recurring`, async function () {
            await selectRecurring(cms);
        });
    }
);

Given(
    '{string} has filled end date is lesson date of next month',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const currentDate = new Date();
        const numberOfDateForNextMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0
        ).getDate();

        await cms.instruction(
            `${role} has filled end date is lesson date of next month`,
            async function () {
                await selectEndDateByDateRange(cms, scenarioContext, numberOfDateForNextMonth);

                saveFilledLessonUpsertFields({
                    scenarioContext,
                    lessonField: ['end date'],
                });
            }
        );
    }
);

Then(
    '{string} sees created weekly recurring lesson within the repeat duration on the {string} lessons list on CMS',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees created weekly recurring lesson within the repeat duration on the ${lessonTime} lessons list on CMS`,
            async function () {
                await seeLessonRecurringOnLessonList(cms, scenario, lessonTime);
            }
        );
    }
);

Then(
    '{string} can {string} created {string} recurring lesson within the repeat duration on Teacher App',
    { timeout: 90000 },
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        action: ActionCanSee,
        lessonTime: LessonManagementLessonTime
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;
        const shouldDisplay = action === 'see';

        await teacher.instruction(
            `${role} can ${action} created ${lessonTime} recurring lesson within the repeat duration on Teacher App`,
            async function () {
                await assertLessonRecurringOnTeacherApp(
                    teacher,
                    scenario,
                    lessonTime,
                    shouldDisplay
                );
            }
        );
    }
);

Then(
    '{string} sees created {string} weekly recurring lesson within the repeat duration on Learner App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await learner.instruction(
            `${role} sees created ${lessonTime} weekly recurring lesson within the repeat duration on Learner App`,
            async function () {
                await assertLessonRecurringOnLeanerApp(learner, scenario);
            }
        );
    }
);

Then(
    '{string} does not see created {string} weekly recurring lesson within the repeat duration on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await teacher.instruction(
            `${role} does not sees created ${lessonTime} weekly recurring lesson within the repeat duration on Teacher App`,
            async function () {
                await assertLessonRecurringOnTeacherApp(teacher, scenario, lessonTime, false);
            }
        );
    }
);

Then(
    '{string} does not see created {string} weekly recurring lesson within the repeat duration on Learner App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await learner.instruction(
            `${role} does not sees created ${lessonTime} weekly recurring lesson within the repeat duration on Learner App`,
            async function () {
                await assertLessonRecurringOnLeanerApp(learner, scenario, false);
            }
        );
    }
);

Given(
    '{string} has filled end date with {string}',
    async function (this: IMasterWorld, role: AccountRoles, lessonDateCondition: string) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has filled end date with ${lessonDateCondition}`,
            async function () {
                await selectEndDateWithCondition(cms, lessonDateCondition);
            }
        );
    }
);

When(
    '{string} creates weekly recurring individual lesson with missing End date field',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} creates weekly recurring individual lesson with missing End date field`,
            async function () {
                await createRecurringLessonWithMissingEndDateField(cms, scenario);
            }
        );
    }
);

Given(
    '{string} has applied location setting',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} has applied location setting`, async function () {
            await cms.selectElementByDataTestId(saveDialogButton);
        });
    }
);

Then(
    '{string} sees created {string} recurring lesson within the repeat duration on {string} lessons list on CMS',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const endIndex = lessonTime === 'past' ? 0 : 3;

        await cms.instruction(
            `${role} sees created ${lessonStatus} recurring lesson within the repeat duration on ${lessonTime} lessons list on CMS`,
            async function () {
                await seeLessonRecurringOnLessonList(cms, scenarioContext, lessonTime);
                await assertLessonStatusOrderBy({
                    cms,
                    scenarioContext,
                    startIndex: 0,
                    endIndex,
                    lessonTime,
                    lessonStatus,
                });
            }
        );
    }
);

Then(
    '{string} can {string} created {string} weekly recurring lesson within the repeat duration on Teacher App',
    { timeout: 90000 },
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        action: ActionCanSee,
        lessonTime: LessonManagementLessonTime
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        const shouldDisplay = action === 'see';

        await teacher.instruction(
            `${role} can ${action} created ${lessonTime} weekly recurring lesson within the repeat duration on Teacher App`,
            async function () {
                await assertLessonRecurringOnTeacherApp(
                    teacher,
                    scenario,
                    lessonTime,
                    shouldDisplay
                );
            }
        );
    }
);

Then(
    '{string} can {string} created {string} weekly recurring lesson within the repeat duration on Learner App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        action: ActionCanSee,
        lessonTime: LessonManagementLessonTime
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const scenario = this.scenario;

        const shouldDisplay = action === 'see';

        await learner.instruction(
            `${role} can ${action} created ${lessonTime} weekly recurring lesson within the repeat duration on Learner App`,
            async function () {
                await assertLessonRecurringOnLeanerApp(learner, scenario, shouldDisplay);
            }
        );
    }
);

Then(
    '{string} sees created {string} recurring lesson within the repeat duration on the {string} lessons list on CMS',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} sees created ${lessonStatus} recurring lesson within the repeat duration on the ${lessonTime} lessons list on CMS`,
            async function () {
                await seeLessonRecurringOnLessonList(cms, scenario, lessonTime);

                await assertLessonStatusOrderBy({
                    cms,
                    scenarioContext: scenario,
                    startIndex: 0,
                    endIndex: 0,
                    lessonTime,
                    lessonStatus,
                });
            }
        );
    }
);

Then(
    '{string} does not see created {string} recurring lesson within the repeat duration on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await teacher.instruction(
            `${role} does not sees created ${lessonTime} recurring lesson within the repeat duration on Teacher App`,
            async function () {
                await assertLessonRecurringOnTeacherApp(teacher, scenario, lessonTime, false);
            }
        );
    }
);

Then(
    '{string} does not see created {string} recurring lesson within the repeat duration on Learner App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await learner.instruction(
            `${role} does not sees created ${lessonTime} recurring lesson within the repeat duration on Learner App`,
            async function () {
                await assertLessonRecurringOnLeanerApp(learner, scenario, false);
            }
        );
    }
);
