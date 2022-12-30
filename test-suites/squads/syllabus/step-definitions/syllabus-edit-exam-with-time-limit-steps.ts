import { getRandomElement } from '@legacy-step-definitions/utils';

import { When } from '@cucumber/cucumber';

import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import { aliasExamLOTimeLimit } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { convertOneOfStringTypeToArray } from 'test-suites/squads/syllabus/utils/common';

When(
    'school admin edits exam with time limit setting is {string}',
    async function (options: string) {
        const timeLimit = getRandomElement(convertOneOfStringTypeToArray(options));

        await this.cms.instruction(
            `School admin ${
                timeLimit === 'null' ? 'leaves empty' : `fills ${timeLimit}`
            } in time limit`,
            async () => {
                await cmsExamForm.fillTimeLimit(
                    this.cms.page!,
                    timeLimit === 'null' ? undefined : Number(timeLimit)
                );
            }
        );

        await this.cms.instruction('School admin saves the exam', async () => {
            await this.cms.selectAButtonByAriaLabel('Save');
        });

        this.scenario.set(aliasExamLOTimeLimit, timeLimit);
    }
);
