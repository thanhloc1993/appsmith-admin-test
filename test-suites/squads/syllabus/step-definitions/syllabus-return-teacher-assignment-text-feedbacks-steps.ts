import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, LearnerInterface, TeacherInterface } from '@supports/app-types';

import {
    aliasTopicName,
    aliasAssignmentName,
    aliasCourseName,
    aliasRandomAssignments,
    aliasRandomTopics,
} from './alias-keys/syllabus';
import {
    studentAddAttachmentToAssignment,
    studentBackToHomeAfterSubmit,
    studentFillTextNoteAssignment,
    studentRecordVideoAssignment,
    studentSubmitAssignment,
} from './syllabus-assignment-submit-definitions';
import {
    upsertSampleBrightCoveLinkByGRPC,
    updateAssignmentByGRPC,
} from './syllabus-edit-assignment-definitions';
import { studentGoesToAssignmentScreenFromHome } from './syllabus-edit-studyplan-item-assignment-time-definitions';
import {
    studentDoesNotSeeTeacherTextFeedbacks,
    studentRefreshAssignmentScreen,
    studentSeesTeacherTextFeedbacks,
    teacherEntersAssignmentTextFeedbacks,
    teacherReturnsAndSavesChanges,
    teacherSetToNotMarkedAndSavesChanges,
    teacherSeesSuccessMessage,
    teacherSeesTextFeedbacks,
} from './syllabus-return-teacher-assignment-text-feedbacks-definitions';
import { AssignmentSetting } from 'manabuf/eureka/v1/assignments_pb';
import { Assignment, Topic } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export const sampleText =
    'In order to gain a better understanding of what a good short answer text looks like, we have included some examples written by students. Read or listen to the example texts below and think about what you can learn from how these students chose to solve the tasks. At the end of each text, you can read how an English teacher explains why these tasks are considered good short answer tasks.';

const sampleTextUpdated = 'Updated feedbacks';

export async function teacherReturnsTextFeedbacksForSubmission(
    masterWorld: IMasterWorld,
    feedbacks: string
): Promise<void> {
    const teacher = masterWorld.teacher;
    await teacher.instruction(
        `teacher enters feedbacks text`,
        async (teacher: TeacherInterface) => {
            await teacherEntersAssignmentTextFeedbacks(teacher, feedbacks);
        }
    );

    await teacher.instruction(`teacher saves changes`, async (teacher: TeacherInterface) => {
        await teacherReturnsAndSavesChanges(teacher);
    });
}

export async function teacherGivesTextFeedbacksForSubmission(
    masterWorld: IMasterWorld,
    feedbacks: string
): Promise<void> {
    const teacher = masterWorld.teacher;
    await teacher.instruction(
        `teacher enters feedbacks text`,
        async (teacher: TeacherInterface) => {
            await teacherEntersAssignmentTextFeedbacks(teacher, feedbacks);
        }
    );

    await teacher.instruction(`teacher saves changes`, async (teacher: TeacherInterface) => {
        await teacherSetToNotMarkedAndSavesChanges(teacher);
    });
}

export async function teacherSeesActionSuccess(
    masterWorld: IMasterWorld,
    isReturned: boolean,
    feedbacks: string
): Promise<void> {
    const teacher = masterWorld.teacher;
    await teacher.instruction(
        `teacher sees return success message`,
        async (teacher: TeacherInterface) => {
            await teacherSeesSuccessMessage(teacher, isReturned);
        }
    );

    await teacher.instruction(
        `teacher reloads assignment score screen`,
        async (teacher: TeacherInterface) => {
            await teacher.flutterDriver!.reload();
        }
    );

    await teacher.instruction(
        `teacher sees text feedbacks is returned`,
        async (teacher: TeacherInterface) => {
            await teacherSeesTextFeedbacks(teacher, feedbacks);
        }
    );
}

When(
    `teacher returns text feedbacks for submission`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherReturnsTextFeedbacksForSubmission(this, sampleText);
    }
);

When(
    `teacher gives text feedbacks for submission`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherGivesTextFeedbacksForSubmission(this, sampleText);
    }
);

When(
    `teacher updates existing submission's text feedbacks but doesn't return it`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherGivesTextFeedbacksForSubmission(this, sampleTextUpdated);
    }
);

When(
    `teacher deletes existing submission's text feedbacks but doesn't return it`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherGivesTextFeedbacksForSubmission(this, '');
    }
);

When(
    `teacher updates existing submission's text feedbacks and returns again`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherReturnsTextFeedbacksForSubmission(this, sampleTextUpdated);
    }
);

When(
    `teacher deletes existing submission's text feedbacks and returns again`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherReturnsTextFeedbacksForSubmission(this, '');
    }
);

Given(
    `school admin has checked on all assignment options`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const assignment = context.get<Assignment[]>(aliasRandomAssignments)[0];
        const assignmentSetting = new AssignmentSetting();

        assignmentSetting.setAllowLateSubmission(true);
        assignmentSetting.setAllowResubmission(true);
        assignmentSetting.setRequireAttachment(true);
        assignmentSetting.setRequireVideoSubmission(true);
        assignmentSetting.setRequireAssignmentNote(true);
        assignment.setting = assignmentSetting.toObject();

        await this.cms.instruction(
            `school admin check all assignment options by GRPC`,
            async function (cms) {
                const { response } = await upsertSampleBrightCoveLinkByGRPC(cms);
                assignment.attachmentsList = [response!.mediaIdsList[0]];
                // @ts-ignore Hieu will remove
                await updateAssignmentByGRPC(cms, assignment);
            }
        );
    }
);

