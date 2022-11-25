import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    LessonTimeValueType,
    MethodSavingType,
    LessonReportPageType,
    ComponentVisibleState,
} from 'test-suites/squads/lesson/common/types';
import {
    assertButtonPreviousReportGrpVisible,
    assertSeeDialogPreviousReportGrp,
    assertSeeStudentInPreviousLessonReportGrp,
} from 'test-suites/squads/lesson/step-definitions/teacher-views-the-previous-group-lesson-report-definitions';
import {
    confirmSubmitGroupLessonReport,
    openEditingLessonReportGrpPage,
    parseAfterThatLessonTime,
    saveDraftLessonReportGrp,
    submitGroupLessonReport,
} from 'test-suites/squads/lesson/utils/lesson-report';
import {
    createLessonWithGRPC,
    methodSavingObject,
} from 'test-suites/squads/lesson/utils/lesson-upsert';
import { getUsersFromContextByRegexKeys } from 'test-suites/squads/lesson/utils/user';

Given('{string} has saved draft a group lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} has saved draft a group lesson report`, async function () {
        await saveDraftLessonReportGrp(cms.page!);
    });
});

Given(
    '{string} has created a {string} {string} group lesson after that lesson',
    async function (
        role: AccountRoles,
        lessonTime: LessonTimeValueType,
        methodSaving: MethodSavingType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const createLessonTime = parseAfterThatLessonTime({
            lessonTime,
            methodSaving,
        });

        await cms.instruction(
            `${role} has created a ${lessonTime} ${methodSaving} group lesson after that lesson`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP,
                    teachingMedium: 'Online',
                    methodSavingOption: methodSavingObject[methodSaving],
                });
            }
        );
    }
);

Then(
    '{string} sees the previous lesson report icon is {string} in lesson report group {string} page',
    async function (
        role: AccountRoles,
        visibleState: ComponentVisibleState,
        lessonReportPage: LessonReportPageType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const shouldBeEnabled = visibleState === 'enabled';

        await cms.instruction(
            `${role} sees the previous lesson report icon is ${visibleState} in lesson report group ${lessonReportPage} page`,
            async function () {
                await assertButtonPreviousReportGrpVisible({
                    page: cms.page!,
                    shouldBeEnabled,
                    onPage: lessonReportPage,
                });
            }
        );
    }
);
Then(
    '{string} sees student has same class with lesson in previous report in lesson report group page',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const studentName = getUsersFromContextByRegexKeys(this.scenario, learnerProfileAlias)[0]
            .name;

        await cms.instruction(
            `${role} sees student has same class with lesson in previous report in lesson report group page`,
            async function () {
                await assertSeeStudentInPreviousLessonReportGrp({
                    cms,
                    studentName,
                });
            }
        );
    }
);

Then(
    '{string} sees the previous group lesson report of lesson in lesson report group {string} page',
    async function (role: AccountRoles, lessonReportPage: LessonReportPageType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees the previous group lesson report of lesson in lesson report group ${lessonReportPage} page`,
            async function () {
                await assertSeeDialogPreviousReportGrp({
                    cms,
                    onPage: lessonReportPage,
                });
            }
        );
    }
);

When('{string} opens edit group lesson report page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} opens edit group lesson report page`, async function () {
        await openEditingLessonReportGrpPage(cms.page!);
    });
});

Given('{string} has submitted group lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} has submitted group lesson report`, async function () {
        await submitGroupLessonReport(cms);
        await confirmSubmitGroupLessonReport(cms);
    });
});
