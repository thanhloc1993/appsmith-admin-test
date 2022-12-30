import { aliasLOName } from '@legacy-step-definitions/alias-keys/syllabus';
import { convertStringTypeToArray } from '@legacy-step-definitions/utils';
import { asyncForEach } from '@syllabus-utils/common';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { DataTable, Then, When } from '@cucumber/cucumber';

import { genId } from '@drivers/message-formatter/utils';

import { IMasterWorld, LOType } from '@supports/app-types';
import { QuizTypeTitle } from '@supports/types/cms-types';

import {
    aliasContentBookLOQuestionQuantity,
    aliasCourseId,
    aliasCourseName,
    aliasExamLOName,
    aliasQuestionGroupDetails,
    aliasTopicName,
    aliasTotalQuestionCount,
} from './alias-keys/syllabus';
import { QuestionDetail, QuestionGroupDetail } from './cms-models/question-group';
import { getQuestionItemName, questionIndividual } from './cms-selectors/syllabus';
import {
    getTotalQuestionsFromQuestionGroupDetails,
    learnerVerifyIndividualQuestion,
    learnerVerifyQuestionGroups,
    setQuestionDescription,
    showQuizProgressBarButton,
    studentAnswersAllQuestions,
    teacherVerifyIndividualQuestion,
    teacherVerifyQuestionGroups,
} from './create-and-view-question-and-question-group.definitions';
import {
    schoolAdminAssertQuestionGroupDetail,
    schoolAdminClickAddQuestionOrQuestionGroupActionPanel,
    schoolAdminClickCreateQuestionInQuestionGroup,
    schoolAdminFillUpsertQuestionForm,
    schoolAdminFillUpsertQuestionGroupForm,
    schoolAdminGetQuestionGroupAccordionElementByName,
} from './question-group.definition';
import {
    studentGoesToLODetailsPage,
    teacherGoesToStudyPlanItemDetails,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { studentSubmitExamLO } from './syllabus-do-exam-lo-definitions';
import { studentStartExamLOFromInstructionScreen } from './syllabus-exam-lo-common-definition';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import {
    getConvertedStringType,
    getQuizTypeValue,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x/dist/common/find';
import { cmsExamDetail } from 'test-suites/squads/syllabus/cms-locators/exam-detail';

When(
    'school admin creates question and question group detail in {string}',
    async function (loType: LOType, questionDetailTable: DataTable) {
        const hashedQuestionDetailTable: QuestionDetail[] = questionDetailTable.hashes();

        const questionGroupDetails: QuestionGroupDetail[] = [];

        if (loType === 'exam LO') {
            await this.cms.instruction(
                `School admin switches to questions tab in exam LO`,
                async () => {
                    await cmsExamDetail.selectQuestionTab(this.cms.page!);
                }
            );
        }

        await asyncForEach(
            hashedQuestionDetailTable,
            async ({ groupType, questionList: questionListString }) => {
                const questionList = convertStringTypeToArray<QuizTypeTitle | 'empty'>(
                    questionListString
                );

                if (groupType === 'individual question') {
                    const questionName = `Question ${genId()}`;
                    const explanationContent = `Explanation ${genId()}`;

                    const selectedTypeTitle = getConvertedStringType<QuizTypeTitle>(
                        questionList[0] // Only 1 question in individual question
                    );
                    const questionTypeNumber = getQuizTypeValue({
                        quizTypeTitle: selectedTypeTitle,
                    }).quizTypeNumber;

                    await this.cms.instruction(
                        `School admin create "${selectedTypeTitle}" type individual question`,
                        async () => {
                            await schoolAdminClickAddQuestionOrQuestionGroupActionPanel(
                                this.cms,
                                'createQuestion'
                            );

                            await schoolAdminFillUpsertQuestionForm(this.cms, {
                                selectedTypeTitle,
                                explanationContent,
                                questionName,
                            });
                        }
                    );

                    questionGroupDetails.push({
                        groupType,
                        questionGroupName: '',
                        questionGroupDescription: '',
                        questionNames: [questionName],
                        questionTypeNumbers: [questionTypeNumber],
                    });

                    setQuestionDescription(
                        questionName,
                        getQuizTypeValue({
                            quizTypeTitle: selectedTypeTitle,
                        }).quizTypeTitle,
                        this.scenario
                    );
                }

                if (groupType === 'group') {
                    const questionGroupName = `Question group name ${genId()}`;
                    const questionGroupDescription = `Question group description ${genId()}`;

                    await this.cms.instruction(
                        `School admin clicks add new question group with name ${questionGroupName}`,
                        async () => {
                            await schoolAdminClickAddQuestionOrQuestionGroupActionPanel(
                                this.cms,
                                'createQuestionGroup'
                            );
                        }
                    );

                    await this.cms.instruction(
                        `School admin fills and submit the question group form in ${loType}`,
                        async () => {
                            await schoolAdminFillUpsertQuestionGroupForm(this.cms, {
                                questionGroupName,
                                questionGroupDescription,
                            });

                            await this.cms.assertNotification(
                                'You have added question group successfully'
                            );
                        }
                    );

                    await this.cms.waitForSkeletonLoading();

                    if (questionList[0] === 'empty') return;

                    let questionGroupDetail: QuestionGroupDetail = {
                        groupType,
                        questionGroupName,
                        questionGroupDescription,
                        questionNames: [],
                        questionTypeNumbers: [],
                    };

                    await asyncForEach(questionList, async (quizTypeTitle) => {
                        await this.cms.instruction(
                            `School admin create "${quizTypeTitle}" type question inside question group ${questionGroupName}`,
                            async () => {
                                const questionName = `Question ${genId()}`;
                                const explanationContent = `Explanation ${genId()}`;

                                await schoolAdminClickCreateQuestionInQuestionGroup(
                                    this.cms,
                                    questionGroupName
                                );

                                const selectedTypeTitle =
                                    getConvertedStringType<QuizTypeTitle>(quizTypeTitle);
                                const questionTypeNumber = getQuizTypeValue({
                                    quizTypeTitle: selectedTypeTitle,
                                }).quizTypeNumber;

                                await schoolAdminFillUpsertQuestionForm(this.cms, {
                                    selectedTypeTitle,
                                    explanationContent,
                                    questionName,
                                });

                                questionGroupDetail = {
                                    ...questionGroupDetail,
                                    questionNames: [
                                        ...questionGroupDetail.questionNames!,
                                        questionName,
                                    ],
                                    questionTypeNumbers: [
                                        ...questionGroupDetail.questionTypeNumbers!,
                                        questionTypeNumber,
                                    ],
                                };

                                setQuestionDescription(
                                    questionName,
                                    getQuizTypeValue({
                                        quizTypeTitle: selectedTypeTitle,
                                    }).quizTypeTitle,
                                    this.scenario
                                );
                            }
                        );
                    });

                    questionGroupDetails.push(questionGroupDetail);
                }
            }
        );

        const totalQuestions = getTotalQuestionsFromQuestionGroupDetails(questionGroupDetails);

        this.scenario.set(aliasContentBookLOQuestionQuantity, totalQuestions);
        this.scenario.set(aliasTotalQuestionCount, totalQuestions);
        this.scenario.set(aliasQuestionGroupDetails, questionGroupDetails);
    }
);

Then(
    'school admin sees new question group list created in {string}',
    async function (loType: LOType) {
        const questionGroupDetails =
            this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);

        await asyncForEach(
            questionGroupDetails,
            async ({ groupType, questionNames, questionGroupName, questionGroupDescription }) => {
                const questionNamesInQuestionGroup = questionNames!;

                if (groupType === 'individual question') {
                    // Only 1 item for individual question
                    const questionName = questionNamesInQuestionGroup[0];

                    await this.cms.instruction(
                        `School admin assert created individual question ${questionName} in ${loType}`,
                        async () => {
                            await this.cms.waitForSelectorHasText(questionIndividual, questionName);
                        }
                    );
                }

                if (groupType === 'group') {
                    await this.cms.instruction(
                        `School admin assert created question group ${questionGroupName} in ${loType}`,
                        async () => {
                            await schoolAdminAssertQuestionGroupDetail(this.cms, {
                                questionGroupName,
                                questionGroupDescription,
                            });
                        }
                    );

                    await this.cms.instruction(
                        `School admin assert ${questionNamesInQuestionGroup.length} created question in question group ${questionGroupName} in ${loType}`,
                        async () => {
                            const questionGroupAccordionElement =
                                await schoolAdminGetQuestionGroupAccordionElementByName(
                                    this.cms,
                                    questionGroupName
                                );

                            await asyncForEach(
                                questionNamesInQuestionGroup,
                                async (questionName) => {
                                    await questionGroupAccordionElement?.waitForSelector(
                                        getQuestionItemName(questionName)
                                    );
                                }
                            );
                        }
                    );
                }
            }
        );
    }
);

Then(
    'student sees the new question and question group on Learner App with {string}',
    { timeout: 300000 },
    async function (this: IMasterWorld, loType: LOType) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const loName = scenario.get<string>(loType == 'exam LO' ? aliasExamLOName : aliasLOName);
        const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);
        const questionGroupDetails =
            this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);

        await this.learner.instruction(`Student go to LO detail page`, async (learner) => {
            await studentRefreshHomeScreen(learner);
            await studentGoToCourseDetail(learner, courseName);
            await studentGoToTopicDetail(learner, topicName);
            await studentGoesToLODetailsPage(learner, topicName, loName);
        });

        await this.learner.instruction(`Student start doing LO`, async (learner) => {
            if (loType == 'exam LO') {
                await studentStartExamLOFromInstructionScreen(learner);
            }
        });

        await this.learner.instruction(`Student wait to see quiz progress bar`, async (learner) => {
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity)),
                30000
            );
            await showQuizProgressBarButton(learner, loType);
        });

        let questionIndex = 0;
        await asyncForEach(questionGroupDetails, async (item) => {
            if (item.groupType === 'group') {
                await this.learner.instruction(
                    `Student can see detail of question group: ${item.questionGroupName}`,
                    async (learner) => {
                        await learnerVerifyQuestionGroups(
                            learner,
                            loType,
                            item,
                            questionIndex,
                            questionQuantity
                        );
                        questionIndex += (item.questionNames as string[]).length;
                    }
                );
            } else if (item.groupType === 'individual question') {
                await this.learner.instruction(
                    `Student can see detail of question: ${(item.questionNames as string[])[0]}`,
                    async (learner) => {
                        await learnerVerifyIndividualQuestion(
                            learner,
                            loType,
                            item,
                            questionIndex,
                            questionQuantity
                        );
                        questionIndex++;
                    }
                );
            }
        });
    }
);

