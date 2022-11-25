import { Then, When } from '@cucumber/cucumber';

import { LearnerInterface } from '@supports/app-types';

import {
    aliasCourseName,
    aliasTaskAssignmentName,
    aliasTaskAssignmentSetting,
    aliasTopicName,
} from './alias-keys/syllabus';
import { studentGoesToLODetailsPage } from './syllabus-create-question-definitions';
import { TaskAssignmentSettingInfo } from './syllabus-create-task-assignment-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { LearningFlow } from './syllabus-resume-learning-on-retry-mode-steps';
import {
    learnerSeesTaskAssignmentCompleteDate,
    learnerSeesTaskAssignmentRequiredField,
} from './syllabus-see-task-assignment-on-learner-app-definitions';
import { studentSeeStudyPlanItem } from './syllabus-study-plan-upsert-definitions';
import {
    studentGoesToHomeTab,
    studentGoesToTabInToDoScreen,
    studentGoesToTodosScreen,
    studentGoToCourseDetail,
    studentGoToStudyPlanItemDetailsFromTodo,
    studentRefreshHomeScreen,
} from './syllabus-utils';

When(
    `student goes to task assignment in {string} from Home Screen`,
    { timeout: 50000 },
    async function (learningFlow: LearningFlow): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);

        const taskAssignmentName = context.get<string>(aliasTaskAssignmentName);

        switch (learningFlow) {
            case 'course flow':
                await studentGoesToHomeTab(learner);
                await studentRefreshHomeScreen(learner);
                await studentGoToCourseDetail(learner, courseName);
                await studentGoToTopicDetail(learner, topicName);

                await this.learner.instruction(
                    `Student sees the task assignment ${taskAssignmentName}`,
                    async (learner) => {
                        await studentSeeStudyPlanItem(learner, topicName, taskAssignmentName);
                    }
                );

                await this.learner.instruction(
                    `Student go to the task assignment ${taskAssignmentName} detail screen`,
                    async (learner) => {
                        await studentGoesToLODetailsPage(learner, topicName, taskAssignmentName);
                    }
                );

                break;
            case 'todo flow':
                await studentGoesToTodosScreen(learner);
                await studentGoesToTabInToDoScreen(learner, context, 'active');
                await studentGoToStudyPlanItemDetailsFromTodo(
                    learner,
                    taskAssignmentName,
                    'active'
                );
                break;
            default:
                break;
        }
    }
);

Then(
    `student sees task assignment with required fields`,
    { timeout: 50000 },
    async function (): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const setting = context.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

        await learner.instruction(
            `student sees complete date`,
            async function (this: LearnerInterface) {
                await learnerSeesTaskAssignmentCompleteDate(learner);
            }
        );

        for (let i = 0; i < setting.length; i++) {
            switch (setting[i]) {
                case 'Text note':
                    await learner.instruction(
                        `student sees text note`,
                        async function (this: LearnerInterface) {
                            await learnerSeesTaskAssignmentRequiredField(this, 'Text note');
                        }
                    );
                    break;
                case 'Correctness':
                    await learner.instruction(
                        `student sees correctness`,
                        async function (this: LearnerInterface) {
                            await learnerSeesTaskAssignmentRequiredField(this, 'Correctness');
                        }
                    );
                    break;
                case 'Duration':
                    await learner.instruction(
                        `student sees duration`,
                        async function (this: LearnerInterface) {
                            await learnerSeesTaskAssignmentRequiredField(this, 'Duration');
                        }
                    );
                    break;
                case 'File attachment':
                    await learner.instruction(
                        `student sees attachment`,
                        async function (this: LearnerInterface) {
                            await learnerSeesTaskAssignmentRequiredField(this, 'File attachment');
                        }
                    );
                    break;
                case 'Understanding level':
                    await learner.instruction(
                        `student sees understanding level`,
                        async function (this: LearnerInterface) {
                            await learnerSeesTaskAssignmentRequiredField(
                                this,
                                'Understanding level'
                            );
                        }
                    );
                    break;
            }
        }
    }
);
