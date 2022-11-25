import {
    aliasAttachmentFileNames,
    aliasRemovedAttachmentFileNames,
} from '@legacy-step-definitions/alias-keys/file';
import { genId, getRandomElements } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import {
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';

import {
    aliasCourseName,
    aliasTaskAssignmentDueDate,
    aliasTaskAssignmentStartDate,
    aliasTaskAssignmentName,
    aliasCourseId,
    aliasCourseIds,
    aliasAssignmentFiles,
} from './alias-keys/syllabus';
import { schoolAdminSeeChapter } from './create-chapter-definitions';
import {
    teacherDoesNotSeeStudyPlan,
    teacherGoToCourseStudentDetail,
    teacherSeeStudyPlan,
} from './create-course-studyplan-definitions';
import {
    studentAttachesFiles,
    studentCheckOnRequireCheckBox,
    studentDoesNotSeeSelectedDate,
    studentFillsNote,
    studentFillsTaskName,
    studentGoesToCreateTaskAssignmentScreen,
    studentSeesCreateSuccessMessage,
    studentSeesFilledNote,
    studentSeesFilledTaskName,
    studentSeesRequireCheckBoxValue,
    studentSeesSaveButtonIsDisabled,
    studentSeesSelectedCourse,
    studentSeesSelectedDate,
    studentDoesNotSeeAttachments,
    studentSelectCourse,
    studentSelectDate,
    studentTapOnBackButton,
    studentTapOnConfirmButton,
    studentTapOnSaveButton,
    studentSubmitTaskAssignment,
    studentWaitToSubmitTaskAssignment,
    studentWaitForAttachmentUploadSuccessfully,
    studentCancelsUploadingAttachment,
    studentDoesNotSeeAttachmentsInTaskAssignmentDetail,
    studentDeletesUploadingAttachment,
    studentWaitForTodoTabReloaded,
    studentSeesTaskAssignmentInstruction,
    studentSeesAttachmentsInTaskAssignmentDetail,
} from './create-task-assignment-on-learner-definitions';
import { teacherSeesTaskAssignmentRequiredField } from './create-task-assignment-with-required-items-definitions';
import { schoolAdminSeeTopicByName } from './syllabus-create-topic-definitions';
import { teacherReloadStudentStudyPlanScreen } from './syllabus-delete-card-in-flashcard-definitions';
import { teacherSeesUpdatedTaskAssignmentInfo } from './syllabus-edit-task-assignment-definitions';
import {
    teacherDoesNotSeeTopicStudyPlanItems,
    teacherSeesTopic,
    teacherSeeTopicStudyPlanItem,
} from './syllabus-expand-collapse-topic-definitions';
import { sampleText } from './syllabus-return-teacher-assignment-text-feedbacks-steps';
import {
    learnerSeesTaskAssignmentCompleteDate,
    learnerSeesTaskAssignmentRequiredField,
} from './syllabus-see-task-assignment-on-learner-app-definitions';
import {
    schoolAdminDoesNotSeeStudyPlanOfStudent,
    schoolAdminGoesToBookDetailByBookNameInStudyPlanDetail,
    schoolAdminIsOnStudyPlanTab,
    schoolAdminSeesStudyPlanOfStudent,
    schoolAdminSelectStudyPlanOfStudent,
} from './syllabus-study-plan-common-definitions';
import { teacherDoesNotSeeTopic } from './syllabus-study-plan-upsert-definitions';
import { teacherGoesToTaskAssignmentDetailScreen } from './syllabus-submit-task-assignment-on-teacher-web-definitions';
import {
    schoolAdminSeeLOsItemInBook,
    studentGoesToTodosScreen,
    studentGoToStudyPlanItemDetailsFromTodo,
    studentTodoName,
} from './syllabus-utils';

type InputField =
    | 'task name'
    | 'course'
    | 'start date'
    | 'due date'
    | 'require text note'
    | 'require duration'
    | 'require correctness'
    | 'require understanding level'
    | 'require file attachment'
    | 'note'
    | 'attachment';

const allInputFields: InputField[] = [
    'task name',
    'course',
    'start date',
    'due date',
    'require text note',
    'require duration',
    'require correctness',
    'require understanding level',
    'require file attachment',
    'note',
    'attachment',
];

const sampleAttachments = ['sample-image.png', 'sample-pdf.pdf', 'sample-video.mov'];

Given('student is at create task assignment screen', async function (this: IMasterWorld) {
    await this.learner.instruction(
        `student goes to create task assignment screen`,
        async (learner: LearnerInterface) => {
            await studentGoesToTodosScreen(learner);
            await studentGoesToCreateTaskAssignmentScreen(learner);
        }
    );
});

When('student creates 2 task assignments on learner app', async function (this: IMasterWorld) {
    const context = this.scenario;
    const learner = this.learner;

    const taskAssignmentName = `Task assignment ${genId()}`;
    const taskAssignmentName2 = `Task assignment 2 ${genId()}`;

    context.set(aliasTaskAssignmentName, taskAssignmentName);

    await learner.instruction(`student goes to create task assignment screen`, async () => {
        await studentGoesToTodosScreen(learner);
        await studentGoesToCreateTaskAssignmentScreen(learner);
    });

    const courseName = context.get<string>(aliasCourseName);

    await learner.instruction('student fills the task assignment information', async () => {
        await studentFillsTaskName(learner, taskAssignmentName);
        await studentSelectCourse(learner, courseName);
    });

    await learner.instruction('student submits the task assignment on Learner App', async () => {
        await studentSubmitTaskAssignment(learner);
    });

    await studentWaitToSubmitTaskAssignment();

    // Create another task
    await learner.instruction(`student backs to create task assignment screen`, async () => {
        await studentGoesToTodosScreen(learner);
        await studentGoesToCreateTaskAssignmentScreen(learner);
    });

    await learner.instruction('student fills the task assignment 2 information', async () => {
        await studentFillsTaskName(learner, taskAssignmentName2);
        await studentSelectCourse(learner, courseName);
    });

    await learner.instruction('student submits the task assignment 2 on Learner App', async () => {
        await studentSubmitTaskAssignment(learner);
    });

    await studentWaitToSubmitTaskAssignment();
});

export async function studentInputSomeInformationForTask(
    masterWorld: IMasterWorld,
    inputFields: InputField[]
): Promise<void> {
    const context = masterWorld.scenario;

    if (inputFields.includes('attachment')) {
        await masterWorld.learner.instruction(
            `student attaches files for Task`,
            async (learner: LearnerInterface) => {
                await studentAttachesFiles(learner);
                context.set(aliasAttachmentFileNames, sampleAttachments);
                context.set(aliasAssignmentFiles, sampleAttachments);
            }
        );
    }

    if (inputFields.includes('task name')) {
        await masterWorld.learner.instruction(
            `student inputs task name for Task`,
            async (learner: LearnerInterface) => {
                const taskAssignmentName = `Task ${genId()}`;
                await studentFillsTaskName(learner, taskAssignmentName);
                context.set(aliasTaskAssignmentName, taskAssignmentName);
            }
        );
    }

    if (inputFields.includes('course')) {
        await masterWorld.learner.instruction(
            `student selects course for Task`,
            async (learner: LearnerInterface) => {
                const courseName = context.get(aliasCourseName);
                await studentSelectCourse(learner, courseName);
            }
        );
    }

    if (inputFields.includes('start date')) {
        await masterWorld.learner.instruction(
            `student selects start date for Task`,
            async (learner: LearnerInterface) => {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 1);
                await studentSelectDate(learner, 'start date', startDate);
            }
        );
    }
    if (inputFields.includes('due date')) {
        await masterWorld.learner.instruction(
            `student selects due date for Task`,
            async (learner: LearnerInterface) => {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 15);
                await studentSelectDate(learner, 'end date', dueDate);
            }
        );
    }
    if (inputFields.includes('require text note')) {
        await masterWorld.learner.instruction(
            `student ticks on text note`,
            async (learner: LearnerInterface) => {
                await studentCheckOnRequireCheckBox(learner, 'Text note');
            }
        );
    }
    if (inputFields.includes('require duration')) {
        await masterWorld.learner.instruction(
            `student ticks on duration`,
            async (learner: LearnerInterface) => {
                await studentCheckOnRequireCheckBox(learner, 'Duration');
            }
        );
    }
    if (inputFields.includes('require correctness')) {
        await masterWorld.learner.instruction(
            `student ticks on correctness`,
            async (learner: LearnerInterface) => {
                await studentCheckOnRequireCheckBox(learner, 'Correctness');
            }
        );
    }
    if (inputFields.includes('require understanding level')) {
        await masterWorld.learner.instruction(
            `student ticks on understanding level`,
            async (learner: LearnerInterface) => {
                await studentCheckOnRequireCheckBox(learner, 'Understanding level');
            }
        );
    }

    if (inputFields.includes('require file attachment')) {
        await masterWorld.learner.instruction(
            `student ticks on file attachment`,
            async (learner: LearnerInterface) => {
                await studentCheckOnRequireCheckBox(learner, 'File attachment');
            }
        );
    }

    if (inputFields.includes('note')) {
        await masterWorld.learner.instruction(
            `student inputs task note for Task`,
            async (learner: LearnerInterface) => {
                await studentFillsNote(learner, sampleText);
            }
        );
    }
}

