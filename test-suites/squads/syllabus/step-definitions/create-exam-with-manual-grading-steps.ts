import { getRandomPollingOptionFromOptions } from '@legacy-step-definitions/lesson-utils';
import { capitalizeFirstLetter, genId } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import {
    aliasExamInstruction,
    aliasExamLOName,
    aliasExamManualGrading,
    aliasTopicName,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import {
    ManualGrading,
    schoolAdminAssertManualGrading,
    schoolAdminFillExamWithManualGrading,
} from 'test-suites/squads/syllabus/step-definitions/create-exam-with-manual-grading-definitions';
import { schoolAdminSelectExamLOTypeAndOpenUpsertDialog } from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-create-definitions';
import { checkIsManualGradingEnabled } from 'test-suites/squads/syllabus/step-definitions/syllabus-migration-temp';

When(
    'school admin creates exam with manual grading setting is {string}',
    async function (options: string) {
        const state = getRandomPollingOptionFromOptions(options);
        const id = genId();
        const name = `Exam ${id}`;
        const instruction = `Instruction ${id}`;
        const manualGrading = state === ManualGrading.On;
        const topicName = this.scenario.get(aliasTopicName);
        const isManualGradingEnabled = await checkIsManualGradingEnabled();

        if (!isManualGradingEnabled) {
            return;
        }

        await this.cms.instruction(`School admin selects exam type in ${topicName}`, async () => {
            await schoolAdminSelectExamLOTypeAndOpenUpsertDialog(this.cms, topicName);
        });

        await this.cms.instruction(
            `School admin fills exam with grade to pass is ${state}`,
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
        this.scenario.set(aliasExamManualGrading, capitalizeFirstLetter(state));
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
        `School admin sees manual grading setting is ${manualGrading.toLowerCase()} in exam detail`,
        async () => {
            await schoolAdminAssertManualGrading(this.cms, manualGrading);
        }
    );
});
