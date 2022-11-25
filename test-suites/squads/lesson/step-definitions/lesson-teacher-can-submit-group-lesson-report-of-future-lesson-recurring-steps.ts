import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { MasterWorld } from '@supports/master-world';

import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { CreateLessonSavingMethod, LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    GroupLessonReportField,
    LessonTimeValueType,
    LessonType,
} from 'test-suites/squads/lesson/common/types';
import {
    assertAlertMessageBelowGroupReportField,
    assertGroupLessonReportFulfilled,
    fillGroupLessonReport,
    fulfillGroupLessonReport,
    studentWithPackageLoginLearnerApp,
    userIsOnGroupLessonReportDetail,
} from 'test-suites/squads/lesson/step-definitions/lesson-teacher-can-submit-group-lesson-report-of-future-lesson-recurring-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import {
    cancelSubmitGroupLessonReport,
    confirmSubmitGroupLessonReport,
    submitGroupLessonReport,
    userIsOnGroupReportUpsertPage,
} from 'test-suites/squads/lesson/utils/lesson-report';
import {
    CreateLessonTimeType,
    createLessonWithGRPC,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

// TODO: Use this step for all other create lesson steps
Given(
    '{string} has created a {string} weekly recurring {string} lesson with lesson date in the {string}',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        lessonType: LessonType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a weekly recurring ${lessonType} lesson with lesson date in the ${lessonTime}`,
            async function () {
                const teachingMethod: LessonTeachingMethod =
                    lessonType === 'individual'
                        ? LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
                        : LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP;

                const createLessonTime: CreateLessonTimeType =
                    lessonTime === 'future' ? 'future weekly recurring' : 'past weekly recurring';

                const schedulingStatus =
                    lessonActionSave === 'Published'
                        ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                        : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    teachingMedium: 'Online',
                    createLessonTime,
                    schedulingStatus,
                    teachingMethod,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE,
                });
            }
        );
    }
);

Given(
    '{string} with course and class and enrolled status has logged Learner App',
    async function (this: MasterWorld, studentRole: AccountRoles) {
        await studentWithPackageLoginLearnerApp(this, studentRole);
    }
);

Given('{string} has fulfilled group lesson report info', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} has fulfilled group lesson report info`, async function () {
        await fulfillGroupLessonReport(cms);
    });
});

When('{string} submits group lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} submits group lesson report`, async function () {
        await submitGroupLessonReport(cms);
        await confirmSubmitGroupLessonReport(cms);
    });
});

When('{string} cancels submitting group lesson report', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} cancels submitting group lesson report`, async function () {
        await submitGroupLessonReport(cms);
        await cancelSubmitGroupLessonReport(cms);
    });
});

Then(
    '{string} is redirected to detailed group lesson report page',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} is redirected to detailed group lesson report page`,
            async function () {
                await cms.waitingForLoadingIcon();
                await userIsOnGroupLessonReportDetail(cms);
            }
        );
    }
);

Then('{string} sees fulfilled group lesson report info', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} sees fulfilled group lesson report info`, async function () {
        await assertGroupLessonReportFulfilled(cms);
    });
});

Given(
    '{string} has filled group lesson report info with missing {string} field',
    async function (role: AccountRoles, groupReportField: GroupLessonReportField) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has filled group lesson report info with missing ${groupReportField} field`,
            async function () {
                await fillGroupLessonReport({ cms, missingFields: [groupReportField] });
            }
        );
    }
);

When(
    '{string} submits lesson report with missing {string} field',
    async function (role: AccountRoles, groupReportField: GroupLessonReportField) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} submits lesson report with missing ${groupReportField} field`,
            async function () {
                await submitGroupLessonReport(cms);
            }
        );
    }
);

Then(
    '{string} sees alert message below {string} field',
    async function (role: AccountRoles, groupReportField: GroupLessonReportField) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees alert message below ${groupReportField} field`,
            async function () {
                await assertAlertMessageBelowGroupReportField({ cms, groupReportField });
            }
        );
    }
);

Then('{string} is still in creating group lesson report page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(
        `${role} is still in creating group lesson report page`,
        async function () {
            await userIsOnGroupReportUpsertPage(cms);
        }
    );
});
