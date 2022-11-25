import { genId, getRandomElementsWithLength, randomInteger } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import {
    AccountAction,
    CMSInterface,
    IMasterWorld,
    LearnerInterface,
    TeacherInterface,
} from '@supports/app-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasTaskAssignmentCompleteDate,
    aliasTaskAssignmentDuration,
    aliasTaskAssignmentInstruction,
    aliasTaskAssignmentName,
    aliasTaskAssignmentSetting,
    aliasTaskAssignmentTextNote,
    aliasTaskAssignmentUnderstandingLevel,
    aliasTaskAssignmentCorrectness,
    aliasTopicName,
    aliasAssignmentFiles,
} from './alias-keys/syllabus';
import {
    studentAddAttachmentToAssignment,
    studentBackToHomeAfterSubmit,
    studentCanNotSubmitAssignment,
    studentFillTextNoteAssignment,
    studentGoToAssignmentInTodo,
    studentSubmitAssignment,
} from './syllabus-assignment-submit-definitions';
import { studentGoesToLODetailsPage } from './syllabus-create-question-definitions';
import {
    taskAssignmentSetting,
    TaskAssignmentSettingInfo,
    schoolAdminSelectTaskAssignmentSetting,
} from './syllabus-create-task-assignment-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    studentSeeStudyPlanItem,
    teacherGoesToStudyPlanDetails,
} from './syllabus-study-plan-upsert-definitions';
import {
    studentChoosesUnderstandingLevelOnTaskAssignment,
    studentDoesNotSeeLearningTimeOnStatsPage,
    studentFillsCompleteDateOnTaskAssignment,
    studentFillsCorrectnessOnTaskAssignment,
    studentFillsDurationOnTaskAssignment,
    studentGetsCompleteDateOnTaskAssignment,
    studentGetsDurationOnTaskAssignment,
    studentIsOnTaskAssignmentDetailScreen,
    studentSeesLearningTimeOnStatsPage,
    teacherSeesCompleteDateOnTeacherDashBoard,
    teacherSeesCompleteStatusOnTaskAssignmentDetailScreen,
    teacherSeesCompleteStatusOnTeacherDashBoard,
    teacherSeesIncompleteStatusOnTaskAssignmentDetailScreen,
    teacherSeesIncompleteStatusOnTeacherDashBoard,
    teacherSeesGradeOnTeacherDashBoard,
    teacherSeesSubmittedTextNote,
    studentGetsCorrectnessOnTaskAssignment,
    teacherSeesSubmittedCompleteDate,
    teacherSeesSubmittedCorrectness,
    teacherSeesSubmittedDuration,
    teacherSeesSubmittedUnderstandingLevel,
    teacherSeesTaskAssignmentAttachments,
} from './syllabus-submit-task-assignment-on-learner-app-definitions';
import { teacherGoesToTaskAssignmentDetailScreen } from './syllabus-submit-task-assignment-on-teacher-web-definitions';
import {
    studentGoesToHomeTab,
    studentGoesToPageFromHomeScreen,
    studentGoesToTodosScreen,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    studentGoesToTabInToDoScreen,
    studentSeeStudyPlanItemInToDoTab,
    parseTeacherDurationToStudentDuration,
    parseTeacherCompleteDateToStudentCompleteDate,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { delay } from 'flutter-driver-x';
import moment from 'moment';

export type State = 'the same as' | 'different from';

Given(
    `student is on task assignment detail screen`,
    async function (this: IMasterWorld): Promise<void> {
        const learner = this.learner;
        const name = this.scenario.get(aliasTaskAssignmentName);

        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);

        const taskAssignmentName = context.get<string>(aliasTaskAssignmentName);
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

        await this.learner.instruction(
            `student is on task assignment detail screen`,
            async function (this: LearnerInterface) {
                await studentIsOnTaskAssignmentDetailScreen(this, name);
            }
        );
    }
);

Given(
    `school admin edits task assignment setting to include duration field and n random remaining required fields`,
    async function (this: IMasterWorld): Promise<void> {
        const randomN = randomInteger(0, 5); // 5 available setting required items
        const instruction = `Task instruction ${genId()}`;

        let setting = getRandomElementsWithLength(
            Object.keys(taskAssignmentSetting),
            randomN
        ) as TaskAssignmentSettingInfo[];

        const newSetting = setting.filter(function (item) {
            return item !== 'Duration';
        });

        newSetting.push('Duration');

        await this.cms.instruction(
            `create ${randomN} required fields ${setting}`,
            async function (this: CMSInterface) {
                await schoolAdminSelectTaskAssignmentSetting(this, newSetting);
                await this.page!.fill(`#instruction`, instruction);
                await this.selectAButtonByAriaLabel('Save');
            }
        );
        setting = setting.filter((e) => e != taskAssignmentSetting.Duration);
        setting.push('Duration' as TaskAssignmentSettingInfo);
        this.scenario.set(aliasTaskAssignmentInstruction, instruction);
        this.scenario.set(aliasTaskAssignmentSetting, newSetting);
    }
);

