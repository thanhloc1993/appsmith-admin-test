import { questionListItemByText } from '@legacy-step-definitions/cms-selectors/syllabus';
import { asyncForEach } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import {
    aliasCourseId,
    aliasCourseName,
    aliasLOName,
    aliasQuizQuestionName,
    aliasQuizTypeTitle,
    aliasQuizUpdatedInfo,
    aliasTopicName,
} from './alias-keys/syllabus';
import { questionListTable, tableRowByText } from './cms-selectors/cms-keys';
import {
    schoolAdminCheckUpdatedInfo,
    schoolAdminEditsQuestionInfo,
} from './edit-question-definitions';
import {
    getAllQuizQuestionsNameInTable,
    studentGoesToLODetailsPage,
    studentSeesAndDoesLOQuestions,
    teacherGoesToStudyPlanItemDetails,
    teacherSeesLOQuestions,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    checkIsQuestionGroupEnabled,
    schoolAdminWaitingQuestionDataSync,
} from './syllabus-migration-temp';
import {
    schoolAdminGoesToEditQuestionPage,
    schoolAdminSubmitQuestion,
} from './syllabus-question-utils';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { QuizEditInfoTitle, QuizTypeTitle, QuizUpdateInfoValue } from './types/cms-types';

When('school admin edits the created question', async function () {
    const context = this.scenario;
    const questionName = context.get(aliasQuizQuestionName);
    const quizTypeTitle: QuizTypeTitle = context.get(aliasQuizTypeTitle);
    const editingInfo: QuizEditInfoTitle[] = [
        'description',
        'explanation',
        'answers',
        'number of answers',
        'answer config',
    ];
    let updatedInfo = {} as Record<QuizEditInfoTitle, QuizUpdateInfoValue>;

    await this.cms.instruction('school admin waits for question data sync', async () => {
        await schoolAdminWaitingQuestionDataSync(this.cms);
        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();
    });

    await this.cms.instruction('school admin goes to edit question page', async () => {
        await schoolAdminGoesToEditQuestionPage(this.cms, questionName);
        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();
        await this.cms.waitingForLoadingIcon();
    });

    await asyncForEach(editingInfo, (info) =>
        this.cms.instruction(`school admin edits ${info} of question`, async () => {
            const result = await schoolAdminEditsQuestionInfo(this.cms, info, quizTypeTitle);
            updatedInfo = {
                ...updatedInfo,
                ...result,
            };
        })
    );

    context.set(aliasQuizUpdatedInfo, updatedInfo);
    if (updatedInfo['description']) {
        context.set(aliasQuizQuestionName, updatedInfo['description']);
    }

    await this.cms.instruction('school admin saves changes', async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });
});

Then('school admin sees the edited question on CMS', async function () {
    const context = this.scenario;
    const questionName = context.get(aliasQuizQuestionName);
    const updatedInfo =
        context.get<Record<QuizEditInfoTitle, QuizUpdateInfoValue>>(aliasQuizUpdatedInfo);
    const quizTypeTitle: QuizTypeTitle = context.get(aliasQuizTypeTitle);

    await this.cms.instruction('school admin waits for question data sync', async () => {
        await schoolAdminWaitingQuestionDataSync(this.cms);
        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();
    });

    await this.cms.instruction(
        `school admin sees the edited question ${questionName} type ${quizTypeTitle} on CMS`,
        async () => {
            const isQuestionGroupEnabled = await checkIsQuestionGroupEnabled();
            const selector = isQuestionGroupEnabled
                ? questionListItemByText(questionName)
                : tableRowByText(questionListTable, questionName);

            await this.cms.page!.waitForSelector(selector);

            await getAllQuizQuestionsNameInTable(this.cms, context);
        }
    );

    await this.cms.instruction('school admin goes to edit question page', async () => {
        await schoolAdminGoesToEditQuestionPage(this.cms, questionName);
        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();
        await this.cms.waitingForLoadingIcon();
    });

    await asyncForEach(Object.entries(updatedInfo), async ([info, expectedValue]) => {
        await this.cms.instruction(
            `school admin checks updated ${info}, expected value: ${expectedValue}`,
            async () => {
                await schoolAdminCheckUpdatedInfo(
                    this.cms,
                    quizTypeTitle,
                    info as QuizEditInfoTitle,
                    expectedValue
                );
            }
        );
    });
});

Then('student sees the edited question on Learner App', async function () {
    const context = this.scenario;

    const courseName = context.get<string>(aliasCourseName);
    const topicName = context.get<string>(aliasTopicName);
    const studyPlanItemName = context.get<string>(aliasLOName);
    const quizTypeTitle = context.get<QuizTypeTitle>(aliasQuizTypeTitle);

    await this.learner.instruction('Student refreshes home screen', async () => {
        await studentRefreshHomeScreen(this.learner);
    });

    await this.learner.instruction(`Student goes to ${courseName} detail`, async () => {
        await studentGoToCourseDetail(this.learner, courseName);
    });

    await this.learner.instruction(`Student goes to ${topicName} detail`, async () => {
        await studentGoToTopicDetail(this.learner, topicName);
    });

    await this.learner.instruction(`Student goes to ${studyPlanItemName} detail`, async () => {
        await studentGoesToLODetailsPage(this.learner, topicName, studyPlanItemName);
    });

    await this.learner.instruction(
        `Student sees questions of this LO ${studyPlanItemName} on Learner App`,
        async () => {
            await studentSeesAndDoesLOQuestions(this.learner, context, quizTypeTitle);
        }
    );
});

Then('teacher sees the edited question on Teacher App', async function () {
    const scenario = this.scenario;

    const courseName = scenario.get<string>(aliasCourseName);
    const courseId = scenario.get<string>(aliasCourseId);
    const studentId = await this.learner.getUserId();
    const studyPlanItemName = scenario.get<string>(aliasLOName);
    const quizTypeTitle = scenario.get<QuizTypeTitle>(aliasQuizTypeTitle);

    await this.teacher.instruction(
        `Teacher goes to course ${courseName} student tab from home page`,
        async () => {
            await teacherGoesToStudyPlanDetails(this.teacher, courseId, studentId);
        }
    );

    await this.teacher.instruction(`Teacher goes to view the study plan item details`, async () => {
        await teacherGoesToStudyPlanItemDetails(this.teacher, studyPlanItemName);
    });

    await this.teacher.instruction(
        `Teacher sees questions of this LO ${studyPlanItemName} on Teacher App`,
        async () => {
            await teacherSeesLOQuestions(this.teacher, scenario, quizTypeTitle);
        }
    );
});

When('school admin change question type', async function () {
    const context = this.scenario;
    const questionName = context.get(aliasQuizQuestionName);
    const quizTypeTitle: QuizTypeTitle = context.get(aliasQuizTypeTitle);

    await this.cms.instruction('school admin waits for question data sync', async () => {
        await schoolAdminWaitingQuestionDataSync(this.cms);
        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();
    });

    await this.cms.instruction('school admin goes to edit question page', async () => {
        await schoolAdminGoesToEditQuestionPage(this.cms, questionName);
        await this.cms.waitingForLoadingIcon();
        await this.cms.waitForSkeletonLoading();
        await this.cms.waitingForLoadingIcon();
    });

    await this.cms.instruction(`school admin change question type`, async () => {
        const result = await schoolAdminEditsQuestionInfo(this.cms, 'type', quizTypeTitle);
        context.set(aliasQuizUpdatedInfo, result);
        context.set(aliasQuizTypeTitle, result.type);
    });

    await this.cms.instruction('school admin saves changes', async () => {
        await schoolAdminSubmitQuestion(this.cms);
    });
});
