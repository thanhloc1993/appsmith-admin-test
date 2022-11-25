import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    assertMaterialOnMaterialListOfLessonOnTeacherApp,
    assertMaterialAtLessonDetail,
    removeMaterialFromLesson,
    uploadMaterialForLesson,
} from './lesson-edit-lesson-of-lesson-management-material-definitions';
import { userIsOnLessonDetailPage } from './lesson-teacher-can-delete-individual-lesson-report-of-future-lesson-definitions';
import { getCMSInterfaceByRole, getTeacherInterfaceFromRole } from './utils';
import { getCreatedLessonInfoOfLessonManagement } from 'step-definitions/lesson-management-utils';
import { aliasMaterialName } from 'test-suites/squads/lesson/common/alias-keys';
import {
    LessonMaterialSingleType,
    saveUpdateLessonOfLessonManagement,
    submitLessonOfLessonManagementWithMaterials,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { LessonManagementLessonTime } from 'test-suites/squads/lesson/types/lesson-management';

When(
    '{string} adds file {string} to the lesson of lesson management on CMS',
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialSingleType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} adds file ${material} to the lesson`, async function () {
            await uploadMaterialForLesson(cms, scenario, material);
        });
    }
);

When(
    '{string} saves the lesson with file {string}',
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialSingleType) {
        const scenarioContext = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(`${role} submit the lesson with ${material}`, async function () {
            await submitLessonOfLessonManagementWithMaterials({
                cms,
                scenarioContext,
                materials: [material],
                mode: 'UPDATE',
            });
        });
    }
);

Then(
    '{string} sees added file {string} in the lesson on CMS',
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialSingleType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} sees added file ${material} in the lesson on CMS`,
            async function () {
                await userIsOnLessonDetailPage(cms);
                await assertMaterialAtLessonDetail({ cms, scenario, material });
            }
        );
    }
);

Then(
    '{string} sees added file {string} in {string} lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        material: LessonMaterialSingleType,
        lessonTime: LessonManagementLessonTime
    ) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);

        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);
        const materialName = scenario.get(aliasMaterialName[material]);

        await teacher.instruction(
            `${role} sees added file ${material} in ${lessonTime} lesson on Teacher App`,
            async function () {
                await assertMaterialOnMaterialListOfLessonOnTeacherApp({
                    ...lessonInfo,
                    teacher,
                    lessonTime,
                    materialName,
                });
            }
        );
    }
);

Given(
    '{string} has attached a pdf and a video in the lesson on CMS',
    async function (this: IMasterWorld, role: AccountRoles) {
        const scenarioContext = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} has attached a pdf and a video in the lesson on CMS`,
            async function () {
                const materials: LessonMaterialSingleType[] = ['pdf', 'video'];

                await uploadMaterialForLesson(cms, scenarioContext, materials);
                await submitLessonOfLessonManagementWithMaterials({
                    cms,
                    scenarioContext,
                    materials,
                    mode: 'UPDATE',
                });
            }
        );
    }
);

When(
    '{string} removes file {string} from the lesson on CMS',
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialSingleType) {
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} removes file ${material} from the lesson on CMS`,
            async function () {
                await removeMaterialFromLesson(cms, material);
                await saveUpdateLessonOfLessonManagement(cms);
            }
        );
    }
);

Then(
    '{string} does not see file {string} in the lesson on CMS',
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialSingleType) {
        const scenario = this.scenario;
        const cms = getCMSInterfaceByRole(this, role);

        await cms.instruction(
            `${role} does not see file ${material} in the lesson on CMS`,
            async function () {
                await assertMaterialAtLessonDetail({
                    cms,
                    material,
                    scenario,
                    shouldVisible: false,
                });
            }
        );
    }
);

Then(
    '{string} does not see file {string} in {string} lesson on Teacher App',
    async function (
        this: IMasterWorld,
        role: AccountRoles,
        material: LessonMaterialSingleType,
        lessonTime: LessonManagementLessonTime
    ) {
        const scenario = this.scenario;
        const teacher = getTeacherInterfaceFromRole(this, role);

        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);
        const materialName = scenario.get(aliasMaterialName[material]);

        await teacher.instruction(
            `${role} does not see file${material} in ${lessonTime} lesson on Teacher App`,
            async function () {
                await assertMaterialOnMaterialListOfLessonOnTeacherApp({
                    ...lessonInfo,
                    teacher,
                    lessonTime,
                    materialName,
                    shouldBeOnList: false,
                });
            }
        );
    }
);
