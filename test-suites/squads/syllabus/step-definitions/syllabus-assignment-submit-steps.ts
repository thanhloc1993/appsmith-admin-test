import { delay } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { When, Then, Given } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasAssignmentFiles,
    aliasAssignmentName,
    aliasCourseId,
    aliasCourseName,
    aliasRandomAssignments,
    aliasRandomTopics,
    aliasTopicName,
} from './alias-keys/syllabus';
import {
    studentCanNotSubmitAssignment,
    studentGoToAssignmentInBook,
    studentGoToAssignmentInTodo,
    studentSubmitAssignment,
    studentBackToHomeAfterSubmit,
    teacherSeeAssignmentNotMarked,
    teacherCheckAssignmentNotMarked,
    studentFillTextNoteAssignment,
    teacherCheckAssignmentTextNote,
    studentAddAttachmentToAssignment,
    teacherCheckAssignmentAttachments,
    studentHasNotSubmittedAssignmentBefore,
    studentCanSubmitAssignment,
    studentRecordVideoAssignment,
    teacherTapAssignmentAttachments,
    teacherSeeVideoAssignmentAttachments,
} from './syllabus-assignment-submit-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    teacherGoesToStudyPlanDetails,
    teacherSeeStudyPlanItem,
} from './syllabus-study-plan-upsert-definitions';
import {
    studentGoesToTodosScreen,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { Assignment, Topic } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export type AssignmentType = 'text note' | 'recorded video' | 'attachment';

export type AttachmentType = 'image' | 'video' | 'pdf';

export type AssignmentWorkingType = AssignmentType | AttachmentType;

When('student submits the assignment', async function (this: IMasterWorld): Promise<void> {
    const scenario = this.scenario;

    const topic = scenario.get<Topic[]>(aliasRandomTopics)[0];
    const assignmentName = scenario
        .get<Assignment[]>(aliasRandomAssignments)
        .find((assignment: Assignment) => assignment.content?.topicId === topic.id)!.name;

    scenario.set(aliasAssignmentName, assignmentName);

    await this.learner.instruction(`Submit assignment ${assignmentName}`, async function (learner) {
        await studentSubmitAssignment(learner);
    });

    await this.learner.instruction(
        `Back to home screen after submit assignment success`,
        async function (learner) {
            await studentBackToHomeAfterSubmit(learner, topic.name);
        }
    );
});

Then(
    'the assignment is submitted on Learner App',
    async function (this: IMasterWorld): Promise<void> {
        const scenario = this.scenario;
        const assignmentName = scenario.get(aliasAssignmentName);

        await this.learner.instruction(`Go to Todos page`, async function (learner) {
            await studentGoesToTodosScreen(learner);
        });

        await this.learner.instruction(`Go to completed tab`, async function (learner) {
            await learner.clickOnTab(
                SyllabusLearnerKeys.completed_tab,
                SyllabusLearnerKeys.completed_page
            );
        });

        await this.learner.instruction(
            `Go to assignment ${assignmentName}`,
            async function (learner) {
                await studentGoToAssignmentInTodo(learner, assignmentName);
            }
        );
    }
);

Given(
    'student has not submitted assignment yet',
    async function (this: IMasterWorld): Promise<void> {
        await this.learner.instruction(
            `Student has not submitted assignment yet`,
            async function (learner) {
                await studentHasNotSubmittedAssignmentBefore(learner);
            }
        );
    }
);

Then(
    'student cannot submit the assignment again on Learner App',
    async function (this: IMasterWorld): Promise<void> {
        await this.learner.instruction(`Can not submit assignment again`, async function (learner) {
            await studentCanNotSubmitAssignment(learner);
        });
    }
);

Then(
    'teacher sees the submission on Teacher App',
    { timeout: 300000 },
    async function (this: IMasterWorld): Promise<void> {
        const scenario = this.scenario;
        const assignmentName = scenario.get(aliasAssignmentName);
        const courseId = scenario.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();

        // TODO: Temporary solution, will update when study plan detail stabled
        await this.teacher.instruction(`Teacher goes back to the home page`, async () => {
            const backButtonKey = new ByValueKey(SyllabusTeacherKeys.backButton);
            await this.teacher.flutterDriver!.tap(backButtonKey);
        });

        await this.teacher.instruction(`Teacher goes to that study plan detail again`, async () => {
            await teacherGoesToStudyPlanDetails(this.teacher, courseId, studentId);
            await this.teacher.flutterDriver!.waitFor(
                new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScreen)
            );
            await this.teacher.flutterDriver!.waitFor(
                new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTab)
            );
        });

        await this.teacher.instruction(
            `Teacher sees student's submission is not marked`,
            async () => {
                await teacherSeeStudyPlanItem(this.teacher, assignmentName);
                await teacherSeeAssignmentNotMarked(this.teacher, assignmentName);
            }
        );

        await this.teacher.instruction(
            `Teacher checks student's submission is not marked can be edit`,
            async () => {
                await teacherCheckAssignmentNotMarked(this.teacher, assignmentName);
            }
        );
    }
);

