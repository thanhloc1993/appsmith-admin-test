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
        const scenario = this.scenario;
        const currentDate = new Date();
        const numberOfDateForNextMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0
        ).getDate();

        await cms.instruction(
            `${role} has filled end date is lesson date of next month`,
            async function () {
                await selectEndDateByDateRange(cms, scenario, numberOfDateForNextMonth);
            }
        );
    }
);

Then(
    '{string} sees created weekly recurring lesson within the repeat duration on the {string} lessons list on CMS',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
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
    '{string} sees created {string} weekly recurring lesson within the repeat duration on Teacher App',
    { timeout: 90000 },
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        await teacher.instruction(
            `${role} sees created ${lessonTime} weekly recurring lesson within the repeat duration on Teacher App`,
            async function () {
                await assertLessonRecurringOnTeacherApp(teacher, scenario, lessonTime);
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
            `${role} does not sees created ${lessonTime} weekly recurring lesson within the repeat duration on Learner App`,
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
