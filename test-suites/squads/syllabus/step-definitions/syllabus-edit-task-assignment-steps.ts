import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasTaskAssignmentFiles,
    aliasTaskAssignmentInstruction,
    aliasTaskAssignmentName,
    aliasTopicName,
} from './alias-keys/syllabus';
import {
    teacherGoToCourseStudentDetail,
    teacherWaitingForStudyPlanListVisible,
} from './create-course-studyplan-definitions';
import {
    schoolAdminSeesTaskAssignment,
    TaskAssignmentInfo,
} from './syllabus-create-task-assignment-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    schoolAdminSelectEditTaskAssignment,
    schoolAdminUpdateTaskAssignmentValue,
    schoolAdminUploadTaskAssignmentAttachments,
    studentSeesUpdatedTaskAssignmentInfo,
    teacherSeesAndGoesToStudyPlanItemDetails,
    teacherSeesUpdatedTaskAssignmentInfo,
} from './syllabus-edit-task-assignment-definitions';
import { studentSeeStudyPlanItem } from './syllabus-study-plan-upsert-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import { genId } from 'step-definitions/utils';

const sampleFiles = ['sample-pdf.pdf', 'sample-video.mp4', 'sample-audio.mp3'];

When(
    'school admin edits task assignment {string}',
    {
        timeout: 100000,
    },
    async function (this: IMasterWorld, taskAssignmentInfo: TaskAssignmentInfo) {
        const taskAssignmentName = this.scenario.get<string>(aliasTaskAssignmentName);

        await this.cms.instruction(
            `school admin goes to assignment details, select to edit the task assignment`,
            async () => {
                await schoolAdminClickLOByName(this.cms, taskAssignmentName);
                await schoolAdminSelectEditTaskAssignment(this.cms);
            }
        );

        await this.cms.instruction(
            `school admin updates the ${taskAssignmentInfo} of the task assignment`,
            async () => {
                switch (taskAssignmentInfo) {
                    case 'name': {
                        const newName = `Updated ${taskAssignmentName}`;
                        await schoolAdminUpdateTaskAssignmentValue(
                            this.cms,
                            taskAssignmentInfo,
                            newName
                        );
                        this.scenario.set(aliasTaskAssignmentName, newName);
                        return;
                    }
                    case 'description': {
                        const newInstruction = `Updated task assignment instruction ${genId()}`;
                        await schoolAdminUpdateTaskAssignmentValue(
                            this.cms,
                            'instruction',
                            newInstruction
                        );
                        this.scenario.set(aliasTaskAssignmentInstruction, newInstruction);
                        return;
                    }
                    case 'attachments': {
                        await schoolAdminUploadTaskAssignmentAttachments(this.cms, sampleFiles);
                        this.scenario.set(aliasTaskAssignmentFiles, sampleFiles);
                        return;
                    }
                }
            }
        );

        await this.cms.waitForSkeletonLoading();
    }
);

Then(
    'school admin sees the edited task assignment {string} on CMS',
    async function (this: IMasterWorld, taskAssignmentInfo: TaskAssignmentInfo) {
        const name = this.scenario.get<string>(aliasTaskAssignmentName);
        const instruction = this.scenario.get<string>(aliasTaskAssignmentInstruction);
        const attachments = this.scenario.get<string[]>(aliasTaskAssignmentFiles);

        await this.cms.instruction(
            `school admin sees the task assignment with updated ${taskAssignmentInfo}`,
            async () => {
                await schoolAdminSeesTaskAssignment(this.cms, taskAssignmentInfo, {
                    name,
                    instruction,
                    attachments,
                });
            }
        );
    }
);

Then(
    'student sees the edited task assignment {string} on Learner App',
    async function (this: IMasterWorld, taskAssignmentInfo: TaskAssignmentInfo) {
        await this.learner.instruction(
            `student refreshes course list and go to course details page`,
            async () => {
                const courseName = this.scenario.get<string>(aliasCourseName);
                await studentRefreshHomeScreen(this.learner);
                await studentGoToCourseDetail(this.learner, courseName);
            }
        );

        await this.learner.instruction(
            `student goes to the topic details of the assignment`,
            async () => {
                const topicName = this.scenario.get<string>(aliasTopicName);
                await studentGoToTopicDetail(this.learner, topicName);
            }
        );

        await this.learner.instruction(
            `student sees the task assignment with the update ${taskAssignmentInfo}`,
            async () => {
                const topicName = this.scenario.get<string>(aliasTopicName);
                const taskAssignmentName = this.scenario.get<string>(aliasTaskAssignmentName);
                const instruction = this.scenario.get<string>(aliasTaskAssignmentInstruction);
                const attachments = this.scenario.get<string[]>(aliasTaskAssignmentFiles);

                await studentSeeStudyPlanItem(this.learner, topicName, taskAssignmentName);

                await studentSeesUpdatedTaskAssignmentInfo(
                    this.learner,
                    taskAssignmentName,
                    taskAssignmentInfo,
                    {
                        instruction,
                        attachments,
                    }
                );
            }
        );
    }
);

Then(
    'teacher sees the edited task assignment {string} on Teacher App',
    async function (this: IMasterWorld, taskAssignmentInfo: TaskAssignmentInfo) {
        const courseName = this.scenario.get<string>(aliasCourseName);
        const courseId = this.scenario.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();

        await this.teacher.instruction(
            `teacher goes to course ${courseName} student tab`,
            async () => {
                await teacherGoToCourseStudentDetail(this.teacher, courseId, studentId);
                await teacherWaitingForStudyPlanListVisible(this.teacher);
            }
        );

        await this.teacher.instruction(
            `teacher sees the task assignment with the update ${taskAssignmentInfo}`,
            async () => {
                const taskAssignmentName = this.scenario.get<string>(aliasTaskAssignmentName);
                const instruction = this.scenario.get<string>(aliasTaskAssignmentInstruction);
                const attachments = this.scenario.get<string[]>(aliasTaskAssignmentFiles);

                await teacherSeesAndGoesToStudyPlanItemDetails(this.teacher, taskAssignmentName);

                await teacherSeesUpdatedTaskAssignmentInfo(this.teacher, taskAssignmentInfo, {
                    instruction,
                    attachments,
                });
            }
        );
    }
);
