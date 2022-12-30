import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod } from 'manabuf/lessonmgmt/v1/enums_pb';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasLessonId, aliasLocationId } from 'test-suites/squads/lesson/common/alias-keys';
import {
    LessonReportActionType,
    LessonReportStatus,
    LessonTimeValueType,
    LessonType,
} from 'test-suites/squads/lesson/common/types';
import { saveIndividualLessonReport } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-can-delete-weekly-recurring-lesson-definitions';
import {
    userSeeEmptyIndividualReport,
    userSeeFulFilledIndividualReport,
} from 'test-suites/squads/lesson/step-definitions/lesson-teacher-saves-draft-individual-lesson-report-of-future-lesson-one-time-definitions';
import { goToLessonDetailByLessonId } from 'test-suites/squads/lesson/utils/lesson-detail';
import {
    assertLessonReportStatus,
    fulfillIndividualLessonReport,
    openLessonReportUpsertDialog,
    saveDraftIndividualLessonReport,
    userOnLessonReportIndDetailPage,
} from 'test-suites/squads/lesson/utils/lesson-report';
import { createLessonWithGRPC } from 'test-suites/squads/lesson/utils/lesson-upsert';
import { applyLocationOnCMS } from 'test-suites/squads/lesson/utils/locations';

Given(
    '{string} has created a one time individual lesson in the future',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a one time individual lesson in the future`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    teachingMedium: 'Online',
                    createLessonTime: 'within 10 minutes from now',
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
                });
            }
        );
    }
);

// TODO: Use this step for all other create lesson steps
Given(
    '{string} has created a one time {string} lesson in the {string}',
    async function (role: AccountRoles, lessonType: LessonType, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a one time ${lessonType} lesson in the ${lessonTime}`,
            async function () {
                const teachingMethod: LessonTeachingMethod =
                    lessonType === 'individual'
                        ? LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
                        : LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP;

                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    teachingMedium: 'Online',
                    createLessonTime: lessonTime,
                    teachingMethod,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME,
                });
            }
        );
    }
);

Given(
    '{string} has applied location in location settings is the same as location in the lesson',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has applied location in location settings is the same as location in the lesson`,
            async function () {
                const locationId = scenarioContext.get(aliasLocationId);
                await applyLocationOnCMS(cms, locationId);
            }
        );
    }
);

Given('{string} has gone to detailed lesson info page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;
    const lessonId = scenarioContext.get(aliasLessonId);

    await cms.instruction(`${role} has gone to detailed lesson info page`, async function () {
        await goToLessonDetailByLessonId({ cms, lessonId });
    });
});

Given(
    '{string} has opened creating {string} lesson report page',
    async function (role: AccountRoles, lessonType: LessonType) {
        const cms = getCMSInterfaceByRole(this, role);
        const page = cms.page!;

        await cms.instruction(
            `${role} has opened ${lessonType} lesson report upsert dialog`,
            async function () {
                await openLessonReportUpsertDialog({
                    page,
                    lessonType,
                    upsertType: 'creating',
                });
            }
        );
    }
);

Given('{string} has fulfilled individual lesson report info', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} has fulfilled individual lesson report info`, async function () {
        await fulfillIndividualLessonReport(cms);
    });
});

When('{string} saves draft individual lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} saves draft individual lesson report`, async function () {
        await saveDraftIndividualLessonReport(cms);
    });
});

Given(
    '{string} has clicked {string} individual lesson report',
    async function (role: AccountRoles, actionSaveLessonReport: LessonReportActionType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has clicked ${actionSaveLessonReport} individual lesson report`,
            async function () {
                await saveIndividualLessonReport(cms, actionSaveLessonReport);
            }
        );
    }
);

Then('{string} is redirected to detailed lesson report page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const page = cms.page!;

    await cms.instruction(
        `${role} is redirected to detailed lesson report page`,
        async function () {
            await cms.waitingForLoadingIcon();
            await userOnLessonReportIndDetailPage(page);
        }
    );
});

Then('{string} sees fulfilled individual lesson report info', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(
        `${role} sees fulfilled individual lesson report info`,
        async function () {
            await userSeeFulFilledIndividualReport(cms);
        }
    );
});

Then(
    '{string} sees {string} tag of lesson report',
    async function (role: AccountRoles, status: LessonReportStatus) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} sees ${status} tag of lesson report`, async function () {
            await assertLessonReportStatus({ cms, status });
        });
    }
);

When(
    '{string} saves draft individual lesson report with missing all fields',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} saves draft individual lesson report with missing all fields`,
            async function () {
                await saveDraftIndividualLessonReport(cms);
            }
        );
    }
);

Then('{string} sees blank lesson report info', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} sees blank lesson report info`, async function () {
        await userSeeEmptyIndividualReport(cms);
    });
});
