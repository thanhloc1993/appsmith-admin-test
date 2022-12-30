import {
    learnerProfileAlias,
    learnerProfileAliasWithAccountRoleSuffix,
} from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { goToLessonsList } from './lesson-delete-lesson-of-lesson-management-definitions';
import {
    compareFieldOfLessonData,
    compare2LessonData,
    LessonManagementLessonData,
    updateFieldOfLesson,
    getLessonDataOnLessonDetailPage,
    assertStudentOnStudentListOfCourseOnTeacherApp,
    getUserProfileAliasByRole,
} from './lesson-edit-lesson-by-updating-and-adding-definitions';
import { userIsOnLessonDetailPage } from './lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import {
    getCMSInterfaceByRole,
    getTeacherInterfaceFromRole,
    getUserProfileFromContext,
    getUsersFromContextByRegexKeys,
    pick1stElement,
} from './utils';
import { delay } from 'flutter-driver-x';
import {
    aliasCourseId,
    aliasCourseIdByStudent,
    aliasLessonData,
    aliasLessonId,
} from 'step-definitions/alias-keys/lesson';
import {
    assertAlertMessageLessonUpsertRequiredField,
    assertSeeLessonOnCMS,
    assertToSeeTheLessonOnTeacherApp,
    changeLessonTimeToEndOfDay,
    changeLessonTimeToMorning,
    clearLessonField,
    isOnLessonUpsertDialog,
    saveUpdateLessonOfLessonManagement,
    selectStudentSubscription,
    selectTeacher,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import {
    LessonManagementLessonTime,
    LessonUpsertFields,
} from 'test-suites/squads/lesson/types/lesson-management';
import {
    changeLessonDateToTomorrow,
    changeLessonDateToYesterday,
} from 'test-suites/squads/lesson/utils/lesson-management';

When(
    '{string} updates lesson date to the previous date of yesterday',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} changes lesson date to yesterday`, async function () {
            await changeLessonDateToYesterday(cms, 2);
        });
    }
);

When(
    '{string} updates start & end time before 11:55 PM',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} changes lesson time from 11:45 PM to 11:55 PM`,
            async function () {
                await changeLessonTimeToEndOfDay(cms);
            }
        );
    }
);

When(
    '{string} saves the changes of the lesson',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} saves the changes of lesson`, async function () {
            await saveUpdateLessonOfLessonManagement(cms);
        });
    }
);

Then(
    '{string} sees updated lesson on CMS',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const previousLessonData: LessonManagementLessonData = scenario.get(aliasLessonData);

        await cms.instruction(`${role} sees updated lesson on CMS`, async function () {
            await userIsOnLessonDetailPage(cms);
            await delay(1000); //Wait for refetch lesson detail

            await compare2LessonData({
                cms,
                dataIsCompared: previousLessonData,
                shouldMatch: false,
            });
        });
    }
);

Then(
    '{string} sees lesson moved to {string} lessons list page',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const lessonId = scenario.get(aliasLessonId);
        const students = getUsersFromContextByRegexKeys(scenario, learnerProfileAlias);
        const nameOf1stStudent = pick1stElement(students)?.name;

        await cms.instruction(
            `${role} sees the lesson on ${lessonTime} lesson list page`,
            async function () {
                if (!nameOf1stStudent) throw new Error('Can not find student name');

                await goToLessonsList(cms, lessonTime);
                await assertSeeLessonOnCMS({ cms, lessonId, studentName: nameOf1stStudent });
                return;
            }
        );
    }
);

When(
    '{string} updates lesson date to the next date of tomorrow',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} updates lesson date to the next date of tomorrow`,
            async function () {
                await changeLessonDateToTomorrow(cms, 2);
            }
        );
    }
);

When(
    '{string} updates start & end time from 7AM to 9AM',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} updates date to the next date`, async function () {
            await changeLessonTimeToMorning(cms);
        });
    }
);

Then(
    '{string} sees lesson still in {string} lessons list page',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const lessonId = scenario.get(aliasLessonId);
        const students = getUsersFromContextByRegexKeys(scenario, learnerProfileAlias);
        const nameOf1stStudent = pick1stElement(students)?.name;

        await cms.instruction(
            `${role} sees lesson still in ${lessonTime} lesson list page`,
            async function () {
                if (!nameOf1stStudent) throw new Error('Can not find student name');

                await goToLessonsList(cms, lessonTime);
                await assertSeeLessonOnCMS({ cms, lessonId, studentName: nameOf1stStudent });
                return;
            }
        );
    }
);

When(
    '{string} updates {string} of lesson',
    async function (this: IMasterWorld, role: AccountRoles, lessonField: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} updates ${lessonField} of lesson`, async function () {
            await updateFieldOfLesson(cms, lessonField);
        });
    }
);

