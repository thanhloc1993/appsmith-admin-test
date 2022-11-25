import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld, LearnerInterface, TeacherInterface } from '@supports/app-types';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasAssignmentFiles,
    aliasCourseId,
    aliasCourseName,
    aliasTaskAssignmentCompleteDate,
    aliasTaskAssignmentCorrectness,
    aliasTaskAssignmentDuration,
    aliasTaskAssignmentName,
    aliasTaskAssignmentSetting,
    aliasTaskAssignmentTextNote,
    aliasTaskAssignmentUnderstandingLevel,
} from './alias-keys/syllabus';
import { TaskAssignmentSettingInfo } from './syllabus-create-task-assignment-definitions';
import {
    studentSeesDefaultCompleteDate,
    studentDoesNotSeeSubmittedCorrectness,
    studentDoesNotSeeSubmittedDuration,
    studentDoesNotSeeSubmittedTextNote,
    studentDoesNotSeeSubmittedUnderstandingLevel,
    studentDoesNotSeeTaskAssignmentAttachments,
    teacherDoesNotSeeCompleteDateOnTeacherDashBoard,
    teacherDoesNotSeeGradeOnTeacherDashBoard,
    teacherDoesNotSeeSubmittedCompleteDate,
    teacherDoesNotSeeSubmittedCorrectness,
    teacherDoesNotSeeSubmittedDuration,
    teacherDoesNotSeeSubmittedTextNote,
    teacherDoesNotSeeSubmittedUnderstandingLevel,
    teacherDoesNotSeeTaskAssignmentAttachments,
    teacherRemoveTaskAssignment,
} from './syllabus-remove-task-assignment-submission-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { teacherSeesIncompleteStatusOnTeacherDashBoard } from './syllabus-submit-task-assignment-on-learner-app-definitions';
import { teacherGoesToTaskAssignmentDetailScreen } from './syllabus-submit-task-assignment-on-teacher-web-definitions';
import {
    studentGoesToTodosScreen,
    studentSeeStudyPlanItemInToDoTab,
    studentDoesNotSeeStudyPlanItemInToDoTab,
    studentGoesToTabInToDoScreen,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

When(
    `teacher removes the task assignment submission`,
    async function (this: IMasterWorld): Promise<void> {
        const name = this.scenario.get(aliasTaskAssignmentName);
        await this.teacher.instruction(
            `teacher goes to task assignment detail screen`,
            async function (this: TeacherInterface) {
                await teacherGoesToTaskAssignmentDetailScreen(this, name);
            }
        );
        await this.teacher.instruction(
            `teacher removes the task assignment submission on Teacher web`,
            async function (this: TeacherInterface) {
                await teacherRemoveTaskAssignment(this);
            }
        );
    }
);

Then(
    `teacher sees empty data on teacher dashboard`,
    async function (this: IMasterWorld): Promise<void> {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();

        const completeDate = await context.get(aliasTaskAssignmentCompleteDate);
        let formattedDate = '';
        if (completeDate.split('/')[0] == new Date().getFullYear().toString()) {
            formattedDate = `${completeDate.split('/')[1]}/${completeDate.split('/')[2]}`;
        } else {
            formattedDate = completeDate;
        }

        await this.teacher.instruction(
            `teacher goes to course ${courseName} people tab from home page`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanDetails(this, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `teacher does not see complete date ${formattedDate} of ${taskAssignmentName} on teacher dashboard anymore`,
            async function (teacher) {
                await teacherDoesNotSeeCompleteDateOnTeacherDashBoard(
                    teacher,
                    taskAssignmentName,
                    formattedDate
                );
            }
        );

        const setting = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

        if (setting.includes('Correctness')) {
            const correctness = await context.get<string>(aliasTaskAssignmentCorrectness);
            await this.teacher.instruction(
                `teacher does not see grade ${correctness} of ${taskAssignmentName} on teacher dashboard anymore`,
                async function (teacher) {
                    await teacherDoesNotSeeGradeOnTeacherDashBoard(
                        teacher,
                        taskAssignmentName,
                        correctness
                    );
                }
            );
        }

        await this.teacher.instruction(
            `teacher sees the submission of ${taskAssignmentName} with incomplete status on teacher dashboard`,
            async function (teacher) {
                await teacherSeesIncompleteStatusOnTeacherDashBoard(teacher, taskAssignmentName);
            }
        );
    }
);

Then(
    `teacher sees empty data on task assignment detail screen on Teacher App`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const settings = context.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);
        const correctness = context.get<string>(aliasTaskAssignmentCorrectness);
        const duration = context.get<string>(aliasTaskAssignmentDuration);
        const completeDate = context.get<string>(aliasTaskAssignmentCompleteDate);
        const textNote = context.get<string>(aliasTaskAssignmentTextNote);
        const understandingLevel = context.get<string>(aliasTaskAssignmentUnderstandingLevel);
        const attachmentFileNames = context.get<string[]>(aliasAssignmentFiles);
        await this.teacher.instruction(
            `teacher does not see complete date ${completeDate} anymore`,
            async function (teacher) {
                await teacherDoesNotSeeSubmittedCompleteDate(teacher, completeDate);
            }
        );

        if (settings.includes('Text note')) {
            await this.teacher.instruction(
                `teacher does not see data ${textNote} on text note anymore`,
                async function (teacher) {
                    await teacherDoesNotSeeSubmittedTextNote(teacher, textNote);
                }
            );
        }

        if (settings.includes('Correctness')) {
            await this.teacher.instruction(
                `teacher does not see data ${correctness} on correctness anymore`,
                async function (teacher) {
                    await teacherDoesNotSeeSubmittedCorrectness(teacher, correctness);
                }
            );
        }

        if (settings.includes('Duration')) {
            await this.teacher.instruction(
                `teacher does not see data ${duration} on duration anymore`,
                async function (teacher) {
                    await teacherDoesNotSeeSubmittedDuration(teacher, duration);
                }
            );
        }

        if (settings.includes('File attachment')) {
            await this.teacher.instruction(
                `teacher does not see data ${attachmentFileNames[0]} on attachment`,
                async function (teacher) {
                    await teacherDoesNotSeeTaskAssignmentAttachments(
                        teacher,
                        attachmentFileNames[0]
                    );
                }
            );
        }
        if (settings.includes('Understanding level')) {
            await this.teacher.instruction(
                `teacher does not see data ${understandingLevel} on understanding level anymore`,
                async function (teacher) {
                    await teacherDoesNotSeeSubmittedUnderstandingLevel(teacher, understandingLevel);
                }
            );
        }
    }
);

