import { LearnerKeys } from '@legacy-step-definitions/learner-keys/learner-key';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function verifyNotificationDescriptionHaveHyperlink(
    learner: LearnerInterface,
    link: string
) {
    const driver = learner.flutterDriver!;

    const descriptionHtmlWidgetFinder = new ByValueKey(
        LearnerKeys.notificationDescriptionHtmlWidget(`[${link}]`)
    );
    await driver.waitFor(descriptionHtmlWidgetFinder);
}
