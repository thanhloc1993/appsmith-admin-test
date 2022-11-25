import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { LessonManagementLessonTime, TeachingMediumValueType } from '../types/lesson-management';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import {
    getStaffNameFromContext,
    getStudentNameFromContext,
    getUserProfileFromContext,
} from 'test-suites/common/step-definitions/user-common-definitions';
import {
    aliasCourseName,
    aliasClassName,
    aliasLocationName,
    aliasCourseId,
    aliasLocationId,
} from 'test-suites/squads/lesson/common/alias-keys';
import { secondClassNameSuffix } from 'test-suites/squads/lesson/common/constants';
import { importClass } from 'test-suites/squads/lesson/services/student-service/student-service';
import {
    assertUpdatedClass,
    assertUpdatedCourseAndClass,
    assertUpdatedLocationCourseClassAndStudent,
    updateCourseInGroupLesson,
} from 'test-suites/squads/lesson/step-definitions/can-edit-one-time-group-lesson-by-updating-and-adding-definitions';
import { addNewTeacherOrStudentToLesson } from 'test-suites/squads/lesson/step-definitions/can-edit-one-time-individual-lesson-by-updating-and-adding-definitions';
import {
    assertStudentNameExistInLessonDetailPageOnCMS,
    assertTeacherNameExistInLessonDetailPageOnCMS,
} from 'test-suites/squads/lesson/step-definitions/lesson-can-edit-one-time-group-lesson-by-removing-definitions';
import { changeCenter } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-edits-center-of-weekly-recurring-individual-lesson-definitions';
import { clearLessonFieldOfGroupLesson } from 'test-suites/squads/lesson/step-definitions/school-admin-edits-center-of-weekly-recurring-group-lesson-definitions';
import {
    createLessonWithGRPC,
    selectClassByNameV3,
    selectClassByNameV3GroupLesson,
    selectCourseByNameV3,
} from 'test-suites/squads/lesson/utils/lesson-upsert';

Given(
    '{string} has created a group lesson in the {string} with {string} teaching medium',
    async function (
        role: AccountRoles,
        lessonTime: LessonManagementLessonTime,
        teachingMedium: TeachingMediumValueType
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${role} has created a group lesson in the ${lessonTime} with ${teachingMedium} teaching medium`,
            async function () {
                await createLessonWithGRPC({
                    cms,
                    scenarioContext,
                    createLessonTime: lessonTime,
                    teachingMethod: LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP,
                    teachingMedium,
                });
            }
        );
    }
);

When(
    '{string} adds {string} and {string} to the lesson on CMS',
    async function (cmsRole: AccountRoles, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, cmsRole);
        const scenarioContext = this.scenario;

        await cms.instruction(
            `${cmsRole} adds ${teacherRole} and ${learnerRole} to the the lesson on CMS`,
            async function () {
                await addNewTeacherOrStudentToLesson(cms, scenarioContext, teacherRole);
                await addNewTeacherOrStudentToLesson(cms, scenarioContext, learnerRole);
            }
        );
    }
);

When(
    '{string} selects course in detailed lesson info page on CMS',
    async function (cmsRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, cmsRole);
        const courseName = this.scenario.get<string>(aliasCourseName);

        await cms.instruction(
            `${cmsRole} selects course in detailed lesson info page on CMS`,
            async function () {
                await selectCourseByNameV3(cms, courseName);
            }
        );
    }
);

When(
    '{string} selects class in detailed lesson info page on CMS',
    async function (cmsRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, cmsRole);
        const className = this.scenario.get<string>(aliasClassName);

        await cms.instruction(
            `${cmsRole} selects class in detailed lesson info page on CMS`,
            async function () {
                await selectClassByNameV3(cms, className);
            }
        );
    }
);

When('{string} edits Center of the group lesson', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenario = this.scenario;

    await cms.instruction(`${role} clear center`, async function () {
        await clearLessonFieldOfGroupLesson(cms, 'center');
    });

    await cms.instruction(`${role} edits Center of the group lesson`, async function () {
        await changeCenter(cms, scenario, role);
    });
});

When(
    '{string} updates course in detailed group lesson info page on CMS',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const context = this.scenario;
        await cms.instruction(
            `${role} updates course in detailed group lesson info page on CMS`,
            async function () {
                await updateCourseInGroupLesson(cms, context);
            }
        );
    }
);

When(
    '{string} updates class in detailed group lesson info page on CMS',
    async function (role: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, role);
        const courseId = this.scenario.get(aliasCourseId);
        const locationId = this.scenario.get(aliasLocationId);
        const className = this.scenario.get(aliasClassName);
        await cms.instruction(
            `${role} updates class in detailed group lesson info page on CMS`,
            async function () {
                await importClass({
                    cms,
                    courseId,
                    locationId,
                    className: `Class E2E ${courseId} ${secondClassNameSuffix}`,
                });
                await selectClassByNameV3GroupLesson(cms, `${className} ${secondClassNameSuffix}`);
            }
        );
    }
);

Then(
    '{string} sees added {string} and {string} in detailed lesson info page on CMS',
    async function (cmsRole: AccountRoles, teacherRole: AccountRoles, learnerRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, cmsRole);
        const scenarioContext = this.scenario;

        const teacherName = getStaffNameFromContext(scenarioContext, teacherRole);
        const learnerName = getStudentNameFromContext(scenarioContext, learnerRole);

        await cms.instruction(
            `${cmsRole} adds ${teacherRole} and ${learnerRole} to the the lesson on CMS`,
            async function () {
                await assertTeacherNameExistInLessonDetailPageOnCMS(cms, teacherName, true);
                await assertStudentNameExistInLessonDetailPageOnCMS(cms, learnerName, true);
            }
        );
    }
);

Then(
    '{string} sees updated location, course, class and student on CMS',
    async function (cmsRole: AccountRoles) {
        const cms = getCMSInterfaceByRole(this, cmsRole);
        const scenario = this.scenario;
        const locationName = scenario.get(aliasLocationName);
        const courseName = scenario.get(aliasCourseName);
        const className = scenario.get(aliasClassName);
        const { name: studentName } = getUserProfileFromContext(
            scenario,
            learnerProfileAliasWithAccountRoleSuffix('student S2')
        );

        await cms.instruction(
            `${cmsRole} sees updated location, course, class and student on CMS`,
            async function () {
                await assertUpdatedLocationCourseClassAndStudent(
                    cms,
                    courseName,
                    className,
                    locationName,
                    studentName
                );
            }
        );
    }
);

Then('{string} sees updated course and class on CMS', async function (cmsRole: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, cmsRole);
    const scenario = this.scenario;
    const courseName = scenario.get(aliasCourseName);
    const className = scenario.get(aliasClassName);

    await cms.instruction(`${cmsRole} sees updated course and class on CMS`, async function () {
        await assertUpdatedCourseAndClass(cms, courseName, className);
    });
});

Then('{string} sees updated class on CMS', async function (cmsRole: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, cmsRole);
    const scenario = this.scenario;
    const className = scenario.get(aliasClassName);

    await cms.instruction(`${cmsRole} sees updated course and class on CMS`, async function () {
        await assertUpdatedClass(cms, `${className} ${secondClassNameSuffix}`);
    });
});
