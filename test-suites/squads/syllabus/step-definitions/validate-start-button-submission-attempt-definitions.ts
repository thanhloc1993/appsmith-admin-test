import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function studentPressTakeAgainButton(learner: LearnerInterface) {
    await learner.instruction(`student press take again button`, async () => {
        const takeAgainButtonFinder = new ByValueKey(SyllabusLearnerKeys.takeAgainButton);
        await learner.flutterDriver!.waitFor(takeAgainButtonFinder);
        await learner.flutterDriver!.tap(takeAgainButtonFinder);
    });
}

export async function validateStartButton(learner: LearnerInterface, enabled: boolean) {
    if (enabled) {
        const startExamLOButtonFinder = new ByValueKey(SyllabusLearnerKeys.startExamLOButton);
        await learner.flutterDriver!.waitFor(startExamLOButtonFinder);
    } else {
        const startExamLOButtonDisabledFinder = new ByValueKey(
            SyllabusLearnerKeys.startExamLOButtonDisabled
        );
        await learner.flutterDriver!.waitFor(startExamLOButtonDisabledFinder);
    }
}
