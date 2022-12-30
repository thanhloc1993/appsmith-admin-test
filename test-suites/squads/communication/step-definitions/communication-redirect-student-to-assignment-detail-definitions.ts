import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function learnerClickOnViewAssignmentButton(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const notificationFinder = new ByValueKey(LearnerKeys.viewAssignmentButton);
    await driver.tap(notificationFinder);
}

export async function verifyAssignmentInfoInAssignmentDetail(
    learner: LearnerInterface,
    assignmentName: string
) {
    const driver = learner.flutterDriver!;
    const appBarFinder = new ByValueKey(LearnerKeys.appBarName(assignmentName));
    await driver.waitFor(appBarFinder);
}
