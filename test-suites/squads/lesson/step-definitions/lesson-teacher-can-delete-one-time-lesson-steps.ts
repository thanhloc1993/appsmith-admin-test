import {
    aliasCourseIdByStudent,
    aliasLocationId,
} from '@legacy-step-definitions/alias-keys/lesson';
import { userIsOnLessonDetailPage } from '@legacy-step-definitions/lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import {
    getCMSInterfaceByRole,
    getLearnerInterfaceFromRole,
    getTeacherInterfaceFromRole,
    getUsersFromContextByRegexKeys,
} from '@legacy-step-definitions/utils';
import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import { CreateLessonRequestData } from '@supports/services/bob-lesson-management/bob-lesson-management-service';

import { getUserIdFromRole } from 'test-suites/common/step-definitions/user-common-definitions';
import { aliasLessonId, aliasStudentInfoList } from 'test-suites/squads/lesson/common/alias-keys';
import {
    LessonTimeValueType,
    ActionCanSee,
    LessonReportActionType,
} from 'test-suites/squads/lesson/common/types';
import { assertToSeeNewLessonOnLearnerApp } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    assertNewLessonAndStudentExistInStudentListOnTeacherApp,
    goToLessonDetailAndCancelDeleteLesson,
    goToLessonDetailAndSaveDraftReport,
    goToLessonDetailAndSaveReportWithAction,
    goToLessonListAndAssertLesson,
} from 'test-suites/squads/lesson/step-definitions/lesson-teacher-can-delete-one-time-lesson-definitions';
import { assertNewLessonOnTeacherApp } from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has saved draft the {string} individual lesson report',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cmsTeacher = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonId = scenarioContext.get(aliasLessonId);
        const { name: studentName, locations } = getUsersFromContextByRegexKeys(
            scenarioContext,
            learnerProfileAlias
        )[0];

        await cmsTeacher.instruction(
            `${role} has saved draft the ${lessonTime} individual lesson report`,
            async function () {
                await goToLessonDetailAndSaveDraftReport({
                    cms: cmsTeacher,
                    locationId: locations![0].locationId,
                    studentName,
                    lessonId,
                    lessonTime,
                });
            }
        );
    }
);

Given(
    '{string} has {string} the {string} individual lesson report',
    async function (
        role: AccountRoles,
        actionSaveLessonReport: LessonReportActionType,
        lessonTime: LessonTimeValueType
    ) {
        const cmsTeacher = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonId = scenarioContext.get(aliasLessonId);
        const { name: studentName, locations } = getUsersFromContextByRegexKeys(
            scenarioContext,
            learnerProfileAlias
        )[0];

        await cmsTeacher.instruction(
            `${role} has ${actionSaveLessonReport} the ${lessonTime} individual lesson report`,
            async function () {
                await goToLessonDetailAndSaveReportWithAction({
                    actionSaveLessonReport,
                    cms: cmsTeacher,
                    locationId: locations![0].locationId,
                    studentName,
                    lessonId,
                    lessonTime,
                });
            }
        );
    }
);

Then(
    '{string} can {string} the {string} one time individual lesson on CMS',
    async function (role: AccountRoles, action: ActionCanSee, lessonTime: LessonTimeValueType) {
        const cmsTeacher = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const lessonId = scenarioContext.get(aliasLessonId);
        const { name: studentName } = getUsersFromContextByRegexKeys(
            scenarioContext,
            learnerProfileAlias
        )[0];

        await cmsTeacher.instruction(
            `${role} can ${action} the ${lessonTime} one time individual lesson on CMS`,
            async function () {
                const shouldSeeLesson = action === 'see';
                await goToLessonListAndAssertLesson({
                    cms: cmsTeacher,
                    lessonId,
                    lessonTime,
                    studentName,
                    shouldSeeLesson,
                });
            }
        );
    }
);

Then(
    '{string} can {string} the {string} one time individual lesson on Teacher App',
    async function (role: AccountRoles, action: ActionCanSee, lessonTime: LessonTimeValueType) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenarioContext = this.scenario;

        const { locationId, courseId } =
            scenarioContext.get<CreateLessonRequestData['studentInfoListList']>(
                aliasStudentInfoList
            )[0];
        const lessonId = scenarioContext.get(aliasLessonId);

        await teacher.instruction(
            `${role} can ${action} the ${lessonTime} one time individual lesson on Teacher App`,
            async function () {
                const shouldDisplay = action === 'see';
                await assertNewLessonOnTeacherApp({
                    teacher,
                    lessonId,
                    courseId,
                    locationId,
                    lessonTime,
                    shouldDisplay,
                });
            }
        );
    }
);

Then(
    '{string} can {string} the {string} one time individual lesson on Learner App',
    async function name(role: AccountRoles, action: ActionCanSee, lessonTime: LessonTimeValueType) {
        const learner = getLearnerInterfaceFromRole(this, role);
        const lessonId = this.scenario.get(aliasLessonId);

        await learner.instruction(
            `${role} can ${action} the ${lessonTime} one time individual lesson on Learner App`,
            async function () {
                const shouldDisplay = action === 'see';
                await assertToSeeNewLessonOnLearnerApp(learner, lessonId, shouldDisplay);
            }
        );
    }
);

When(
    '{string} cancels deleting the {string} one time individual lesson',
    async function (role: AccountRoles, lessonTime: LessonTimeValueType) {
        const cmsTeacher = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const { name: studentName, locations } = getUsersFromContextByRegexKeys(
            scenarioContext,
            learnerProfileAlias
        )[0];
        const lessonId = scenarioContext.get(aliasLessonId);

        await cmsTeacher.instruction(
            `${role} cancels deleting the ${lessonTime} one time individual lesson`,
            async function () {
                await goToLessonDetailAndCancelDeleteLesson({
                    cms: cmsTeacher,
                    lessonId,
                    lessonTime,
                    studentName,
                    locationId: locations![0].locationId,
                });
            }
        );
    }
);

Then(
    '{string} is still in the detailed individual lesson info page',
    async function (role: AccountRoles) {
        const cmsTeacher = getCMSInterfaceByRole(this, role);

        await cmsTeacher.instruction(
            `${role} is still in the detailed individual lesson info page`,
            async function () {
                await userIsOnLessonDetailPage(cmsTeacher);
            }
        );
    }
);

Then(
    '{string} can {string} the {string} lesson and {string} {string} in student list on Teacher App',
    async function (
        role: AccountRoles,
        action: ActionCanSee,
        lessonTime: LessonTimeValueType,
        actionStudent: ActionCanSee,
        learnerRole: AccountRoles
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenarioContext = this.scenario;

        const studentInfo = scenarioContext.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix(learnerRole)
        );

        const courseId = scenarioContext.get(aliasCourseIdByStudent(studentInfo.id));

        const lessonId = scenarioContext.get(aliasLessonId);
        const locationId = scenarioContext.get(aliasLocationId);

        await teacher.instruction(
            `${role} can ${action} the ${lessonTime} one time individual lesson on Teacher App`,
            async function () {
                const shouldDisplay = action === 'see';
                const exist = actionStudent === 'see';
                const studentId = getUserIdFromRole(scenarioContext, learnerRole);

                await assertNewLessonAndStudentExistInStudentListOnTeacherApp({
                    teacher,
                    lessonId,
                    courseId,
                    locationId,
                    lessonTime,
                    shouldDisplay,
                    studentId,
                    exist,
                    role,
                    learnerRole,
                });
            }
        );
    }
);