When('student inputs some information for Task', async function (this: IMasterWorld) {
    const someInputFields = getRandomElements<InputField>(allInputFields);
    await studentInputSomeInformationForTask(this, someInputFields);
});

When(
    'student cancels creating the task assignment by back button',
    async function (this: IMasterWorld) {
        await this.learner.instruction(
            `student tap on back button`,
            async (learner: LearnerInterface) => {
                await studentTapOnBackButton(learner);
            }
        );
    }
);

When('student confirms leaving create task assignment screen', async function (this: IMasterWorld) {
    await this.learner.instruction(`student tap on confirm`, async (learner: LearnerInterface) => {
        await studentTapOnConfirmButton(learner);
    });
});

When('student goes back to create task assignment screen', async function (this: IMasterWorld) {
    await this.learner.instruction(
        `student tap on add new task`,
        async (learner: LearnerInterface) => {
            await studentGoesToCreateTaskAssignmentScreen(learner);
        }
    );
});

Then('student sees all fields in form are reset', async function (this: IMasterWorld) {
    await this.learner.instruction(
        `student sees task name is empty`,
        async (learner: LearnerInterface) => {
            await studentSeesFilledTaskName(learner, '');
        }
    );
    await this.learner.instruction(
        `student sees course is empty`,
        async (learner: LearnerInterface) => {
            await studentSeesSelectedCourse(learner, '');
        }
    );
    await this.learner.instruction(
        `student sees start date is today`,
        async (learner: LearnerInterface) => {
            await studentSeesSelectedDate(learner, 'start date', new Date());
        }
    );
    await this.learner.instruction(
        `student sees due date is empty`,
        async (learner: LearnerInterface) => {
            await studentSeesSelectedDate(learner, 'end date');
        }
    );

    await this.learner.instruction(
        `student sees require text note is unchecked`,
        async (learner: LearnerInterface) => {
            await studentSeesRequireCheckBoxValue(learner, 'Text note', false);
        }
    );
    await this.learner.instruction(
        `student sees require duration is unchecked`,
        async (learner: LearnerInterface) => {
            await studentSeesRequireCheckBoxValue(learner, 'Duration', false);
        }
    );
    await this.learner.instruction(
        `student sees require correctness is unchecked`,
        async (learner: LearnerInterface) => {
            await studentSeesRequireCheckBoxValue(learner, 'Correctness', false);
        }
    );
    await this.learner.instruction(
        `student sees require understanding level is unchecked`,
        async (learner: LearnerInterface) => {
            await studentSeesRequireCheckBoxValue(learner, 'Understanding level', false);
        }
    );
    await this.learner.instruction(
        `student sees require attachment is unchecked`,
        async (learner: LearnerInterface) => {
            await studentSeesRequireCheckBoxValue(learner, 'File attachment', false);
        }
    );
    await this.learner.instruction(
        `student sees note is empty`,
        async (learner: LearnerInterface) => {
            await studentSeesFilledNote(learner, '');
        }
    );

    await this.learner.instruction(
        `student sees there is no attachment`,
        async (learner: LearnerInterface) => {
            await studentDoesNotSeeAttachments(learner, sampleAttachments);
        }
    );
});