Then(
    `student sees empty data on task assignment detail screen on Learner App`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const settings = context.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);
        const correctness = context.get<string>(aliasTaskAssignmentCorrectness);
        const duration = context.get<string>(aliasTaskAssignmentDuration);
        const formattedDefaultDate = formatDate(new Date(), 'YYYY/MM/DD');
        const textNote = context.get<string>(aliasTaskAssignmentTextNote);
        const understandingLevel = context.get<string>(aliasTaskAssignmentUnderstandingLevel);
        const attachmentFileNames = context.get<string[]>(aliasAssignmentFiles);
        await this.learner.instruction(
            `student sees default complete date ${formattedDefaultDate}`,
            async function (this: LearnerInterface) {
                await studentSeesDefaultCompleteDate(this, formattedDefaultDate);
            }
        );

        if (settings.includes('Text note')) {
            await this.learner.instruction(
                `student does not see data ${textNote} on text note anymore`,
                async function (this: LearnerInterface) {
                    await studentDoesNotSeeSubmittedTextNote(this, textNote);
                }
            );
        }

        if (settings.includes('Correctness')) {
            await this.learner.instruction(
                `student does not see data ${correctness} on correctness anymore`,
                async function (this: LearnerInterface) {
                    await studentDoesNotSeeSubmittedCorrectness(this, correctness);
                }
            );
        }

        if (settings.includes('File attachment')) {
            await this.learner.instruction(
                `student does not see data ${attachmentFileNames[0]} on attachment`,
                async function (this: LearnerInterface) {
                    await studentDoesNotSeeTaskAssignmentAttachments(this, attachmentFileNames[0]);
                }
            );
        }
        if (settings.includes('Duration')) {
            await this.learner.instruction(
                `student does not see data ${duration} on duration anymore`,
                async function (this: LearnerInterface) {
                    await studentDoesNotSeeSubmittedDuration(this, duration);
                }
            );
        }
        if (settings.includes('Understanding level')) {
            await this.learner.instruction(
                `student does not see data ${understandingLevel} on understanding level anymore`,
                async function (this: LearnerInterface) {
                    await studentDoesNotSeeSubmittedUnderstandingLevel(this, understandingLevel);
                }
            );
        }
    }
);

When(
    `student sees task assignment not submitted in todo page`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const studyPlanItemName = context.get<string>(aliasTaskAssignmentName);
        const studyPlanItemKey = new ByValueKey(
            SyllabusLearnerKeys.study_plan_item(studyPlanItemName)
        );
        await learner.instruction(`Reload screen`, async function (this: LearnerInterface) {
            await learner.flutterDriver?.reload();
        });

        await studentGoesToTodosScreen(learner);
        await studentGoesToTabInToDoScreen(learner, context, 'active');
        try {
            await this.learner.flutterDriver?.waitFor(studyPlanItemKey);
        } catch (error) {
            await studentSeeStudyPlanItemInToDoTab(this.learner, studyPlanItemName, 'active');
        }
        await studentGoesToTabInToDoScreen(learner, context, 'completed');
        await studentDoesNotSeeStudyPlanItemInToDoTab(learner, studyPlanItemName, 'completed');
    }
);
