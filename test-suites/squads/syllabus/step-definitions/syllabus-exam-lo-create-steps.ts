import { genId, splitAndCombinationIntoArray } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { aliasExamInstruction, aliasExamLOName, aliasTopicName } from './alias-keys/syllabus';
import {
    ExamLODetail,
    ExamLOUpsertField,
    schoolAdminAssertExamDetail,
    schoolAdminCreateExamLO,
    schoolAdminSeeValidationErrorMessages,
    schoolAdminSelectExamLOTypeAndOpenUpsertDialog,
} from './syllabus-exam-lo-create-definitions';

When(
    'school admin creates an exam LO in book with {string}',
    async function (fieldsString: string) {
        const cms = this.cms;

        const randomID = genId();
        const generatedExamName = `Exam LO ${randomID}`;
        const generatedExamInstruction = `Exam LO Instruction ${randomID}`;

        const topicName = this.scenario.get(aliasTopicName);

        await cms.instruction(`Select Exam LO type in topic ${topicName}`, async () => {
            await schoolAdminSelectExamLOTypeAndOpenUpsertDialog(cms, topicName);
        });

        await cms.instruction(
            `School admin fill in the exam upsert form with "${fieldsString}"`,
            async () => {
                let formValues: ExamLODetail = {};
                const fields = splitAndCombinationIntoArray(fieldsString) as ExamLOUpsertField[];

                for (const field of fields) {
                    if (field === 'name') {
                        formValues = {
                            ...formValues,
                            name: generatedExamName,
                        };
                    }
                    if (field === 'instruction') {
                        formValues = {
                            ...formValues,
                            instruction: generatedExamInstruction,
                        };
                    }
                }
                await schoolAdminCreateExamLO(cms, formValues);

                this.scenario.set(aliasExamLOName, formValues.name);
                this.scenario.set(aliasExamInstruction, formValues.instruction);
            }
        );
    }
);

When(
    'school admin creates an exam LO in book without {string}',
    async function (missingFieldsString: string) {
        const cms = this.cms;

        const randomID = genId();
        const generatedExamName = `Exam LO ${randomID}`;
        const generatedExamInstruction = `Exam LO Instruction ${randomID}`;

        const topicName = this.scenario.get(aliasTopicName);

        await cms.instruction(`Select Exam LO type in topic ${topicName}`, async () => {
            await schoolAdminSelectExamLOTypeAndOpenUpsertDialog(cms, topicName);
        });

        await cms.instruction(
            `School admin fill in the exam upsert form with missing "${missingFieldsString}"`,
            async () => {
                let formValues: ExamLODetail = {
                    name: generatedExamName,
                    instruction: generatedExamInstruction,
                };

                const fields = splitAndCombinationIntoArray(
                    missingFieldsString
                ) as ExamLOUpsertField[];

                for (const field of fields) {
                    if (field === 'name') {
                        formValues = {
                            ...formValues,
                            name: undefined,
                        };
                    }
                    if (field === 'instruction') {
                        formValues = {
                            ...formValues,
                            instruction: undefined,
                        };
                    }
                }
                await schoolAdminCreateExamLO(cms, formValues);

                this.scenario.set(aliasExamLOName, formValues.name);
                this.scenario.set(aliasExamInstruction, formValues.instruction);
            }
        );
    }
);

Then('school admin sees message of creating successfully', async function () {
    const examLOName = this.scenario.get<string>(aliasExamLOName);

    await this.cms.instruction(`See message of creating ${examLOName} successfully`, async () => {
        await this.cms.assertNotification(`You have added ${examLOName} successfully!`);
    });
});

Then('school admin sees the created exam LO on CMS', async function () {
    const cms = this.cms;

    const examLOName = this.scenario.get(aliasExamLOName);
    const examLOInstruction = this.scenario.get(aliasExamInstruction);

    await cms.waitingForLoadingIcon();
    await cms.waitForSkeletonLoading();

    await cms.instruction(`Assert the exam detail with title ${examLOName}`, async () => {
        await schoolAdminAssertExamDetail(cms, {
            name: examLOName,
            instruction: examLOInstruction,
        });
    });
});

Then(
    'school admin cannot create exam LO without {string}',
    async function (missingField: ExamLOUpsertField) {
        await this.cms.instruction(
            `school admin still sees dialog create exam with error message for field "${missingField}"`,
            async () => {
                await schoolAdminSeeValidationErrorMessages(this.cms, missingField);
            }
        );
    }
);
