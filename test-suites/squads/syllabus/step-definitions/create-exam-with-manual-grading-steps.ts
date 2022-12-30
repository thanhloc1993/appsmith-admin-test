import { genId } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';
import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import {
    aliasExamInstruction,
    aliasExamLOName,
    aliasExamManualGrading,
    aliasTopicName,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { ManualGrading } from 'test-suites/squads/syllabus/step-definitions/cms-models/exam-lo-settings';
import { schoolAdminFillExamWithManualGrading } from 'test-suites/squads/syllabus/step-definitions/create-exam-with-manual-grading-definitions';
import { schoolAdminSelectExamLOTypeAndOpenUpsertDialog } from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-create-definitions';
import { checkIsManualGradingEnabled } from 'test-suites/squads/syllabus/step-definitions/syllabus-migration-temp';
import { getRandomPollingOptionFromOptions } from 'test-suites/squads/syllabus/utils/common';

When(
    'school admin creates exam with manual grading setting is {string}',
    async function (options: string) {
        const manualGrading = getRandomPollingOptionFromOptions(options) as ManualGrading;
        const id = genId();
        const name = `Exam ${id}`;
        const instruction = `Instruction ${id}`;
        const topicName = this.scenario.get(aliasTopicName);
        const isManualGradingEnabled = await checkIsManualGradingEnabled();

        if (!isManualGradingEnabled) {
            return;
        }

        await this.cms.instruction(`School admin selects exam type in ${topicName}`, async () => {
            await schoolAdminSelectExamLOTypeAndOpenUpsertDialog(this.cms, topicName);
        });

        const manualGradingValue = await cmsExamForm.getManualGradingLabel(
            this.cms.page!,
            manualGrading
        );

        await this.cms.instruction(
            `School admin selects ${manualGradingValue} in manual grading setting`,
            async () => {
                await schoolAdminFillExamWithManualGrading(this.cms, {
                    name,
                    instruction,
                    manualGrading,
                });
            }
        );

        await this.cms.instruction('School admin saves the exam', async () => {
            await this.cms.selectAButtonByAriaLabel('Save');
        });

        this.scenario.set(aliasExamLOName, name);
        this.scenario.set(aliasExamInstruction, instruction);
        this.scenario.set(aliasExamManualGrading, manualGradingValue);
    }
);

Then('school admin sees the created exam with manual grading in CMS', async function () {
    const manualGrading = this.scenario.get(aliasExamManualGrading);
    const isManualGradingEnabled = await checkIsManualGradingEnabled();

    if (isManualGradingEnabled) {
        return;
    }

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction(
        `School admin sees manual grading setting is ${manualGrading} in exam detail`,
        async () => {
            await cmsExamDetail.findManualGrading(this.cms, manualGrading);
        }
    );
});
