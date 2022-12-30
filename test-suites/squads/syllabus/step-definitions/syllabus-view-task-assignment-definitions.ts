import { CMSInterface } from '@supports/app-types';

import { loAndAssignmentByName, topicItemRoot } from './cms-selectors/cms-keys';
import {
    schoolAdminSeesTaskAssignment,
    TaskAssignmentValue,
} from './syllabus-create-task-assignment-definitions';

export async function schoolAdminClickLOByName(cms: CMSInterface, name: string) {
    const cmsPage = cms.page!;

    // Wait loading topic
    await cmsPage.waitForSelector(topicItemRoot);
    await cmsPage.click(loAndAssignmentByName(name));
}

export async function schoolAdminSeeTaskAssignmentInfo(
    cms: CMSInterface,
    value: TaskAssignmentValue
) {
    await schoolAdminSeesTaskAssignment(cms, 'name', value);
}
