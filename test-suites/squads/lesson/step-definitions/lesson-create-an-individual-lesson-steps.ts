import {
    aliasCourseId,
    aliasLessonId,
    aliasLocationId,
    aliasLocationName,
} from '@legacy-step-definitions/alias-keys/lesson';
import {
    teacherAppliesSelectedLocationOnTeacherApp,
    teacherOpenLocationFilterDialogOnTeacherApp,
    teacherSelectLocationsOnTeacherApp,
} from '@legacy-step-definitions/lesson-teacher-sees-respective-course-after-applying-location-in-location-settings-definitions';
import { chooseLessonTabOnLessonList } from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    getUserProfileFromContext,
    splitRolesStringToAccountRoles,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAliasWithAccountRoleSuffix,
    staffProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    LessonActionSaveType,
    LessonManagementLessonTime,
    LessonUpsertFields,
} from '../types/lesson-management';
import {
    assertAlertMessageLessonUpsertRequiredFieldV2,
    assertSeeLessonOnCMSVersion2,
    assertSeeLessonWithStatus,
    checkTeachingMedium,
    checkTeachingMethod,
    fillUpsertFormLessonV2,
    isOnLessonUpsertDialogV2,
    selectDateAndTimeOfFutureV2,
    selectDateAndTimeOfPastV2,
} from './lesson-create-an-individual-lesson-definitions';
import {
    assertToSeeNewLessonOnLearnerApp,
    assertToSeeTheLessonOnTeacherApp,
    saveUpdateLessonOfLessonManagementWithStatus,
    triggerSubmitLesson,
} from './lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { ActionCanSee, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';

Given(
    '{string} has filled date & time is within 10 minutes from now in create lesson page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has filled date & time is within 10 minutes from now`,
            async function () {
                await selectDateAndTimeOfFutureV2(cms);
            }
        );
    }
);

Given(
    '{string} has applied center location in location settings on Teacher App',
    async function (role: AccountRoles) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);
        const locationIdFromContext = scenario.get(aliasLocationId);
        await teacher.instruction(
            `${role} has applied center location in location settings on Teacher App`,
            async function () {
                await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                await teacherSelectLocationsOnTeacherApp(teacher, [locationIdFromContext]);
                await teacherAppliesSelectedLocationOnTeacherApp(teacher);
            }
        );
    }
);

Given(
    '{string} has filled all remain fields in create lesson page',
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
            await fillUpsertFormLessonV2({
                cms,
                teacherName,
                studentName,
                centerName,
                missingFields: [
                    'start time',
                    'end time',
                    'lesson date',
                    'teaching medium',
                    'teaching method',
                ],
            });
        });
    }
);

Given(
    '{string} has filled online teaching medium',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} has filled online teaching medium`, async function () {
            await checkTeachingMedium(cms, 'online');
        });
    }
);

Given(
    '{string} has filled individual teaching method',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} has filled individual teaching method`, async function () {
            await checkTeachingMethod(cms);
        });
    }
);

Then(
    '{string} sees newly created {string} lesson on the list on CMS',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(`${role} change tab ${lessonTime}`, async function () {
            await chooseLessonTabOnLessonList(cms, lessonTime);
        });

        await cms.instruction(`${role} sees newly created ${lessonTime} lesson`, async function () {
            await assertSeeLessonOnCMSVersion2({
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
    '{string} sees newly created {string} {string} lesson on the list on CMS',
    async function (
        role: AccountRoles,
        lessonStatus: LessonActionSaveType,
        lessonTime: LessonTimeValueType
    ) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} sees newly created ${lessonStatus} ${lessonTime} lesson on the list on CMS`,
            async function () {
                await assertSeeLessonWithStatus({
                    cms,
                    lessonId,
                    studentName,
                    shouldSeeLesson: true,
                    lessonTime,
                    lessonStatus,
                });
            }
        );
    }
);

When(
    '{string} creates an individual lesson with missing required {string}',
    async function (this: IMasterWorld, role: AccountRoles, missingField: LessonUpsertFields) {
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
            await fillUpsertFormLessonV2({
                cms,
                teacherName,
                studentName,
                centerName,
                missingFields: [missingField],
            });
        });
        await cms.instruction(`${role} saves lesson of lesson management`, async function () {
            await triggerSubmitLesson(cms);
        });
    }
);

Given(
    '{string} has filled start & end time have been completed in the last 24 hours in create lesson page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has filled start & end time have been completed in the last 24 hours`,
            async function () {
                await selectDateAndTimeOfPastV2(cms);
            }
        );
    }
);

Then(
    '{string} sees alert message under required {string} in creating lesson page',
    async function (this: IMasterWorld, role: AccountRoles, missingField: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} fill lesson report upsert form with missing ${missingField}`,
            async function () {
                await assertAlertMessageLessonUpsertRequiredFieldV2(cms, missingField);
            }
        );
    }
);

Given(
    '{string} have applied center location in location settings on Teacher App',
    async function (this: IMasterWorld, roles: string) {
        const scenario = this.scenario;
        const teacherRoles = splitRolesStringToAccountRoles(roles);
        const locationIdFromContext = scenario.get(aliasLocationId);

        for (const teacherRole of teacherRoles) {
            const teacher = getTeacherInterfaceFromRole(this, teacherRole);
            const cms = getCMSInterfaceByRole(this, teacherRole);
            await cms.instruction(
                `${teacherRole} have applied center location in location settings on Teacher App`,
                async function () {
                    await teacherOpenLocationFilterDialogOnTeacherApp(teacher);
                    await teacherSelectLocationsOnTeacherApp(teacher, [locationIdFromContext]);
                    await teacherAppliesSelectedLocationOnTeacherApp(teacher);
                }
            );
        }
    }
);

Then(
    '{string} is still in creating lesson page cms',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is still in creating lesson page`, async function () {
            await isOnLessonUpsertDialogV2(cms);
        });
    }
);

When(
    '{string} click save with {string} the lesson page',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} click save with ${lessonActionSave} the lesson page`,
            async function () {
                await saveUpdateLessonOfLessonManagementWithStatus(
                    cms,
                    lessonActionSave,
                    scenarioContext
                );
            }
        );
    }
);

Then(
    '{string} {string} new {string} lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        action: ActionCanSee,
        lessonTime: LessonManagementLessonTime
    ) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);

        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);

        const shouldDisplay = action === 'see';

        await teacher.instruction(
            `${role} ${action} new ${lessonTime} lesson on Teacher App`,
            async function () {
                await assertToSeeTheLessonOnTeacherApp({
                    teacher,
                    courseId,
                    lessonId,
                    lessonTime,
                    lessonItemShouldDisplay: shouldDisplay,
                    lessonName: '', // Lesson of lesson management has no name
                });
            }
        );
    }
);

Then(
    '{string} {string} the new lesson on Learner App',
    async function (this: IMasterWorld, role: AccountRoles, action: ActionCanSee) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);

        const shouldDisplay = action === 'see';

        await learner.instruction(
            `${role} ${action} the new lesson on Learner App`,
            async function () {
                await assertToSeeNewLessonOnLearnerApp(learner, lessonId, shouldDisplay);
            }
        );
    }
);