Given(
    `school admin edits task assignment setting to include random n required fields but exclude duration field`,
    async function (this: IMasterWorld): Promise<void> {
        // const randomN = randomInteger(0, 5); // 5 available setting required items
        const randomN = 5;
        const instruction = `Task instruction ${genId()}`;

        const setting = getRandomElementsWithLength(
            Object.keys(taskAssignmentSetting),
            randomN
        ) as TaskAssignmentSettingInfo[];

        const newSettingWithoutDuration = setting.filter(function (item) {
            return item !== 'Duration';
        });

        await this.cms.instruction(
            `create ${randomN} required fields ${setting}`,
            async function (this: CMSInterface) {
                await schoolAdminSelectTaskAssignmentSetting(this, newSettingWithoutDuration);
                await this.page!.fill(`#instruction`, instruction);
                await this.selectAButtonByAriaLabel('Save');
            }
        );
        this.scenario.set(aliasTaskAssignmentInstruction, instruction);
        this.scenario.set(aliasTaskAssignmentSetting, newSettingWithoutDuration);
    }
);

Given(
    `school admin edits task assignment setting to include random n>0 required fields`,
    async function (this: IMasterWorld): Promise<void> {
        const randomN = randomInteger(1, 5); // 5 available setting required items
        const instruction = `Task instruction ${genId()}`;

        const setting = getRandomElementsWithLength(
            Object.keys(taskAssignmentSetting),
            randomN
        ) as TaskAssignmentSettingInfo[];

        await this.cms.instruction(
            `create ${randomN} required fields ${setting}`,
            async function (this: CMSInterface) {
                await schoolAdminSelectTaskAssignmentSetting(this, setting);
                await this.page!.fill(`#instruction`, instruction);
                await this.selectAButtonByAriaLabel('Save');
            }
        );
        this.scenario.set(aliasTaskAssignmentInstruction, instruction);
        this.scenario.set(aliasTaskAssignmentSetting, setting);
    }
);

When(
    `student fills a required field with no data on Learner App`,
    async function (this: IMasterWorld): Promise<void> {
        const settings = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);
        const scenario = this.scenario;

        if (settings?.length != 0) {
            await this.learner.instruction(
                `student fills complete date`,
                async function (this: LearnerInterface) {
                    await studentFillsCompleteDateOnTaskAssignment(this);
                }
            );
        }
        settings.pop();
        if (settings.includes('Text note')) {
            await this.learner.instruction(
                `student fills text note`,
                async function (this: LearnerInterface) {
                    await studentFillTextNoteAssignment(this, scenario);
                }
            );
        }

        if (settings.includes('Correctness')) {
            await this.learner.instruction(
                `student fills correctness`,
                async function (this: LearnerInterface) {
                    await studentFillsCorrectnessOnTaskAssignment(this);
                }
            );
        }

        if (settings.includes('Duration')) {
            await this.learner.instruction(
                `student fills duration`,
                async function (this: LearnerInterface) {
                    await studentFillsDurationOnTaskAssignment(this);
                }
            );
        }
        if (settings.includes('File attachment')) {
            await this.learner.instruction(
                `Student attaches attachment to assignment`,
                async function (learner) {
                    await studentAddAttachmentToAssignment(learner, scenario, 'image');
                }
            );
        }
        if (settings.includes('Understanding level')) {
            await this.learner.instruction(
                `student chooses understanding level`,
                async function (this: LearnerInterface) {
                    await studentChoosesUnderstandingLevelOnTaskAssignment(this, scenario);
                }
            );
        }
    }
);

