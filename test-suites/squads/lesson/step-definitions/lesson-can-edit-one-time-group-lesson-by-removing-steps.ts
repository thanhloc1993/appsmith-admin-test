import { getCMSInterfaceByRole, getTeacherInterfaceFromRole } from '@legacy-step-definitions/utils';
import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasLessonId } from '../common/alias-keys';
import { chooseLessonTabOnLessonList } from '../utils/lesson-list';
import {
    removeStudentFromLesson,
    removeTeacherFromLesson,
    searchTeacherV3,
    selectTeacher,
} from '../utils/lesson-upsert';
import {
    goToLessonDetailByLessonIdOnLessonList,
    userIsOnLessonDetailPage,
} from '../utils/navigation';
import {
    assertClassIsBlank,
    assertStudentExistInStudentListOnTeacherApp,
    assertStudentNameExistInLessonDetailPageOnCMS,
    assertTeacherNameExistInLessonDetailPageOnCMS,
    removeClass,
} from './lesson-can-edit-one-time-group-lesson-by-removing-definitions';
import { selectStudentSubscriptionV2 } from './lesson-create-an-individual-lesson-definitions';
import { assertSeeLessonOnCMS } from './lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    getStaffNameFromContext,
    getStudentNameFromContext,
    getUserIdFromRole,
    getUsersFromContextByRegexKeys,
} from 'test-suites/common/step-definitions/user-common-definitions';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';

Given(
    '{string} has gone to detailed the newly {string} lesson info page',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);
        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUsersFromContextByRegexKeys(
            scenario,
            learnerProfileAlias
        )[0];

        await cms.instruction(
            `${role} go to the new ${lessonTime} lesson detail`,
            async function () {
                await goToLessonDetailByLessonIdOnLessonList({
                    cms,
                    lessonTime,
                    lessonId,
                    studentName,
                });
            }
        );
    }
);

When(
    '{string} adds teacher {string} in lesson page on CMS',
    async function (adminRole: AccountRoles, teacherRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, adminRole);
        const teacherName = getStaffNameFromContext(this.scenario, teacherRole);
        await cms.instruction(
            `${adminRole} adds teacher ${teacherRole} in lesson page on CMS`,
            async function () {
                await searchTeacherV3(cms, teacherName);
                await selectTeacher(cms, teacherName);
            }
        );
    }
);

When(
    '{string} removes teacher {string} in lesson page on CMS',
    async function (adminRole: AccountRoles, teacherRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, adminRole);
        const teacherName = getStaffNameFromContext(this.scenario, teacherRole);
        await cms.instruction(
            `${adminRole} removes teacher ${teacherRole} in lesson page on CMS`,
            async function () {
                await removeTeacherFromLesson(cms, teacherName);
            }
        );
    }
);

When(
    '{string} adds student {string} in lesson page on CMS',
    { timeout: 120000 },
    async function (adminRole: AccountRoles, learnerRole: AccountRoles) {
        const scenarioContext = this!.scenario;
        const cms = getCMSInterfaceByRole(this, adminRole);
        const studentName = getStudentNameFromContext(scenarioContext, learnerRole);
        await cms.instruction(
            `${adminRole} adds ${learnerRole} in lesson page on CMS`,
            async function () {
                await selectStudentSubscriptionV2({ cms, studentName });
            }
        );
    }
);

When(
    '{string} removes student {string} in lesson page on CMS',
    async function (adminRole: AccountRoles, learnerRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, adminRole);
        const studentName = getStudentNameFromContext(this.scenario, learnerRole);
        await cms.instruction(
            `${adminRole} removes student ${learnerRole} in lesson page on CMS`,
            async function () {
                await removeStudentFromLesson(cms, studentName);
            }
        );
    }
);

Then(
    '{string} can {string} {string} in lesson detail page on CMS',
    async function (adminRole: AccountRoles, action: string, teacherRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, adminRole);
        const teacherName = getStaffNameFromContext(this.scenario, teacherRole);
        const exist = action === 'see';
        await cms.instruction(
            `${adminRole} can ${action} ${teacherRole} in lesson detail page on CMS`,
            async function () {
                await assertTeacherNameExistInLessonDetailPageOnCMS(cms, teacherName, exist);
            }
        );
    }
);

Then(
    '{string} can {string} {string} in student list in lesson detail page on CMS',
    async function (adminRole: AccountRoles, action: string, learnerRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, adminRole);
        const learnerName = getStudentNameFromContext(this.scenario, learnerRole);
        const exist = action === 'see';
        await cms.instruction(
            `${adminRole} can ${action} ${learnerRole} in student list in lesson detail page on CMS`,
            async function () {
                await assertStudentNameExistInLessonDetailPageOnCMS(cms, learnerName, exist);
            }
        );
    }
);

Then(
    '{string} can {string} {string} in student list on Teacher App',
    async function (teacherRole: AccountRoles, action: string, learnerRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const studentId = getUserIdFromRole(this.scenario, learnerRole);
        const exist = action === 'see';
        await teacher.instruction(
            `${teacherRole} can ${action} ${learnerRole} in student list on Teacher App`,
            async function () {
                await assertStudentExistInStudentListOnTeacherApp(teacher, studentId, exist);
            }
        );
    }
);

Then(
    '{string} does not see the {string} lesson on CMS',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenario = this.scenario;

        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUsersFromContextByRegexKeys(
            scenario,
            learnerProfileAlias
        )[0];

        await cms.instruction(
            `${role} does not see the ${lessonTime} lesson on CMS`,
            async function () {
                await chooseLessonTabOnLessonList({ cms, lessonTime });
                await assertSeeLessonOnCMS({
                    cms,
                    lessonId,
                    studentName,
                    shouldSeeLesson: false,
                    lessonTime,
                });
            }
        );
    }
);

Then(
    '{string} still sees the {string} lesson on CMS',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const lessonId = scenario.get(aliasLessonId);

        const { name: studentName } = getUsersFromContextByRegexKeys(
            scenario,
            learnerProfileAlias
        )[0];

        await cms.instruction(`${role} still sees the ${lessonTime} on CMS`, async function () {
            await goToLessonDetailByLessonIdOnLessonList({
                cms,
                lessonTime,
                lessonId,
                studentName,
            });
        });
    }
);

Then(
    '{string} is redirected to detailed lesson info page',
    {
        timeout: 100000,
    },
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(
            `${role} is redirected to detailed lesson info page`,
            async function () {
                await cms.waitingForLoadingIcon();
                await cms.waitForSkeletonLoading();
                await userIsOnLessonDetailPage(cms);
            }
        );
    }
);

When(
    '{string} removes class in lesson page on CMS',
    { timeout: 90000 },
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} removes class in lesson page on CMS`, async function () {
            await removeClass(cms);
        });
    }
);

When('{string} sees class field is blank', { timeout: 90000 }, async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);

    await cms.instruction(`${role} sees class field is blank`, async function () {
        await assertClassIsBlank(cms);
    });
});
