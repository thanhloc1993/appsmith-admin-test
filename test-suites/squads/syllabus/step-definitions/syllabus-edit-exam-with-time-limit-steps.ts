import { convertOneOfStringTypeToArray, getRandomElement } from '@legacy-step-definitions/utils';

import { When } from '@cucumber/cucumber';

import { aliasExamLOTimeLimit } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { schoolAdminFillsTimeLimit } from 'test-suites/squads/syllabus/step-definitions/create-exam-with-time-limit-definitions';

When(
    'school admin edits exam with time limit setting is {string}',
    async function (options: string) {
        const timeLimit = getRandomElement(convertOneOfStringTypeToArray(options));

        await this.cms.instruction(
            `School admin ${
                timeLimit === 'null' ? 'leaves empty' : `fills ${timeLimit}`
            } in time limit`,
            async () => {
                await schoolAdminFillsTimeLimit(
                    this.cms,
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
