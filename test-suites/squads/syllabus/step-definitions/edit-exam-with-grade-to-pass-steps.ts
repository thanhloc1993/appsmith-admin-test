import { getRandomPollingOptionFromOptions } from '@legacy-step-definitions/lesson-utils';

import { When } from '@cucumber/cucumber';

import { aliasExamGradeToPass } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { schoolAdminFillGradeToPass } from 'test-suites/squads/syllabus/step-definitions/create-exam-with-grade-to-pass-definitions';
import { checkIsGradeToPassEnabled } from 'test-suites/squads/syllabus/step-definitions/syllabus-migration-temp';

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
                await schoolAdminFillGradeToPass(
                    this.cms,
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
