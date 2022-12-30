import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { QuizTypeTitle } from '@supports/types/cms-types';

import {
    aliasBookDetailsPage,
    aliasBookIds,
    aliasBookName,
    aliasCourseId,
    aliasCourseName,
    aliasLOName,
    aliasTopicName,
} from './alias-keys/syllabus';
import { schoolAdminIsOnBookDetailPageByUrl } from './book-definitions';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import {
    schoolAdminChooseToCreateAQuestion,
    schoolAdminGoesToLODetailsPage,
    schoolAdminSeesNewQuestionCreated,
    studentGoesToLODetailsPage,
    studentSeesAndDoesLOQuestions,
    teacherGoesToStudyPlanItemDetails,
    teacherSeesLOQuestions,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { schoolAdminWaitingQuestionDataSync } from './syllabus-migration-temp';
import {
    schoolAdminWaitingLODetailPage,
    schoolAdminWaitingQuizTableInTheLODetail,
} from './syllabus-question-utils';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';

Given('school admin is at a LO detail page', async function (this: IMasterWorld) {
    const scenario = this.scenario;
    const loName = scenario.get<string>(aliasLOName);
    const bookId = scenario.get<string[]>(aliasBookIds)[0];
    const bookName = this.scenario.get<string>(aliasBookName);

    try {
        await this.cms.instruction('school admin goes to book detail page', async function (cms) {
            await schoolAdminIsOnBookDetailsPage(cms, scenario);
        });
    } catch {
        await this.cms.instruction(
            `school admin goes to book ${bookName} detail page by url with book id ${bookId}`,
            async function (cms) {
                await schoolAdminIsOnBookDetailPageByUrl(cms, {
                    id: bookId,
                    name: bookName,
                });
            }
        );

        scenario.set(aliasBookDetailsPage, this.cms.page!.url());
    }

    await this.cms.instruction('school admin goes to LO details page', async function (cms) {
        await schoolAdminGoesToLODetailsPage(cms, loName);
    });
});

When(
    'school admin creates a new {string} question',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle) {
        const context = this.scenario;
        await schoolAdminChooseToCreateAQuestion(this.cms, context, quizTypeTitle);
    }
);

Given(
    'school admin has created a new {string} question',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle) {
        const context = this.scenario;
        await schoolAdminChooseToCreateAQuestion(this.cms, context, quizTypeTitle);

        await schoolAdminWaitingQuestionDataSync(this.cms);

        await this.cms.waitingForLoadingIcon();

        await schoolAdminWaitingQuizTableInTheLODetail(this.cms);

        await this.cms.waitForSkeletonLoading();

        await schoolAdminSeesNewQuestionCreated(this.cms, context, quizTypeTitle);
    }
);

Then(
    'school admin sees the new {string} question on CMS',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle) {
        const context = this.scenario;

        await schoolAdminWaitingLODetailPage(this.cms);

        await schoolAdminSeesNewQuestionCreated(this.cms, context, quizTypeTitle);
    }
);

Then(
    'student sees the new {string} question on Learner App',
    { timeout: 100000 },
    // waiting for doing questions in book and see new question added
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const studyPlanItemName = scenario.get<string>(aliasLOName);

        await this.learner.instruction('Student refreshes home screen', async function (learner) {
            await studentRefreshHomeScreen(learner);
        });

        await this.learner.instruction(
            `Student goes to ${courseName} detail`,
            async function (learner) {
                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(
            `Student goes to ${topicName} detail`,
            async function (learner) {
                await studentGoToTopicDetail(learner, topicName);
            }
        );

        await this.learner.instruction(
            `Student goes to ${studyPlanItemName} detail`,
            async function (learner) {
                await studentGoesToLODetailsPage(learner, topicName, studyPlanItemName);
            }
        );

        await this.learner.instruction(
            `Student sees questions of this LO ${studyPlanItemName} on Learner App`,
            async function (learner) {
                await studentSeesAndDoesLOQuestions(learner, scenario, quizTypeTitle);
            }
        );
    }
);

Then(
    'teacher sees the new {string} question on Teacher App',
    async function (this: IMasterWorld, quizTypeTitle: QuizTypeTitle) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const courseId = scenario.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();
        const studyPlanItemName = scenario.get<string>(aliasLOName);

        await this.teacher.instruction(
            `Teacher goes to course ${courseName} student tab from home page`,
            async function (teacher) {
                await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `Teacher goes to view the study plan item details`,
            async function (teacher) {
                await teacherGoesToStudyPlanItemDetails(teacher, studyPlanItemName);
            }
        );

        await this.teacher.instruction(
            `Teacher sees questions of this LO ${studyPlanItemName} on Teacher App`,
            async function (teacher) {
                await teacherSeesLOQuestions(teacher, scenario, quizTypeTitle);
            }
        );
    }
);
