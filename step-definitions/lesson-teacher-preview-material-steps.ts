import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import {
    teacherPreviewLessonMaterialOnTeacherApp,
    teacherSeeMaterialOnLessonDetailOnTeacherApp,
} from './lesson-teacher-preview-material-definitions';
import { getTeacherInterfaceFromRole } from './utils';
import { teacherGoToLessonDetailOfLessonManagementOnTeacherApp } from 'step-definitions/lesson-edit-lesson-of-lesson-management-material-definitions';
import { getCreatedLessonInfoOfLessonManagement } from 'step-definitions/lesson-management-utils';
import { aliasMaterialName } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonMaterialSingleType } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

Then(
    "{string} sees lesson's {string} material on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialSingleType) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);
        const materialName = scenario.get(aliasMaterialName[material]);

        await teacher.instruction(
            `${role} sees material ${material} on Teacher App`,
            async function () {
                await teacherGoToLessonDetailOfLessonManagementOnTeacherApp({
                    teacher,
                    ...lessonInfo,
                });

                await teacherSeeMaterialOnLessonDetailOnTeacherApp(teacher, materialName);
            }
        );
    }
);

Then(
    "{string} can preview lesson's {string} material on Teacher App",
    async function (this: IMasterWorld, role: AccountRoles, material: LessonMaterialSingleType) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const materialName = this.scenario.get(aliasMaterialName[material]);

        await teacher.instruction(
            `${role} previews lesson ${material} on Teacher App`,
            async function () {
                await teacherPreviewLessonMaterialOnTeacherApp(teacher, material, materialName);
            }
        );
    }
);
