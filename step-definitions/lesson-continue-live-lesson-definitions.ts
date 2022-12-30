import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherContinuesLessonNormallyOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const liveStreamScreen = new ByValueKey(TeacherKeys.liveStreamScreen);
    await driver.waitFor(liveStreamScreen);
}

export async function learnerContinuesLessonNormallyOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;

    const liveStreamScreen = new ByValueKey(LearnerKeys.liveStreamScreen);
    await driver.waitFor(liveStreamScreen);
}
