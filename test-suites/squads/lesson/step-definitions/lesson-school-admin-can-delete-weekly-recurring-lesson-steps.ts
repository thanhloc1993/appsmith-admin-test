import { aliasLessonId, aliasLessonTime } from '@legacy-step-definitions/alias-keys/lesson';
import { lessonInfoLessonDate } from '@legacy-step-definitions/cms-selectors/lesson-management';
import { goToLessonsList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { createLessonManagementIndividualLessonWithGRPC } from '@legacy-step-definitions/lesson-teacher-submit-individual-lesson-report-definitions';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { chooseLessonTabOnLessonList } from '../utils/lesson-list';
import {
    assertNotSeeOtherLessonInChain,
    deleteRecurringLessonWithOption,
    assertOtherLessonStillRemainInLesson,
    goToLessonDetailByLessonOrderOnLessonList,
    assertNotSeeLessonOnCMSWithEmptyMessageTableV2,
} from './lesson-school-admin-can-delete-weekly-recurring-lesson-definitions';
import { CreateLessonSavingMethod } from 'manabuf/bob/v1/lessons_pb';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import {
    getUserProfileFromContext,
    getUsersFromContextByRegexKeys,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasDeletedLessonDate } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import {
    searchLessonByStudentName,
    waitForTableLessonRenderRows,
} from 'test-suites/squads/lesson/utils/lesson-list';
import { createLessonWithGRPC } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a weekly recurring individual lesson with lesson date in the future',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a lesson management with start date&time is more than 10 minutes from now`,
            async function () {
                await createLessonManagementIndividualLessonWithGRPC(
                    cms,
                    scenarioContext,
                    'within 10 minutes from now',
                    'Online',
                    CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE
                );
            }
        );
    }
);

Given(
    '{string} has created a weekly recurring individual lesson with lesson date in the past',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a weekly recurring individual lesson with lesson date in the past`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    teachingMedium: 'Online',
                    createLessonTime: 'past weekly recurring',
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL,
                    methodSavingOption:
                        CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE,
                });
            }
        );
    }
);

When(
    '{string} deletes the recurring lesson with the {string} option',
    async function (this: IMasterWorld, role: AccountRoles, method: string) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const timeDeleteRecurringLesson = await cms.page!.textContent(lessonInfoLessonDate);

        scenarioContext.set(aliasDeletedLessonDate, timeDeleteRecurringLesson);

        const methodDeleteRecurringLesson =
            method === 'This and the following lessons'
                ? CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_RECURRENCE
                : CreateLessonSavingMethod.CREATE_LESSON_SAVING_METHOD_ONE_TIME;

        await cms.instruction(
            `${role} deletes the recurring lesson with the ${method} option`,
            async function () {
                await deleteRecurringLessonWithOption({
                    cms,
                    method: methodDeleteRecurringLesson,
                });
            }
        );
    }
);

When(
    '{string} sees other lessons in the recurring chain still remain',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const lessonTime = scenario.get<LessonTimeValueType>(aliasLessonTime);

        await cms.instruction(`${role} change to tab future lessons list`, async function () {
            await goToLessonsList(cms, lessonTime);
            await chooseLessonTabOnLessonList({ cms, lessonTime });
        });

        await cms.instruction(
            `${role} sees other lessons in the recurring chain still remain`,
            async function () {
                await assertOtherLessonStillRemainInLesson({
                    cms,
                    studentName,
                    lessonTime,
                });
            }
        );
    }
);

Given(
    '{string} has gone to detailed {string} lesson info page of the 2nd lesson in the recurring chain',
    {
        timeout: 240000,
    },
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);
        const lessonId = scenario.get(aliasLessonId);

        const userProfiles = getUsersFromContextByRegexKeys(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const studentName = userProfiles[0].name;

        await cms.instruction(
            `${role} go to the new ${lessonTime} lesson detail`,
            async function () {
                await goToLessonDetailByLessonOrderOnLessonList({
                    cms,
                    lessonTime,
                    lessonId,
                    studentName,
                    scenario,
                });
            }
        );
    }
);

Then(
    '{string} does not see the {string} lesson list on CMS',
    async function (this: IMasterWorld, role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(`${role} change to ${lessonTime} lessons list`, async function () {
            await chooseLessonTabOnLessonList({ cms, lessonTime });
        });

        await cms.instruction(
            `${role} does not see the ${lessonTime} lesson on CMS`,
            async function () {
                await assertNotSeeLessonOnCMSWithEmptyMessageTableV2({
                    cms,
                    lessonId,
                    studentName,
                    lessonTime,
                });
            }
        );
    }
);

Then(
    '{string} does not see other lessons in chain from deleted lesson',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `${role} does not see other lessons in chain from deleted lesson`,
            async function () {
                await assertNotSeeOtherLessonInChain(cms, scenario, studentName);
            }
        );
    }
);

Then(
    '{string} still sees other lessons in chain before deleted lesson',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        const lessonTime = scenario.get<LessonTimeValueType>(aliasLessonTime);

        await cms.instruction(`${role} change to tab future lessons list`, async function () {
            await chooseLessonTabOnLessonList({ cms, lessonTime });
        });

        await cms.instruction(
            `${role} still sees other lessons in chain before deleted lesson`,
            async function () {
                await searchLessonByStudentName({ cms, studentName, lessonTime });
                await waitForTableLessonRenderRows(cms, lessonTime);
            }
        );
    }
);
