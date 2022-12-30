import { Then } from '@cucumber/cucumber';

import { AccountRoles, IMasterWorld } from '@supports/app-types';

import { makeSureLessonHasNoMaterialOnTeacherApp } from './lesson-teacher-without-material-definitions';
import { getTeacherInterfaceFromRole } from './utils';
import { teacherGoToLessonDetailOfLessonManagementOnTeacherApp } from 'step-definitions/lesson-edit-lesson-of-lesson-management-material-definitions';
import { getCreatedLessonInfoOfLessonManagement } from 'step-definitions/lesson-management-utils';

Then(
    '{string} sees no material on Teacher App',
    { timeout: 30000 },
    async function (this: IMasterWorld, role: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, role);
        const scenario = this.scenario;

        const lessonInfo = getCreatedLessonInfoOfLessonManagement(scenario);

        await teacher.instruction(
            `${role} sees no material on Teacher App`,
            async function (teacher) {
                await teacherGoToLessonDetailOfLessonManagementOnTeacherApp({
                    teacher,
                    ...lessonInfo,
                });
                await makeSureLessonHasNoMaterialOnTeacherApp(teacher);
            }
        );
    }
);
