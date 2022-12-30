import { getCMSInterfaceByRole, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';
import { dialogWithHeaderFooterWrapper } from '@user-common/cms-selectors/students-page';

import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { columnStudentName, endTimeInputV3, startTimeInputV3 } from '../common/cms-selectors';
import {
    assertErrorLessonDateMustBeforeEndDate,
    changeLessonDateWithFromUpsertV3,
    changeLessonEndDateWithFromUpsertV3,
    changeTimeLesson,
    checkInputToEqualValue,
    checkValueTableToEqualValue,
    isOnLessonUpsertDialogV3,
    OptionCompareLessonDateAndEndDate,
    selectStudent,
} from './lesson-school-admin-cannot-edit-weekly-recurring-individual-lesson-definitions';

When(
    '{string} edits end date with {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        optionCompareLessonDateAndEndDate: OptionCompareLessonDateAndEndDate
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        if (optionCompareLessonDateAndEndDate === 'end date < lesson date') {
            await cms.instruction(
                `${role} updates lesson date to the next date of tomorrow`,
                async function () {
                    await changeLessonDateWithFromUpsertV3(cms, scenarioContext, -1);
                }
            );

            await cms.instruction(`${role} update lesson end date to yesterday`, async function () {
                await changeLessonEndDateWithFromUpsertV3(cms, 1);
            });
        }

        if (optionCompareLessonDateAndEndDate === 'end date = lesson date') {
            await cms.instruction(
                `${role} updates lesson date to the next date of tomorrow`,
                async function () {
                    await changeLessonDateWithFromUpsertV3(cms, scenarioContext, 2);
                }
            );

            await cms.instruction(`${role} update lesson end date to yesterday`, async function () {
                await changeLessonEndDateWithFromUpsertV3(cms, 2);
            });
        }
    }
);

Then(
    '{string} sees inline errors message under both Lesson Date and End Date',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await assertErrorLessonDateMustBeforeEndDate(cms.page);
    }
);

When(
    '{string} edits all fields exclude the end date field',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} updates lesson date to the next date of tomorrow`,
            async function () {
                await changeLessonDateWithFromUpsertV3(cms, scenario, 1);
            }
        );

        await cms.instruction('select start time', async function () {
            await changeTimeLesson(cms, '05:45', '07:30');
        });

        await cms.instruction(`${role} has filled all remain fields`, async function () {
            await selectStudent({ cms, studentName });
        });
    }
);

When('{string} cancels editing lesson', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} cancels editing lesson`, async function () {
        await cms.cancelDialogAction();
    });
});

Then(
    '{string} sees confirm popup editing lesson has been closed',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} cancels editing lesson`, async function () {
            await cms.page!.waitForSelector(dialogWithHeaderFooterWrapper, {
                state: 'hidden',
            });
        });
    }
);

Then(
    '{string} is still sees previous edited info',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} is still sees previous start time edited info`,
            async function () {
                await checkInputToEqualValue(cms, startTimeInputV3, '05:45');
            }
        );
        await cms.instruction(
            `${role} is still sees previous End time edited info`,
            async function () {
                await checkInputToEqualValue(cms, endTimeInputV3, '07:30');
            }
        );

        await cms.instruction(
            `${role} is still sees previous student edited info`,
            async function () {
                await checkValueTableToEqualValue(cms, columnStudentName, studentName);
            }
        );
    }
);

Then(
    '{string} is still in editing the lesson page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is still in editing lesson page`, async function () {
            await isOnLessonUpsertDialogV3(cms);
        });
    }
);
