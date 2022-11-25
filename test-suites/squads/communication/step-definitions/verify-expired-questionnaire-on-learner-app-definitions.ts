import { LearnerInterface } from '@supports/app-types';

import {
    questionnaireExpiredStatus,
    questionnaireSubmitButton,
} from './learner-keys/communication-key';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerSeesNotificationDisplayWithExpiredQuestionnaire(
    learner: LearnerInterface
) {
    const driver = learner.flutterDriver!;
    const questionnaireExpiredStatusFinder = new ByValueKey(questionnaireExpiredStatus);
    const questionnaireSubmitButtonDisabled = new ByValueKey(questionnaireSubmitButton(false));
    await driver.waitFor(questionnaireExpiredStatusFinder);
    await driver.waitFor(questionnaireSubmitButtonDisabled);
}
