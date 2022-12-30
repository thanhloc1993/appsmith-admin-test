import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { learnerProfileAlias } from '@user-common/alias-keys/user';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasCourseId, aliasLessonId } from '../common/alias-keys';
import { LessonActionSaveType, LessonManagementLessonTime } from '../types/lesson-management';
import { MaterialFileState } from '../types/material';
import { setupAliasForCreateLessonOfLessonManagement } from '../utils/lesson-management';
import { createLessonByUI } from '../utils/lesson-upsert';
import {
    assertMaterialInLesson,
    assertMaterialInLiveLesson,
    convertToMaterialType,
    removeMaterials,
    uploadMaterials,
} from '../utils/materials';
import {
    createIndividualLesson,
    getStudentInfoByUserProfile,
} from './lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonTeachingMethod } from 'manabuf/common/v1/enums_pb';
import { getUsersFromContextByRegexKeys } from 'test-suites/common/step-definitions/user-common-definitions';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { LessonType, MethodSavingType } from 'test-suites/squads/lesson/common/types';
import { staffProfileAlias } from 'test-suites/squads/timesheet/common/alias-keys';
import { goToLiveLessonDetailOnTeacherApp } from 'test-suites/squads/virtual-classroom/utils/navigation';

Given(
    '{string} has created a {string} {string} {string} lesson in the {string} with attached {string}',
    { timeout: 300000 },
    async function (
        role: AccountRoles,
        lessonActionSave: LessonActionSaveType,
        recurringSetting: MethodSavingType,
        lessonType: LessonType,
        lessonTime: LessonManagementLessonTime,
        rawMaterial: string
    ) {
        const cms = getCMSInterfaceByRole(this, role);
        const scenarioContext = this.scenario;
        const materials = convertToMaterialType(rawMaterial);
        const teachingMethod =
            lessonType === 'individual'
                ? LessonTeachingMethod.LESSON_TEACHING_METHOD_INDIVIDUAL
                : LessonTeachingMethod.LESSON_TEACHING_METHOD_GROUP;
        const teachers = getUsersFromContextByRegexKeys(scenarioContext, staffProfileAlias) || [];
        const learners = getUsersFromContextByRegexKeys(scenarioContext, learnerProfileAlias) || [];
        const teacherNames = teachers.map((user) => user.name);
        const studentInfos = learners.map((learner) =>
            getStudentInfoByUserProfile(scenarioContext, learner)
        );
        await cms.instruction(
            `${role} has created a ${lessonActionSave} ${recurringSetting} ${lessonType} lesson in the ${lessonTime} with attached ${rawMaterial}`,
            async function () {
                await createLessonByUI({
                    cms,
                    scenarioContext,
                    lessonActionSave,
                    lessonTime,
                    materials,
                    teachingMedium: 'LESSON_TEACHING_MEDIUM_ONLINE',
                    teachingMethod,
                    recurringSetting,
                    teacherNames,
                    studentInfos,
                });
            }
        );
    }
);

When(
    '{string} adds {string} to the lesson',
    async function (role: AccountRoles, materials: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} adds ${materials} to the lesson`, async function () {
            await uploadMaterials({ cms, materials: convertToMaterialType(materials) });
        });
    }
);

When(
    '{string} removes {string} to the lesson',
    async function (role: AccountRoles, materials: string) {
        const cms = getCMSInterfaceByRole(this, role);
        await cms.instruction(`${role} removes ${materials} to the lesson`, async function () {
            await removeMaterials({ cms, materials: convertToMaterialType(materials) });
        });
    }
);

When(
    'school admin creates a lesson of lesson management with attached {string} on CMS',
    async function (material: string) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        const setupAliasLesson = setupAliasForCreateLessonOfLessonManagement(scenarioContext);
        const { teacherNames, studentInfos } = setupAliasLesson;

        await cms.instruction(
            `school admin has created a lesson of lesson management with ${material} by ui actions`,
            async function () {
                await createIndividualLesson({
                    cms,
                    scenarioContext,
                    teacherNames,
                    studentInfos,
                    materials: convertToMaterialType(material),
                });
            }
        );
    }
);

Then(
    '{string} {string} added {string} in lesson detail page on CMS',
    async function (role: AccountRoles, state: MaterialFileState, rawMaterial: string) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees added ${rawMaterial} in lesson detail page on CMS`,
            async function () {
                const materials = convertToMaterialType(rawMaterial);
                await assertMaterialInLesson({ cms, materials, state, org: 'MANABIE' });
            }
        );
    }
);

Then(
    '{string} {string} {string} material of the lesson page on Teacher App',
    async function (role: AccountRoles, state: MaterialFileState, rawMaterial: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const courseId = this.scenario.get(aliasCourseId);
        const lessonId = this.scenario.get(aliasLessonId);

        await teacher.instruction(
            `${role} ${state} ${rawMaterial} material of the lesson page on Teacher App`,
            async function () {
                const materials = convertToMaterialType(rawMaterial);
                await goToLiveLessonDetailOnTeacherApp({ teacher, courseId, lessonId });
                await assertMaterialInLiveLesson({ teacher, materials, state });
            }
        );
    }
);