When('student finish the {string}', async function (loType: LOType) {
    const scenario = this.scenario;
    const loName = scenario.get<string>(loType == 'exam LO' ? aliasExamLOName : aliasLOName);

    if (loType === 'learning objective') {
        const questionGroupDetails =
            this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);
        await this.learner.instruction(
            `Student answers all questions of the ${loType}`,
            async (learner) => {
                await studentAnswersAllQuestions(learner, questionGroupDetails);
            }
        );
    }
    if (loType === 'exam LO') {
        await this.learner.instruction(`Student submits the exam`, async (learner) => {
            await studentSubmitExamLO(learner, scenario, loName);
        });
    }
});

When('student go to the {string}', async function (loType: LOType) {
    const scenario = this.scenario;

    const courseName = scenario.get<string>(aliasCourseName);
    const topicName = scenario.get<string>(aliasTopicName);
    const loName = scenario.get<string>(loType == 'exam LO' ? aliasExamLOName : aliasLOName);
    const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

    await this.learner.instruction(`Student go to LO detail page`, async (learner) => {
        await studentRefreshHomeScreen(learner);
        await studentGoToCourseDetail(learner, courseName);
        await studentGoToTopicDetail(learner, topicName);
        await studentGoesToLODetailsPage(learner, topicName, loName);
    });

    await this.learner.instruction(`Student start doing LO`, async (learner) => {
        if (loType == 'exam LO') {
            await studentStartExamLOFromInstructionScreen(learner);
        }
    });

    await this.learner.instruction(`Student wait to see quiz progress bar`, async (learner) => {
        await learner.flutterDriver?.waitFor(
            new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity)),
            30000
        );
        await showQuizProgressBarButton(learner, loType);
    });
});

