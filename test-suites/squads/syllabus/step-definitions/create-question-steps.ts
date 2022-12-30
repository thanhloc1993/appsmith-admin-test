import { genId } from '@legacy-step-definitions/utils';

import { When } from '@cucumber/cucumber';

import { QuizTypeTitle } from '@supports/types/cms-types';

import { aliasQuizQuestionName, aliasQuizTypeTitle } from './alias-keys/syllabus';
import { schoolAdminFillQuizExplanationData } from './create-question-definitions';
import { schoolAdminFillQuizQuestionData } from './syllabus-create-question-definitions';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminFillsAllAnswersByQuestionType,
    schoolAdminSubmitQuestion,
} from './syllabus-question-utils';
import { getConvertedStringType } from './syllabus-utils';

When(
    'school admin creates a new {string} question v2',
    async function (quizTypeTitle: QuizTypeTitle) {
        const questionName = `Question ${genId()}`;
        const explanationContent = `Explanation ${genId()}`;
        const selectedTypeTitle = getConvertedStringType<QuizTypeTitle>(quizTypeTitle);

        await this.cms.instruction(
            `school admin selects question type: ${selectedTypeTitle}`,
            async function (cms) {
                await schoolAdminChooseToCreateQuizWithTypeV2(cms, selectedTypeTitle);
            }
        );

        await this.cms.instruction(
            `school admin fills the question is ${questionName}`,
            async () => {
                await schoolAdminFillQuizQuestionData(this.cms, questionName);
            }
        );

        await this.cms.instruction('school admin fills all answers', async () => {
            await schoolAdminFillsAllAnswersByQuestionType(this.cms, selectedTypeTitle);
        });

        await this.cms.instruction(
            `school admin fills the explanation is ${explanationContent}`,
            async function (cms) {
                await schoolAdminFillQuizExplanationData(cms, explanationContent);
            }
        );

        await this.cms.instruction('school admin submit question', async function (cms) {
            await schoolAdminSubmitQuestion(cms);
        });

        this.scenario.set(aliasQuizQuestionName, questionName);
        this.scenario.set(aliasQuizTypeTitle, selectedTypeTitle);
    }
);
