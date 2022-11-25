import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherGoesToPollingDetailsPageOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const pollingDetailTabKey = TeacherKeys.pollingDetailTabKey;
    await driver.tap(new ByValueKey(pollingDetailTabKey));

    const pollingDetailPageKey = TeacherKeys.pollingDetailPageKey;
    await driver.waitFor(new ByValueKey(pollingDetailPageKey));
}

export async function teacherSeeLearnerSubmittedOptionAtPollingDetailsPageOnTeacherApp(
    teacher: TeacherInterface,
    learnerId: string,
    option: string,
    isLearnerAnswerCorrectAtLestOneOption: boolean
) {
    const teacherDriver = teacher.flutterDriver!;

    const liveLessonPollingDetailsLearnerAnswerKey = new ByValueKey(
        TeacherKeys.liveLessonPollingDetailsLearnerAnswerKey(
            learnerId,
            option,
            isLearnerAnswerCorrectAtLestOneOption
        )
    );

    await teacherDriver.waitFor(liveLessonPollingDetailsLearnerAnswerKey);
}
