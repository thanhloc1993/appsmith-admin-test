import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getUserProfileFromContext } from 'test-suites/common/step-definitions/user-common-definitions';
import { getCMSInterfaceByRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    aliasClassName,
    aliasCourseName,
    aliasLessonId,
    aliasLocationName,
} from 'test-suites/squads/lesson/common/alias-keys';
import { LessonTimeValueType, MethodSavingType } from 'test-suites/squads/lesson/common/types';
import {
    createSampleStudentWithPackage,
    createStudentPackage,
    getLocation,
} from 'test-suites/squads/lesson/services/student-service/student-service';
import { CourseDuration } from 'test-suites/squads/lesson/services/student-service/types';
import {
    createStudentWithAvailablePackage,
    fillLessonDateByCourseDuration,
    fillLessonForAutoAllocate,
} from 'test-suites/squads/lesson/step-definitions/auto-allocate-student-to-the-lesson-has-been-create-before-that-definitions';
import {
    saveLessonUpsertWithCacheLessonId,
    selectTeachingMethod,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonActionSaveType } from 'test-suites/squads/lesson/types/lesson-management';
import {
    assertStudentInLessonDetailByName,
    assertStudentInLessonUpsertByName,
    goToLessonDetailByLessonId,
} from 'test-suites/squads/lesson/utils/lesson-detail';
import {
    selectCenterByNameV3,
    selectClassByNameV3,
    selectCourseByNameV3,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a new {string} with course and class during {string}',
    async function (role: AccountRoles, studentRole: AccountRoles, courseDuration: CourseDuration) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a new ${studentRole} with course and class during ${courseDuration}`,
            async function () {
                await createSampleStudentWithPackage({
                    cms,
                    scenarioContext,
                    studentRole,
                    courseDuration,
                });
            }
        );
    }
);

When(
    '{string} fills lesson date so that {string}',
    async function (role: AccountRoles, courseDuration: CourseDuration) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} fills lesson date so that ${courseDuration}`,
            async function () {
                await fillLessonDateByCourseDuration({
                    cms,
                    scenarioContext,
                    courseDuration,
                });
            }
        );
    }
);

When('{string} fills location and course', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;

    const locationName = scenarioContext.get(aliasLocationName);
    const courseName = scenarioContext.get(aliasCourseName);

    await cms.instruction(`${role} fills location and course`, async function () {
        await selectTeachingMethod(cms, 'LESSON_TEACHING_METHOD_GROUP');
        await selectCenterByNameV3(cms, locationName);
        await selectCourseByNameV3(cms, courseName);
    });
});

When(
    "{string} fills class which is the same as the student's class",
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const className = scenarioContext.get(aliasClassName);

        await cms.instruction(
            `${role} fills class which is the same as the student's class`,
            async function () {
                await selectClassByNameV3(cms, className);
            }
        );
    }
);

Then(
    "{string} sees added {string} to the lesson's student info",
    async function (role: AccountRoles, studentRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await cms.instruction(
            `${role} sees added ${studentRole} to the lesson's student info`,
            async function () {
                await assertStudentInLessonUpsertByName({ cms, studentName });
            }
        );
    }
);

Given(
    '{string} has created course and imported class for the course',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created course and imported class for the course`,
            async function () {
                const { locationId } = await getLocation({ cms, scenarioContext });
                await createStudentPackage({ cms, scenarioContext, locationId });
            }
        );
    }
);

Given(
    '{string} has created a {string} {string} group lesson in {string} without student',
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        lessonMethodSaving: MethodSavingType,
        lessonTime: LessonTimeValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const locationName = scenarioContext.get(aliasLocationName);
        const courseName = scenarioContext.get(aliasCourseName);
        const className = scenarioContext.get(aliasClassName);

        await cms.instruction(
            `${role} has created a ${lessonActionSave} ${lessonMethodSaving} group lesson in ${lessonTime} without student`,
            async function () {
                await fillLessonForAutoAllocate({
                    cms,
                    lessonTime,
                    scenarioContext,
                    locationName,
                    courseName,
                    className,
                    lessonMethodSaving,
                });

                await saveLessonUpsertWithCacheLessonId(cms, lessonActionSave, scenarioContext);
            }
        );
    }
);

Given(
    '{string} has created a new {string} with available course and class during {string}',
    async function (role: AccountRoles, studentRole: AccountRoles, courseDuration: CourseDuration) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a new ${studentRole} with available course and class during ${courseDuration}`,
            async function () {
                await createStudentWithAvailablePackage({
                    cms,
                    scenarioContext,
                    studentRole,
                    courseDuration,
                });
            }
        );
    }
);

When('{string} goes to detailed lesson info page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;
    const lessonId = scenarioContext.get(aliasLessonId);

    await cms.instruction(`${role} goes to detailed lesson info page`, async function () {
        await goToLessonDetailByLessonId({ cms, lessonId });
    });
});

Then(
    '{string} sees added newly {string} in lesson detail page',
    async function (role: AccountRoles, studentRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        const { name: studentName } = getUserProfileFromContext(
            scenarioContext,
            learnerProfileAliasWithAccountRoleSuffix(studentRole)
        );

        await cms.instruction(
            `${role} sees added newly ${studentRole} in lesson detail page`,
            async function () {
                await assertStudentInLessonDetailByName({ cms, studentName });
            }
        );
    }
);
