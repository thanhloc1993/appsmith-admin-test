import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import {
    learnerTapsEndLessonButtonAfterReceivedEndAllMessage,
    learnerBacksToLessonPage,
} from './lesson-leave-lesson-definitions';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerDoesNotSeePollingIconOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    await driver.waitForAbsent(
        new ByValueKey(LearnerKeys.liveLessonLearnerPollButtonWithActiveStatus(true))
    );
    await driver.waitForAbsent(
        new ByValueKey(LearnerKeys.liveLessonLearnerPollButtonWithActiveStatus(false))
    );
}

export async function learnerHasToEndLesson(learner: LearnerInterface): Promise<void> {
    await learnerTapsEndLessonButtonAfterReceivedEndAllMessage(learner);
    await learnerBacksToLessonPage(learner);
}
