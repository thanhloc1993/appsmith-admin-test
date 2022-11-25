import { Then } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasAssignmentName, aliasCourseName, aliasTopicName } from './alias-keys/syllabus';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { studentResubmitAssignmentByTimes } from './syllabus-resubmit-assignment-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';

Then(
    'student can resubmit the assignment many times on Learner App',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);
        const assignmentName = context.get<string>(aliasAssignmentName);
        const resubmittedTimes = 2;

        await this.learner.instruction(
            `Student goes to course ${courseName} detail`,
            async function (learner) {
                await studentRefreshHomeScreen(learner);
                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(
            `Student goes to topic ${topicName} detail`,
            async function (learner) {
                await studentGoToTopicDetail(learner, topicName);
            }
        );

        await this.learner.instruction(
            `Student submits assignment ${assignmentName} then resubmitting ${resubmittedTimes} times`,
            async function (learner) {
                await studentResubmitAssignmentByTimes(learner, {
                    topicName,
                    assignmentName,
                    resubmittedTimes,
                });
            }
        );
    }
);
