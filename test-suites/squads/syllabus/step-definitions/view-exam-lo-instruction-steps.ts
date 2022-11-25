import { delay, randomInteger } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import {
    aliasCourseId,
    aliasCourseName,
    aliasExamInstruction,
    aliasExamLOName,
    aliasStudyPlanName,
    aliasTopicName,
    aliasTotalQuestionCount,
} from './alias-keys/syllabus';
import { examLOAddQuestionButton, examLOQuestionsTab } from './cms-selectors/exam-lo';
import { schoolAdminClickAddQuestionOrQuestionGroupActionPanel } from './question-group.definition';
import { studentTapsOnStudyPlanItemInTodoTab } from './syllabus-answer-keys-definitions';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import {
    getAllQuizQuestionsNameInTable,
    schoolAdminCreateLOQuestion,
    studentGoesToLODetailsPage,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { checkIsQuestionGroupEnabled } from './syllabus-migration-temp';
import {
    schoolAdminIsOnStudyPlanTab,
    schoolAdminSelectCourseStudyPlan,
} from './syllabus-study-plan-common-definitions';
import {
    studentGoesToTabInToDoScreen,
    studentGoesToTodosScreen,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import {
    cmsUpdateAvailableTimeForExamLO,
    learnerVerifyExamLOInstruction,
    schoolAdminGoToLOItemDetail,
    schoolAdminUpdateExamLOInstruction,
} from './view-exam-lo-instruction-definitions';

Given(
    'school admin creates random number of questions in current Exam LO',
    { timeout: 120000 },
    async function () {
        const cms = this.cms;
        const scenario = this.scenario;
        const numOfQuestions = randomInteger(1, 5);
        scenario.set(aliasTotalQuestionCount, numOfQuestions);

        await cms.instruction(
            `school admin create ${numOfQuestions} new questions in LO`,
            async function (cms) {
                await cms.page?.click(examLOQuestionsTab);

                for (let i = 0; i < numOfQuestions; i++) {
                    const isGroupOfQuestionEnabled = await checkIsQuestionGroupEnabled();

                    if (!isGroupOfQuestionEnabled) {
                        await cms.page?.click(examLOAddQuestionButton);
                    } else {
                        await schoolAdminClickAddQuestionOrQuestionGroupActionPanel(
                            cms,
                            'createQuestion'
                        );
                    }
                    await cms.waitingForLoadingIcon();
                    await cms.waitingForProgressBar();
                    await schoolAdminCreateLOQuestion(cms, 'fill in the blank', scenario);
                    await delay(1000);
                }

                await getAllQuizQuestionsNameInTable(cms, scenario);
            }
        );
    }
);

Given('school admin has updated exam lo with available time', async function () {
    const cms = this.cms;
    const scenario = this.scenario;

    const courseId = scenario.get<string>(aliasCourseId);
    const studyPlanName = scenario.get<string>(aliasStudyPlanName);

    await this.cms.instruction(
        `School admin goes to master study plan ${studyPlanName} detail page`,
        async () => {
            await schoolAdminIsOnStudyPlanTab(this.cms, courseId, 'master');

            await schoolAdminSelectCourseStudyPlan(this.cms, studyPlanName);
            await this.cms.waitingForLoadingIcon();
            await this.cms.waitForSkeletonLoading();
        }
    );

    await cms.instruction(`school admin has updated exam lo with available time`, async () => {
        await cmsUpdateAvailableTimeForExamLO(cms);
    });
});

When(
    'student opens the exam lo instruction screen from {string}',
    async function (fromScreen: string) {
        const learner = this.learner;
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);

        if (fromScreen == 'Course screen') {
            await learner.instruction('Student refreshes home screen', async (learner) => {
                await studentRefreshHomeScreen(learner);
            });

            await learner.instruction(`Student goes to ${courseName} detail`, async (learner) => {
                await studentGoToCourseDetail(learner, courseName);
            });

            await learner.instruction(`Student goes to ${topicName} detail`, async (learner) => {
                await studentGoToTopicDetail(learner, topicName);
            });
            await learner.instruction(
                `Student goes to ${examLOName} instruction screen`,
                async (learner) => {
                    await studentGoesToLODetailsPage(learner, topicName, examLOName);
                }
            );
        } else if (fromScreen == 'Todo screen') {
            await learner.instruction('Student open exam lo from Todo screen', async (learner) => {
                await studentGoesToTodosScreen(learner);
                await studentGoesToTabInToDoScreen(learner, scenario, 'active');
                await studentTapsOnStudyPlanItemInTodoTab(learner, examLOName, 'active');
            });
        }
    }
);

When('school admin updates exam lo with new instruction', async function () {
    const cms = this.cms;
    const scenario = this.scenario;
    const examLOName = scenario.get<string>(aliasExamLOName);
    const oldInstruction = scenario.get<string>(aliasExamInstruction);

    await cms.instruction(`school admin go to book details just created`, async function () {
        await schoolAdminIsOnBookDetailsPage(cms, scenario);
    });

    await cms.instruction(`school admin go to exam lo detail`, async () => {
        await schoolAdminGoToLOItemDetail(cms, examLOName);
    });

    await cms.instruction(`school admin updates exam lo instruction`, async () => {
        const newInstruction = oldInstruction + ' edited';
        scenario.set(aliasExamInstruction, newInstruction);
        await schoolAdminUpdateExamLOInstruction(cms, newInstruction);
    });
});

Then('student sees the exact instruction and question number accordingly', async function () {
    const learner = this.learner;
    const scenario = this.scenario;

    let instruction = scenario.get<string>(aliasExamInstruction);
    instruction = instruction !== undefined ? instruction : 'No Information';
    const numOfQuestions = scenario.get<number>(aliasTotalQuestionCount);

    await learner.instruction(
        `student verify instruction and total questions in the learner app`,
        async () => {
            await learnerVerifyExamLOInstruction(learner, instruction, numOfQuestions);
        }
    );
});
