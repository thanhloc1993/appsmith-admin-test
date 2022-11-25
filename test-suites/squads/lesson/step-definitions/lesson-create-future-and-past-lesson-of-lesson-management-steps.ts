import {
    aliasCourseId,
    aliasLessonId,
    aliasLocationName,
} from '@legacy-step-definitions/alias-keys/lesson';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    getUserProfileFromContext,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { LessonManagementLessonTime, LessonUpsertFields } from '../types/lesson-management';
import {
    isOnLessonListPage,
    openCreateLessonPage,
    assertSeeLessonOnCMS,
    submitLessonOfLessonManagement,
    selectDateAndTimeOfFuture,
    assertToSeeTheLessonOnTeacherApp,
    assertToSeeNewLessonOnLearnerApp,
    assertLessonListByLessonTime,
    selectDateAndTimeOfPast,
    fillUpsertFormLessonOfLessonManagement,
    assertAlertMessageLessonUpsertRequiredField,
    isOnLessonUpsertDialog,
    triggerSubmitLesson,
} from './lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';

Given(
    '{string} has gone to lesson management page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} has gone to lesson management page`, async function () {
            await cms.selectMenuItemInSidebarByAriaLabel('Lesson Management');
        });
    }
);

Given(
    '{string} has opened creating lesson page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} has opened creating lesson page`, async function () {
            await openCreateLessonPage(cms);
        });
    }
);

Given(
    '{string} has filled date & time is within 10 minutes from now',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has filled date & time is within 10 minutes from now`,
            async function () {
                await selectDateAndTimeOfFuture(cms);
            }
        );
    }
);

Given(
    '{string} has filled start & end time have been completed in the last 24 hours',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has filled start & end time have been completed in the last 24 hours`,
            async function () {
                await selectDateAndTimeOfPast(cms);
            }
        );
    }
);

Given(
    '{string} has filled all remain fields',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: teacherName } = getUserProfileFromContext(
            scenario,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const centerName = scenario.get(aliasLocationName);

        await cms.instruction(`${role} has filled all remain fields`, async function () {
            await fillUpsertFormLessonOfLessonManagement({
                cms,
                teacherName,
                studentName,
                centerName,
                missingFields: ['start time'],
            });
        });
    }
);

When(
    '{string} creates the lesson of lesson management',
    { timeout: 300000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        await cms.instruction(
            `${role} saves the new lesson of lesson management`,
            async function () {
                await submitLessonOfLessonManagement(cms, scenario);
            }
        );
    }
);

Then(
    '{string} is redirected to {string} lessons list page',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} is redirected to ${lessonTime} lessons list page`,
            async function () {
                await cms.waitingForLoadingIcon();
                await isOnLessonListPage(cms);
                await assertLessonListByLessonTime(cms, lessonTime);
            }
        );
    }
);

Then(
    '{string} sees newly created {string} lesson on the list',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(`${role} sees newly created ${lessonTime} lesson`, async function () {
            await assertSeeLessonOnCMS({
                cms,
                lessonId,
                studentName,
                shouldSeeLesson: true,
                lessonTime,
            });
        });
    }
);

Then(
    '{string} sees new {string} lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);

        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);

        await teacher.instruction(`${role} sees new lesson on Teacher App`, async function () {
            await assertToSeeTheLessonOnTeacherApp({
                teacher,
                lessonTime,
                courseId,
                lessonId,
                lessonName: '', // Lesson of lesson management has no name
            });
        });
    }
);

Then(
    '{string} sees the new lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);

        await learner.instruction(`${role} sees new lesson on Teacher App`, async function () {
            await assertToSeeNewLessonOnLearnerApp(learner, lessonId);
        });
    }
);

When(
    '{string} creates the lesson with missing required {string}',
    async function (this: IMasterWorld, role: AccountRoles, missingField: LessonUpsertFields) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const { name: teacherName } = getUserProfileFromContext(
            scenario,
            staffProfileAliasWithAccountRoleSuffix('teacher')
        );
        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );
        const centerName = scenario.get(aliasLocationName);

        await cms.instruction(
            `${role} fill lesson report upsert form with missing ${missingField}`,
            async function () {
                await fillUpsertFormLessonOfLessonManagement({
                    cms,
                    teacherName,
                    studentName,
                    centerName,
                    missingFields: [missingField],
                });
            }
        );

        await cms.instruction(`${role} saves lesson of lesson management`, async function () {
            await triggerSubmitLesson(cms);
        });
    }
);

Then(
    '{string} sees alert message under required {string}',
    async function (this: IMasterWorld, role: AccountRoles, missingField: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees alert message under required ${missingField}`,
            async function () {
                await assertAlertMessageLessonUpsertRequiredField(cms, missingField);
            }
        );
    }
);

Then(
    '{string} is still in creating lesson page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is still in creating lesson page`, async function () {
            await isOnLessonUpsertDialog(cms);
        });
    }
);
