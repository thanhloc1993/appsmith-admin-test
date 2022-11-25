import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { getStudentNameFromContext } from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    ComponentVisibleState,
    LessonReportPageType,
    LessonReportPageWithUpsertType,
    LessonTimeValueType,
    LessonType,
    MethodSavingType,
} from 'test-suites/squads/lesson/common/types';
import {
    assertButtonPreviousReportIndVisible,
    assertSeeDialogPreviousReportInd,
    selectStudentInListReport,
} from 'test-suites/squads/lesson/step-definitions/teacher-views-the-previous-draft-individual-lesson-report-definitions';
import {
    confirmSubmitIndLessonReport,
    openLessonReportIndUpsertDialog,
    openLessonReportUpsertDialog,
    parseAfterThatLessonTime,
    saveDraftIndividualLessonReport,
    submitIndLessonReport,
} from 'test-suites/squads/lesson/utils/lesson-report';
import {
    CreateLessonTimeType,
    createLessonWithGRPC,
    methodSavingObject,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a {string} {string} individual lesson after that lesson',
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
            `${role} has created a ${lessonTime} ${methodSaving} individual lesson after that lesson`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    teachingMedium: 'Online',
                    methodSavingOption: methodSavingObject[methodSaving],
                });
            }
        );
    }
);

Given(
    '{string} has created a weekly recurring individual lesson in the {string}',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const createLessonTime: CreateLessonTimeType =
            lessonTime === 'future' ? 'future weekly recurring' : 'past weekly recurring';

        await cms.instruction(
            `${role} has created a weekly recurring individual lesson in the ${lessonTime}`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    teachingMedium: 'Online',
                });
            }
        );
    }
);

When(
    '{string} views the individual lesson report of {string} in {string} lesson report page',
    async function (
        role: AccountRoles,
        learnerRole: AccountRoles,
        page: LessonReportPageWithUpsertType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const studentName = getStudentNameFromContext(scenarioContext, learnerRole);
        const onPage: LessonReportPageType = page === 'detail' ? 'detail' : 'upsert';

        await cms.instruction(
            `${role} views the individual lesson report of ${learnerRole} in ${page} lesson report page`,
            async function () {
                await selectStudentInListReport(cms, studentName, onPage);
            }
        );
    }
);

Then(
    '{string} sees the previous lesson report icon is {string} in {string} lesson report page',
    async function (
        role: AccountRoles,
        visibleState: ComponentVisibleState,
        page: LessonReportPageWithUpsertType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const shouldBeEnabled = visibleState === 'enabled';
        const onPage: LessonReportPageType = page === 'detail' ? 'detail' : 'upsert';

        await cms.instruction(
            `${role} sees the previous lesson report icon is ${visibleState} in detail lesson report page`,
            async function () {
                await assertButtonPreviousReportIndVisible(cms, shouldBeEnabled, onPage);
            }
        );
    }
);

Then(
    '{string} sees the previous draft lesson report of student in {string} lesson report page',
    async function (role: AccountRoles, page: LessonReportPageWithUpsertType) {
        const cms = getCMSInterfaceByRole(this, role);
        const onPage: LessonReportPageType = page === 'detail' ? 'detail' : 'upsert';

        await cms.instruction(
            `${role} sees the previous draft lesson report of student in ${page} lesson report page`,
            async function () {
                await assertSeeDialogPreviousReportInd(cms, onPage);
            }
        );
    }
);

Given('{string} has saved draft the individual lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(
        `${role} has saved draft the individual lesson report`,
        async function () {
            await saveDraftIndividualLessonReport(cms);
        }
    );
});

Given(
    '{string} has opened detail {string} lesson report page',
    async function (role: AccountRoles, lessonType: LessonType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has opened ${lessonType} lesson report upsert dialog`,
            async function () {
                await openLessonReportIndUpsertDialog(cms);
            }
        );
    }
);

Given(
    '{string} has submitted individual lesson report of the lesson',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;

        await cms.instruction(
            `${role} has submitted individual lesson report of the lesson`,
            async function () {
                await submitIndLessonReport(page);
                await confirmSubmitIndLessonReport(page);
            }
        );
    }
);

When(
    '{string} submits individual lesson report of the lesson',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;

        await cms.instruction(`${role} has submitted individual lesson report`, async function () {
            await submitIndLessonReport(page);
            await confirmSubmitIndLessonReport(page);
        });
    }
);

When(
    '{string} opens editing {string} lesson report page',
    async function (role: AccountRoles, lessonType: LessonType) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;

        await cms.instruction(
            `${role} opens editing ${lessonType} lesson report page`,
            async function () {
                await openLessonReportUpsertDialog({
                    page,
                    lessonType,
                    upsertType: 'editing',
                });
            }
        );
    }
);
