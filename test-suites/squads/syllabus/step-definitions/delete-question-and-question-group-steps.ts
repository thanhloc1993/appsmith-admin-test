import { Then, When } from '@cucumber/cucumber';

import { aliasQuestionGroupDetails } from './alias-keys/syllabus';
import { QuestionGroupDetail } from './cms-models/question-group';
import {
    schoolAdminDeletesQuestion,
    schoolAdminDeletesQuestionGroup,
    schoolAdminDoesNotSeeQuestionGroup,
    schoolAdminDoesNotSeeQuestionInQuestionGroup,
} from './delete-question-and-question-group-definitions';

When('school admin deletes the question group', async function () {
    const questionGroupDetails: QuestionGroupDetail[] =
        this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);

    if (questionGroupDetails && questionGroupDetails.length) {
        const questionGroup = questionGroupDetails[0];
        const questionGroupName = questionGroup.questionGroupName;

        await this.cms.instruction(
            `school admin deletes question group ${questionGroupName}`,
            async (cms) => {
                await schoolAdminDeletesQuestionGroup(cms, 'questionGroupName');
            }
        );

        await this.cms.assertNotification(`You have deleted ${questionGroupName} successfully`);
    }
});

When('school admin deletes the question in question group', async function () {
    const questionGroupDetails: QuestionGroupDetail[] =
        this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);
    const questionGroup = questionGroupDetails[0];
    const questionGroupName = questionGroup.questionGroupName;

    if (questionGroupDetails && questionGroup.questionNames?.length) {
        const questionName = questionGroup.questionNames[0];

        await this.cms.instruction(
            `school admin deletes question ${questionName} in question group ${questionGroupName}`,
            async (cms) => {
                await schoolAdminDeletesQuestion(cms, questionName);
            }
        );

        await this.cms.assertNotification(`You have deleted question successfully`);
    }
});

Then('school admin does not see question group', async function () {
    const questionGroupDetails: QuestionGroupDetail[] =
        this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);
    const questionGroup = questionGroupDetails[0];
    const questionGroupName = questionGroup.questionGroupName;

    await this.cms.instruction(
        `School admin does not see question group ${questionGroupName}`,
        async function (cms) {
            await schoolAdminDoesNotSeeQuestionGroup(cms, questionGroupName);
        }
    );
});

Then('school admin does not see question inside question group', async function () {
    const questionGroupDetails: QuestionGroupDetail[] =
        this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);
    const questionGroup = questionGroupDetails[0];

    if (questionGroup && questionGroup.questionNames) {
        const questionGroupName = questionGroup.questionGroupName;
        const questionName = questionGroup.questionNames[0];

        await this.cms.instruction(
            `School admin does not see question ${questionName} in question group ${questionGroupName}`,
            async function (cms) {
                await schoolAdminDoesNotSeeQuestionInQuestionGroup(cms, questionName);
            }
        );
    }
});
