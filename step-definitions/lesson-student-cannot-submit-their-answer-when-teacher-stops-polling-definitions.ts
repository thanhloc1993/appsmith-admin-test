import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { ByValueKey } from 'flutter-driver-x';

export async function learnerNotChooseAnyPollingOptionOnLearnerApp(
    learner: LearnerInterface,
    options: string[]
) {
    const driver = learner.flutterDriver!;

    for (let i = 0; i < options.length; i++) {
        const pollingOption = options[i];
        await driver.waitFor(
            new ByValueKey(
                LearnerKeys.liveLessonPollingLearnerQuizBarOptionTextKey(pollingOption, false)
            )
        );
    }
}

export async function learnerSeesOptionStatusOnLearnerApp(
    learner: LearnerInterface,
    option: string,
    isOptionCorrect: boolean
) {
    const driver = learner.flutterDriver!;
    const optionButton = LearnerKeys.liveLessonPollingLearnerQuizBarOptionContainerKey(
        option,
        isOptionCorrect
    );
    await driver.waitFor(new ByValueKey(optionButton));
}

export async function learnerChoosePollingOptionOnLearnerApp(
    learner: LearnerInterface,
    option: string
) {
    const driver = learner.flutterDriver!;
    const optionButton = LearnerKeys.liveLessonPollingLearnerQuizBarOptionTextKey(option, false);

    await driver.tap(new ByValueKey(optionButton));
}
