import { joinCommaDelimiter } from '@syllabus-utils/question-utils';

import { Then, When } from '@cucumber/cucumber';

import { genId } from '@supports/utils/ulid';

import { aliasQuizDescription } from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { QuizDifficultyLevels } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { QuizDescription } from 'test-suites/squads/syllabus/step-definitions/cms-models/quiz';
import { schoolAdminFillQuizExplanationData } from 'test-suites/squads/syllabus/step-definitions/create-question-definitions';
import {
    schoolAdminSeeSelectedTagInPreviewPanel,
    schoolAdminSelectQuestionTag,
} from 'test-suites/squads/syllabus/step-definitions/create-question-tag.definitions';
import {
    schoolAdminFillQuizQuestionData,
    schoolAdminSelectPreviewQuestionInTable,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-create-question-definitions';
import {
    schoolAdminChooseToCreateQuizWithTypeV2,
    schoolAdminFillsAllAnswersByQuestionType,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-question-utils';
import {
    getConvertedStringType,
    schoolAdminWaitForAutocomplete,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-utils';
import { QuizTypeTitle } from 'test-suites/squads/syllabus/step-definitions/types/cms-types';

When('school admin creates {string} question with tags', async function (quizType: string) {
    const content = `Question tag ${genId()}`;
    const type = getConvertedStringType<QuizTypeTitle>(quizType);
    const explanation = `Explanation tag ${genId()}`;
    const numOfTags = 2;
    let questionTags: string[] = [];

    await this.cms.instruction(`school admin selects question type: ${type}`, async () => {
        await schoolAdminChooseToCreateQuizWithTypeV2(this.cms, type);
    });

    await this.cms.instruction('school admin waits for loading tags', async () => {
        await schoolAdminWaitForAutocomplete(this.cms);
    });

    await this.cms.instruction(`school admin selects ${numOfTags} tags`, async () => {
        questionTags = await schoolAdminSelectQuestionTag(this.cms, numOfTags);
    });

    await this.cms.instruction(`school admin fills the question is ${content}`, async () => {
        await schoolAdminFillQuizQuestionData(this.cms, content);
    });

    await this.cms.instruction('school admin fills all answers', async () => {
        await schoolAdminFillsAllAnswersByQuestionType(this.cms, type);
    });

    await this.cms.instruction(
        `school admin fills the explanation is ${explanation}`,
        async function (cms) {
            await schoolAdminFillQuizExplanationData(cms, explanation);
        }
    );

    await this.cms.instruction('school admin submits question', async (cms) => {
        await schoolAdminSubmitQuestion(cms);
    });

    this.scenario.set<QuizDescription>(aliasQuizDescription, {
        difficultyLevel: QuizDifficultyLevels.ONE,
        point: 1,
        taggedLOs: [],
        type,
        content,
        explanation,
        questionTags,
    });
});

Then('school admin sees tags in the question preview', async function () {
    const { content, questionTags = [] } = this.scenario.get<QuizDescription>(aliasQuizDescription);
    const tags = questionTags?.length ? joinCommaDelimiter(questionTags) : '--';

    await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

    await this.cms.instruction(
        `school admin clicks on preview button of ${content} question`,
        async () => {
            await schoolAdminSelectPreviewQuestionInTable(this.cms, content);
        }
    );

    await this.cms.instruction(`school admin sees ${tags} tags in the preview panel`, async () => {
        await schoolAdminSeeSelectedTagInPreviewPanel(this.cms, tags);
    });
});