Then(
    'student cannot submit the assignment without {string} on Learner App',
    async function (this: IMasterWorld, assignmentType: AssignmentType) {
        const scenario = this.scenario;

        const courseName = scenario.get(aliasCourseName);
        const topicName = scenario.get(aliasTopicName);
        const assignmentName = scenario.get(aliasAssignmentName);

        scenario.set(aliasAssignmentName, assignmentName);
        await this.learner.instruction(
            `Go to course ${courseName} detail`,
            async function (learner) {
                await studentRefreshHomeScreen(learner);

                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(`Go to topic ${topicName} detail`, async function (learner) {
            await studentGoToTopicDetail(learner, topicName);
        });

        await this.learner.instruction(
            `Go to assignment ${assignmentName}`,
            async function (learner) {
                await studentGoToAssignmentInBook(learner, topicName, assignmentName);
            }
        );

        await this.learner.instruction(
            `Can not submit assignment ${assignmentName} without ${assignmentType}`,
            async function (learner) {
                await studentCanNotSubmitAssignment(learner);
            }
        );
    }
);

When(
    'student submits the assignment with {string}',
    {
        timeout: 100000,
    },
    async function (
        this: IMasterWorld,
        assignmentWorkingType: AssignmentWorkingType
    ): Promise<void> {
        const scenario = this.scenario;
        const assignmentName = scenario.get<string>(aliasAssignmentName);
        const topicName = scenario.get<string>(aliasTopicName);

        scenario.set(aliasAssignmentName, assignmentName);
        switch (assignmentWorkingType) {
            case 'text note':
                await this.learner.instruction(
                    `Fill text note ${assignmentName}`,
                    async function (learner) {
                        await studentFillTextNoteAssignment(learner, scenario);
                    }
                );
                break;
            case 'image':
            case 'pdf':
            case 'video':
                await this.learner.instruction(
                    `Student add ${assignmentWorkingType} to assignment`,
                    async function (learner) {
                        await studentAddAttachmentToAssignment(
                            learner,
                            scenario,
                            assignmentWorkingType
                        );
                    }
                );
                break;
            case 'recorded video':
                await this.learner.instruction(
                    `Student record video for assignmentName ${assignmentName}`,
                    async function (learner) {
                        await studentRecordVideoAssignment(learner, scenario);
                    }
                );
                break;
            default:
        }

        await this.learner.instruction(
            `Submit assignment ${assignmentName}`,
            async function (learner) {
                await studentSubmitAssignment(learner);
            }
        );

        await this.learner.instruction(
            `Back to home screen after submit assignment success`,
            async function (learner) {
                await studentBackToHomeAfterSubmit(learner, topicName);
            }
        );
    }
);

Then(
    'teacher sees the submission with {string} on Teacher App',
    { timeout: 300000 },
    async function (
        this: IMasterWorld,
        assignmentWorkingType: AssignmentWorkingType
    ): Promise<void> {
        const scenario = this.scenario;
        const assignmentName = scenario.get(aliasAssignmentName);
        const attachmentFileNames = scenario.get<string[]>(aliasAssignmentFiles);

        await this.teacher.instruction(`Refresh current web`, async function (teacher) {
            //Because Refresh Current Web not working so we back to home again.
            await teacher.flutterDriver?.reload();

            await delay(3000);

            await teacher.flutterDriver!.waitFor(
                new ByValueKey(SyllabusTeacherKeys.studentStudyPlanScreen)
            );
            await teacher.flutterDriver!.waitFor(
                new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTab)
            );
        });

        await this.teacher.instruction(
            `See student submission not marked`,
            async function (teacher) {
                await teacherSeeStudyPlanItem(teacher, assignmentName);
                await teacherSeeAssignmentNotMarked(teacher, assignmentName);
            }
        );

        await this.teacher.instruction(
            `Check student submission not marked can be edit`,
            async function (teacher) {
                await teacherCheckAssignmentNotMarked(teacher, assignmentName);
            }
        );

        switch (assignmentWorkingType) {
            case 'text note':
                await this.teacher.instruction(
                    `Check student's assignment note submission`,
                    async function (teacher) {
                        await teacherCheckAssignmentTextNote(teacher);
                    }
                );
                break;
            case 'image':
            case 'pdf':
            case 'video':
                await this.teacher.instruction(
                    `Check student's attachment assignment submission ${assignmentWorkingType}: ${attachmentFileNames[0]}`,
                    async function (teacher) {
                        await teacherCheckAssignmentAttachments(teacher, attachmentFileNames[0]);
                    }
                );
                break;
            case 'recorded video':
                await this.teacher.instruction(
                    `Check student's attachment assignment submission ${assignmentWorkingType}: ${attachmentFileNames[0]}`,
                    async function (teacher) {
                        await teacherCheckAssignmentAttachments(teacher, attachmentFileNames[0]);
                    }
                );
                break;
            default:
        }
    }
);

Then(
    'teacher plays the {string} on Teacher App',
    { timeout: 300000 },
    async function (
        this: IMasterWorld,
        assignmentWorkingType: AssignmentWorkingType
    ): Promise<void> {
        const scenario = this.scenario;
        const attachmentFileNames = scenario.get<string[]>(aliasAssignmentFiles);

        switch (assignmentWorkingType) {
            case 'video':
            case 'recorded video':
                await this.teacher.instruction(
                    `Tap student's attachment assignment submission ${assignmentWorkingType}: ${attachmentFileNames[0]}`,
                    async function (teacher) {
                        await teacherTapAssignmentAttachments(teacher, attachmentFileNames[0]);
                    }
                );
                await this.teacher.instruction(
                    `See student's video attachment assignment submission`,
                    async function (teacher) {
                        await teacherSeeVideoAssignmentAttachments(teacher);
                    }
                );
                break;
            default:
        }
    }
);

//Because scenario need When step
When('student try to submit the assignment', async function (this: IMasterWorld) {
    await this.learner.instruction(`Try to submit assignment`, async function (learner) {
        await studentCanNotSubmitAssignment(learner);
    });
});

Then('student cannot submit the assignment', async function (this: IMasterWorld) {
    await this.learner.instruction(`Can not submit assignment`, async function (learner) {
        await studentCanNotSubmitAssignment(learner);
    });
});

Then(
    "student can submit the assignment after assignment's due time on Learner App",
    async function (this: IMasterWorld) {
        const scenario = this.scenario;

        const courseName = scenario.get(aliasCourseName);
        const topicName = scenario.get(aliasTopicName);
        const assignmentName = scenario.get(aliasAssignmentName);

        scenario.set(aliasAssignmentName, assignmentName);
        await this.learner.instruction(
            `Go to course ${courseName} detail`,
            async function (learner) {
                await studentRefreshHomeScreen(learner);

                await studentGoToCourseDetail(learner, courseName);
            }
        );

        await this.learner.instruction(`Go to topic ${topicName} detail`, async function (learner) {
            await studentGoToTopicDetail(learner, topicName);
        });

        await this.learner.instruction(
            `Go to assignment ${assignmentName}`,
            async function (learner) {
                await studentGoToAssignmentInBook(learner, topicName, assignmentName);
            }
        );

        await this.learner.instruction(
            `Student can submit assignment ${assignmentName}`,
            async function (learner) {
                await studentCanSubmitAssignment(learner);
            }
        );
    }
);
