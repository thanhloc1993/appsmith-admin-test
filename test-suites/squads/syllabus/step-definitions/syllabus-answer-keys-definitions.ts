import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { LearnerToDoTab, getLearnerToDoKeys } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export async function studentTapsOnStudyPlanItemInTodoTab(
    learner: LearnerInterface,
    studyPlanItemName: string,
    toDoTabPage: LearnerToDoTab
) {
    const driver = learner.flutterDriver!;
    const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));
    const { pageKey } = getLearnerToDoKeys(toDoTabPage);
    await driver.waitFor(new ByValueKey(pageKey));
    await driver.scrollIntoView(itemKey, 0.0);
    await driver.tap(itemKey, 20000);
}