When(
    `student fills all required fields with data on Learner App`,
    async function (this: IMasterWorld): Promise<void> {
        const settings = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);
        const scenario = this.scenario;

        await this.learner.instruction(
            `student fills complete date that is submitted date`,
            async function (this: LearnerInterface) {
                await studentFillsCompleteDateOnTaskAssignment(this);
                await studentGetsCompleteDateOnTaskAssignment(this, scenario);
            }
        );

        if (settings.includes('Text note')) {
            await this.learner.instruction(
                `student fills text note`,
                async function (this: LearnerInterface) {
                    await studentFillTextNoteAssignment(this, scenario);
                }
            );
        }

        if (settings.includes('Correctness')) {
            await this.learner.instruction(
                `student fills correctness`,
                async function (this: LearnerInterface) {
                    await studentFillsCorrectnessOnTaskAssignment(this);
                    await studentGetsCorrectnessOnTaskAssignment(this, scenario);
                }
            );
        }

        if (settings.includes('File attachment')) {
            await this.learner.instruction(
                `Student attaches attachment to assignment`,
                async function (learner) {
                    await studentAddAttachmentToAssignment(learner, scenario, 'image');
                }
            );
        }

        if (settings.includes('Duration')) {
            await this.learner.instruction(
                `student fills duration`,
                async function (this: LearnerInterface) {
                    await studentFillsDurationOnTaskAssignment(this);
                    await studentGetsDurationOnTaskAssignment(this, scenario);
                }
            );
        }

        if (settings.includes('Understanding level')) {
            await this.learner.instruction(
                `student chooses understanding level`,
                async function (this: LearnerInterface) {
                    await studentChoosesUnderstandingLevelOnTaskAssignment(this, scenario);
                }
            );
        }
    }
);

When(
    `student fills all required fields with data on Learner App that complete date is {string} submitted date`,
    async function (this: IMasterWorld, state: State): Promise<void> {
        const settings = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);
        const scenario = this.scenario;

        if (state == 'different from') {
            await this.learner.instruction(
                `student fills complete date that is not submitted date`,
                async function (this: LearnerInterface) {
                    await studentFillsCompleteDateOnTaskAssignment(this);
                    await studentGetsCompleteDateOnTaskAssignment(this, scenario);
                }
            );
        } else {
            await this.learner.instruction(
                `student gets complete date that is submitted date`,
                async function (this: LearnerInterface) {
                    await studentGetsCompleteDateOnTaskAssignment(this, scenario);
                }
            );
        }

        if (settings.includes('Text note')) {
            await this.learner.instruction(
                `student fills text note`,
                async function (this: LearnerInterface) {
                    await studentFillTextNoteAssignment(this, scenario);
                }
            );
        }

        if (settings.includes('Correctness')) {
            await this.learner.instruction(
                `student fills correctness`,
                async function (this: LearnerInterface) {
                    await studentFillsCorrectnessOnTaskAssignment(this);
                    await studentGetsCorrectnessOnTaskAssignment(this, scenario);
                }
            );
        }

        if (settings.includes('File attachment')) {
            await this.learner.instruction(
                `Student attaches attachment to assignment`,
                async function (learner) {
                    await studentAddAttachmentToAssignment(learner, scenario, 'image');
                }
            );
        }

        if (settings.includes('Duration')) {
            await this.learner.instruction(
                `student fills duration`,
                async function (this: LearnerInterface) {
                    await studentFillsDurationOnTaskAssignment(this);
                    await studentGetsDurationOnTaskAssignment(this, scenario);
                }
            );
        }

        if (settings.includes('Understanding level')) {
            await this.learner.instruction(
                `student chooses understanding level`,
                async function (this: LearnerInterface) {
                    await studentChoosesUnderstandingLevelOnTaskAssignment(this, scenario);
                }
            );
        }

        if (settings.includes('Understanding level')) {
            await this.learner.instruction(
                `student chooses understanding level`,
                async function (this: LearnerInterface) {
                    await studentChoosesUnderstandingLevelOnTaskAssignment(this, scenario);
                }
            );
        }
    }
);

When(`student submits the task assignment`, async function (this: IMasterWorld): Promise<void> {
    const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);

    const topicName = this.scenario.get<string>(aliasTopicName);

    await this.learner.instruction(
        `Student submit assignment ${taskAssignmentName}`,
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
});

When(
    `student sees the task assignment submitted`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const studyPlanItemName = context.get<string>(aliasTaskAssignmentName);
        const studyPlanItemKey = new ByValueKey(
            SyllabusLearnerKeys.study_plan_item(studyPlanItemName)
        );
        await studentGoesToTodosScreen(learner);
        await studentGoesToTabInToDoScreen(learner, context, 'completed');
        try {
            await this.learner.flutterDriver?.waitFor(studyPlanItemKey);
        } catch (error) {
            await studentSeeStudyPlanItemInToDoTab(this.learner, studyPlanItemName, 'completed');
        }
    }
);

