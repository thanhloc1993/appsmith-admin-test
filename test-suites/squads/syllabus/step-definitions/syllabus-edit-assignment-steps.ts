import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { ActionOptions } from '@supports/types/cms-types';

import {
    aliasAssignmentName,
    aliasAssignmentSettingInfo,
    aliasCourseId,
    aliasCourseName,
    aliasRandomAssignments,
    aliasTopicName,
} from './alias-keys/syllabus';
import {
    teacherGoToCourseStudentDetail,
    teacherWaitingForStudyPlanListVisible,
} from './create-course-studyplan-definitions';
import { studentGoToAssignmentInBook } from './syllabus-assignment-submit-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { schoolAdminClickOptionOnHeader } from './syllabus-delete-learning-objective-definitions';
import {
    schoolAdminGoesToAssignmentDetails,
    schoolAdminSeesUpdatedAssignmentInfo,
    schoolAdminSeesUpdatedAssignmentSettingInfo,
    schoolAdminSelectEditAssignment,
    schoolAdminSelectEditAssignmentSetting,
    schoolAdminUpdateAssignmentGrade,
    schoolAdminUpdateAssignmentInstruction,
    schoolAdminUpdateAssignmentName,
    schoolAdminUploadAssignmentAttachments,
    studentSeesUpdatedAssignmentInfo,
    teacherSeesUpdatedAssignmentInfo,
    updateAssignmentByGRPC,
    upsertSampleBrightCoveLinkByGRPC,
} from './syllabus-edit-assignment-definitions';
import {
    teacherGoesToStudyPlanDetails,
    teacherSeeStudyPlanItem,
} from './syllabus-study-plan-upsert-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';
import { AssignmentSetting } from 'manabuf/eureka/v1/assignments_pb';
import { Assignment } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export type AssignmentInfo =
    | 'name'
    | 'instruction'
    | 'attachments'
    | 'require grading'
    | 'not require grading';

export type AssignmentSettingInfo =
    | 'Allow resubmission'
    | 'Allow late submission'
    | 'Require text note submission'
    | 'Require recorded video submission'
    | 'Require attachment submission';

When(
    `school admin edits assignment {string}`,
    {
        timeout: 100000, //Waiting upload attachments
    },
    async function (this: IMasterWorld, assignmentInfo: AssignmentInfo): Promise<void> {
        const context = this.scenario;
        const assignmentName = context.get<string>(aliasAssignmentName);

        await this.cms.instruction(
            `school admin goes to assignment details, select to edit the assignment`,
            async function (cms) {
                await schoolAdminGoesToAssignmentDetails(cms, context, assignmentName);
                await schoolAdminSelectEditAssignment(cms);
            }
        );

        await this.cms.instruction(
            `school admin updates the ${assignmentInfo} of the assignment`,
            async function (cms) {
                switch (assignmentInfo) {
                    case 'name':
                        return schoolAdminUpdateAssignmentName(cms, context, assignmentName);
                    case 'instruction':
                        return schoolAdminUpdateAssignmentInstruction(cms, context);
                    case 'require grading':
                    case 'not require grading':
                        return schoolAdminUpdateAssignmentGrade(cms, context, assignmentInfo);
                    case 'attachments':
                        return schoolAdminUploadAssignmentAttachments(cms, context);
                }
            }
        );

        await this.cms.waitForSkeletonLoading();
    }
);

Then(
    `school admin sees the edited assignment {string} on CMS`,
    { timeout: 50000 },
    async function (this: IMasterWorld, assignmentInfo: AssignmentInfo): Promise<void> {
        const context = this.scenario;

        await this.cms.instruction(
            `school admin sees the assignment with updated ${assignmentInfo}`,
            async function (cms) {
                await schoolAdminSeesUpdatedAssignmentInfo(cms, context, assignmentInfo);
            }
        );
    }
);

