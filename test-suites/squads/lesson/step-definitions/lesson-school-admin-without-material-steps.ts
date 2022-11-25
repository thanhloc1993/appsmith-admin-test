import { goToLessonDetailByLessonIdOnLessonList } from '@legacy-step-definitions/lesson-delete-lesson-of-lesson-management-definitions';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';

import { setupAliasForCreateLessonOfLessonManagement } from 'step-definitions/lesson-management-utils';
import { aliasLessonId, aliasLessonTime } from 'test-suites/squads/lesson/common/alias-keys';
import { LessonTimeValueType } from 'test-suites/squads/lesson/common/types';
import { createIndividualLesson } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';
import { makeSureLessonDetailHasNoMaterial } from 'test-suites/squads/lesson/step-definitions/lesson-school-admin-without-material-definitions';

When('school admin creates a lesson without material on CMS', async function (this: IMasterWorld) {
    const cms = this.cms;
    const scenarioContext = this.scenario;

    const setupAliasLesson = setupAliasForCreateLessonOfLessonManagement(scenarioContext);
    const { teacherNames, studentInfos } = setupAliasLesson;

    await cms.instruction('create a lesson without material by ui actions', async function () {
        await createIndividualLesson({
            cms,
            scenarioContext,
            teacherNames,
            studentInfos,
        });
    });
});

Then(
    'school admin sees no material in lesson detail screen on CMS',
    async function (this: IMasterWorld) {
        const cms = this.cms;
        const scenario = this.scenario;

        const lessonId = scenario.get<string>(aliasLessonId);
        const lessonTime = scenario.get<LessonTimeValueType>(aliasLessonTime);
        const { name: studentName } = scenario.get<UserProfileEntity>(
            learnerProfileAliasWithAccountRoleSuffix('student')
        );

        await cms.instruction(
            'school admin view lesson detail and see no material',
            async function () {
                await goToLessonDetailByLessonIdOnLessonList({
                    cms,
                    lessonId,
                    lessonTime,
                    studentName,
                });

                await makeSureLessonDetailHasNoMaterial(cms);
            }
        );
    }
);
