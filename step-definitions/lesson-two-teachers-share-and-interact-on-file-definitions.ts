import { LearnerInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { seesPageOfSharingPdfOnLearnerApp } from './lesson-change-page-definitions';
import { ByValueKey } from 'flutter-driver-x';
import { LessonMaterial } from 'test-suites/squads/lesson/step-definitions/lesson-create-future-and-past-lesson-of-lesson-management-definitions';

export async function learnerSeesNewFileFromBeginningOnLearnerApp(
    learner: LearnerInterface,
    file: LessonMaterial
) {
    const driver = learner.flutterDriver!;

    if (file.includes('pdf')) {
        const liveLessonWhiteBoard = new ByValueKey(LearnerKeys.liveLessonWhiteBoardView);
        await driver.waitFor(liveLessonWhiteBoard);
        await seesPageOfSharingPdfOnLearnerApp(learner, 1);
    } else {
        const presentVideo = new ByValueKey(LearnerKeys.liveLessonVideoView());
        await driver.waitFor(presentVideo);
    }
}
