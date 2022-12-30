import { When } from '@cucumber/cucumber';

import { Quiz } from '@supports/services/common/quiz';

import {
    aliasLOSelected,
    aliasQuizDescription,
    aliasRandomQuizzes,
} from 'test-suites/squads/syllabus/step-definitions/alias-keys/syllabus';
import { LearningObjective } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { QuizDescription } from 'test-suites/squads/syllabus/step-definitions/cms-models/quiz';
import { schoolAdminSelectQuestionTag } from 'test-suites/squads/syllabus/step-definitions/create-question-tag.definitions';
import { schoolAdminSelectTabInExamLODetail } from 'test-suites/squads/syllabus/step-definitions/syllabus-do-exam-lo-definitions';
import {
    schoolAdminGoesToEditQuestionPage,
    schoolAdminSubmitQuestion,
    schoolAdminWaitingQuizTableInTheLODetail,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-question-utils';
import {
    getQuizTypeValue,
    schoolAdminWaitForAutocomplete,
} from 'test-suites/squads/syllabus/step-definitions/syllabus-utils';

When('school admin edits tags in question', async function () {
    const selectedLO = this.scenario.get<LearningObjective>(aliasLOSelected);
    const { difficultyLevel, taggedLosList, kind, point, question } = this.scenario
        .get<Quiz[]>(aliasRandomQuizzes)
        .filter((quiz) => quiz.loId === selectedLO.info.id)[0];
    const { quizTypeTitle: type } = getQuizTypeValue({ quizTypeNumber: kind });
    const content = question!.raw;
    const numOfTags = 2;
    let questionTags: string[] = [];

    await this.cms.instruction(`school admin goes to edit ${content} question page`, async () => {
        await schoolAdminSelectTabInExamLODetail(this.cms, 'Questions');
        await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

        await schoolAdminGoesToEditQuestionPage(this.cms, content);
    });

    await this.cms.instruction('school admin waits for loading tags', async () => {
        await schoolAdminWaitForAutocomplete(this.cms);
    });

    await this.cms.instruction(`school admin selects ${numOfTags} tags`, async () => {
        questionTags = await schoolAdminSelectQuestionTag(this.cms, numOfTags);
    });

    await this.cms.instruction(`school admin saves question`, async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });

    this.scenario.set<QuizDescription>(aliasQuizDescription, {
        content,
        point: point!.value,
        type,
        difficultyLevel: difficultyLevel,
        taggedLOs: taggedLosList,
        questionTags,
    });
});