When(
    `student doesn't input {string} for Task`,
    async function (this: IMasterWorld, exceptedInputField: InputField) {
        const mandatoryFields: InputField[] = ['task name', 'course'];
        const exceptedInputIndex = mandatoryFields.indexOf(exceptedInputField);
        mandatoryFields.splice(exceptedInputIndex, 1);
        await studentInputSomeInformationForTask(this, mandatoryFields);
    }
);

Then(`student sees save task assignment button is disabled`, async function (this: IMasterWorld) {
    await this.learner.instruction(
        `student sees save task assignment button is disabled`,
        async (learner: LearnerInterface) => {
            await studentSeesSaveButtonIsDisabled(learner);
        }
    );
});
When('student selects {string}', async function (this: IMasterWorld, dateCase: string) {
    const context = this.scenario;
    await this.learner.instruction(
        `student selects ${dateCase}`,
        async (learner: LearnerInterface) => {
            if (dateCase == 'start date after due date') {
                const selectDate = new Date();
                selectDate.setDate(selectDate.getDate() + 15);
                await studentSelectDate(learner, 'end date', selectDate);
                selectDate.setDate(selectDate.getDate() + 5);
                try {
                    await studentSelectDate(learner, 'start date', selectDate);
                } catch (err) {
                    console.log("Can't pick start date after due date");
                }
                context.set(aliasTaskAssignmentStartDate, selectDate);
            } else {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() - 5);
                try {
                    await studentSelectDate(learner, 'end date', dueDate);
                } catch (err) {
                    console.log("Can't pick due date date before start date");
                }
                context.set(aliasTaskAssignmentDueDate, dueDate);
            }
        }
    );
});

