import { When } from '@cucumber/cucumber';

import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import { aliasExamGradeToPass } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { checkIsGradeToPassEnabled } from 'test-suites/squads/syllabus/step-definitions/syllabus-migration-temp';
import { getRandomPollingOptionFromOptions } from 'test-suites/squads/syllabus/utils/common';

When(
    'school admin edits exam with grade to pass setting is {string}',
    async function (options: string) {
        const gradeToPass = getRandomPollingOptionFromOptions(options);
        const isGradeToPassEnabled = await checkIsGradeToPassEnabled();

        if (!isGradeToPassEnabled) {
            return;
        }

        await this.cms.instruction(
            `School admin ${
                gradeToPass === 'null' ? 'leaves empty' : `fills ${gradeToPass}`
            } in grade to pass`,
            async () => {
                await cmsExamForm.fillGradeToPass(
                    this.cms.page!,
                    gradeToPass === 'null' ? undefined : Number(gradeToPass)
                );
            }
        );

        await this.cms.instruction('School admin saves the exam', async () => {
            await this.cms.selectAButtonByAriaLabel('Save');
        });

        this.scenario.set(aliasExamGradeToPass, gradeToPass);
    }
);
