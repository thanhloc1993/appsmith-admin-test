import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    schoolAdminClickLOByName,
    schoolAdminSeeTaskAssignmentInfo,
} from './syllabus-view-task-assignment-definitions';
import { aliasTaskAssignmentName } from 'step-definitions/alias-keys/syllabus';

When('school admin views created task assignment', async function (this: IMasterWorld) {
    const name = this.scenario.get(aliasTaskAssignmentName);

    await this.cms.instruction(`school admin click task assignment named ${name}`, async () => {
        await schoolAdminClickLOByName(this.cms, name);
    });
});

Then("school admin sees task assignment's info", async function (this: IMasterWorld) {
    const name = this.scenario.get(aliasTaskAssignmentName);

    await this.cms.instruction("school admin sees task assignment's info", async () => {
        await schoolAdminSeeTaskAssignmentInfo(this.cms, { name });
    });
});