Given(
    `student submits the assignment with all required fields`,
    { timeout: 100000 },
    async function (this: IMasterWorld): Promise<void> {
        const scenario = this.scenario;

        const topic = scenario.get<Topic[]>(aliasRandomTopics)[0];
        const assignmentName = scenario
            .get<Assignment[]>(aliasRandomAssignments)
            .find((assignment: Assignment) => assignment.content?.topicId === topic.id)!.name;

        scenario.set(aliasAssignmentName, assignmentName);

        await this.learner.instruction(
            `Fill text note ${assignmentName}`,
            async function (learner) {
                await studentFillTextNoteAssignment(learner, scenario);
            }
        );

        await this.learner.instruction(
            `Student attaches files to assignment`,
            async function (learner) {
                await studentAddAttachmentToAssignment(learner, scenario, 'image');
                await studentAddAttachmentToAssignment(learner, scenario, 'pdf');
                await studentAddAttachmentToAssignment(learner, scenario, 'video');
            }
        );

        await this.learner.instruction(
            `Student record video for assignmentName ${assignmentName}`,
            async function (learner) {
                await studentRecordVideoAssignment(learner, scenario);
            }
        );

        await this.learner.instruction(
            `Submit assignment ${assignmentName}`,
            async function (learner) {
                await studentSubmitAssignment(learner);
            }
        );

        await this.learner.instruction(
            `Back to home screen after submit assignment success`,
            async function (learner) {
                await studentBackToHomeAfterSubmit(learner, topic.name);
            }
        );
    }
);

Then(
    `teacher sees submission's text feedbacks is returned`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherSeesActionSuccess(this, true, sampleText);
    }
);

Then(
    `teacher sees submission's text feedbacks is saved`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherSeesActionSuccess(this, false, sampleText);
    }
);

Then(
    `teacher sees new submission's text feedbacks is saved`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherSeesActionSuccess(this, false, sampleTextUpdated);
    }
);

Then(
    `teacher sees new submission's text feedbacks is returned`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherSeesActionSuccess(this, true, sampleTextUpdated);
    }
);

Then(
    `teacher sees submission's text feedbacks is deleted`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherSeesActionSuccess(this, true, '');
    }
);

Then(
    `teacher sees submission's text feedbacks is empty`,
    async function (this: IMasterWorld): Promise<void> {
        await teacherSeesActionSuccess(this, false, '');
    }
);

Then(`student sees teacher's text feedbacks`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const topicName = context.get<string>(aliasTopicName);
    const assignmentName = context.get<string>(aliasAssignmentName);
    const courseName = context.get<string>(aliasCourseName);

    await this.learner.instruction(
        `student goes to assignment again`,
        async (learner: LearnerInterface) => {
            await studentGoesToAssignmentScreenFromHome(
                learner,
                assignmentName,
                courseName,
                topicName
            );
        }
    );

    await this.learner.instruction(
        `student sees teacher's text feedbacks`,
        async (learner: LearnerInterface) => {
            await studentSeesTeacherTextFeedbacks(learner, sampleText);
        }
    );
});

Then(
    `student sees teacher's text feedbacks is updated`,
    async function (this: IMasterWorld): Promise<void> {
        await this.learner.instruction(
            `student refresh assignment screen`,
            async (learner: LearnerInterface) => {
                await studentRefreshAssignmentScreen(learner);
            }
        );

        await this.learner.instruction(
            `student sees teacher's text feedbacks`,
            async (learner: LearnerInterface) => {
                await studentSeesTeacherTextFeedbacks(learner, sampleTextUpdated);
            }
        );
    }
);

Then(
    `student doesn't see teacher's text feedbacks anymore`,
    async function (this: IMasterWorld): Promise<void> {
        await this.learner.instruction(
            `student refresh assignment screen`,
            async (learner: LearnerInterface) => {
                await studentRefreshAssignmentScreen(learner);
            }
        );

        await this.learner.instruction(
            `student does not see teacher's text feedbacks anymore`,
            async (learner: LearnerInterface) => {
                await studentDoesNotSeeTeacherTextFeedbacks(learner);
            }
        );
    }
);

Then(
    `student doesn't see teacher's text feedbacks`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const topicName = context.get<string>(aliasTopicName);
        const assignmentName = context.get<string>(aliasAssignmentName);
        const courseName = context.get<string>(aliasCourseName);
        await this.learner.instruction(
            `student goes to assignment again`,
            async (learner: LearnerInterface) => {
                await studentGoesToAssignmentScreenFromHome(
                    learner,
                    assignmentName,
                    courseName,
                    topicName
                );
            }
        );

        await this.learner.instruction(
            `student does not see teacher's text feedbacks`,
            async (learner: LearnerInterface) => {
                await studentDoesNotSeeTeacherTextFeedbacks(learner);
            }
        );
    }
);