Then(`student can't select {string}`, async function (this: IMasterWorld, dateCase: string) {
    const context = this.scenario;

    await this.learner.instruction(
        `student can't select ${dateCase}`,
        async (learner: LearnerInterface) => {
            if (dateCase == 'start date after due date') {
                const selectedDate = context.get<Date>(aliasTaskAssignmentStartDate);
                await studentDoesNotSeeSelectedDate(learner, 'start date', selectedDate);
            } else {
                const selectedDate = context.get<Date>(aliasTaskAssignmentDueDate);
                await studentDoesNotSeeSelectedDate(learner, 'end date', selectedDate);
            }
        }
    );
});

Then(`student sees default start date is today`, async function (this: IMasterWorld) {
    await this.learner.instruction(
        `student sees default start date is today`,
        async (learner: LearnerInterface) => {
            await studentSeesSelectedDate(learner, 'start date', new Date());
        }
    );
});

When(`student inputs mandatory information for Task`, async function (this: IMasterWorld) {
    await studentInputSomeInformationForTask(this, ['task name', 'course']);
});

When(`student selects start date before due date`, async function (this: IMasterWorld) {
    await this.learner.instruction(
        `student selects start date before due date`,
        async (learner: LearnerInterface) => {
            const selectedDate = new Date();
            selectedDate.setDate(selectedDate.getDate() - 2);
            await studentSelectDate(learner, 'start date', selectedDate);
            selectedDate.setDate(selectedDate.getDate() + 10);
            await studentSelectDate(learner, 'end date', selectedDate);
        }
    );
});

When(`student saves the creating process`, async function (this: IMasterWorld) {
    const context = this.scenario;
    await this.learner.instruction(
        `student taps on save button`,
        async (learner: LearnerInterface) => {
            const removedAttachments = context.get<string[]>(aliasRemovedAttachmentFileNames) ?? [];
            const attachments = context.get<string[]>(aliasAttachmentFileNames) ?? [];
            const uploadingAttachments = attachments.filter(
                (attachment) => !removedAttachments.includes(attachment)
            );
            await studentWaitForAttachmentUploadSuccessfully(learner, uploadingAttachments);
            await studentTapOnSaveButton(learner);
        }
    );
});

