import { aliasLessonId, aliasLessonTime } from '@legacy-step-definitions/alias-keys/lesson';
import { goToLessonDetailByLessonIdOnLessonList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { setupAliasForCreateLessonOfLessonManagement } from '@legacy-step-definitions/lesson-management-utils';
import { splitMaterialNameToMaterialArr } from '@legacy-step-definitions/lesson-utils';
import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, Given } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import {
    assertLessonDetailHasMaterial,
    previewMaterialFileOnCMS,
} from './lesson-school-admin-preview-material-definitions';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import {
    createIndividualLesson,
    LessonMaterialSingleType,
} from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

Given(
    'school admin has created a lesson of lesson management with attached {string} on CMS',
    async function (this: IMasterWorld, materials: LessonMaterialSingleType) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        const setupAliasLesson = setupAliasForCreateLessonOfLessonManagement(scenarioContext);
        const { teacherNames, studentInfos } = setupAliasLesson;

        const materialNameArr = splitMaterialNameToMaterialArr(materials);
        await cms.instruction(
            `school admin has created a lesson of lesson management with ${materials} by ui actions`,
            async function () {
                await createIndividualLesson({
                    cms,
                    scenarioContext,
                    teacherNames,
                    studentInfos,
                    materials: materialNameArr,
                });
            }
        );
    }
);

Then(
    `school admin sees lesson's {string} in lesson detail of lesson management screen on CMS`,
    async function (this: IMasterWorld, material: LessonMaterialSingleType) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenario = this.scenario;

        const lessonId = scenario.get<string>(aliasLessonId);
        const lessonTime = scenario.get<LessonTimeValueType>(aliasLessonTime);
        const { name: studentName } = scenario.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            `school admin sees lesson's ${material} in lesson detail of lesson management screen on CMS`,
            async function () {
                await goToLessonDetailByLessonIdOnLessonList({
                    cms,
                    lessonId,
                    lessonTime,
                    studentName,
                });

                await assertLessonDetailHasMaterial(cms, material);
            }
        );
    }
);

Then(
    `school admin can preview lesson's {string} on CMS`,
    async function (this: IMasterWorld, material: LessonMaterialSingleType) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenario = this.scenario;

        await cms.instruction(
            `school admin can preview lesson's ${material} file in lesson detail`,
            async function () {
                await previewMaterialFileOnCMS(cms, scenario, material);
            }
        );
    }
);
