import { LearnerKeys } from '@common/learner-key';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function studentRefreshHomeScreen(learner: LearnerInterface) {
    try {
        await learner.flutterDriver!.waitFor(new ByValueKey(LearnerKeys.courseList));
        await learner.flutterDriver!.scroll(
            new ByValueKey(LearnerKeys.courseList),
            0.0,
            4000,
            1000,
            60
        );
    } catch (err) {
        await learner.flutterDriver!.scroll(
            new ByValueKey(LearnerKeys.learning_page),
            0.0,
            4000,
            1000,
            60
        ); /// No course case
    }
}