When(
    `student goes to task assignment detail screen again`,
    async function (this: IMasterWorld): Promise<void> {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);

        await this.learner.instruction(
            `Go to assignment ${taskAssignmentName}`,
            async function (learner) {
                await studentGoToAssignmentInTodo(learner, taskAssignmentName);
            }
        );
    }
);

Then(
    `student cannot resubmit the task assignment`,
    async function (this: IMasterWorld): Promise<void> {
        const assignmentName = this.scenario.get(aliasTaskAssignmentName);

        await this.learner.instruction(
            `Can not submit assignment ${assignmentName}`,
            async function (learner) {
                await studentCanNotSubmitAssignment(learner);
            }
        );
    }
);

Then(
    `student cannot submit the task assignment on Learner App`,
    async function (this: IMasterWorld): Promise<void> {
        const assignmentName = this.scenario.get(aliasTaskAssignmentName);

        await this.learner.instruction(
            `Can not submit assignment ${assignmentName}`,
            async function (learner) {
                await studentCanNotSubmitAssignment(learner);
            }
        );
    }
);

Then(
    `student does not see learning time accumulated in learning stats screen on submitted date`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const statsTab = SyllabusLearnerKeys.stats_tab;
        const statsPage = SyllabusLearnerKeys.stats_page;
        const duration = await context.get(aliasTaskAssignmentDuration);
        let formattedDuration = duration;
        if (duration != null && duration.includes(' ') == false) {
            formattedDuration = parseTeacherDurationToStudentDuration(duration);
        }
        const submittedDate = moment(new Date()).format('YYYY/MM/DD');
        await this.learner.instruction(`Go to stats page`, async function (learner) {
            await studentGoesToPageFromHomeScreen(learner, statsTab, statsPage);
        });

        await this.learner.instruction(
            `student does not see learning time accumulated ${formattedDuration} in learning stats screen on submitted date ${submittedDate}`,
            async function (learner) {
                await studentDoesNotSeeLearningTimeOnStatsPage(
                    learner,
                    submittedDate,
                    formattedDuration
                );
            }
        );
    }
);

Then(
    `student sees duration accumulated in learning stats screen on complete date`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;
        const statsTab = SyllabusLearnerKeys.stats_tab;
        const statsPage = SyllabusLearnerKeys.stats_page;
        const duration = await context.get(aliasTaskAssignmentDuration);
        let formattedDuration = duration;
        if (duration.includes(' ') == false) {
            formattedDuration = parseTeacherDurationToStudentDuration(duration);
        }
        const completeDate = await context.get(aliasTaskAssignmentCompleteDate);
        const formattedCompleteDate = parseTeacherCompleteDateToStudentCompleteDate(completeDate);
        const today = new Date();
        await this.learner.instruction(`Go to stats page`, async function (learner) {
            await studentGoesToPageFromHomeScreen(learner, statsTab, statsPage);
        });
        if (
            (today.getDate() < parseInt(formattedCompleteDate.split('/')[2]) &&
                today.getDay() == 0) ||
            (today.getDate() > parseInt(formattedCompleteDate.split('/')[2]) && today.getDay() == 1) // TMR is next week's Monday and Yesterday is last week's Sunday
        ) {
            console.log(
                `Student cannot see duration ${formattedDuration} of learning time that is not within the week in Stats Page`
            );
        } else {
            await this.learner.instruction(
                `student sees duration accumulated ${formattedDuration} in learning stats screen on complete date ${formattedCompleteDate}`,
                async function (learner) {
                    await studentSeesLearningTimeOnStatsPage(
                        learner,
                        formattedCompleteDate,
                        formattedDuration
                    );
                }
            );
        }
    }
);

Then(
    `student {string} duration accumulated in learning stats screen on submitted date`,
    async function (this: IMasterWorld, result: AccountAction): Promise<void> {
        const context = this.scenario;
        const duration = await context.get(aliasTaskAssignmentDuration);
        let formattedDuration = duration;
        if (duration.includes(' ') == false) {
            formattedDuration = parseTeacherDurationToStudentDuration(duration);
        }
        const submittedDate = moment(new Date()).format('YYYY/MM/DD');
        if (result == 'sees') {
            await this.learner.instruction(
                `student sees duration accumulated ${formattedDuration} in learning stats screen on submitted date ${submittedDate}`,
                async function (learner) {
                    await studentSeesLearningTimeOnStatsPage(
                        learner,
                        submittedDate,
                        formattedDuration
                    );
                }
            );
        } else {
            await this.learner.instruction(
                `student does not see learning time accumulated ${formattedDuration} in learning stats screen on submitted date ${submittedDate}`,
                async function (learner) {
                    await studentDoesNotSeeLearningTimeOnStatsPage(
                        learner,
                        submittedDate,
                        formattedDuration
                    );
                }
            );
        }
    }
);

