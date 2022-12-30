import { genId } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';
import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import {
    aliasExamGradeToPass,
    aliasExamInstruction,
    aliasExamLOName,
    aliasTopicName,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { schoolAdminFillExamWithGradeToPass } from 'test-suites/squads/syllabus/step-definitions/create-exam-with-grade-to-pass-definitions';
import { schoolAdminSelectExamLOTypeAndOpenUpsertDialog } from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-create-definitions';
import { checkIsGradeToPassEnabled } from 'test-suites/squads/syllabus/step-definitions/syllabus-migration-temp';
import { getRandomPollingOptionFromOptions } from 'test-suites/squads/syllabus/utils/common';

When(
    'school admin creates exam with grade to pass setting is {string}',
    async function (options: string) {
        const gradeToPass = getRandomPollingOptionFromOptions(options);
        const id = genId();
        const name = `Exam ${id}`;
        const instruction = `Instruction ${id}`;
        const topicName = this.scenario.get(aliasTopicName);
        const isGradeToPassEnabled = await checkIsGradeToPassEnabled();

        if (!isGradeToPassEnabled) {
            return;
        }

        await this.cms.instruction(`School admin selects exam type in ${topicName}`, async () => {
            await schoolAdminSelectExamLOTypeAndOpenUpsertDialog(this.cms, topicName);
        });

        await this.cms.instruction(
            `School admin fills the exam with grade to pass is ${gradeToPass}`,
            async () => {
                await schoolAdminFillExamWithGradeToPass(this.cms, {
                    name,
                    instruction,
                    gradeToPass: gradeToPass === 'null' ? undefined : Number(gradeToPass),
                });
            }
        );

        await this.cms.instruction('School admin saves the exam', async () => {
            await this.cms.selectAButtonByAriaLabel('Save');
        });

        this.scenario.set(aliasExamLOName, name);
        this.scenario.set(aliasExamInstruction, instruction);
        this.scenario.set(aliasExamGradeToPass, gradeToPass);
    }
);

Then('school admin sees exam detail with grade to pass in CMS', async function () {
    const gradeToPass = this.scenario.get(aliasExamGradeToPass);
    const isGradeToPassEnabled = await checkIsGradeToPassEnabled();

    if (!isGradeToPassEnabled) {
        return;
    }

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction(
        `School admin sees grade to pass is ${gradeToPass === 'null' ? '--' : gradeToPass}`,
        async () => {
            await cmsExamDetail.findGradeToPass(
                this.cms,
                gradeToPass === 'null' ? undefined : Number(gradeToPass)
            );
        }
    );
});

Then('school admin sees error message under grade to pass input field', async function () {
    const isGradeToPassEnabled = await checkIsGradeToPassEnabled();
    const message = 'The number must be an integer between 1 and 99999';

    if (!isGradeToPassEnabled) {
        return;
    }

    await this.cms.instruction(`School admin sees error message: ${message}`, async () => {
        await cmsExamForm.findValidationError(this.cms, message);
    });
});
