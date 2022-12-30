import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { LearnerInterface } from '@supports/app-types';

import {
    notificationItemContentKey,
    notificationItemTitleKey,
} from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function verifyAssignmentReturnNotificationItem(
    learner: LearnerInterface,
    itemIndex: number,
    assignmentTitle: string,
    assignmentName: string
): Promise<void> {
    const driver = learner.flutterDriver!;

    const notificationItemTitleFinder = new ByValueKey(notificationItemTitleKey(itemIndex));
    const title = await driver.getText(notificationItemTitleFinder);
    weExpect(title).toEqual(assignmentTitle);

    const notificationItemContentFinder = new ByValueKey(notificationItemContentKey(itemIndex));
    const content = await driver.getText(notificationItemContentFinder);
    weExpect(content).toContain(assignmentName);
}

export async function verifyAssignmentReturnNotificationInNotificationDetail(
    learner: LearnerInterface,
    assignmentTitle: string,
    assignmentName: string
): Promise<void> {
    const driver = learner.flutterDriver!;

    const notificationDetailTitleFinder = new ByValueKey(LearnerKeys.notificationDetailTitle);
    const title = await driver.getText(notificationDetailTitleFinder);
    weExpect(title).toEqual(assignmentTitle);

    const notificationRawHtmlFinder = new ByValueKey(LearnerKeys.notificationRawHtmlKey);
    const rawHtml = await driver.getText(notificationRawHtmlFinder);
    weExpect(rawHtml).toContain(assignmentName);
}
