import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { LearnerInterface } from '@supports/app-types';

import { ByValueKey } from 'flutter-driver-x';

export async function studentGoesBackToHomeScreenFromDoingExamLoScreen(
    learner: LearnerInterface
): Promise<void> {
    await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.leaveButtonKey));
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    await learner.flutterDriver?.waitFor(new ByValueKey(SyllabusLearnerKeys.book_detail_screen));
    await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    await learner.flutterDriver?.waitFor(new ByValueKey(SyllabusLearnerKeys.homeScreen));
}
