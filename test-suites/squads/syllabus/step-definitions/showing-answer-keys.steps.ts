import { genId } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';
import { cmsExamForm } from 'test-suites/squads/syllabus/cms-locators/exam-form';
import {
    aliasExamInstruction,
    aliasExamLOName,
    aliasExamShowingAnswerKey,
    aliasTopicName,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { ShowingAnswerKey } from 'test-suites/squads/syllabus/step-definitions/cms-models/exam-lo-settings';
import { schoolAdminFillExamWithShowingAnswerKey } from 'test-suites/squads/syllabus/step-definitions/showing-answer-keys.definition';
import { schoolAdminSelectExamLOTypeAndOpenUpsertDialog } from 'test-suites/squads/syllabus/step-definitions/syllabus-exam-lo-create-definitions';
import { getRandomPollingOptionFromOptions } from 'test-suites/squads/syllabus/utils/common';

When(
    'school admin creates exam with showing answer keys setting is {string}',
    async function (options: string) {
        const showingAnswerKey = getRandomPollingOptionFromOptions(options) as ShowingAnswerKey;
        const id = genId();
        const name = `Exam ${id}`;
        const instruction = `Instruction ${id}`;
        const topicName = this.scenario.get(aliasTopicName);

        await this.cms.instruction(`School admin selects exam type in ${topicName}`, async () => {
            await schoolAdminSelectExamLOTypeAndOpenUpsertDialog(this.cms, topicName);
        });

        const showingAnswerKeyValue = await cmsExamForm.getShowingAnswerKeyLabel(
            this.cms.page!,
            showingAnswerKey
        );

        await this.cms.instruction(
            `School admin selects ${showingAnswerKeyValue} in showing answer keys setting`,
            async () => {
                await schoolAdminFillExamWithShowingAnswerKey(this.cms, {
                    name,
                    instruction,
                    showingAnswerKey,
                });
            }
        );

        await this.cms.instruction('School admin saves the exam', async () => {
            await this.cms.selectAButtonByAriaLabel('Save');
        });

        this.scenario.set(aliasExamLOName, name);
        this.scenario.set(aliasExamInstruction, instruction);
        this.scenario.set(aliasExamShowingAnswerKey, showingAnswerKeyValue);
    }
);

When(
    'school admin edits exam with showing answer keys setting is {string}',
    async function (options: string) {
        const showingAnswerKey = getRandomPollingOptionFromOptions(options) as ShowingAnswerKey;

        const showingAnswerKeyValue = await cmsExamForm.getShowingAnswerKeyLabel(
            this.cms.page!,
            showingAnswerKey
        );

        await this.cms.instruction(
            `School admin selects ${showingAnswerKeyValue} in showing answer keys setting`,
            async () => {
                await cmsExamForm.selectShowingAnswerKey(this.cms.page!, showingAnswerKey);
            }
        );

        await this.cms.instruction('School admin saves the exam', async () => {
            await this.cms.selectAButtonByAriaLabel('Save');
        });

        this.scenario.set(aliasExamShowingAnswerKey, showingAnswerKeyValue);
    }
);

Then('school admin sees the exam with showing answer keys setting in CMS', async function () {
    const showingAnswerKey = this.scenario.get(aliasExamShowingAnswerKey);

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction(
        `School admin sees showing answer keys setting is ${showingAnswerKey} in exam detail`,
        async () => {
            await cmsExamDetail.findShowingAnswerKey(this.cms, showingAnswerKey);
        }
    );
});