Then(
    `teacher sees the submission with incomplete status on teacher dashboard`,
    async function (this: IMasterWorld): Promise<void> {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);
        const context = this.scenario;
        const courseName = context.get<string>(aliasCourseName);
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();

        await this.teacher.instruction(
            `teacher goes to course ${courseName} people tab from home page`,
            async function (this: TeacherInterface) {
                await teacherGoesToStudyPlanDetails(this, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `teacher sees the submission of ${taskAssignmentName} with incomplete status on teacher dashboard`,
            async function (teacher) {
                await teacherSeesIncompleteStatusOnTeacherDashBoard(teacher, taskAssignmentName);
            }
        );
    }
);

Then(
    `teacher sees the submission with matched data on teacher dashboard`,
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

        await delay(1000);

        await this.teacher.instruction(
            `teacher sees complete date ${formattedDate} of ${taskAssignmentName} on teacher dashboard`,
            async function (teacher) {
                await teacherSeesCompleteDateOnTeacherDashBoard(
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
                `teacher sees grade ${correctness} of ${taskAssignmentName} on teacher dashboard`,
                async function (teacher) {
                    await teacherSeesGradeOnTeacherDashBoard(
                        teacher,
                        taskAssignmentName,
                        correctness
                    );
                }
            );
        }

        await this.teacher.instruction(
            `teacher sees the submission of ${taskAssignmentName} with complete status on teacher dashboard`,
            async function (teacher) {
                await teacherSeesCompleteStatusOnTeacherDashBoard(teacher, taskAssignmentName);
            }
        );
    }
);

Then(
    `teacher sees the submission with incomplete status on task assignment detail screen`,
    async function (this: IMasterWorld): Promise<void> {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);

        await this.teacher.instruction(
            `teacher goes to task assignment detail screen`,
            async function (this: TeacherInterface) {
                await teacherGoesToTaskAssignmentDetailScreen(this, taskAssignmentName);
            }
        );

        await this.teacher.instruction(
            `teacher sees the submission with incomplete status`,
            async function (this: TeacherInterface) {
                await teacherSeesIncompleteStatusOnTaskAssignmentDetailScreen(this);
            }
        );
    }
);

Then(
    `teacher sees the submission with complete status on task assignment detail screen`,
    async function (this: IMasterWorld): Promise<void> {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);

        await this.teacher.instruction(
            `teacher goes to task assignment detail screen`,
            async function (this: TeacherInterface) {
                await teacherGoesToTaskAssignmentDetailScreen(this, taskAssignmentName);
            }
        );

        await this.teacher.instruction(
            `teacher sees the submission with complete status`,
            async function (this: TeacherInterface) {
                await teacherSeesCompleteStatusOnTaskAssignmentDetailScreen(this);
            }
        );
    }
);

Then(
    `teacher sees submitted data on task assignment detail screen`,
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
            `teacher sees complete date ${completeDate}`,
            async function (teacher) {
                await teacherSeesSubmittedCompleteDate(teacher, completeDate);
            }
        );

        if (settings.includes('Text note')) {
            await this.teacher.instruction(
                `teacher sees data ${textNote} on text note`,
                async function (teacher) {
                    await teacherSeesSubmittedTextNote(teacher, textNote);
                }
            );
        }

        if (settings.includes('Correctness')) {
            await this.teacher.instruction(
                `teacher sees data ${correctness} on correctness`,
                async function (teacher) {
                    await teacherSeesSubmittedCorrectness(teacher, correctness);
                }
            );
        }

        if (settings.includes('Duration')) {
            await this.teacher.instruction(
                `teacher sees data ${duration} on duration`,
                async function (teacher) {
                    await teacherSeesSubmittedDuration(teacher, duration);
                }
            );
        }

        if (settings.includes('File attachment')) {
            await this.teacher.instruction(
                `teacher sees data ${attachmentFileNames[0]} on attachment`,
                async function (teacher) {
                    await teacherSeesTaskAssignmentAttachments(teacher, attachmentFileNames[0]);
                }
            );
        }

        if (settings.includes('Understanding level')) {
            await this.teacher.instruction(
                `teacher sees data ${understandingLevel} on attachment understanding level`,
                async function (teacher) {
                    await teacherSeesSubmittedUnderstandingLevel(teacher, understandingLevel);
                }
            );
        }
    }
);
