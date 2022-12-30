import { LessonKeys } from '@common/lesson-keys';
import { VirtualClassroomKeys } from '@common/virtual-classroom-keys';

import { LearnerInterface, TeacherInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';

import { ByValueKey, delay } from 'flutter-driver-x';
import {
    aliasPollCorrectAnswers,
    aliasPollSelectedOptionsLength,
} from 'test-suites/squads/virtual-classroom/common/alias-keys';
import { sampleAnswer, sampleQuestion } from 'test-suites/squads/virtual-classroom/utils/constants';
import { teacherTapPollStatsTabBarIfNeeded } from 'test-suites/squads/virtual-classroom/utils/navigation';

export async function saveCorrectAnswersOptionsIfNeeded(scenario: ScenarioContext) {
    const correctAnswerOptions = scenario.get<string[]>(aliasPollCorrectAnswers);
    if (correctAnswerOptions === null || correctAnswerOptions === undefined) {
        scenario.set(aliasPollCorrectAnswers, []);
    }
}

export async function teacherOpensCreatePollingPage(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const pollButton = new ByValueKey(VirtualClassroomKeys.pollButton(false));
    await driver.tap(pollButton);
}

export async function teacherAddsMorePollOption(
    teacher: TeacherInterface,
    scenario: ScenarioContext,
    length: number
) {
    const driver = teacher.flutterDriver!;
    const addMoreButton = new ByValueKey(LessonKeys.addMoreItem(true));

    for (let i = 0; i < length; i++) {
        await driver.tap(addMoreButton);
        await delay(200);
    }

    scenario.set(aliasPollSelectedOptionsLength, 2 + length);
}

export async function teacherStartsPolling(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const startPollButton = new ByValueKey(LessonKeys.startPollButton);
    await driver.tap(startPollButton);
}

export async function teacherSeesPollStatsView(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const statsView = new ByValueKey(LessonKeys.pollingStatsPage);
    await driver.waitFor(statsView);
}

export async function teacherSeesThePreviousSelectedPollOptions(
    teacher: TeacherInterface,
    length: number
) {
    const driver = teacher.flutterDriver!;
    const options = new ByValueKey(LessonKeys.listPollingOptionItem(length));
    await driver.waitFor(options);
}

export async function teacherSeesPollNumberOfAnswerStats(
    teacher: TeacherInterface,
    votes: number,
    length: number
) {
    const driver = teacher.flutterDriver!;
    const numberOfAnswerStats = new ByValueKey(LessonKeys.numberOfAnswer(votes, length));
    await teacherTapPollStatsTabBarIfNeeded(teacher);
    await driver.waitFor(numberOfAnswerStats);
}

export async function teacherSeesStopPollAnswerButton(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const stopAnswerButton = new ByValueKey(LessonKeys.stopPollButton);
    await driver.waitFor(stopAnswerButton);
}

export async function teacherSeesPollingIconWithStatus(teacher: TeacherInterface, active: boolean) {
    const driver = teacher.flutterDriver!;
    const pollButton = new ByValueKey(VirtualClassroomKeys.pollButton(active));
    await driver.waitFor(pollButton);
}

export async function studentSeesPollBlankQuestionAndBlankOption(
    learner: LearnerInterface,
    optionLength: number
) {
    const driver = learner.flutterDriver!;
    const question = new ByValueKey(LessonKeys.questionContent(''));
    await driver.waitFor(question);
    for (let i = 0; i < optionLength; i++) {
        const option = new ByValueKey(LessonKeys.optionContent(i, ''));
        await driver.waitFor(option);
    }
}

export async function teacherFulfillsPollQuestionText(teacher: TeacherInterface) {
    const driver = teacher.flutterDriver!;
    const questionField = new ByValueKey(LessonKeys.questionInput);
    await driver.tap(questionField);
    await driver.enterText(sampleQuestion);
}

export async function teacherFulfillsPollAnswerText(teacher: TeacherInterface, length: number) {
    const driver = teacher.flutterDriver!;
    for (let i = 0; i < length; i++) {
        const answerField = new ByValueKey(LessonKeys.optionItem(i));
        await driver.scrollIntoView(answerField, 0.0);
        await driver.tap(answerField);
        await driver.enterText(sampleAnswer(i));
    }
}

export async function studentSeesPollQuestionContent(learner: LearnerInterface) {
    const driver = learner.flutterDriver!;
    const questionContent = new ByValueKey(LessonKeys.questionContent(sampleQuestion));
    await driver.waitFor(questionContent);
}

export async function studentSeesPollOptionsContent(learner: LearnerInterface, length: number) {
    const driver = learner.flutterDriver!;
    for (let i = 0; i < length; i++) {
        const optionContent = new ByValueKey(LessonKeys.optionContent(i, sampleAnswer(i)));
        await driver.waitFor(optionContent);
    }
}
