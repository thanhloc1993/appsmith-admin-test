import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x/dist/common/find';

export async function learnerSubmitsOptionOnLearnerApp(learner: LearnerInterface, option: string) {
    const driver = learner.flutterDriver!;
    const optionButton = LearnerKeys.liveLessonPollingLearnerQuizBarOptionTextKey(option, false);
    const submitButton = LearnerKeys.liveLessonLearnerPollQuizBarSubmitButtonKey(false);

    await driver.tap(new ByValueKey(optionButton));
    await driver.tap(new ByValueKey(submitButton));
}

export async function learnerSeesPollingResultBannerOnLearnerApp(
    learner: LearnerInterface,
    isCorrect: boolean
) {
    const driver = learner.flutterDriver!;
    const resultBanner = LearnerKeys.liveLessonPollingLearnerQuizResultBannerKey(isCorrect);
    await driver.waitFor(new ByValueKey(resultBanner));
}

export async function learnerSeesPollingSubmitButtonStatusOnLearnerApp(
    learner: LearnerInterface,
    isEnable: boolean
) {
    const driver = learner.flutterDriver!;
    const submitButton = LearnerKeys.liveLessonLearnerPollQuizBarSubmitButtonKey(!isEnable);
    await driver.waitFor(new ByValueKey(submitButton));
}

export async function learnerSeesTheirSelectedOptionStatusOnLearnerApp(
    learner: LearnerInterface,
    option: string,
    isAnswerCorrect: boolean
) {
    const driver = learner.flutterDriver!;
    const optionButton = LearnerKeys.pollingLearnerQuizBarOptionKey(option, isAnswerCorrect, true);
    await driver.waitFor(new ByValueKey(optionButton));
}