When('teacher go to the student submission with {string}', async function (loType: LOType) {
    const scenario = this.scenario;

    const courseName = scenario.get<string>(aliasCourseName);
    const courseId = scenario.get<string>(aliasCourseId);
    const studentId = await this.learner.getUserId();
    const loName = scenario.get<string>(loType == 'exam LO' ? aliasExamLOName : aliasLOName);

    const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

    await this.teacher.instruction(
        `Teacher goes to course ${courseName} student tab from home page`,
        async (teacher) => {
            await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
        }
    );

    await this.teacher.instruction(
        `Teacher goes to view the study plan item details`,
        async function (teacher) {
            await teacherGoesToStudyPlanItemDetails(teacher, loName);
        }
    );

    await this.teacher.instruction(`Teacher wait to see quiz progress bar`, async (learner) => {
        await learner.flutterDriver?.waitFor(
            new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity)),
            30000
        );
    });
});

Then(
    'teacher sees the question and question group on Teacher App display correctly',
    async function () {
        const questionGroupDetails =
            this.scenario.get<QuestionGroupDetail[]>(aliasQuestionGroupDetails);

        let questionIndex = 0;
        await asyncForEach(questionGroupDetails, async (item) => {
            if (item.groupType === 'group') {
                await this.teacher.instruction(
                    `Student can see detail of question group: ${item.questionGroupName}`,
                    async (teacher) => {
                        await teacherVerifyQuestionGroups(teacher, item, questionIndex);
                        questionIndex += (item.questionNames as string[]).length;
                    }
                );
            } else if (item.groupType === 'individual question') {
                await this.teacher.instruction(
                    `Student can see detail of question: ${(item.questionNames as string[])[0]}`,
                    async (teacher) => {
                        await teacherVerifyIndividualQuestion(teacher, questionIndex);
                        questionIndex++;
                    }
                );
            }
        });
    }
);
