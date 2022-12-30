import { Given } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { setupAliasForCreateLessonOfLessonManagement } from 'step-definitions/lesson-management-utils';
import { getCMSInterfaceByRole } from 'step-definitions/utils';
import { createIndividualLesson } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

Given(
    'school admin has created a lesson of lesson management with attached materials on CMS',
    { timeout: 300000 },
    async function (this: IMasterWorld) {
        const cms = getCMSInterfaceByRole(this, 'school admin');
        const scenarioContext = this.scenario;

        const setupAliasLesson = setupAliasForCreateLessonOfLessonManagement(scenarioContext);
        const { teacherNames, studentInfos } = setupAliasLesson;

        await cms.instruction(
            `create a lesson with multiple materials by ui actions`,
            async function () {
                await createIndividualLesson({
                    cms,
                    scenarioContext,
                    teacherNames,
                    studentInfos,
                    materials: ['pdf 1', 'pdf 2', 'video 1', 'video 2'],
                    lessonTime: 'future',
                });
            }
        );
    }
);
