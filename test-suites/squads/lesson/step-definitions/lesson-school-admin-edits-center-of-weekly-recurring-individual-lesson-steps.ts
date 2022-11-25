import {
    appliedLocation,
    openLocationSettingInCMS,
} from '@legacy-step-definitions/lesson-apply-location-settings-for-lesson-list-definitions';
import { getCMSInterfaceByRole, getUserProfileFromContext } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLocationId, aliasLocationName } from '../common/alias-keys';
import { CreateLessonSavingMethod } from 'manabuf/bob/v1/lessons_pb';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { openDialogAddStudentSubscriptionV2 } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { clearLessonField } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    assertBreakRecurringChain,
    assertDetailLessonChangeSavingOption,
    assertLessonDateBreakChain,
    assertLocationName,
    assertLocationUpdatedInLessonDetail,
    changeCenter,
    goToDetailFirstLesson,
    removeAllStudent,
    saveRecurringLessonWithOption,
    updateCenterStudent,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';

When('{string} edits Center', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await cms.instruction(`${role} clear center`, async function () {
        await clearLessonField(cms, 'center');
    });

    await cms.instruction(`${role} has selected weekly recurring`, async function () {
        await changeCenter(cms, scenario, role);
    });
});
When('{string} updates center of student', async function (this: IMasterWorld, role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await removeAllStudent(cms);

    await openDialogAddStudentSubscriptionV2(cms);

    const { name: studentName } = getUserProfileFromContext(
        scenario,
        learnerProfileAliasWithAccountRoleSuffix('student S2')
    );

    await cms.instruction(`${role} updates center of student`, async function () {
        await updateCenterStudent({ cms, studentName });
    });
});

When(
    '{string} saves the changes with {string} option',
    async function (this: IMasterWorld, role: AccountRoles, method: string) {
        const cms = getCMSInterfaceByRole(this, role);

        const methodSavingRecurringLesson =
            method === 'This and the following lessons'
                ? CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE
                : CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME;

        await cms.instruction(
            `${role} saves the changes with ${methodSavingRecurringLesson}`,
            async function () {
                await saveRecurringLessonWithOption({ cms, method: methodSavingRecurringLesson });
            }
        );
    }
);
Given(
    `{string} has applied {string} location`,
    async function (this: IMasterWorld, role: AccountRoles, type: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} opens location settings in nav bar on CMS`,
            async function () {
                await openLocationSettingInCMS(cms);
            }
        );

        await cms.instruction(`${role} applies ${type} location`, async function () {
            const locationId = scenario.get(aliasLocationId);
            await appliedLocation(cms, locationId, type);
        });
    }
);
Then(
    '{string} sees updated center in lesson detail',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const locationName = scenario.get(aliasLocationName);

        await cms.instruction(`${role} sees updated center in lesson detail`, async function () {
            await assertLocationName({ cms, locationName });
        });
    }
);
Then(
    '{string} sees other lessons in chain from edited lesson have updated center and remained repeat duration',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName, locations } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student S2')
        );

        await cms.instruction('Go to detail first lesson list', async function () {
            await goToDetailFirstLesson({
                cms,
                studentName,
                role,
                lessonTime: 'future',
            });
        });

        await cms.instruction('Go to detail first lesson list', async function () {
            await assertLocationUpdatedInLessonDetail(cms, locations?.[0].name);
        });
    }
);

Then(
    '{string} sees other lessons in chain before edited lesson end date is lesson date of the last lesson old chain',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction('See updated lesson date in last recurring chain', async function () {
            await assertLessonDateBreakChain({
                cms,
                role,
                lessonTime: 'future',
                studentName,
            });
        });
    }
);
Then(
    '{string} sees other lessons in chain before edited lesson remain center and weekly on',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName, locations } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction('Go to detail lesson page', async function () {
            await goToDetailFirstLesson({
                cms,
                lessonTime: 'future',
                studentName,
                role,
            });
        });

        await cms.instruction('See the new lesson on CMS', async function () {
            await assertLocationUpdatedInLessonDetail(cms, locations?.[0].name);
        });
    }
);

Then(
    '{string} sees this lesson leaves chain and changes to one time lesson',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student S2')
        );

        await cms.instruction(
            `${role} sees this lesson leaves chain and changes to one time lesson`,
            async function () {
                await assertBreakRecurringChain({
                    cms,
                    countBreakChain: 1,
                    studentName,
                    role,
                    lessonTime: 'past',
                });

                await assertDetailLessonChangeSavingOption({
                    cms,
                    lessonTime: 'past',
                    studentName,
                    role,
                    savingOptionExpect: 'One Time',
                });
            }
        );
    }
);

Then(
    '{string} sees other {string} lessons in chain no change',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} sees other ${lessonTime} lessons in chain no change`,
            async function () {
                await assertBreakRecurringChain({
                    cms,
                    countBreakChain: 4,
                    studentName,
                    role,
                    lessonTime,
                });

                await assertDetailLessonChangeSavingOption({
                    cms,
                    lessonTime,
                    studentName,
                    role,
                    savingOptionExpect: 'Weekly Recurring',
                });
            }
        );
    }
);
