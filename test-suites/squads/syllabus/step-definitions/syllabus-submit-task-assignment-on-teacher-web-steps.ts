import { delay, genId, getRandomElementsWithLength } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { CMSInterface, IMasterWorld, TeacherInterface } from '@supports/app-types';

import {
    aliasTaskAssignmentInstruction,
    aliasTaskAssignmentName,
    aliasTaskAssignmentSetting,
} from './alias-keys/syllabus';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import {
    schoolAdminSeesTaskAssignment,
    schoolAdminSelectTaskAssignmentSetting,
    taskAssignmentSetting,
    TaskAssignmentSettingInfo,
} from './syllabus-create-task-assignment-definitions';
import { schoolAdminSelectEditAssignment } from './syllabus-edit-assignment-definitions';
import { State } from './syllabus-submit-task-assignment-on-learner-app-steps';
import {
    schoolAdminGoesToTaskAssignmentDetails,
    teacherAttachesFilesOnTaskAssignment,
    teacherCannotSubmitTaskAssignment,
    teacherCanSubmitTaskAssignment,
    teacherChoosesUnderstandingLevelOnTaskAssignment,
    teacherFillsCompleteDateOnTaskAssignment,
    teacherFillsCorrectnessOnTaskAssignment,
    teacherFillsDurationOnTaskAssignment,
    teacherFillsTextNoteOnTaskAssignment,
    teacherGetsAttachmentNamesOnTaskAssignment,
    teacherGetsCompleteDateOnTaskAssignment,
    teacherGetsCorrectnessOnTaskAssignment,
    teacherGetsDurationOnTaskAssignment,
    teacherGetsTextNoteOnTaskAssignment,
    teacherGoesToTaskAssignmentDetailScreen,
    teacherSeesDashboard,
    teacherSubmitsTaskAssignment,
} from './syllabus-submit-task-assignment-on-teacher-web-definitions';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

Given(
    `school admin goes to a task assignment detail page of the content book`,
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;

        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);

        await this.cms.instruction(
            `go to book details just created`,
            async function (this: CMSInterface) {
                await schoolAdminIsOnBookDetailsPage(this, context);
            }
        );

        await this.cms.instruction(
            `school admin goes to assignment details, select to edit the assignment`,
            async function (cms) {
                await schoolAdminGoesToTaskAssignmentDetails(cms, context, taskAssignmentName);
            }
        );

        await this.cms.instruction(
            `school admin select to edit the assignment`,
            async function (cms) {
                await schoolAdminSelectEditAssignment(cms);
            }
        );
    }
);