Then(
    "{string} sees updated lesson's {string}",
    async function (this: IMasterWorld, role: AccountRoles, lessonField: LessonUpsertFields) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const previousLessonData: LessonManagementLessonData = scenario.get(aliasLessonData);

        await cms.instruction(`${role} sees updated lesson's ${lessonField}`, async function () {
            await userIsOnLessonDetailPage(cms);
            await delay(1000); //Wait for refetch lesson detail

            await compareFieldOfLessonData({
                cms,
                dataIsCompared: previousLessonData,
                lessonField,
                shouldMatch: false,
            });
        });
    }
);

When(
    '{string} adds {string} into the lesson',
    async function (this: IMasterWorld, role: AccountRoles, secondRole: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const { isTeacher, profileAlias } = getUserProfileAliasByRole(secondRole);

        const { name: userName, id: userId } = getUserProfileFromContext(scenario, profileAlias);

        await cms.instruction(`${role} adds ${secondRole} into the lesson`, async function () {
            if (isTeacher) {
                await selectTeacher(cms, userName);
                return;
            }

            const courseId = scenario.get(aliasCourseIdByStudent(userId));

            await selectStudentSubscription({
                cms,
                studentName: userName,
                studentSubscriptionId: `${userId}_${courseId}`,
            });
        });
    }
);

Given(
    '{string} has added {string} into the lesson',
    async function (this: IMasterWorld, role: AccountRoles, secondRole: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const { isTeacher, profileAlias } = getUserProfileAliasByRole(secondRole);

        const { name: userName, id: userId } = getUserProfileFromContext(scenario, profileAlias);

        await cms.instruction(`${role} adds ${secondRole} into the lesson`, async function () {
            if (isTeacher) {
                await selectTeacher(cms, userName);
                return;
            }

            const courseId = scenario.get(aliasCourseIdByStudent(userId));

            await selectStudentSubscription({
                cms,
                studentName: userName,
                studentSubscriptionId: `${userId}_${courseId}`,
            });
        });
    }
);

Then(
    '{string} sees added {string} in detailed lesson info page on CMS',
    async function (this: IMasterWorld, role: AccountRoles, secondRole: AccountRoles) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        const { isTeacher, profileAlias } = getUserProfileAliasByRole(secondRole);

        const { name: userName } = getUserProfileFromContext(scenario, profileAlias);
        const { teacherNames, studentNames } = await getLessonDataOnLessonDetailPage(cms);
        const desireNameNotContainUsername = isTeacher ? teacherNames : studentNames;

        await cms.instruction(
            `${role} sees added ${secondRole} in detailed lesson info page on CMS`,
            async function () {
                weExpect(desireNameNotContainUsername).toContain(userName);
            }
        );
    }
);

Then(
    '{string} sees the {string} lesson on Teacher App',
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
    '{string} sees added {string} in student list of {string} lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        studentRole: AccountRoles,
        lessonTime: LessonManagementLessonTime
    ) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);

        const courseId = scenario.get(aliasCourseId);
        const lessonId = scenario.get(aliasLessonId);
        const { id: studentId } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await teacher.instruction(
            `${role} sees added ${studentRole} in student list on Teacher App`,
            async function () {
                await assertStudentOnStudentListOfCourseOnTeacherApp({
                    teacher,
                    courseId,
                    lessonId,
                    studentId,
                    lessonTime,
                });
            }
        );
    }
);

When(
    '{string} clears {string} value of the lesson',
    async function (this: IMasterWorld, role: AccountRoles, lessonField: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} clears ${lessonField} value of the lesson`,
            async function () {
                await clearLessonField(cms, lessonField);
            }
        );
    }
);

Then(
    '{string} sees alert message in {string} area in editing lesson page',
    async function (this: IMasterWorld, role: AccountRoles, lessonField: LessonUpsertFields) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees alert message in ${lessonField} area in editing lesson page`,
            async function () {
                await assertAlertMessageLessonUpsertRequiredField(cms, lessonField);
            }
        );
    }
);

Then(
    '{string} is still in editing lesson page',
    async function (this: IMasterWorld, role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} is still in editing lesson page`, async function () {
            await isOnLessonUpsertDialog(cms);
        });
    }
);
