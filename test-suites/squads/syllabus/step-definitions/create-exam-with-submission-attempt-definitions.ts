import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export const studentSeeAllowedAttempt = async (
    learner: LearnerInterface,
    maximumAttempt: number | undefined
) => {
    if (maximumAttempt === undefined) {
        await learner.flutterDriver!.waitForAbsent(
            new ByValueKey(SyllabusLearnerKeys.examLOSubmissionAttempt)
        );
    } else {
        await learner.flutterDriver!.waitFor(
            new ByValueKey(SyllabusLearnerKeys.examLOSubmissionAttempt)
        );
        await learner.flutterDriver!.waitFor(
            new ByValueKey(SyllabusLearnerKeys.examLOSubmissionAttemptWithValue(maximumAttempt))
        );
    }
};
