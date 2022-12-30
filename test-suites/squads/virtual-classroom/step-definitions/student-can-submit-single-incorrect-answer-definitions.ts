import { LessonKeys } from '@common/lesson-keys';
import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { ByValueKey } from 'flutter-driver-x';
import { aliasPollSubmittedAnswerOptionIndexes } from 'test-suites/squads/virtual-classroom/common/alias-keys';
import { pollOptionValues } from 'test-suites/squads/virtual-classroom/utils/constants';
import { teacherTapPollDetailTabBarIfNeeded } from 'test-suites/squads/virtual-classroom/utils/navigation';
import { pollOptionIndex } from 'test-suites/squads/virtual-classroom/utils/utils';

export async function studentSubmitsPollOptions(
    learner: LearnerInterface,
    scenario: ScenarioContext,
    options: string[]
) {
    const driver = learner.flutterDriver!;
    const indexes: number[] = options.map((e) => pollOptionIndex(e));
    for (let i = 0; i < options.length; i++) {
        const selectButton = new ByValueKey(LessonKeys.optionItemSelect(indexes[i], false));
        await driver.scrollIntoView(selectButton, 0.0);
        await driver.tap(selectButton);
    }

    const submitButton = new ByValueKey(VirtualClassroomKeys.submitPollButton(false));
    await driver.tap(submitButton);
    const userId = await learner.getUserId();
    scenario.set(aliasPollSubmittedAnswerOptionIndexes(userId), indexes);
}

export async function studentSeesTheirSelectedAnswerOptionInOptionList(
    learner: LearnerInterface,
    indexes: number[]
) {
    const driver = learner.flutterDriver!;
    for (const index of indexes) {
        const selectedAnswer = new ByValueKey(LessonKeys.optionItem(index));
        await driver.scrollIntoView(selectedAnswer, 0.0);
    }
}

export async function teacherSeesStudentSubmittedTime(teacher: TeacherInterface, userId: string) {
    const driver = teacher.flutterDriver!;
    await teacherTapPollDetailTabBarIfNeeded(teacher);
    const emptySubmittedTime = new ByValueKey(LessonKeys.studentSubmittedTimeText(userId, ''));
    await driver.waitForAbsent(emptySubmittedTime);
}

export async function teacherSeesStudentSubmittedAnswer(
    teacher: TeacherInterface,
    userId: string,
    submittedAnswerIndexes: number[]
) {
    const driver = teacher.flutterDriver!;
    const answerText = submittedAnswerIndexes.map((e) => pollOptionValues[e]);
    const answerTextItem = new ByValueKey(
        LessonKeys.studentAnswerText(userId, answerText.join(','))
    );
    await driver.waitFor(answerTextItem);
}

export async function teacherSeesPollOptionHasRatio(
    teacher: TeacherInterface,
    index: number,
    ratio: number
) {
    const driver = teacher.flutterDriver!;
    const ratioKey = new ByValueKey(LessonKeys.pollingOptionVoteText(index, ratio));
    await driver.scrollIntoView(ratioKey, 0.0);
}