Given(
    `school admin edits task assignment setting to include random n required fields`,
    async function (this: IMasterWorld): Promise<void> {
        const randomN = randomInteger(0, 5); // 5 available setting required items
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

Given(
    `school admin sees the edited task assignment setting on CMS`,
    async function (this: IMasterWorld): Promise<void> {
        const name = this.scenario.get(aliasTaskAssignmentName);
        const instruction = this.scenario.get(aliasTaskAssignmentInstruction);
        const setting = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);
        await this.cms.instruction(
            `school admin sees the edited task assignment setting ${setting} on CMS`,
            async function (this: CMSInterface) {
                await schoolAdminSeesTaskAssignment(this, 'any required item', {
                    name,
                    instruction,
                    setting,
                });
            }
        );
    }
);

When(
    `teacher fills all required fields with data on Teacher App`,
    async function (this: IMasterWorld): Promise<void> {
        const scenario = this.scenario;
        const name = scenario.get(aliasTaskAssignmentName);
        const setting = scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

        await this.teacher.instruction(
            `teacher reloads dashboard screen`,
            async function (this: TeacherInterface) {
                await this.flutterDriver?.reload();
                await delay(1000);
            }
        );

        await this.teacher.instruction(
            `teacher goes to task assignment detail screen`,
            async function (this: TeacherInterface) {
                await teacherGoesToTaskAssignmentDetailScreen(this, name);
            }
        );

        await this.teacher.instruction(
            `teacher fills complete date`,
            async function (this: TeacherInterface) {
                await teacherFillsCompleteDateOnTaskAssignment(this, 1);
                await teacherGetsCompleteDateOnTaskAssignment(this, scenario);
            }
        );

        for (let i = 0; i < setting.length; i++) {
            switch (setting[i]) {
                case 'Text note':
                    await this.teacher.instruction(
                        `teacher fills text note`,
                        async function (this: TeacherInterface) {
                            await teacherFillsTextNoteOnTaskAssignment(this);
                            await teacherGetsTextNoteOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
                case 'Correctness':
                    await this.teacher.instruction(
                        `teacher fills correctness`,
                        async function (this: TeacherInterface) {
                            await teacherFillsCorrectnessOnTaskAssignment(this);
                            await teacherGetsCorrectnessOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
                case 'Duration':
                    await this.teacher.instruction(
                        `teacher fills duration`,
                        async function (this: TeacherInterface) {
                            await teacherFillsDurationOnTaskAssignment(this);
                            await teacherGetsDurationOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
                case 'File attachment':
                    await this.teacher.instruction(
                        `teacher attaches attachment`,
                        async function (this: TeacherInterface) {
                            await teacherAttachesFilesOnTaskAssignment(this);
                            await teacherGetsAttachmentNamesOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
                case 'Understanding level':
                    await this.teacher.instruction(
                        `teacher chooses understanding level`,
                        async function (this: TeacherInterface) {
                            await teacherChoosesUnderstandingLevelOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
            }
        }
    }
);

When(
    `teacher fills all required fields with data on Teacher App that complete date is {string} submitted date`,
    async function (this: IMasterWorld, state: State): Promise<void> {
        const scenario = this.scenario;
        const name = scenario.get(aliasTaskAssignmentName);
        const setting = scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() - 1);
        const dates = [yesterday, tomorrow];
        const randomDate = dates[randomInteger(0, 1)];

        await this.teacher.instruction(
            `teacher reloads dashboard screen`,
            async function (this: TeacherInterface) {
                await this.flutterDriver?.reload();
                await delay(1000);
            }
        );

        await this.teacher.instruction(
            `teacher goes to task assignment detail screen`,
            async function (this: TeacherInterface) {
                await teacherGoesToTaskAssignmentDetailScreen(this, name);
            }
        );

        if (state == 'different from') {
            await this.teacher.instruction(
                `teacher fills complete date that is different from today - submitted day`,
                async function (this: TeacherInterface) {
                    await teacherFillsCompleteDateOnTaskAssignment(this, randomDate.getDate());
                    await teacherGetsCompleteDateOnTaskAssignment(this, scenario);
                }
            );
        } else {
            await this.teacher.instruction(
                `teacher fills complete date that is the same as today - submitted day`,
                async function (this: TeacherInterface) {
                    await teacherFillsCompleteDateOnTaskAssignment(this, today.getDate());
                    await teacherGetsCompleteDateOnTaskAssignment(this, scenario);
                }
            );
        }

        for (let i = 0; i < setting.length; i++) {
            switch (setting[i]) {
                case 'Text note':
                    await this.teacher.instruction(
                        `teacher fills text note`,
                        async function (this: TeacherInterface) {
                            await teacherFillsTextNoteOnTaskAssignment(this);
                            await teacherGetsTextNoteOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
                case 'Correctness':
                    await this.teacher.instruction(
                        `teacher fills correctness`,
                        async function (this: TeacherInterface) {
                            await teacherFillsCorrectnessOnTaskAssignment(this);
                            await teacherGetsCorrectnessOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
                case 'Duration':
                    await this.teacher.instruction(
                        `teacher fills duration`,
                        async function (this: TeacherInterface) {
                            await teacherFillsDurationOnTaskAssignment(this);
                            await teacherGetsDurationOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
                case 'File attachment':
                    await this.teacher.instruction(
                        `teacher attaches attachment`,
                        async function (this: TeacherInterface) {
                            await teacherAttachesFilesOnTaskAssignment(this);
                            await teacherGetsAttachmentNamesOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
                case 'Understanding level':
                    await this.teacher.instruction(
                        `teacher chooses understanding level`,
                        async function (this: TeacherInterface) {
                            await teacherChoosesUnderstandingLevelOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
            }
        }
    }
);

When(
    `teacher fills a required field with no data on Teacher App`,
    async function (this: IMasterWorld): Promise<void> {
        const scenario = this.scenario;
        const name = scenario.get(aliasTaskAssignmentName);
        const setting = scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

        await this.teacher.instruction(
            `teacher reloads dashboard screen`,
            async function (this: TeacherInterface) {
                await this.flutterDriver?.reload();
                await delay(1000);
            }
        );

        await this.teacher.instruction(
            `teacher goes to task assignment detail screen`,
            async function (this: TeacherInterface) {
                await teacherGoesToTaskAssignmentDetailScreen(this, name);
            }
        );

        if (setting?.length != 0) {
            await this.teacher.instruction(
                `teacher fills complete date`,
                async function (this: TeacherInterface) {
                    await teacherFillsCompleteDateOnTaskAssignment(this, 1);
                }
            );
        }

        setting.pop();

        for (let i = 0; i < setting!.length; i++) {
            switch (setting![i]) {
                case 'Text note':
                    await this.teacher.instruction(
                        `teacher fills text note`,
                        async function (this: TeacherInterface) {
                            await teacherFillsTextNoteOnTaskAssignment(this);
                        }
                    );
                    break;
                case 'Correctness':
                    await this.teacher.instruction(
                        `teacher fills correctness`,
                        async function (this: TeacherInterface) {
                            await teacherFillsCorrectnessOnTaskAssignment(this);
                        }
                    );
                    break;
                case 'Duration':
                    await this.teacher.instruction(
                        `teacher fills duration`,
                        async function (this: TeacherInterface) {
                            await teacherFillsDurationOnTaskAssignment(this);
                        }
                    );
                    break;
                case 'File attachment':
                    await this.teacher.instruction(
                        `teacher attaches attachment`,
                        async function (this: TeacherInterface) {
                            await teacherAttachesFilesOnTaskAssignment(this);
                            await teacherGetsAttachmentNamesOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
                case 'Understanding level':
                    await this.teacher.instruction(
                        `teacher chooses understanding level`,
                        async function (this: TeacherInterface) {
                            await teacherChoosesUnderstandingLevelOnTaskAssignment(this, scenario);
                        }
                    );
                    break;
            }
        }
    }
);

Then(
    `teacher can submit the task assignment on Teacher App`,
    async function (this: IMasterWorld): Promise<void> {
        await this.teacher.instruction(
            `teacher can submit the task assignment on Teacher App`,
            async function (this: TeacherInterface) {
                await teacherCanSubmitTaskAssignment(this);
            }
        );
    }
);

Then(
    `teacher cannot submit the task assignment on Teacher App`,
    async function (this: IMasterWorld): Promise<void> {
        await this.teacher.instruction(
            `teacher cannot submit the task assignment on Teacher App`,
            async function (this: TeacherInterface) {
                await teacherCannotSubmitTaskAssignment(this);
            }
        );
    }
);

Then(`teacher submits the task assignment`, async function (this: IMasterWorld): Promise<void> {
    await this.teacher.instruction(
        `teacher submits the task assignment on Teacher App`,
        async function (this: TeacherInterface) {
            await teacherSubmitsTaskAssignment(this);
        }
    );
    await delay(1000); // wait to submit task assignment
    await this.teacher.instruction(
        `teacher sees dashboard after submitting task assignment on Teacher App`,
        async function (this: TeacherInterface) {
            await teacherSeesDashboard(this);
        }
    );
});
