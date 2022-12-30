import { Then } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import { aliasCourseId, aliasLessonId } from 'test-suites/squads/lesson/common/alias-keys';
import { ActionCanSee, LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { assertLessonWithMaterialOnTeacherApp } from 'test-suites/squads/lesson/step-definitions/school-admin-edits-material-of-the-one-time-group-lesson-definitions';
import { MaterialFileState } from 'test-suites/squads/lesson/types/material';
import { convertToMaterialType } from 'test-suites/squads/lesson/utils/materials';

Then(
    '{string} can {string} the {string} lesson and {string} {string} on Teacher App',
    async function (
        role: AccountRoles,
        state: ActionCanSee,
        lessonTime: LessonTimeValueType,
        materialState: MaterialFileState,
        rawMaterial: string
    ) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        const courseId = this.scenario.get(aliasCourseId);
        const lessonId = this.scenario.get(aliasLessonId);

        const materials = convertToMaterialType(rawMaterial);

        await teacher.instruction(
            `${role} ${state} the ${lessonTime} lesson with ${rawMaterial} on Teacher App`,
            async function () {
                await assertLessonWithMaterialOnTeacherApp({
                    teacher,
                    courseId,
                    lessonId,
                    lessonTime,
                    materialState,
                    materials,
                    state,
                });
            }
        );
    }
);
