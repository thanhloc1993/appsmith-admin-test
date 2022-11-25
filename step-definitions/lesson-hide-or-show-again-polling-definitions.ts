import { LearnerInterface, TeacherInterface } from '@supports/app-types';

import { LearnerKeys } from './learner-keys/learner-key';
import { TeacherKeys } from './teacher-keys/teacher-keys';
import { ByValueKey } from 'flutter-driver-x';
import { liveLessonScreenVisible } from 'step-definitions/teacher-keys/lesson';

export async function teacherSeesSetUpPollingPageWithOptionOnTeacherApp(
    teacher: TeacherInterface,
    optionName: string,
    isCorrect: boolean
) {
    const driver = teacher.flutterDriver!;
    const setUpPollingView = TeacherKeys.setUpPollingView;

    await driver.waitFor(new ByValueKey(setUpPollingView));

    await driver.waitFor(new ByValueKey(TeacherKeys.setUpPollingOptionKey(optionName, isCorrect)));
}

export async function teacherDoesNotSeePollingStatsPageOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const pollingStatsPageKey = new ByValueKey(TeacherKeys.pollingStatsPageKey);
    await driver.waitForAbsent(pollingStatsPageKey);
}

export async function teacherSeePollingStatsPageVisibleOnTeacherApp(
    teacher: TeacherInterface,
    visible: boolean
) {
    const driver = teacher.flutterDriver!;
    const pollingStatsPageKey = new ByValueKey(
        TeacherKeys.liveLessonScreenVisible(liveLessonScreenVisible['pollingView'])
    );
    if (visible) {
        await driver.waitFor(pollingStatsPageKey);
    } else {
        await driver.waitForAbsent(pollingStatsPageKey);
    }
}

export async function teacherSelectPollingButtonWithActiveStatusOnTeacherApp(
    teacher: TeacherInterface,
    isActive: boolean
) {
    const driver = teacher.flutterDriver!;

    const teachingPollButton = TeacherKeys.teachingPollButtonWithActiveStatus(isActive);

    await driver.tap(new ByValueKey(teachingPollButton));
}

export async function learnerHidesPollingAnswerBarOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const liveLessonLearnerPollHidePollingButtonKey =
        LearnerKeys.liveLessonLearnerPollHidePollingButtonKey;

    await driver.tap(new ByValueKey(liveLessonLearnerPollHidePollingButtonKey));
}

export async function learnerSeesPollingIconWithActiveStatusOnTeacherApp(
    learner: LearnerInterface,
    isActive: boolean
) {
    const driver = learner.flutterDriver!;
    const learnerPollButtonWithActiveStatus =
        LearnerKeys.liveLessonLearnerPollButtonWithActiveStatus(isActive);
    await driver.waitFor(new ByValueKey(learnerPollButtonWithActiveStatus));
}

export async function learnerShowsPollingAnswerBarOnLearnerApp(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const learnerPollButtonWithActiveStatus =
        LearnerKeys.liveLessonLearnerPollButtonWithActiveStatus(true);

    await driver.tap(new ByValueKey(learnerPollButtonWithActiveStatus));
}
