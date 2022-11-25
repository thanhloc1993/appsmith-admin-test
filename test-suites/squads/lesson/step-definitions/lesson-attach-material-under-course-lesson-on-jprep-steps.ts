import { getCMSInterfaceByRole } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { AccountRoles } from '@supports/app-types';

import { aliasStudentJPREP } from 'test-suites/squads/common/alias-keys/jprep';
import {
    createRandomCourseWithOnlineLessonJPREP,
    syncStudentWithCourseJPREP,
} from 'test-suites/squads/common/services/jprep-service/jprep-service';
import { LessonJPREP, UserKeyCloak } from 'test-suites/squads/common/services/jprep-service/types';
import { getTeacherInterfaceFromRole } from 'test-suites/squads/common/step-definitions/credential-account-definitions';
import {
    aliasCourseId,
    aliasCourseJPREP,
    aliasLessonId,
    aliasLessonJPREP,
} from 'test-suites/squads/lesson/common/alias-keys';
import {
    previewMaterialInLessonTabOfCourse,
    previewMaterialInLiveLesson,
    removeMaterialForJprepCourse,
    uploadMaterialForJprepCourse,
} from 'test-suites/squads/lesson/step-definitions/lesson-attach-material-under-course-lesson-on-jprep-definitions';
import { MaterialFileState } from 'test-suites/squads/lesson/types/material';
import {
    goToCourseByLinkOnCMS,
    goToLiveLessonOnTeacherApp,
} from 'test-suites/squads/lesson/utils/course';
import {
    assertMaterialInLessonTab,
    assertMaterialInLiveLesson,
    convertToMaterialType,
} from 'test-suites/squads/lesson/utils/materials';

Given('system has synced course with online lesson from partner', async function () {
    const cms = getCMSInterfaceByRole(this, 'school admin');
    const scenarioContext = this.scenario;

    await cms.instruction(
        'system has synced course with online lesson from partner',
        async function () {
            const { course, lesson } = await createRandomCourseWithOnlineLessonJPREP();

            scenarioContext.set(aliasCourseJPREP, course);
            scenarioContext.set(aliasLessonJPREP, lesson);

            scenarioContext.set(aliasCourseId, `JPREP_COURSE_${course.m_course_name_id}`);
            scenarioContext.set(aliasLessonId, `JPREP_LESSON_${lesson.m_lesson_id}`);
        }
    );
});

Given('system has synced course with student from partner', async function () {
    const cms = getCMSInterfaceByRole(this, 'school admin');
    const scenarioContext = this.scenario;

    await cms.instruction('system has synced course with student from partner', async function () {
        const studentJprep = scenarioContext.get<UserKeyCloak>(aliasStudentJPREP);
        const lessonJprep = scenarioContext.get<LessonJPREP>(aliasLessonJPREP);

        await syncStudentWithCourseJPREP({
            studentId: studentJprep.id,
            lessonId: lessonJprep.m_lesson_id,
        });
    });
});

Given('{string} has gone to detail course page', async function (role: AccountRoles) {
    const cms = getCMSInterfaceByRole(this, role);
    const scenarioContext = this.scenario;

    await cms.instruction(`${role} has gone to detail course page`, async function () {
        const courseId = scenarioContext.get(aliasCourseId);
        await goToCourseByLinkOnCMS({ cms, courseId });
    });
});

Given(
    'school admin has attached {string} under course lesson',
    { timeout: 90000 },
    async function (rawMaterial: string) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin has attached ${rawMaterial} under course lesson`,
            async function () {
                const materials = convertToMaterialType(rawMaterial);
                await uploadMaterialForJprepCourse({ cms, scenarioContext, materials });
            }
        );
    }
);

When(
    'school admin attaches {string} under course lesson',
    { timeout: 90000 },
    async function (rawMaterial: string) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        await cms.instruction(
            `school admin attaches ${rawMaterial} under course lesson`,
            async function () {
                const materials = convertToMaterialType(rawMaterial);
                await uploadMaterialForJprepCourse({ cms, scenarioContext, materials });
            }
        );
    }
);

Then(
    'school admin {string} {string} in material list under course lesson',
    async function (state: MaterialFileState, rawMaterial: string) {
        const cms = getCMSInterfaceByRole(this, 'school admin');

        await cms.instruction(
            `school admin edits lesson course by removing ${rawMaterial}`,
            async function () {
                const materials = convertToMaterialType(rawMaterial);
                await assertMaterialInLessonTab({ cms, materials, state });
            }
        );
    }
);

Then('school admin can preview {string} material on CMS', async function (rawMaterial: string) {
    const cms = getCMSInterfaceByRole(this, 'school admin');

    await cms.instruction(
        `school admin can preview ${rawMaterial} material on CMS`,
        async function () {
            const materials = convertToMaterialType(rawMaterial);
            await previewMaterialInLessonTabOfCourse({ cms, materials });
        }
    );
});

Then(
    '{string} goes to the live lesson on Teacher App Jprep',
    async function (teacherRole: AccountRoles) {
        const teacher = getTeacherInterfaceFromRole(this, teacherRole);
        const scenarioContext = this.scenario;

        await teacher.instruction(
            `${teacherRole} goes to the live lesson on Teacher App Jprep`,
            async function () {
                const courseId = scenarioContext.get(aliasCourseId);
                const lessonId = scenarioContext.get(aliasLessonId);

                await goToLiveLessonOnTeacherApp({ teacher, courseId, lessonId });
            }
        );
    }
);

Then(
    '{string} {string} {string} material of the lesson page on Teacher App Jprep',
    async function (role: AccountRoles, state: MaterialFileState, rawMaterial: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} ${state} ${rawMaterial} material of the lesson page on Teacher App Jprep`,
            async function () {
                const materials = convertToMaterialType(rawMaterial);
                await assertMaterialInLiveLesson({ teacher, materials, state });
            }
        );
    }
);

Then(
    '{string} can preview {string} material of the lesson page on Teacher App Jprep',
    async function (role: AccountRoles, rawMaterial: string) {
        const teacher = getTeacherInterfaceFromRole(this, role);

        await teacher.instruction(
            `${role} can preview ${rawMaterial} material of the lesson page on Teacher App Jprep`,
            async function () {
                const materials = convertToMaterialType(rawMaterial);
                await previewMaterialInLiveLesson({ teacher, materials });
            }
        );
    }
);

When('school admin edits lesson course by adding {string}', async function (rawMaterial: string) {
    const cms = getCMSInterfaceByRole(this, 'school admin');
    const scenarioContext = this.scenario;

    await cms.instruction(
        `school admin edits lesson course by adding ${rawMaterial}`,
        async function () {
            const materials = convertToMaterialType(rawMaterial);
            await uploadMaterialForJprepCourse({ cms, scenarioContext, materials });
        }
    );
});

When('school admin edits lesson course by removing {string}', async function (rawMaterial: string) {
    const cms = getCMSInterfaceByRole(this, 'school admin');

    await cms.instruction(
        `school admin edits lesson course by removing ${rawMaterial}`,
        async function () {
            const materials = convertToMaterialType(rawMaterial);
            await removeMaterialForJprepCourse({ cms, materials });
        }
    );
});