Then(`student sees task assignment is created`, async function (this: IMasterWorld) {
    await this.learner.instruction(
        `student sees created success notification`,
        async (learner: LearnerInterface) => {
            await studentSeesCreateSuccessMessage(learner);
        }
    );
});

When(`student is uploading attachments`, async function (this: IMasterWorld) {
    const context = this.scenario;
    await this.learner.instruction(
        `student is uploading attachments`,
        async (learner: LearnerInterface) => {
            await studentAttachesFiles(learner);
            context.set(aliasAttachmentFileNames, sampleAttachments);
        }
    );
});

When(`student uploaded attachments`, async function (this: IMasterWorld) {
    await this.learner.instruction(
        `student uploaded attachments`,
        async (learner: LearnerInterface) => {
            await studentAttachesFiles(learner);
            await studentWaitForAttachmentUploadSuccessfully(learner, sampleAttachments);
        }
    );
});

When(`student deletes some uploaded attachments`, async function (this: IMasterWorld) {
    const context = this.scenario;
    await this.learner.instruction(
        `student deletes some uploaded attachments`,
        async (learner: LearnerInterface) => {
            const deletedAttachments: string[] = getRandomElements(sampleAttachments);
            await studentDeletesUploadingAttachment(learner, deletedAttachments);
            context.set(aliasRemovedAttachmentFileNames, deletedAttachments);
        }
    );
});

When(`student cancels some uploading attachments`, async function (this: IMasterWorld) {
    const context = this.scenario;
    await this.learner.instruction(
        `student cancels some uploading attachments`,
        async (learner: LearnerInterface) => {
            const attachments: string[] = getRandomElements(sampleAttachments);
            const cancelledAttachments = await studentCancelsUploadingAttachment(
                learner,
                attachments
            );
            context.set(aliasRemovedAttachmentFileNames, cancelledAttachments);
        }
    );
});

Then(
    `student doesn't see {string} attachments`,
    async function (this: IMasterWorld, action: string) {
        const context = this.scenario;
        const files = context.get<string[]>(aliasRemovedAttachmentFileNames);
        await this.learner.instruction(
            `student doesn't see ${action} attachments`,
            async (learner: LearnerInterface) => {
                await studentDoesNotSeeAttachments(learner, files);
            }
        );
    }
);

Then(
    `student sees created task assignment without {string} attachments`,
    async function (this: IMasterWorld, action: string) {
        const context = this.scenario;
        const taskAssignmentName = context.get(aliasTaskAssignmentName);
        const attachments = context.get<string[]>(aliasRemovedAttachmentFileNames);
        await this.learner.instruction(
            `student goes to task assignment detail`,
            async (learner: LearnerInterface) => {
                await studentSeesCreateSuccessMessage(learner);
                await studentWaitForTodoTabReloaded(learner);
                await studentGoToStudyPlanItemDetailsFromTodo(
                    learner,
                    taskAssignmentName,
                    'active'
                );
            }
        );
        await this.learner.instruction(
            `student doesn't see ${action} attachments`,
            async (learner: LearnerInterface) => {
                await studentDoesNotSeeAttachmentsInTaskAssignmentDetail(learner, attachments);
            }
        );
    }
);

When(
    `student creates task assignment with full required fields in course 1`,
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        await this.learner.instruction(
            `student goes to create task assignment screen`,
            async (learner: LearnerInterface) => {
                await studentGoesToTodosScreen(learner);
                await studentGoesToCreateTaskAssignmentScreen(learner);
            }
        );
        await studentInputSomeInformationForTask(this, allInputFields);
        await this.learner.instruction(
            `student taps on save button`,
            async (learner: LearnerInterface) => {
                await studentWaitForAttachmentUploadSuccessfully(learner, sampleAttachments);
                await studentTapOnSaveButton(learner);
                await studentSeesCreateSuccessMessage(learner);
            }
        );
    }
);

