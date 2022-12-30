import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherSeesPollingSubmissionOnTeacherApp(
    teacher: TeacherInterface,
    submission: string
) {
    const driver = teacher.flutterDriver!;
    const liveLessonPollingStatsPageSubmissionTextKey =
        TeacherKeys.liveLessonPollingStatsPageSubmissionTextKey(submission);
    await driver.waitFor(new ByValueKey(liveLessonPollingStatsPageSubmissionTextKey));
}

export async function teacherSeesPollingAccuracyOnTeacherApp(
    teacher: TeacherInterface,
    accuracy: string
) {
    const driver = teacher.flutterDriver!;
    const liveLessonPollingStatsPageAccuracyTextKey =
        TeacherKeys.liveLessonPollingStatsPageAccuracyTextKey(accuracy);
    await driver.waitFor(new ByValueKey(liveLessonPollingStatsPageAccuracyTextKey));
}