Then(
    `student sees the edited assignment {string} on Learner App`,
    async function (this: IMasterWorld, assignmentInfo: AssignmentInfo): Promise<void> {
        const context = this.scenario;

        await this.learner.instruction(
            `student refreshes course list and go to course details page`,
            async function (learner) {
                const courseName = context.get<string>(aliasCourseName);
                await studentRefreshHomeScreen(learner);
                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(
            `student goes to the topic details of the assignment`,
            async function (learner) {
                const topicName = context.get<string>(aliasTopicName);
                await studentGoToTopicDetail(learner, topicName);
            }
        );

        await this.learner.instruction(
            `student sees the assignment with the update ${assignmentInfo}`,
            async function (learner) {
                await studentSeesUpdatedAssignmentInfo(learner, context, assignmentInfo);
            }
        );
    }
);

Then(
    `teacher sees the edited assignment {string} on Teacher App`,
    async function (this: IMasterWorld, assignmentInfo: AssignmentInfo): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();

        await this.teacher.instruction(`Go to course ${courseName} student tab`, async () => {
            await teacherGoToCourseStudentDetail(this.teacher, courseId, studentId);
            await teacherWaitingForStudyPlanListVisible(this.teacher);
        });

        await this.teacher.instruction(
            `teacher sees the assignment with the update ${assignmentInfo}`,
            async function (teacher) {
                await teacherSeesUpdatedAssignmentInfo(teacher, context, assignmentInfo);
            }
        );
    }
);

//EDIT ASSIGNMENT SETTING
Given(
    'school admin goes to an assignment detail page of the content book',
    async function (this: IMasterWorld): Promise<void> {
        const scenario = this.scenario;
        const assignmentName = scenario.get<string>(aliasAssignmentName);

        await this.cms.instruction(
            `school admin goes to assignment details, select to edit the assignment`,
            async function (cms) {
                await schoolAdminGoesToAssignmentDetails(cms, scenario, assignmentName);
            }
        );
    }
);

When(
    'school admin edits assignment setting to include {string}',
    async function (this: IMasterWorld, assignmentSettingInfo: AssignmentSettingInfo) {
        const scenario = this.scenario;
        scenario.set(aliasAssignmentSettingInfo, assignmentSettingInfo);

        await this.cms.instruction(
            `school admin select to edit the assignment`,
            async function (cms) {
                await schoolAdminSelectEditAssignment(cms);
            }
        );

        await this.cms.instruction(
            `school admin edit setting ${assignmentSettingInfo}`,
            async function (cms) {
                await schoolAdminSelectEditAssignmentSetting(cms, scenario, assignmentSettingInfo);
            }
        );
    }
);

Then(
    'school admin sees the edited assignment setting on CMS',
    async function (this: IMasterWorld): Promise<void> {
        const scenario = this.scenario;
        const assignmentSettingInfo = scenario.get<AssignmentSettingInfo>(
            aliasAssignmentSettingInfo
        );

        await this.cms.instruction(
            `School admin see assignment is edited with ${assignmentSettingInfo}`,
            async function (cms) {
                await schoolAdminSeesUpdatedAssignmentSettingInfo(
                    cms,
                    scenario,
                    assignmentSettingInfo
                );
            }
        );
    }
);

Then(
    'teacher does not see the edited assignment setting on Teacher App',
    async function (this: IMasterWorld): Promise<void> {
        console.log('Teacher can not see assignment setting on Teacher App');
    }
);

Given(
    `school admin has edited an assignment setting to include {string}`,
    async function (
        this: IMasterWorld,
        assignmentSettingInfo: AssignmentSettingInfo
    ): Promise<void> {
        const context = this.scenario;
        const assignmentName = context.get<string>(aliasAssignmentName);
        const assignment = context.get<Assignment[]>(aliasRandomAssignments)[0];
        context.set(aliasAssignmentSettingInfo, assignmentSettingInfo);
        const assignmentSetting = new AssignmentSetting();
        switch (assignmentSettingInfo) {
            case 'Allow late submission':
                assignmentSetting.setAllowLateSubmission(true);
                break;
            case 'Allow resubmission':
                assignmentSetting.setAllowResubmission(true);
                break;
            case 'Require attachment submission':
                assignmentSetting.setRequireAttachment(true);
                break;
            case 'Require recorded video submission':
                assignmentSetting.setRequireVideoSubmission(true);
                break;
            case 'Require text note submission':
                assignmentSetting.setRequireAssignmentNote(true);
                break;
        }

        assignment.setting = assignmentSetting.toObject();

        await this.cms.instruction(
            `teacher edit ${assignmentName} with setting has ${assignmentSettingInfo} by GRPC`,
            async function (cms) {
                if (assignmentSettingInfo === 'Require recorded video submission') {
                    const { response } = await upsertSampleBrightCoveLinkByGRPC(cms);
                    assignment.attachmentsList = [response!.mediaIdsList[0]];
                }
                // @ts-ignore Hieu will remove
                await updateAssignmentByGRPC(cms, assignment);
            }
        );
    }
);

Given(
    `teacher and student see the edited assignment in their apps`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);
        const assignmentName = context.get<string>(aliasAssignmentName);
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();
        const assignmentSettingInfo = context.get<string>(aliasAssignmentSettingInfo);

        await this.teacher.instruction(
            `teacher see ${assignmentName} with setting has ${assignmentSettingInfo}`,
            async function (teacher) {
                await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
                await teacherSeeStudyPlanItem(teacher, assignmentName);
            }
        );

        await this.learner.instruction(
            `student see ${assignmentName} with setting has ${assignmentSettingInfo}`,
            async function (learner) {
                await learner.instruction(
                    `Go to course ${courseName} detail`,
                    async function (learner) {
                        await studentRefreshHomeScreen(learner);
                        await studentGoToCourseDetail(learner, courseName);
                    }
                );

                await learner.instruction(
                    `Go to topic ${topicName} detail`,
                    async function (learner) {
                        await studentGoToTopicDetail(learner, topicName);
                    }
                );

                await learner.instruction(
                    `Go to assignment ${assignmentName}`,
                    async function (learner) {
                        await studentGoToAssignmentInBook(learner, topicName, assignmentName);
                    }
                );
            }
        );
    }
);

Given('school admin goes to assignment edit page', async function () {
    const assignmentName = this.scenario.get(aliasAssignmentName);

    await this.cms.instruction(
        `school admin clicks ${assignmentName} in the book detail`,
        async () => {
            await schoolAdminClickLOByName(this.cms, assignmentName);
        }
    );

    await this.cms.waitingForLoadingIcon();
    await this.cms.waitForSkeletonLoading();

    await this.cms.instruction('school admin see assignment detail loaded', async () => {
        await this.cms.assertThePageTitle(assignmentName);
    });

    await schoolAdminClickOptionOnHeader(this.cms, ActionOptions.EDIT);
});
