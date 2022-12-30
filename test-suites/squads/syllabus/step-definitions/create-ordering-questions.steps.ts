import { asyncForEach } from '@syllabus-utils/common';

import { Given } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import { aliasQuiz, aliasQuizAnswers, aliasQuizBaseInfo } from './alias-keys/syllabus';
import {
    schoolAdminFillBaseInfoOfQuizV2,
    schoolAdminFillQuizExplanationData,
    schoolAdminFillQuizQuestionData,
    schoolAdminSeeBaseInfoOfQuestionInPreview,
    schoolAdminSeeQuestionInTable,
    schoolAdminSelectPreviewQuestionInTable,
} from './syllabus-create-question-definitions';
import { QuizManualForm } from './syllabus-question-create-manual-input.definitions';
import {
    schoolAdminAssertCorrectAnswerOrderInPreview,
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminFillAnswerQuestion,
    schoolAdminSeesExplanationOnQuestionPreview,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
    schoolAdminWaitingUpsertQuestionDialog,
} from './syllabus-question-utils';
import {
    QuizBaseInfo,
    QuizDifficultyLevels,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given('school admin creates an ordering question', async function () {
    const baseInfo: QuizBaseInfo = {
        difficultyLevel: QuizDifficultyLevels.THREE,
        kind: 'ordering',
        taggedLONames: [],
    };

    const questionDescription = `Question ${genId()}`;
    const questionExplanation = `Explanation ${genId()}`;
    const questionAnswerList = ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'];

    const quiz: QuizManualForm = {
        question: questionDescription,
        explanation: questionExplanation,
    };

    await schoolAdminWaitingUpsertQuestionDialog(this.cms);

    await this.cms.instruction(`school admin selects ordering question type`, async () => {
        await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, 'ordering');
    });

    await this.cms.instruction(
        `School admin changes question base info ${JSON.stringify(baseInfo)}`,
        async () => {
            await schoolAdminFillBaseInfoOfQuizV2(this.cms, baseInfo);
        }
    );

    await this.cms.instruction(
        `School admin fills and submits question content ${JSON.stringify(quiz)}`,
        async () => {
            await schoolAdminFillQuizQuestionData(this.cms, questionDescription);

            await schoolAdminFillQuizExplanationData(this.cms, questionExplanation);
        }
    );

    await this.cms.instruction(`School admin fill answers content`, async () => {
        await asyncForEach(questionAnswerList, async (answer, index) => {
            await schoolAdminFillAnswerQuestion(this.cms, index + 1, answer);
        });
    });

    await this.cms.instruction('School admin create the question', async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });

    this.scenario.set(aliasQuizAnswers, questionAnswerList);
    this.scenario.set(aliasQuiz, quiz);
    this.scenario.set(aliasQuizBaseInfo, baseInfo);
});

Given('school admin will sees the newly created ordering question', async function () {
    const { question } = this.scenario.get<QuizManualForm>(aliasQuiz);

    await this.cms.waitingForLoadingIcon();

    await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

    await this.cms.instruction(`School admin sees newly question ${question}`, async () => {
        await schoolAdminSeeQuestionInTable(this.cms, question);
    });
});

Given('school admin sees question details with correct answers order', async function () {
    const { question: questionName, explanation } = this.scenario.get<QuizManualForm>(aliasQuiz);
    const baseInfo = this.scenario.get<QuizBaseInfo>(aliasQuizBaseInfo);
    const answersList = this.scenario.get<string[]>(aliasQuizAnswers);

    await this.cms.instruction(
        `School admin selects question ${questionName} to preview`,
        async () => {
            await schoolAdminSelectPreviewQuestionInTable(this.cms, questionName);
        }
    );

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

    await this.cms.instruction(
        'School admin checks correct answer order in question preview',
        async () => {
            await schoolAdminAssertCorrectAnswerOrderInPreview(this.cms, answersList);
        }
    );
});
