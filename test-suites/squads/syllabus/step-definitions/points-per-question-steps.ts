import { Then, When } from '@cucumber/cucumber';

import { genId } from '@supports/utils/ulid';

import { Quiz } from '@services/common/quiz';

import { aliasLOSelected, aliasQuizDescription, aliasRandomQuizzes } from './alias-keys/syllabus';
import { LearningObjective } from './cms-models/learning-material';
import { QuizDescription, QuizDifficultyLevels } from './cms-models/quiz';
import {
    schoolAdminFillQuizPoint,
    schoolAdminFillQuizQuestionData,
    schoolAdminSeePointOnQuestionPreview,
    schoolAdminSelectPreviewQuestionInTable,
} from './syllabus-create-question-definitions';
import { schoolAdminSelectTabInExamLODetail } from './syllabus-do-exam-lo-definitions';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminFillsAllAnswersByQuestionType,
    schoolAdminGoesToEditQuestionPage,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import { getConvertedStringType, getQuizTypeValue } from './syllabus-utils';
import { QuizTypeTitle } from './types/cms-types';
import { getValidPointsPerQuestion } from './utils/question-utils';

When(
    'school admin creates points per {string} question',
    async function (quizTypeTitle: QuizTypeTitle) {
        const quizDescription: QuizDescription = {
            content: `Points per question ${genId()}`,
            point: getValidPointsPerQuestion(),
            type: getConvertedStringType<QuizTypeTitle>(quizTypeTitle),
            difficultyLevel: QuizDifficultyLevels.ONE,
            taggedLOs: [],
        };

        await this.cms.instruction(
            `school admin chooses the ${quizDescription.type} question type`,
            async () => {
                await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, quizDescription.type);
            }
        );

        await this.cms.instruction(
            `school admin fills the point is ${quizDescription.point}`,
            async () => {
                await schoolAdminFillQuizPoint(this.cms, quizDescription.point);
            }
        );

        await this.cms.instruction(
            `school admin fills the question is ${quizDescription.content}`,
            async () => {
                await schoolAdminFillQuizQuestionData(this.cms, quizDescription.content);
            }
        );

        await this.cms.instruction('school admin fills all answers', async () => {
            await schoolAdminFillsAllAnswersByQuestionType(this.cms, quizDescription.type);
        });

        await this.cms.instruction(`school admin saves question`, async () => {
            await schoolAdminSubmitQuestion(this.cms);
        });

        this.scenario.set(aliasQuizDescription, quizDescription);
    }
);

When('school admin edits points per question in exam LO', async function () {
    const selectedLO = this.scenario.get<LearningObjective>(aliasLOSelected);
    const { difficultyLevel, taggedLosList, kind, point, question } = this.scenario
        .get<Quiz[]>(aliasRandomQuizzes)
        .filter((quiz) => quiz.loId === selectedLO.info.id)[0];

    const editedQuizPoint = getValidPointsPerQuestion({ min: point!.value + 1 });
    const { quizTypeTitle } = getQuizTypeValue({ quizTypeNumber: kind });

    const quizDescription: QuizDescription = {
        content: question!.raw,
        point: editedQuizPoint,
        type: quizTypeTitle,
        difficultyLevel: difficultyLevel,
        taggedLOs: taggedLosList,
    };

    await this.cms.instruction(
        `school admin goes to edit ${quizDescription.content} question page`,
        async () => {
            await schoolAdminSelectTabInExamLODetail(this.cms, 'Questions');
            await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

            await schoolAdminGoesToEditQuestionPage(this.cms, quizDescription.content);
        }
    );

    await this.cms.instruction(`school admin edits the point to ${editedQuizPoint}`, async () => {
        await schoolAdminFillQuizPoint(this.cms, editedQuizPoint);
    });

    await this.cms.instruction(`school admin saves question`, async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });

    this.scenario.set(aliasQuizDescription, quizDescription);
});

Then('school admin sees points per question on preview', async function () {
    const { content, point } = this.scenario.get<QuizDescription>(aliasQuizDescription);

    await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

    await this.cms.instruction(
        `school admin clicks on preview button of ${content} question`,
        async () => {
            await schoolAdminSelectPreviewQuestionInTable(this.cms, content);
        }
    );

    await this.cms.instruction(
        `school admin sees ${point} points per ${content} question on preview`,
        async () => {
            await schoolAdminSeePointOnQuestionPreview(this.cms, point);
        }
    );
});
