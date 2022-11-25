import { genId, splitAndCombinationIntoArray } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasExamInstruction, aliasExamLOName, aliasLOName } from './alias-keys/syllabus';
import {
    ExamLODetail,
    ExamLOUpsertField,
    schoolAdminSeeValidationErrorMessages,
    schoolAdminAssertExamDetail,
} from './syllabus-exam-lo-create-definitions';
import {
    schoolAdminEditExamLO,
    schoolAdminSelectEditExamLO,
} from './syllabus-exam-lo-edit-definitions';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';

When('school admin edits exam LO with {string}', async function (fieldsString: string) {
    const examLOName = this.scenario.get<string>(aliasExamLOName);

    await this.cms.instruction(
        `school admin updates the ${fieldsString} of the exam LO`,
        async () => {
            let formValues: ExamLODetail = { name: examLOName };
            const fields = splitAndCombinationIntoArray(fieldsString) as ExamLOUpsertField[];

            for (const field of fields) {
                if (field === 'name') {
                    formValues = {
                        ...formValues,
                        name: `Updated ${examLOName}`,
                    };
                }
                if (field === 'instruction') {
                    formValues = {
                        ...formValues,
                        instruction: `Updated instruction ${genId()}`,
                    };
                }
            }
            await schoolAdminEditExamLO(this.cms, formValues);

            this.scenario.set(aliasLOName, formValues.name);
            this.scenario.set(aliasExamInstruction, formValues.instruction);
        }
    );
});

Then(`school admin sees the edited exam LO on CMS`, async function () {
    const cms = this.cms;

    const examLOName = this.scenario.get(aliasLOName);
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

When(
    'school admin edits exam LO with missing {string}',
    async function (missingFieldsString: string) {
        await this.cms.instruction(
            `School admin fill in the exam upsert form with missing "${missingFieldsString}"`,
            async () => {
                let formValues: ExamLODetail = {};
                const fields = splitAndCombinationIntoArray(
                    missingFieldsString
                ) as ExamLOUpsertField[];

                for (const field of fields) {
                    if (field === 'name') {
                        formValues = {
                            ...formValues,
                            name: '',
                        };
                    }
                    if (field === 'instruction') {
                        formValues = {
                            ...formValues,
                            instruction: '',
                        };
                    }
                }

                await schoolAdminEditExamLO(this.cms, formValues);

                this.scenario.set(aliasLOName, formValues.name);
                this.scenario.set(aliasExamInstruction, formValues.instruction);
            }
        );
    }
);

Then(
    'school admin cannot edit exam LO with missing {string}',
    async function (missingField: ExamLOUpsertField) {
        await this.cms.instruction(
            `school admin still sees dialog edit exam with error message for field "${missingField}"`,
            async () => {
                await schoolAdminSeeValidationErrorMessages(this.cms, missingField);
            }
        );
    }
);

When('school admin edits exam LO with empty instruction', async function (this: IMasterWorld) {
    const examLOName = this.scenario.get(aliasLOName);

    await this.cms.instruction(
        `School admin fill in the exam upsert form with empty instruction`,
        async () => {
            await schoolAdminEditExamLO(this.cms, { name: examLOName, instruction: '' });

            this.scenario.set(aliasLOName, examLOName);
            this.scenario.set(aliasExamInstruction, '');
        }
    );
});

Then(`school admin sees double dashes in instruction field`, async function () {
    const cms = this.cms;

    const examLOName = this.scenario.get(aliasLOName);

    await cms.waitingForLoadingIcon();
    await cms.waitForSkeletonLoading();

    await cms.instruction(`Assert the exam detail with title ${examLOName}`, async () => {
        await schoolAdminAssertExamDetail(cms, {
            name: examLOName,
            instruction: '--',
        });
    });
});

Given('school admin goes to exam LO edit page', async function () {
    const examLOName = this.scenario.get<string>(aliasExamLOName);

    await this.cms.instruction(
        `school admin goes to ${examLOName} detail page, select to edit the exam LO`,
        async () => {
            await schoolAdminClickLOByName(this.cms, examLOName);
            await schoolAdminSelectEditExamLO(this.cms);
        }
    );
});
