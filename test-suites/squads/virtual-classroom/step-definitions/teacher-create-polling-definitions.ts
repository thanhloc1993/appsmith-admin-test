import { LearnerKeys } from '@common/learner-key';
import { TeacherKeys } from '@common/teacher-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';
import { defaultPollingOptions } from '@supports/constants';

import { ByValueKey } from 'flutter-driver-x';
import { ButtonStatus } from 'test-suites/squads/virtual-classroom/utils/types';

export async function teacherSelectPollingButtonOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const teachingPollButton = TeacherKeys.teachingPollButtonWithActiveStatus(false);

    await driver.tap(new ByValueKey(teachingPollButton));
}

export async function teacherSeesSetUpPollingPageWithFourDefaultOptionsOnTeacherApp(
    teacher: TeacherInterface
) {
    const driver = teacher.flutterDriver!;
    const setUpPollingView = TeacherKeys.setUpPollingView;
    await driver.waitFor(new ByValueKey(setUpPollingView));

    for (let i = 0; i < defaultPollingOptions.length; i++) {
        const pollingOption = defaultPollingOptions[i];
        await driver.waitFor(
            new ByValueKey(TeacherKeys.setUpPollingOptionKey(pollingOption, false))
        );
    }
}

export async function assertStatusOfPollingButton(teacher: TeacherInterface, status: ButtonStatus) {
    const driver = teacher.flutterDriver!;

    const teachingPollButton = new ByValueKey(
        TeacherKeys.teachingPollButtonWithActiveStatus(status === 'active')
    );

    await driver.waitFor(teachingPollButton);
}

export async function learnerSeesPollingAnswerBarOnLearnerApp(
    learner: LearnerInterface,
    visible: boolean
) {
    const driver = learner.flutterDriver!;
    const pollingOptionsLearnerQuizBar = LearnerKeys.pollingLearnerOptionsQuizBar;
    if (visible) {
        await driver.waitFor(new ByValueKey(pollingOptionsLearnerQuizBar));
    } else {
        await driver.waitForAbsent(new ByValueKey(pollingOptionsLearnerQuizBar));
    }
}

export async function teacherSetPollingOptionOnTeacherApp(
    teacher: TeacherInterface,
    optionName: string,
    isCorrect: boolean
) {
    const driver = teacher.flutterDriver!;

    const setUpPollingOptionKey = TeacherKeys.setUpPollingOptionKey(optionName, !isCorrect);

    await driver.tap(new ByValueKey(setUpPollingOptionKey));
}

export async function teacherStartPollingOnTeacherApp(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;

    const startPollingButton = TeacherKeys.startPollingButton;

    await driver.tap(new ByValueKey(startPollingButton));
}

export async function learnerSeesOptionsOnLearnerApp(learner: LearnerInterface, options: string[]) {
    const driver = learner.flutterDriver!;

    for (let i = 0; i < options.length; i++) {
        const pollingOption = options[i];
        await driver.waitFor(
            new ByValueKey(
                LearnerKeys.liveLessonPollingLearnerQuizBarOptionTextKey(pollingOption, false)
            )
        );
    }
}
