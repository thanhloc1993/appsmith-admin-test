import { Then, When } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { aliasLessonId } from './alias-keys/lesson';
import {
    assertMaterialAtLessonDetail,
    teacherGoToLessonDetailOfLessonManagementOnTeacherApp,
} from './lesson-edit-lesson-of-lesson-management-material-definitions';
import {
    getCreatedLessonInfoOfLessonManagement,
    setupAliasForCreateLessonOfLessonManagement,
} from './lesson-management-utils';
import {
    appliedLocationByIdInCMS,
    teacherPreviewLessonMaterialsOnTeacherApp,
    teacherSeeMaterialsOnLessonDetailOnTeacherApp,
} from './lesson-preview-material-in-an-individual-lesson-definitions';
import { goToDetailedLessonInfoPage } from './lesson-teacher-submit-individual-lesson-report-definitions';
import { splitMaterialNameToMaterialArr } from './lesson-utils';
import { getCMSInterfaceByRole, getTeacherInterfaceFromRole } from './utils';
import {
    createIndividualLesson,
    LessonMaterialSingleType,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { previewMaterialFileOnCMS } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-preview-material-definitions';

When(
    'school admin creates a online future individual lesson with attached {string} on CMS',
    async function (this: IMasterWorld, materials: string) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        const setupAliasLesson = setupAliasForCreateLessonOfLessonManagement(scenarioContext);
        const { teacherNames, studentInfos } = setupAliasLesson;

        const materialNameArr = splitMaterialNameToMaterialArr(materials);
        await cms.instruction(
            'create a lesson with multiple materials by ui actions',
            async function () {
                await createIndividualLesson({
                    cms,
                    scenarioContext,
                    teacherNames,
                    studentInfos,
                    materials: materialNameArr,
                    lessonTime: 'future',
                });
            }
        );

        await cms.instruction(
            'school admin applies location which matches location of lesson',
            async function () {
                await appliedLocationByIdInCMS(cms, scenarioContext);
            }
        );
    }
);

Then(
    "school admin sees lesson's {string} in lesson detail of individual lesson screen on CMS",
    async function (this: IMasterWorld, material: LessonMaterialSingleType) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;
        const newLessonId = scenarioContext.get<string>(aliasLessonId);

        await cms.instruction('school admin to lesson info page', async function () {
            await goToDetailedLessonInfoPage(cms, newLessonId);
        });

        await cms.instruction('Assert material at lesson detail', async function () {
            await assertMaterialAtLessonDetail({ cms, scenario: scenarioContext, material });
        });
    }
);

Then(
    '{string} can see {string} material of the lesson page on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, materials: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);
        const materialNameArr = splitMaterialNameToMaterialArr(materials);

        await teacher.instruction(
            `${role} can see ${materials} of the lesson page on Teacher App`,
            async function () {
                await teacherGoToLessonDetailOfLessonManagementOnTeacherApp({
                    teacher,
                    ...lessonInfo,
                });
                await teacherSeeMaterialsOnLessonDetailOnTeacherApp({
                    teacher,
                    materialNameArr,
                    numberOfList: materialNameArr.length,
                    scenarioContext: scenario,
                });
            }
        );
    }
);

Then(
    '{string} can preview {string} material of the lesson page on Teacher App',
    async function (this: IMasterWorld, role: AccountRoles, materials: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenarioContext = this.scenario;
        const materialNameArr = splitMaterialNameToMaterialArr(materials);

        await teacher.instruction(
            `${role} can preview ${materials} material of the lesson on Teacher App`,
            async function () {
                await teacherPreviewLessonMaterialsOnTeacherApp({
                    teacher,
                    materialNameArr,
                    scenarioContext,
                });
            }
        );
    }
);

Then(
    'school admin can preview {string} material of lesson page detail on CMS',
    async function (this: IMasterWorld, materials: string) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenario = this.scenario;

        const materialNameArr = splitMaterialNameToMaterialArr(materials);

        for (const material of materialNameArr) {
            await cms.instruction(
                `school admin can preview lesson's ${material} file in lesson detail`,
                async function () {
                    await previewMaterialFileOnCMS(cms, scenario, material);
                }
            );
        }
    }
);
