import { aliasLocationName } from '@legacy-step-definitions/alias-keys/lesson';
import {
    getCMSInterfaceByRole,
    getUserProfileFromContext,
    splitRolesStringToAccountRoles,
} from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, When, Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonActionSaveType, LessonManagementLessonTime } from '../types/lesson-management';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { LessonStatus } from 'manabuf/lessonmgmt/v1/enums_pb';
import { aliasLessonId } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import {
    addNewTeacherOrStudentToLesson,
    assertSeeTeacherOrStudentInLesson,
    assertUpdatedLessonDateAndTime,
    changeLessonDateAndTime,
} from 'test-suites/squads/lesson/step-definitions/can-edit-one-time-individual-lesson-by-updating-and-adding-definitions';
import { openDialogAddStudentSubscriptionV2 } from 'test-suites/squads/lesson/step-definitions/lesson-create-an-individual-lesson-definitions';
import { clearLessonField } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    assertLocationName,
    changeCenter,
    removeAllStudent,
    updateCenterStudent,
} from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import { getLessonDataOnLessonDetailPage } from 'test-suites/squads/lesson/utils/lesson-detail';
import { assertSeeLessonOnLessonManagementList } from 'test-suites/squads/lesson/utils/lesson-list';
import {
    CreateLessonTimeType,
    createLessonWithGRPC,
    waitForLessonUpsertDialogClosed,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a one time individual lesson in the {string}',
    async function (role: AccountRoles, lessonTime: LessonManagementLessonTime) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a one time individual lesson in the ${lessonTime}`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime: lessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    teachingMedium: 'Online',
                });
            }
        );
    }
);

Given(
    '{string} has created a {string} one time individual lesson in the {string}',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const schedulingStatus =
            lessonActionSave === 'Published'
                ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

        await cms.instruction(
            `${role} has created a ${lessonActionSave} one time individual lesson in the ${lessonTime}`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime: lessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    teachingMedium: 'Online',
                    schedulingStatus,
                });
            }
        );
    }
);

Given(
    '{string} has created a individual lesson with start date&time is {string}',
    async function (role: AccountRoles, createLessonTime: CreateLessonTimeType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a individual lesson with start date&time is ${createLessonTime}`,
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

Given(
    '{string} has created a {string} individual lesson with start date&time is {string}',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        createLessonTime: CreateLessonTimeType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const schedulingStatus =
            lessonActionSave === 'Published'
                ? LessonStatus.LESSON_SCHEDULING_STATUS_PUBLISHED
                : LessonStatus.LESSON_SCHEDULING_STATUS_DRAFT;

        await cms.instruction(
            `${role} has created a ${lessonActionSave} individual lesson with start date&time is ${createLessonTime}`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    teachingMedium: 'Online',
                    schedulingStatus,
                });
            }
        );
    }
);

When(
    '{string} edits lesson date and start&end time to the {string}',
    async function (role: AccountRoles, lessonTime: LessonManagementLessonTime) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a individual lesson to the ${lessonTime}`,
            async function () {
                await changeLessonDateAndTime(cms, scenarioContext, lessonTime, 2);
            }
        );
    }
);

Then('{string} sees updated lesson date&time on CMS', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;

    await cms.instruction(`${role} sees updated lesson date&time on CMS`, async function () {
        await assertUpdatedLessonDateAndTime(cms, scenarioContext);
    });
});

Then(
    '{string} sees this lesson in the {string} lesson list page',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(`${role} sees updated lesson date&time on CMS`, async function () {
            await assertSeeLessonOnLessonManagementList({
                cms,
                lessonId,
                lessonTime,
                studentName,
                shouldSeeLesson: true,
            });
        });
    }
);

When(
    '{string} adds {string} to this lesson',
    async function (role: AccountRoles, addedRoles: string) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);
        const addedRolesArray = splitRolesStringToAccountRoles(addedRoles);

        await cms.instruction(`${role} adds ${addedRoles} to this lesson`, async function () {
            for (const addedRoleItem of addedRolesArray) {
                await addNewTeacherOrStudentToLesson(cms, scenario, addedRoleItem);
            }
        });
    }
);

Then(
    '{string} sees added {string} in detail lesson page',
    async function (role: AccountRoles, addedRoles: string) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);
        const addedRolesArray = splitRolesStringToAccountRoles(addedRoles);

        await cms.instruction(`${role} adds ${addedRoles} to this lesson`, async function () {
            for (const addedRoleItem of addedRolesArray) {
                await assertSeeTeacherOrStudentInLesson(cms, scenario, addedRoleItem);
            }
        });
    }
);

When('{string} edits location of the lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await cms.instruction(`${role} updates location`, async function () {
        await clearLessonField(cms, 'center');
        await changeCenter(cms, scenario, role);
    });
});
When('{string} updates location of student', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await removeAllStudent(cms);

    await openDialogAddStudentSubscriptionV2(cms);

    const { name: studentName } = getUserProfileFromContext(
        scenario,
        learnerProfileAliasWithAccountRoleSuffix('student S2')
    );

    await cms.instruction(`${role} updates location of student`, async function () {
        await updateCenterStudent({ cms, studentName });
    });
});

Then(
    '{string} sees updated location and student in lesson detail',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;
        const locationName = scenario.get(aliasLocationName);

        await waitForLessonUpsertDialogClosed(cms);
        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student S2')
        );
        const { studentNames: desireStudentNames } = await getLessonDataOnLessonDetailPage(cms);

        await cms.instruction(
            `${role} sees updated location and student in lesson detail`,
            async function () {
                await assertLocationName({ cms, locationName });
                weExpect(
                    desireStudentNames,
                    `List student should contain ${studentName}`
                ).toContain(studentName);
            }
        );
    }
);
