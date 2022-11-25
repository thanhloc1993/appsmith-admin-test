import { asyncForEach } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasTaskAssignmentName,
    aliasTaskAssignmentSetting,
} from './alias-keys/syllabus';
import {
    teacherSeesTaskAssignmentCompleteDate,
    teacherSeesTaskAssignmentRequiredField,
} from './create-task-assignment-with-required-items-definitions';
import {
    learnerDoesNotSeeTaskAssignmentRequiredField,
    teacherDoesNotSeeTaskAssignmentRequiredField,
} from './edit-task-assignment-with-required-items-definitions';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import {
    schoolAdminDeselectAllTaskAssignmentSetting,
    schoolAdminSeesTaskAssignment,
    schoolAdminSelectTaskAssignmentSetting,
    TaskAssignmentSettingInfo,
} from './syllabus-create-task-assignment-definitions';
import { schoolAdminSelectEditTaskAssignment } from './syllabus-edit-task-assignment-definitions';
import {
    learnerSeesTaskAssignmentCompleteDate,
    learnerSeesTaskAssignmentRequiredField,
} from './syllabus-see-task-assignment-on-learner-app-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { teacherSeesCompleteStatusOnTeacherDashBoard } from './syllabus-submit-task-assignment-on-learner-app-definitions';
import {
    getRandomTaskAssignmentSettings,
    studentGoesToTabInToDoScreen,
    studentGoesToTodosScreen,
    studentSeeStudyPlanItemInToDoTab,
} from './syllabus-utils';
import { schoolAdminClickLOByName } from './syllabus-view-task-assignment-definitions';

type EditType = 'include required items' | 'not include required items';

type VisibilityType = 'sees' | "doesn't see";

When(
    'school admin edits task assignment to {string}',
    async function (this: IMasterWorld, type: EditType) {
        await this.cms.instruction('school admin selects to edit the task assignment', async () => {
            await schoolAdminSelectEditTaskAssignment(this.cms);
        });

        switch (type) {
            case 'include required items': {
                const setting = getRandomTaskAssignmentSettings();

                await this.cms.instruction(
                    'school admin edits task assignment with required items',
                    async () => {
                        await schoolAdminSelectTaskAssignmentSetting(this.cms, setting);
                        await this.cms.selectAButtonByAriaLabel('Save');
                    }
                );
                this.scenario.set(aliasTaskAssignmentSetting, setting);
                break;
            }

            case 'not include required items': {
                await this.cms.instruction(
                    'school admin edits task assignment to not include required items',
                    async () => {
                        await schoolAdminDeselectAllTaskAssignmentSetting(this.cms);
                        await this.cms.selectAButtonByAriaLabel('Save');
                    }
                );
                break;
            }
        }
    }
);

Then(
    "school admin sees task assignment's required items edited",
    async function (this: IMasterWorld) {
        const setting = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);

        await this.cms.instruction(
            "school admin sees the task assignment's required items edited",
            async () => {
                await schoolAdminSeesTaskAssignment(this.cms, 'any required item', {
                    setting,
                });
            }
        );
    }
);

Then(
    `student {string} task assignment with required fields`,
    async function (this: IMasterWorld, visibility: VisibilityType) {
        await this.learner.instruction(`student sees complete date`, async () => {
            await learnerSeesTaskAssignmentCompleteDate(this.learner);
        });

        switch (visibility) {
            case 'sees': {
                const settings = this.scenario.get<TaskAssignmentSettingInfo[]>(
                    aliasTaskAssignmentSetting
                );

                await asyncForEach(settings, async (setting) => {
                    await this.learner.instruction(`student sees ${setting}`, async () => {
                        await learnerSeesTaskAssignmentRequiredField(this.learner, setting);
                    });
                });
                break;
            }

            case "doesn't see": {
                await this.learner.instruction(
                    `student doesn't see task assignment with required items`,
                    async () => {
                        await learnerDoesNotSeeTaskAssignmentRequiredField(this.learner);
                    }
                );
                break;
            }
        }
    }
);

Then(
    `teacher {string} task assignment with required fields`,
    async function (this: IMasterWorld, visibility: VisibilityType) {
        await this.teacher.instruction(`teacher sees complete date`, async () => {
            await teacherSeesTaskAssignmentCompleteDate(this.teacher);
        });

        switch (visibility) {
            case 'sees': {
                const settings = this.scenario.get<TaskAssignmentSettingInfo[]>(
                    aliasTaskAssignmentSetting
                );

                await asyncForEach(settings, async (setting) => {
                    await this.teacher.instruction(`teacher sees ${setting}`, async () => {
                        await teacherSeesTaskAssignmentRequiredField(this.teacher, setting);
                    });
                });
                break;
            }

            case "doesn't see": {
                await this.teacher.instruction(
                    `teacher doesn't see task assignment with required items`,
                    async () => {
                        await teacherDoesNotSeeTaskAssignmentRequiredField(this.teacher);
                    }
                );
                break;
            }
        }
    }
);

Then('school admin goes to task assignment detail page', async function (this: IMasterWorld) {
    const name = this.scenario.get(aliasTaskAssignmentName);

    await this.cms.instruction(`school admin goes to book detail page`, async () => {
        await schoolAdminIsOnBookDetailsPage(this.cms, this.scenario);
    });

    await this.cms.instruction(`school admin click task assignment named ${name}`, async () => {
        await schoolAdminClickLOByName(this.cms, name);
    });
});

Then('student still sees task assignment submission', async function (this: IMasterWorld) {
    const studyPlanItemName = this.scenario.get(aliasTaskAssignmentName);

    await this.learner.instruction('student goes to completed tab in todo screen', async () => {
        await studentGoesToTodosScreen(this.learner);
        await studentGoesToTabInToDoScreen(this.learner, this.scenario, 'completed');
    });

    await studentSeeStudyPlanItemInToDoTab(this.learner, studyPlanItemName, 'completed');
});

Then(
    'teacher still sees task assignment submission with complete status',
    async function (this: IMasterWorld) {
        const taskAssignmentName = this.scenario.get(aliasTaskAssignmentName);
        const courseName = this.scenario.get(aliasCourseName);
        const courseId = this.scenario.get(aliasCourseId);
        const studentId = await this.learner.getUserId();

        await this.teacher.instruction(
            `teacher goes to course ${courseName} people tab from home page`,
            async () => {
                await teacherGoesToStudyPlanDetails(this.teacher, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `teacher sees the submission of ${taskAssignmentName} with complete status on teacher dashboard`,
            async () => {
                await teacherSeesCompleteStatusOnTeacherDashBoard(this.teacher, taskAssignmentName);
            }
        );
    }
);
