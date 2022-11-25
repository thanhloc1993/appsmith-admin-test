import { genId } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { aliasQuiz, aliasQuizBaseInfo, aliasQuizQuestionName } from './alias-keys/syllabus';
import { QuizBaseInfo } from './cms-models/content';
import {
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
} from './create-question-definitions';
import { schoolAdminFillQuizBaseInfo } from './syllabus-create-multiple-answers-question-quiz-optimization.definitions';
import {
    schoolAdminSeeBaseInfoOfQuestionInPreview,
    schoolAdminSelectPreviewQuestionInTable,
} from './syllabus-create-question-definitions';
import {
    QuizManualForm,
    schoolAdminFillManualInputQuestionFormV2,
} from './syllabus-question-create-manual-input.definitions';
import {
    genRandomQuestionDifficultLevel,
    schoolAdminGoesToEditQuestionPage,
    schoolAdminSeesDescriptionQuestionErr,
    schoolAdminSeesExplanationOnQuestionPreview,
    schoolAdminSeesExplanationQuestionErr,
    schoolAdminSubmitQuestion,
} from './syllabus-question-utils';

type EditManualInputQuestionInvalidAction = 'missing description and missing explanation';

When('school admin edits a manual input question', async function () {
    const questionName = this.scenario.get(aliasQuizQuestionName);

    const baseInfo: QuizBaseInfo = {
        difficultyLevel: genRandomQuestionDifficultLevel(),
        kind: 'manual input',
        taggedLONames: [],
    };

    await this.cms.instruction(
        `School admin goes to edit question page: ${questionName}`,
        async () => {
            await schoolAdminGoesToEditQuestionPage(this.cms, questionName);
        }
    );

    await this.cms.instruction(
        `school admin change question base info ${JSON.stringify(baseInfo)}`,
        async () => {
            await schoolAdminFillQuizBaseInfo(this.cms, baseInfo);
        }
    );

    const quiz: QuizManualForm = {
        question: `Question edited ${genId()}`,
        explanation: `Explanation edited ${genId()}`,
    };

    await this.cms.instruction(
        `school admin fills manual input question ${JSON.stringify(quiz)}`,
        async () => {
            await schoolAdminFillManualInputQuestionFormV2(this.cms, quiz);
        }
    );

    await this.cms.instruction('School admin submits question', async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });

    this.scenario.set(aliasQuizBaseInfo, baseInfo);
    this.scenario.set(aliasQuiz, quiz);
});

Then('school admin sees that manual input question updated', async function () {
    const baseInfo = this.scenario.get<QuizBaseInfo>(aliasQuizBaseInfo);

    const { question, explanation } = this.scenario.get<QuizManualForm>(aliasQuiz);

    await this.cms.instruction(`School admin clicks preview question: ${question}`, async () => {
        await schoolAdminSelectPreviewQuestionInTable(this.cms, question);
    });

    await this.cms.instruction(
        `School admin sees question base info in preview ${JSON.stringify(baseInfo)}`,
        async () => {
            await schoolAdminSeeBaseInfoOfQuestionInPreview(this.cms, baseInfo);
        }
    );

    await this.cms.instruction(
        `School admin sees question explanation ${explanation}`,
        async () => {
            await schoolAdminSeesExplanationOnQuestionPreview(this.cms, explanation);
        }
    );
});

When(
    'school admin edits a manual input question with invalid action {string}',
    async function (invalidAction: EditManualInputQuestionInvalidAction) {
        const questionName = this.scenario.get(aliasQuizQuestionName);

        await this.cms.instruction(
            `School admin goes to edit question page: ${questionName}`,
            async () => {
                await schoolAdminGoesToEditQuestionPage(this.cms, questionName);
            }
        );

        switch (invalidAction) {
            case 'missing description and missing explanation': {
                await this.cms.instruction(
                    `School admin clears content of question description`,
                    async () => {
                        await schoolAdminFillQuizQuestionData(this.cms, '');
                    }
                );

                await this.cms.instruction(
                    `School admin clears content of question explanation`,
                    async () => {
                        await schoolAdminFillQuizExplanationData(this.cms, '');
                    }
                );
                break;
            }
            default: {
                throw new Error(`Please catch/write test when ${invalidAction}`);
            }
        }

        await this.cms.instruction('School admin submits question', async () => {
            await schoolAdminSubmitQuestion(this.cms);
        });
    }
);

Then(
    'admin sees the validated message of {string} when editing the manual input question',
    async function (invalidAction: EditManualInputQuestionInvalidAction) {
        switch (invalidAction) {
            case 'missing description and missing explanation': {
                await this.cms.instruction(
                    `School admin sees question description error`,
                    async () => {
                        await schoolAdminSeesDescriptionQuestionErr(this.cms);
                    }
                );

                await this.cms.instruction(
                    `School admin sees question explanation error`,
                    async () => {
                        await schoolAdminSeesExplanationQuestionErr(this.cms);
                    }
                );
                break;
            }
            default: {
                throw new Error(`Please catch/write test when ${invalidAction}`);
            }
        }
    }
);
