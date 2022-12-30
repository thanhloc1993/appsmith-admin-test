import { asyncForEach } from '@syllabus-utils/common';

import { When, Then } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import { LOType } from '@supports/app-types';
import { QuizTypeTitle } from '@supports/types/cms-types';

import { aliasQuestionGroupDetails } from './alias-keys/syllabus';
import { QuestionGroupDetail } from './cms-models/question-group';
import { getQuestionItemName } from './cms-selectors/syllabus';
import {
    schoolAdminAssertQuestionGroupDetail,
    schoolAdminFillUpsertQuestionForm,
    schoolAdminFillUpsertQuestionGroupForm,
    schoolAdminGetQuestionGroupAccordionElementByName,
    schoolAdminGoesToEditQuestionGroupPage,
    schoolAdminGoesToEditQuestionPageInQuestionGroup,
} from './question-group.definition';
import { getConvertedStringType } from './syllabus-utils';

When('school admin edits the question group detail', async function () {
    const questionGroupDetails =
        this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);
    let questionGroupDetailsEdited = [...questionGroupDetails];

    await asyncForEach(questionGroupDetails, async (questionGroupDetail: QuestionGroupDetail) => {
        const questionGroupName = questionGroupDetail.questionGroupName;

        const questionGroupNameEdited = `Question group name edited ${genId()}`;
        const questionGroupDescriptionEdited = `Question group description edited ${genId()}`;
        const questionGroupDetailEdited = {
            ...questionGroupDetail,
            questionGroupName: questionGroupNameEdited,
            questionGroupDescription: questionGroupDescriptionEdited,
        };

        questionGroupDetailsEdited = questionGroupDetailsEdited.map((item) =>
            item.questionGroupName === questionGroupDetail.questionGroupName
                ? questionGroupDetailEdited
                : item
        );

        await this.cms.instruction(
            `School admin goes to edit question group page: ${questionGroupName}`,
            async () => {
                await schoolAdminGoesToEditQuestionGroupPage(this.cms, questionGroupName);
            }
        );

        await this.cms.instruction(
            `School admin fills and submit the question group form`,
            async () => {
                await schoolAdminFillUpsertQuestionGroupForm(this.cms, {
                    questionGroupName: questionGroupNameEdited,
                    questionGroupDescription: questionGroupDescriptionEdited,
                });
            }
        );

        await this.cms.assertNotification('You have updated question group successfully');
    });

    this.scenario.set(aliasQuestionGroupDetails, questionGroupDetailsEdited);
});

When('school admin edits the question in question group', async function () {
    const questionGroupDetails =
        this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);
    let questionGroupDetailsEdited = [...questionGroupDetails];

    await asyncForEach(questionGroupDetails, async (questionGroupDetail: QuestionGroupDetail) => {
        if (questionGroupDetail.questionNames && questionGroupDetail.questionNames.length) {
            const questionGroupName = questionGroupDetail.questionGroupName;
            const questionName = questionGroupDetail.questionNames[0];

            const selectedTypeTitle = getConvertedStringType<QuizTypeTitle>('');
            const questionNameEdited = `Question name edited ${genId()}`;
            const explanationContentEdited = `Explanation edited ${genId()}`;
            const questionGroupDetailEdited: QuestionGroupDetail = {
                ...questionGroupDetail,
                questionNames: questionGroupDetail.questionNames.map((name) =>
                    name === questionName ? questionNameEdited : name
                ),
            };

            questionGroupDetailsEdited = questionGroupDetailsEdited.map((item) =>
                item.questionGroupName === questionGroupDetail.questionGroupName
                    ? questionGroupDetailEdited
                    : item
            );

            await this.cms.instruction(
                `School admin goes to edit question page: ${questionName} inside question group ${questionGroupName}`,
                async () => {
                    await schoolAdminGoesToEditQuestionPageInQuestionGroup(
                        this.cms,
                        questionName || ''
                    );
                }
            );

            await this.cms.instruction(`School admin edit and submit question`, async () => {
                await schoolAdminFillUpsertQuestionForm(this.cms, {
                    selectedTypeTitle,
                    explanationContent: explanationContentEdited,
                    questionName: questionNameEdited,
                });
            });
        }
    });

    this.scenario.set(aliasQuestionGroupDetails, questionGroupDetailsEdited);
});

Then(
    'school admin sees the edited the question group detail with {string}',
    async function (loType: LOType) {
        const questionGroupDetails =
            this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);

        await asyncForEach(
            questionGroupDetails,
            async ({ groupType, questionGroupName, questionGroupDescription }) => {
                if (groupType === 'group') {
                    await this.cms.instruction(
                        `School admin assert edited question group ${questionGroupName} in ${loType}`,
                        async () => {
                            await schoolAdminAssertQuestionGroupDetail(this.cms, {
                                questionGroupName,
                                questionGroupDescription,
                            });
                        }
                    );
                }
            }
        );
    }
);

Then(
    'school admin sees the edited the question in question group with {string}',
    async function (loType: LOType) {
        const questionGroupDetails =
            this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);

        await asyncForEach(
            questionGroupDetails,
            async ({ groupType, questionNames = [], questionGroupName }) => {
                if (groupType === 'group') {
                    await this.cms.instruction(
                        `School admin assert edited question in question group ${questionGroupName} with ${loType}`,
                        async () => {
                            const questionGroupAccordionElement =
                                await schoolAdminGetQuestionGroupAccordionElementByName(
                                    this.cms,
                                    questionGroupName
                                );

                            await asyncForEach(questionNames, async (questionName) => {
                                await questionGroupAccordionElement?.waitForSelector(
                                    getQuestionItemName(questionName)
                                );
                            });
                        }
                    );
                }
            }
        );
    }
);
