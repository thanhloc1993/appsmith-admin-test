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
import { LessonStatusType, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { assertLessonStatusOrderBy } from 'test-suites/squads/lesson/step-definitions/auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';
import { openDialogAddStudentSubscriptionV2 } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { clearLessonField } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    assertBreakRecurringChain,
    assertDetailLessonChangeSavingOption,
    assertLessonDateBreakChain,
    assertLocationName,
    assertLocationUpdatedFromEditedLesson,
    assertLocationUpdatedInLessonDetail,
    assertRepeatDurationRecurringChain,
    changeCenter,
    goToDetailFirstLesson,
    removeAllStudent,
    saveRecurringLessonWithOption,
    updateCenterStudent,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';

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
    '{string} saves the changes with {string} {string} option',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        method: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const methodSavingRecurringLesson =
            method === 'This and the following lessons'
                ? CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE
                : CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME;

        await cms.instruction(
            `${role} saves the changes with ${lessonActionSave} ${method}`,
            async function () {
                await saveRecurringLessonWithOption({
                    cms,
                    method: methodSavingRecurringLesson,
                    lessonActionSave,
                    scenarioContext: scenario,
                });
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
    '{string} sees updated location in lesson detail',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const locationName = scenario.get(aliasLocationName);

        await cms.instruction(`${role} sees updated location in lesson detail`, async function () {
            await assertLocationName({ cms, locationName });
        });
    }
);
Then(
    '{string} sees other {string} {string} lessons in chain from edited lesson has location are updated',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonTimeValueType,
        lessonStatus: LessonStatusType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName, locations } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student S2')
        );

        await cms.instruction(
            `${role} sees other ${lessonTime} ${lessonStatus} lessons in chain from edited lesson has location are updated`,
            async function () {
                await assertLocationUpdatedFromEditedLesson({
                    cms,
                    lessonTime,
                    studentName,
                    role,
                    locationName: locations?.[0].name,
                    lessonStatus,
                    startIndex: 0,
                    endIndex: 3,
                });
                await assertLessonStatusOrderBy({
                    cms,
                    lessonTime,
                    lessonStatus,
                    startIndex: 0,
                    endIndex: 0,
                    scenarioContext: scenario,
                });
            }
        );
    }
);

Then(
    '{string} sees {string} {string} lessons in chain before edited lesson has end date is date of previous lesson',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} sees ${lessonStatus} ${lessonTime} lessons in chain before edited lesson has end date is date of previous lesson`,
            async function () {
                await assertLessonDateBreakChain({
                    cms,
                    role,
                    lessonTime,
                    studentName,
                });

                await assertLessonStatusOrderBy({
                    cms,
                    lessonStatus,
                    startIndex: 0,
                    endIndex: 0,
                    scenarioContext: scenario,
                    lessonTime,
                });
            }
        );
    }
);
Then(
    '{string} sees other {string} lessons in chain before edited lesson remain location and weekly on',
    {
        timeout: 120000,
    },
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
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
            await assertLessonStatusOrderBy({
                cms,
                lessonStatus,
                endIndex: 0,
                scenarioContext: scenario,
                lessonTime: 'future',
                startIndex: 0,
            });
        });
    }
);

Then(
    '{string} sees this {string} lesson leaves chain and changes to one time lesson in the {string}',
    {
        timeout: 240000,
    },
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student S2')
        );

        await cms.instruction(
            `${role} sees this ${lessonStatus} lesson leaves chain and changes to one time lesson in the ${lessonTime}`,
            async function () {
                await assertBreakRecurringChain({
                    cms,
                    countBreakChain: 1,
                    studentName,
                    role,
                    lessonTime,
                });

                await assertDetailLessonChangeSavingOption({
                    cms,
                    lessonTime,
                    studentName,
                    role,
                    savingOptionExpect: 'One Time',
                });

                await assertLessonStatusOrderBy({
                    cms,
                    lessonTime,
                    startIndex: 0,
                    endIndex: 0,
                    scenarioContext: scenario,
                    lessonStatus,
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

Then(
    '{string} sees other {string} lessons in chain from edited lesson has location are updated in the {string}',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonStatus: LessonStatusType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName, locations } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student S2')
        );

        await cms.instruction(
            `${role} sees other ${lessonStatus} lessons in chain from edited lesson has location are updated in the ${lessonTime}`,
            async function () {
                await assertLocationUpdatedFromEditedLesson({
                    cms,
                    role,
                    lessonTime,
                    studentName,
                    locationName: locations?.[0].name,
                    startIndex: 0,
                    endIndex: 0,
                    lessonStatus,
                });
            }
        );
    }
);
Then(
    '{string} sees other {string} lessons in chain from edited lesson has repeat duration are remained',
    {
        timeout: 360000,
    },
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student S2')
        );

        await cms.instruction(
            `${role} sees other ${lessonStatus} lessons in chain from edited lesson has repeat duration are remained`,
            async function () {
                await assertRepeatDurationRecurringChain({
                    cms,
                    role,
                    lessonTime: 'future',
                    studentName,
                    scenario,
                    endIndex: 0,
                    startIndex: 3,
                    lessonStatus,
                });
            }
        );
    }
);
