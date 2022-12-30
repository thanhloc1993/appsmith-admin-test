import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function studentRefreshHomeScreen(learner: LearnerInterface) {
    try {
        await learner.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.courseList));
        await learner.flutterDriver!.scroll(
            new ByValueKey(SyllabusLearnerKeys.courseList),
            0.0,
            4000,
            1000,
            60
        );
    } catch (err) {
        await learner.flutterDriver!.scroll(
            new ByValueKey(SyllabusLearnerKeys.learning_page),
            0.0,
            4000,
            1000,
            60
        ); /// No course case
    }
}
