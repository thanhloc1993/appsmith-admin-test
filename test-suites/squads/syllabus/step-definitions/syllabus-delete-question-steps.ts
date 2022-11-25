import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasLOName,
    aliasQuizQuestionName,
    aliasTopicName,
} from './alias-keys/syllabus';
import { questionRow } from './cms-selectors/cms-keys';
import {
    getAllQuizQuestionsNameInTable,
    schoolAdminSeeQuestionInTable,
    schoolAdminSelectPreviewQuestionInTable,
    studentGoesToLODetailsPage,
    teacherGoesToStudyPlanItemDetails,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    schoolAdminSelectsDeleteQuestionInReview,
    schoolAdminClicksQuestionOptions,
    schoolAdminDeletesAQuestion,
    schoolAdminDoesNotSeeQuestion,
    schoolAdminWaitingDeleteQuestionDialogHidden,
    studentDoesNotSeeQuestion,
    teacherDoesNotSeeQuestion,
} from './syllabus-delete-question-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';

When('school admin deletes the question', async function (this: IMasterWorld) {
    const questionName = this.scenario.get(aliasQuizQuestionName);

    await this.cms.instruction(
        `school admin chooses question delete options`,
        async function (cms) {
            await schoolAdminClicksQuestionOptions(cms, questionName);
        }
    );

    await this.cms.instruction('school admin deletes the question created', async function (cms) {
        await schoolAdminDeletesAQuestion(cms);
    });

    await schoolAdminWaitingDeleteQuestionDialogHidden(this.cms);

    await this.cms.waitForSkeletonLoading();
});

Then('school admin does not see the deleted question on CMS', async function () {
    const questionName = this.scenario.get<string>(aliasQuizQuestionName);

    await this.cms.instruction(
        `school admin does not sees the new question ${questionName} on CMS`,
        async function (cms) {
            await schoolAdminDoesNotSeeQuestion(cms, questionName);
        }
    );

    const isEmptyTable = await this.cms.page!.isVisible(questionRow);
    if (isEmptyTable) return;

    await getAllQuizQuestionsNameInTable(this.cms, this.scenario);
});

Then(
    'student does not see the question on Learner App',
    { timeout: 100000 },
    // waiting for doing questions in book and see new question added
    async function (this: IMasterWorld) {
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
            `Student does not see deleted question of this LO ${studyPlanItemName} on Learner App`,
            async function (learner) {
                await studentDoesNotSeeQuestion(learner, scenario);
            }
        );
    }
);

Then('teacher does not see the question on Teacher App', async function (this: IMasterWorld) {
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
        `Teacher sees and goes to view the study plan item details`,
        async function (teacher) {
            await teacherGoesToStudyPlanItemDetails(teacher, studyPlanItemName);
        }
    );

    await this.teacher.instruction(
        `Teacher does not see deleted question of this LO ${studyPlanItemName} on Teacher App`,
        async function (teacher) {
            await teacherDoesNotSeeQuestion(teacher, scenario);
        }
    );
});

When(
    'school admin deletes the question in {string}',
    async function (place: 'question list' | 'question detail preview') {
        const questionName = this.scenario.get(aliasQuizQuestionName);

        if (place === 'question list') {
            await this.cms.instruction(
                `school admin chooses option of ${questionName}`,
                async function (cms) {
                    await schoolAdminClicksQuestionOptions(cms, questionName);
                }
            );
            await this.cms.instruction('school admin deletes the question', async () => {
                await schoolAdminDeletesAQuestion(this.cms, false);
            });
        }

        if (place === 'question detail preview') {
            await this.cms.instruction(
                `school admin clicks review of ${questionName}`,
                async () => {
                    await schoolAdminSelectPreviewQuestionInTable(this.cms, questionName);
                }
            );

            await this.cms.instruction('school admin deletes the question', async () => {
                await schoolAdminSelectsDeleteQuestionInReview(this.cms);
            });
        }

        await this.cms.instruction(`school admin confirms delete question`, async () => {
            await this.cms.confirmDialogAction();
        });
    }
);

Given('school admin goes to LO detail page', async function () {
    const loName = this.scenario.get(aliasLOName);

    await schoolAdminClickLOByName(this.cms, loName);

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();
});

Then('school admin still sees the question on CMS', async function () {
    const questionName = this.scenario.get(aliasQuizQuestionName);

    await this.cms.instruction(`school admin still sees question ${questionName}`, async () => {
        await schoolAdminSeeQuestionInTable(this.cms, questionName);
    });
});
