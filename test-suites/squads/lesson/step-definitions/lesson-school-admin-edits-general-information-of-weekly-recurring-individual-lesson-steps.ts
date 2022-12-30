import { aliasLessonId, aliasStudentName } from '@legacy-step-definitions/alias-keys/lesson';
import { removeMaterialFromLesson } from '@legacy-step-definitions/lesson-edit-lesson-of-lesson-management-material-definitions';
import { createLessonManagementIndividualLessonWithGRPC } from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { assertLessonStatus } from './auto-change-status-change-to-completed-when-submit-lesson-group-report-definitions';
import { CreateLessonSavingMethod, LessonStatus } from 'manabuf/bob/v1/lessons_pb';
import { aliasLessonTime, aliasMaterialName } from 'test-suites/squads/lesson/common/alias-keys';
import {
    columnStudentName,
    lessonUpsertStudentAttendanceStatusInput,
} from 'test-suites/squads/lesson/common/cms-selectors';
import {
    LessonStatusType,
    LessonTimeValueType,
    LessonUpsertFields,
} from 'test-suites/squads/lesson/common/types';
import { createSampleStudentWithPackage } from 'test-suites/squads/lesson/services/student-service/student-service';
import { LessonMaterialSingleType } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    seeUpdatedAttendanceAndNotSeeMaterial,
    assertOtherIndividualLessonsInChainNoChange,
    seeUpdatedAttendanceAndMaterial,
    SavingLessonOptions,
    selectAndSaveLessonSavingOption,
    goToEditLessonPage,
    selectAndSaveLessonSavingOptionWithStatus,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-general-information-of-weekly-recurring-individual-lesson-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import {
    assertIndividualLessonUpsertFieldUpdated,
    assertUpdatedIndividualLessonFieldOfOtherLessonInChain,
    fillUpsertFormLessonV3Updated,
    saveLessonInfo,
    selectAttendanceStatus,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a {string} weekly recurring individual lesson in the future and attached pdf and video',
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const schedulingStatus =
            lessonStatus === 'Published'
                ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

        await cms.instruction(
            `${role} has created a recurring individual lesson with lesson date in the future and attached pdf and video`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'more than 10 minutes from now',
                    'Online',
                    CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE,
                    [
                        // QA confirmed we can hard code to attach media
                        {
                            mediaId: '01GCTEG1F4017JCX881SXK9NPN', //  pdf file
                        },
                        {
                            mediaId: '01GCTEG1F4017JCX881W0V2NX7', // video file
                        },
                    ],
                    schedulingStatus
                );
            }
        );
    }
);

Given(
    '{string} has opened editing lesson page of the lesson in the recurring chain',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);
        const lessonId = scenario.get(aliasLessonId);

        await cms.instruction(
            `${role} has opened editing lesson page of the lesson in the recurring chain`,
            async function () {
                await goToEditLessonPage(cms, lessonId);
                await saveLessonInfo(cms, scenario);
            }
        );
    }
);

When(
    '{string} edits Attendance of Students',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} edits Attendance of Students`, async function () {
            await cms.waitingForLoadingIcon();
            await selectAttendanceStatus(cms, 'Late', lessonUpsertStudentAttendanceStatusInput);
        });
    }
);

When(
    '{string} removes file {string}',
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialSingleType) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} removes ${material}`, async function () {
            await removeMaterialFromLesson(cms, material);
        });
    }
);

Then(
    '{string} sees updated Attendance of Students and not sees {string} for this {string} lesson',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        material: LessonMaterialSingleType,
        lessonStatus: LessonStatusType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const studentName = await cms.page!.textContent(columnStudentName);
        scenarioContext.set(aliasStudentName, studentName);

        await cms.instruction(
            `${role} sees updated Attendance of Students and not sees ${material} for this ${lessonStatus} lesson`,
            async function () {
                await cms.waitingForLoadingIcon();
                await seeUpdatedAttendanceAndNotSeeMaterial(cms, material);
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

Then(
    '{string} sees other {string} lessons in chain no change general information',
    async function (this: IMasterWorld, role: AccountRoles, lessonStatus: LessonStatusType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} sees other {string} individual lessons in chain no change general information`,
            async function () {
                await assertOtherIndividualLessonsInChainNoChange(
                    cms,
                    scenarioContext,
                    lessonStatus
                );
            }
        );
    }
);

Then(
    '{string} sees updated Attendance of Students and {string} Info for this {string} lesson',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        material: LessonMaterialSingleType,
        lessonStatus: LessonStatusType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const studentName = await cms.page!.textContent(columnStudentName);
        scenarioContext.set(aliasStudentName, studentName);

        const fileName = scenarioContext.get(aliasMaterialName[material]);

        await cms.instruction(
            `${role} sees updated Attendance of Students and ${material} Info for this ${lessonStatus} lesson`,
            async function () {
                await seeUpdatedAttendanceAndMaterial(cms, material, fileName);
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

When(
    '{string} edits {string}',
    {
        timeout: 80000,
    },
    async function (this: IMasterWorld, role: AccountRoles, field: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(`${role} edits ${field}`, async function () {
            if (
                field === 'location' ||
                field === 'course' ||
                field === 'class' ||
                field === 'student'
            ) {
                await createSampleStudentWithPackage({
                    cms,
                    scenarioContext,
                    studentRole: 'student S2',
                    indexOfGetLocation: 2,
                    isAddNewLocation: true,
                });
            }
            await fillUpsertFormLessonV3Updated({ cms, scenarioContext, updatedField: [field] });
        });
    }
);

Then(
    '{string} sees updated {string} for this {string} lesson',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        field: LessonUpsertFields,
        lessonStatus: LessonStatusType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(`${role} sees updated ${field} for this lesson`, async function () {
            await assertIndividualLessonUpsertFieldUpdated(cms, scenarioContext, field);
            await assertLessonStatus(cms, lessonStatus);
        });
    }
);

Then(
    '{string} sees updated {string} for other {string} lessons in chain',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        field: LessonUpsertFields,
        lessonStatus: LessonStatusType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonTime = scenarioContext.get<LessonTimeValueType>(aliasLessonTime);

        await cms.instruction(
            `${role} sees updated ${field} for other individual lessons in chain`,
            async function () {
                await assertUpdatedIndividualLessonFieldOfOtherLessonInChain(
                    cms,
                    scenarioContext,
                    lessonTime,
                    field
                );
                await assertLessonStatus(cms, lessonStatus);
            }
        );
    }
);

When(
    '{string} saves the changes with {string} saving option',
    async function (this: IMasterWorld, role: AccountRoles, method: SavingLessonOptions) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} saves the changes with ${method} saving option`,
            async function () {
                await selectAndSaveLessonSavingOption(cms, method);
                await cms.waitingForLoadingIcon();
            }
        );
    }
);

When(
    '{string} clicks save the changes with {string} {string} saving option',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        method: SavingLessonOptions
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} saves the changes with ${method} saving option`,
            async function () {
                await selectAndSaveLessonSavingOptionWithStatus({ cms, method, lessonActionSave });
            }
        );
    }
);
