import { TeacherInterface } from '@supports/app-types';

import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';

export async function teacherAddsOptionsToPollingOptionsOnTeacherApp(
    teacher: TeacherInterface,
    options: string[]
) {
    const driver = teacher.flutterDriver!;

    const liveLessonTeacherPollAddQuizOptionButtonKey =
        TeacherKeys.liveLessonTeacherPollAddQuizOptionButtonKey;

    for (let i = 0; i < options.length; i++) {
        await driver.tap(new ByValueKey(liveLessonTeacherPollAddQuizOptionButtonKey));
    }
}

export async function teacherSeesSetUpPollingPageWithOptionsOnTeacherApp(
    teacher: TeacherInterface,
    options: string[]
) {
    const driver = teacher.flutterDriver!;
    const setUpPollingView = TeacherKeys.setUpPollingView;
    await driver.waitFor(new ByValueKey(setUpPollingView));

    for (let i = 0; i < options.length; i++) {
        const pollingOption = options[i];
        await driver.waitFor(
            new ByValueKey(TeacherKeys.setUpPollingOptionKey(pollingOption, false))
        );
    }
}

export async function teacherRemovesPollingAnswerOptionsOnTeacherApp(
    teacher: TeacherInterface,
    options: string[]
) {
    const driver = teacher.flutterDriver!;

    const liveLessonTeacherPollRemoveQuizOptionButtonKey =
        TeacherKeys.liveLessonTeacherPollRemoveQuizOptionButtonKey;

    for (let i = 0; i < options.length; i++) {
        await driver.tap(new ByValueKey(liveLessonTeacherPollRemoveQuizOptionButtonKey));
    }
}
