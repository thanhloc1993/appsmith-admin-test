import { Given, Then, When } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import { aliasLOName, aliasQuiz, aliasQuizBaseInfo } from './alias-keys/syllabus';
import { draftEditor } from './cms-selectors/cms-keys';
import {
    schoolAdminFillBaseInfoOfQuiz,
    schoolAdminFillBaseInfoOfQuizV2,
    schoolAdminSeeBaseInfoOfQuestionInPreview,
    schoolAdminSeeQuestionInTable,
    schoolAdminSelectPreviewQuestionInTable,
} from './syllabus-create-question-definitions';
import {
    QuizManualForm,
    schoolAdminFillManualInputQuestionForm,
    schoolAdminFillManualInputQuestionFormV2,
} from './syllabus-question-create-manual-input.definitions';
import {
    schoolAdminCannotSubmitQuestion,
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminClickCreateQuestion,
    schoolAdminSeeManualQuestionError,
    schoolAdminSeesExplanationOnQuestionPreview,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import {
    QuizBaseInfo,
    QuizDifficultyLevels,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given('school admin goes to create question page', async function () {
    const loName = this.scenario.get(aliasLOName);

    await schoolAdminClickLOByName(this.cms, loName);

    await this.cms.waitingForLoadingIcon();

    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction('school admin see LO detail page', async () => {
        await schoolAdminWaitingQuizTableInTheLODetail(this.cms);
    });

    await this.cms.instruction('school admin choose add new question in LO', async () => {
        await schoolAdminClickCreateQuestion(this.cms);
    });

    await this.cms.waitingForLoadingIcon();

    await this.cms.instruction('school admin see create question page', async () => {
        await this.cms.page?.waitForSelector(draftEditor);
    });
});

When('school admin creates a manual input question', async function () {
    const baseInfo: QuizBaseInfo = {
        difficultyLevel: QuizDifficultyLevels.THREE,
        kind: 'manual input',
        taggedLONames: [],
    };

    await this.cms.instruction(
        `school admin choose change question base info ${JSON.stringify(baseInfo)}`,
        async () => {
            await schoolAdminFillBaseInfoOfQuiz(this.cms, baseInfo);
        }
    );

    const quiz: QuizManualForm = {
        question: `Question ${genId()}`,
        explanation: `Explanation ${genId()}`,
    };

    await this.cms.instruction(
        `school admin fill question content ${JSON.stringify(quiz)}`,
        async () => {
            await schoolAdminFillManualInputQuestionForm(this.cms, quiz);
        }
    );

    await schoolAdminSubmitQuestion(this.cms);

    this.scenario.set(aliasQuiz, quiz);
    this.scenario.set(aliasQuizBaseInfo, baseInfo);
});

Then('school admin will sees the newly created manual input question', async function () {
    const { question, explanation } = this.scenario.get<QuizManualForm>(aliasQuiz);
    const baseInfo = this.scenario.get<QuizBaseInfo>(aliasQuizBaseInfo);

    await this.cms.waitingForLoadingIcon();

    await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

    await this.cms.instruction(`school admin see newly question ${question}`, async () => {
        await schoolAdminSeeQuestionInTable(this.cms, question);
    });

    await this.cms.instruction('school admin click preview question', async () => {
        await schoolAdminSelectPreviewQuestionInTable(this.cms, question);
    });

    await this.cms.instruction(
        `school admin see question base info in preview ${JSON.stringify(baseInfo)}`,
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
    'school admin creates a manual input question with missing {string}',
    async function (missingField: string) {
        const quiz: QuizManualForm = {
            question: missingField === 'question' ? '' : 'Question',
            explanation: missingField === 'explanation' ? '' : 'Explanation',
        };

        await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'manual input');

        await this.cms.instruction(
            `school admin fill question content ${JSON.stringify(quiz)}`,
            async () => {
                await schoolAdminFillManualInputQuestionForm(this.cms, quiz);
            }
        );
    }
);

Then('school admin cannot create any question', async function () {
    await this.cms.instruction('school admin see submit question disabled', async () => {
        await schoolAdminCannotSubmitQuestion(this.cms);
    });
});

Given('school admin goes to create question v2 page', async function () {
    const loName = this.scenario.get(aliasLOName);

    await this.cms.instruction('school admin goes to LO detail page', async (cms) => {
        await schoolAdminClickLOByName(this.cms, loName);

        await cms.waitingForLoadingIcon();
        await cms.waitForSkeletonLoading();
    });

    await this.cms.instruction('school admin see LO detail page', async () => {
        await schoolAdminWaitingQuizTableInTheLODetail(this.cms);
    });

    await this.cms.instruction('school admin choose add new question in LO', async () => {
        await schoolAdminClickCreateQuestion(this.cms);
    });

    await this.cms.waitingForLoadingIcon();

    await this.cms.instruction('school admin see create question page', async () => {
        await this.cms.page?.waitForSelector(draftEditor);
    });
});

When('school admin creates a manual input question v2', async function () {
    const baseInfo: QuizBaseInfo = {
        difficultyLevel: QuizDifficultyLevels.THREE,
        kind: 'manual input',
        taggedLONames: [],
    };

    await this.cms.instruction(
        `school admin choose change question base info ${JSON.stringify(baseInfo)}`,
        async () => {
            await schoolAdminFillBaseInfoOfQuizV2(this.cms, baseInfo);
        }
    );

    const quiz: QuizManualForm = {
        question: `Question ${genId()}`,
        explanation: `Explanation ${genId()}`,
    };

    await this.cms.instruction(
        `school admin fill question content ${JSON.stringify(quiz)}`,
        async () => {
            await schoolAdminFillManualInputQuestionFormV2(this.cms, quiz);
        }
    );

    await schoolAdminSubmitQuestion(this.cms);

    this.scenario.set(aliasQuiz, quiz);
    this.scenario.set(aliasQuizBaseInfo, baseInfo);
});

When(
    'school admin creates a manual input question v2 with empty {string}',
    async function (missingField: string) {
        const quiz: QuizManualForm = {
            question: missingField === 'question' ? '' : 'Question',
            explanation: missingField === 'explanation' ? '' : 'Explanation',
        };

        await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'manual input');

        await this.cms.instruction(
            `school admin fill question content ${JSON.stringify(quiz)}`,
            async () => {
                await schoolAdminFillManualInputQuestionFormV2(this.cms, quiz);
            }
        );

        await this.cms.instruction('school admin submit question', async (cms) => {
            await schoolAdminSubmitQuestion(cms);
        });
    }
);

Then('school admin sees error on missing {string}', async function (missingField: string) {
    await this.cms.instruction('school admin see error when submit question', async (cms) => {
        await schoolAdminSeeManualQuestionError(cms, missingField);
    });
});