Then(
    `school admin sees new individual study plan created with name is student name's To-do in course 1`,
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseId = context.get(aliasCourseId);
        const profile = await this.learner.getProfile();
        await this.cms.instruction(
            `School admin is on individual study plan tab in course ${courseId} detail page`,
            async (cms: CMSInterface) => {
                await schoolAdminIsOnStudyPlanTab(cms, courseId, 'individual');
            }
        );

        await this.cms.instruction(
            `School admin sees new individual study plan created with name is student name's To-do`,
            async (cms: CMSInterface) => {
                await schoolAdminSeesStudyPlanOfStudent(
                    cms,
                    profile.name,
                    studentTodoName(profile.name)
                );
            }
        );
    }
);

Then(
    `school admin doesn't see new individual study plan in course 2`,
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseIds = context.get<string[]>(aliasCourseIds);
        const courseId = courseIds[1];
        const profile = await this.learner.getProfile();
        await this.cms.instruction(
            `School admin is on individual study plan tab in course ${courseId} detail page`,
            async (cms: CMSInterface) => {
                await schoolAdminIsOnStudyPlanTab(cms, courseId, 'individual');
            }
        );

        await this.cms.instruction(
            `School admin does not see new individual study plan created with name is student name's To-do`,
            async (cms: CMSInterface) => {
                await schoolAdminDoesNotSeeStudyPlanOfStudent(
                    cms,
                    profile.name,
                    studentTodoName(profile.name)
                );
            }
        );
    }
);

Then(
    `school admin sees detailed book from study plan with book name, chapter name, topic name is student name's To-do`,
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseId = context.get(aliasCourseId);
        const profile = await this.learner.getProfile();
        const studentNameTodo = studentTodoName(profile.name);
        await this.cms.instruction(
            `School admin is on individual study plan tab in course ${courseId} detail page`,
            async (cms: CMSInterface) => {
                await schoolAdminIsOnStudyPlanTab(cms, courseId, 'individual');
            }
        );

        await this.cms.instruction(
            `School admin goes to new individual study plan created with name is student name's To-do`,
            async (cms: CMSInterface) => {
                await schoolAdminSelectStudyPlanOfStudent(cms, profile.name, studentNameTodo);
            }
        );

        await this.cms.instruction(
            `School admin goes to ad-hoc book created with name is student name's To-do`,
            async (cms: CMSInterface) => {
                await schoolAdminGoesToBookDetailByBookNameInStudyPlanDetail(cms, studentNameTodo);
            }
        );

        await this.cms.instruction(
            `School admin sees book name, chapter name, topic name is student name's To-do`,
            async (cms: CMSInterface) => {
                const taskName = context.get(aliasTaskAssignmentName);
                await cms.assertThePageTitle(`${studentNameTodo}`);
                await schoolAdminSeeChapter(cms, studentNameTodo);
                await schoolAdminSeeTopicByName(cms, studentNameTodo);
                await schoolAdminSeeLOsItemInBook(cms, taskName);
            }
        );
    }
);

Then(
    `teacher sees a new study plan with the name is student name's To-do in course 1`,
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const courseId = context.get(aliasCourseId);
        const profile = await this.learner.getProfile();
        const studentNameTodo = studentTodoName(profile.name);
        await this.teacher.instruction(
            `teacher goes to course 1 student study plan`,
            async (teacher: TeacherInterface) => {
                await teacherGoToCourseStudentDetail(teacher, courseId, profile.id);
            }
        );

        await this.teacher.instruction(
            `teacher assert student study plan`,
            async (teacher: TeacherInterface) => {
                await teacherSeeStudyPlan(teacher, studentNameTodo);
            }
        );

        await this.teacher.instruction(
            `teacher sees topic name is student name's To-do`,
            async (teacher: TeacherInterface) => {
                await teacherSeesTopic(teacher, studentTodoName(profile.name));
            }
        );

        await this.teacher.instruction(
            `teacher sees task name`,
            async (teacher: TeacherInterface) => {
                const taskName = context.get(aliasTaskAssignmentName);
                await teacherSeeTopicStudyPlanItem(teacher, taskName);
            }
        );
    }
);

