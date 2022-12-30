import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasBookDetailsPage,
    aliasBookName,
    aliasTaskAssignmentInstruction,
    aliasTaskAssignmentName,
    aliasTaskAssignmentSetting,
    aliasTopicName,
} from './alias-keys/syllabus';
import { loAndAssignmentByName, taskAssignmentFormRoot } from './cms-selectors/cms-keys';
import {
    schoolAdminCreateATaskAssignment,
    schoolAdminSeesTaskAssignment,
    TaskAssignmentInfo,
    TaskAssignmentSettingInfo,
} from './syllabus-create-task-assignment-definitions';
import {
    getRandomTaskAssignmentSettings,
    schoolAdminSeesErrorMessageField,
} from './syllabus-utils';
import { genId } from 'step-definitions/utils';

When(
    'school admin creates a task assignment with {string}',
    async function (this: IMasterWorld, field: TaskAssignmentInfo) {
        const topicName = this.scenario.get(aliasTopicName);
        const name = `Task ${genId()}`;
        const instruction = `Task instruction ${genId()}`;
        const setting = getRandomTaskAssignmentSettings();
        await this.cms.instruction(
            `school admin create a task assignment with ${field} in topic ${topicName}`,
            async () => {
                await schoolAdminCreateATaskAssignment(this.cms, topicName, field, {
                    name,
                    instruction,
                    setting,
                });
                this.scenario.set(aliasTaskAssignmentInstruction, instruction);
                this.scenario.set(aliasTaskAssignmentSetting, setting);
                this.scenario.set(aliasTaskAssignmentName, name);
            }
        );
    }
);

Then(
    'school admin sees {string} on created task assignment',
    async function (this: IMasterWorld, field: TaskAssignmentInfo) {
        const name = this.scenario.get(aliasTaskAssignmentName);
        const instruction = this.scenario.get(aliasTaskAssignmentInstruction);
        const setting = this.scenario.get<TaskAssignmentSettingInfo[]>(aliasTaskAssignmentSetting);
        await schoolAdminSeesTaskAssignment(this.cms, field, {
            name,
            instruction,
            setting,
        });
    }
);

Then('school admin sees a new task assignment on CMS', async function (this: IMasterWorld) {
    const scenario = this.scenario;
    const topicName = this.scenario.get(aliasTopicName);
    const taskName = scenario.get(aliasTaskAssignmentName);
    await this.cms.instruction(
        `school admin see a new created task assignment in topic ${topicName}`,
        async () => {
            await this.cms.page!.goto(scenario.get(aliasBookDetailsPage));
            await this.cms.assertThePageTitle(scenario.get(aliasBookName));
            await this.cms.page!.waitForSelector(loAndAssignmentByName(taskName));
        }
    );
});

When(
    'school admin creates a task assignment with missing {string}',
    async function (this: IMasterWorld, field: TaskAssignmentInfo) {
        const topicName = this.scenario.get(aliasTopicName);
        await this.cms.instruction(
            `school admin create task assignment with missing ${field} in topic ${topicName}`,
            async () => {
                await schoolAdminCreateATaskAssignment(this.cms, topicName, field, {
                    name: undefined,
                });
            }
        );
    }
);

Then('school admin cannot create any task assignment', async function (this: IMasterWorld) {
    await this.cms.instruction(
        'school admin still see add task assignment form with error message',
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: taskAssignmentFormRoot,
            });
        }
    );
});
