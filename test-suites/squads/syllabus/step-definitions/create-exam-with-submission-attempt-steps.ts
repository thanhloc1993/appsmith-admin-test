import { Given, Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { studentSeeAllowedAttempt } from './create-exam-with-submission-attempt-definitions';
import { schoolAdminSelectEditExamLO } from './syllabus-exam-lo-edit-definitions';
import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import { aliasExamLOMaximumAttempt } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

type EditExamLOSubmissionAttemptType = 'random from 1 to 99' | 'null' | '1' | '2' | '3';

Given(
    "school admin changes exam lo's submission attempt to {string}",
    async function (this: IMasterWorld, type: EditExamLOSubmissionAttemptType) {
        await this.cms.instruction(`school admin selects to edit the exam LO`, async () => {
            await schoolAdminSelectEditExamLO(this.cms);
        });

        let maximumAttempt: number | undefined = undefined;

        switch (type) {
            case 'random from 1 to 99':
                maximumAttempt = randomInteger(1, 99);
                break;
            case '1':
            case '2':
            case '3':
                maximumAttempt = Number(type);
                break;
            default:
                break;
        }

        await this.cms.instruction(
            `School admin ${
                type === 'null' ? 'leaves empty' : `fills ${maximumAttempt}`
            } in maximum attempt`,
            async () => {
                await cmsExamForm.fillSubmissionAttempt(
                    this.cms.page!,
                    type === 'null' ? undefined : Number(maximumAttempt)
                );
            }
        );

        await this.cms.instruction('School admin saves the exam', async () => {
            await this.cms.selectAButtonByAriaLabel('Save');
        });

        await this.cms.instruction(`School admin sees success msg`, async () => {
            await this.cms.assertNotification('You have updated learning objective successfully');
        });

        this.scenario.set<number | undefined>(aliasExamLOMaximumAttempt, maximumAttempt);
    }
);

Then(
    "student sees exam lo's allowed attempt with matched setting",
    async function (this: IMasterWorld) {
        const maximumAttempt = this.scenario.get<number | undefined>(aliasExamLOMaximumAttempt);

        await this.learner.instruction(
            `student sees exam lo's allowed attempt ${
                maximumAttempt === undefined ? 'not appear' : `is ${maximumAttempt}`
            } minute`,
            async () => {
                await studentSeeAllowedAttempt(this.learner, maximumAttempt);
            }
        );
    }
);