Then(`teacher doesn't see any new study plan of course 2`, async function (this: IMasterWorld) {
    const context = this.scenario;
    const courseIds = context.get<string[]>(aliasCourseIds);
    const courseId = courseIds[1];
    const profile = await this.learner.getProfile();
    const studentNameTodo = studentTodoName(profile.name);
    await this.teacher.instruction(
        `teacher goes to course 2 student study plan`,
        async (teacher: TeacherInterface) => {
            await teacherGoToCourseStudentDetail(teacher, courseId, profile.id);
            await teacherReloadStudentStudyPlanScreen(teacher);
        }
    );

    await this.teacher.instruction(
        `teacher assert student study plan`,
        async (teacher: TeacherInterface) => {
            await teacherDoesNotSeeStudyPlan(teacher, studentNameTodo);
        }
    );

    await this.teacher.instruction(
        `teacher sees topic name is student name's To-do`,
        async (teacher: TeacherInterface) => {
            await teacherDoesNotSeeTopic(teacher, studentTodoName(profile.name));
        }
    );

    await this.teacher.instruction(`teacher sees task name`, async (teacher: TeacherInterface) => {
        const taskName = context.get(aliasTaskAssignmentName);
        await teacherDoesNotSeeTopicStudyPlanItems(teacher, [taskName]);
    });
});

Then(
    `teacher views detailed task assignment created by student with all required items`,
    async function (this: IMasterWorld) {
        const context = this.scenario;

        await this.teacher.instruction(
            `teacher goes to created task assignment detail`,
            async (teacher: TeacherInterface) => {
                const taskName = context.get(aliasTaskAssignmentName);
                await teacherGoesToTaskAssignmentDetailScreen(teacher, taskName);
            }
        );

        await this.teacher.instruction(
            `teacher sees all required fields in created task assignment detail`,
            async (teacher: TeacherInterface) => {
                await teacherSeesTaskAssignmentRequiredField(teacher, 'Text note');
                await teacherSeesTaskAssignmentRequiredField(teacher, 'Duration');
                await teacherSeesTaskAssignmentRequiredField(teacher, 'Correctness');
                await teacherSeesTaskAssignmentRequiredField(teacher, 'Understanding level');
                await teacherSeesTaskAssignmentRequiredField(teacher, 'File attachment');
                await teacherSeesUpdatedTaskAssignmentInfo(teacher, 'description', {
                    instruction: sampleText,
                });
                await teacherSeesUpdatedTaskAssignmentInfo(teacher, 'description', {
                    attachments: sampleAttachments,
                });
            }
        );
    }
);

Then(
    `student sees created task assignment detail with all required items`,
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const taskAssignmentName = context.get(aliasTaskAssignmentName);

        await this.learner.instruction(
            `student goes to task assignment detail`,
            async (learner: LearnerInterface) => {
                await studentGoToStudyPlanItemDetailsFromTodo(
                    learner,
                    taskAssignmentName,
                    'active'
                );
            }
        );

        await this.learner.instruction(
            `student sees task assignment instruction`,
            async (learner: LearnerInterface) => {
                await studentSeesTaskAssignmentInstruction(learner, sampleText);
            }
        );

        await this.learner.instruction(
            `student sees task assignment attachments`,
            async (learner: LearnerInterface) => {
                await studentSeesAttachmentsInTaskAssignmentDetail(learner, sampleAttachments);
            }
        );

        await this.learner.instruction(
            `student sees task assignment required fields`,
            async (learner: LearnerInterface) => {
                await learnerSeesTaskAssignmentRequiredField(learner, 'Text note');
                await learnerSeesTaskAssignmentRequiredField(learner, 'Duration');
                await learnerSeesTaskAssignmentRequiredField(learner, 'Correctness');
                await learnerSeesTaskAssignmentRequiredField(learner, 'Understanding level');
                await learnerSeesTaskAssignmentRequiredField(learner, 'File attachment');
                await learnerSeesTaskAssignmentCompleteDate(learner);
            }
        );
    }
);
