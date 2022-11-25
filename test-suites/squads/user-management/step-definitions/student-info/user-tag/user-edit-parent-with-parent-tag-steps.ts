import { When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { ParentTagAction } from './type';
import { schoolAdminEditStudentAndParentWithTags } from './user-edit-parent-with-parent-tag-definitions';

When(
    'school admin edits parent tag by {string}',
    async function (this: IMasterWorld, parentTagAction: ParentTagAction) {
        const cms = this.cms;
        const scenarioContext = this.scenario;
        await schoolAdminEditStudentAndParentWithTags(cms, scenarioContext, parentTagAction);
    }
);
