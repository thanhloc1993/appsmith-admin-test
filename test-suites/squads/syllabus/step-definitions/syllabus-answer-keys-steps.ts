import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasCourseName,
    aliasTopicName,
    aliasExamLOName,
    aliasContentBookLOQuestionQuantity,
    aliasLOCurrentQuestionIndex,
} from './alias-keys/syllabus';
import { studentTapsOnStudyPlanItemInTodoTab } from './syllabus-answer-keys-definitions';
import { studentGoesToLODetailsPage } from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    studentSelectIndexedQuestion,
    studentSubmitExamLO,
} from './syllabus-do-exam-lo-definitions';
import { studentStartExamLOFromInstructionScreen } from './syllabus-exam-lo-common-definition';
import {
    studentRefreshHomeScreen,
    studentGoToCourseDetail,
    studentGoesToTabInToDoScreen,
    studentGoesToTodosScreen,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

export type PositionConstraint = 'last' | 'except last' | 'none';

export async function studentGoToNthQuestionInAnswerKeysScreen(
    masterWorld: IMasterWorld,
    positionConstraint: PositionConstraint
): Promise<void> {
    const learner = masterWorld.learner;
    const context = masterWorld.scenario;
    const quizQuestionNames = await learner.getQuizNameList();
    let n = 0;
    switch (positionConstraint) {
        case 'none':
            n = randomInteger(0, quizQuestionNames.length - 1);
            break;
        case 'except last':
            n = randomInteger(0, quizQuestionNames.length - 2);
            break;
        case 'last':
            n = quizQuestionNames.length - 1;
            break;
    }
    await learner.instruction(`Student select a ${n + 1}th question`, async (learner) => {
        await studentSelectIndexedQuestion(learner, context, n);
    });
}

Given(
    'student has gone to Answer Keys screen from {string}',
    async function (this: IMasterWorld, fromScreen: string) {
        const context = this.scenario;
        const examLOName = context.get<string>(aliasExamLOName);
        if (fromScreen === 'Course screen') {
            const courseName = context.get<string>(aliasCourseName);
            const topicName = context.get<string>(aliasTopicName);
            const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);

            await this.learner.instruction('Student refreshes home screen', async (learner) => {
                await studentRefreshHomeScreen(learner);
            });

            await this.learner.instruction(
                `Student goes to ${courseName} detail`,
                async (learner) => {
                    await studentGoToCourseDetail(learner, courseName);
                }
            );

            await this.learner.instruction(
                `Student goes to ${topicName} detail`,
                async (learner) => {
                    await studentGoToTopicDetail(learner, topicName);
                }
            );
            await this.learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
                await studentGoesToLODetailsPage(learner, topicName, examLOName);
                await studentStartExamLOFromInstructionScreen(learner);
                await learner.flutterDriver?.waitFor(
                    new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity))
                );
            });
        } else {
            await this.learner.instruction(
                'Student open exam lo from Todo screen',
                async (learner) => {
                    await studentGoesToTodosScreen(learner);
                    await studentGoesToTabInToDoScreen(learner, context, 'active');
                    await studentTapsOnStudyPlanItemInTodoTab(learner, examLOName, 'active');
                    await studentStartExamLOFromInstructionScreen(learner);
                }
            );
        }

        await this.learner.instruction(`Student submits ${examLOName}`, async (learner) => {
            await studentSubmitExamLO(learner, context, examLOName);
        });

        await this.learner.instruction('student taps on next button', async (learner) => {
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.quiz_finished_screen(examLOName))
            );
            await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
        });

        await this.learner.instruction(
            'student taps on view answer keys button',
            async (learner) => {
                await learner.flutterDriver?.tap(
                    new ByValueKey(SyllabusLearnerKeys.viewAnswerKeyButton)
                );
            }
        );
    }
);

Given('student is at random nth question with 0 < n < N', async function (this: IMasterWorld) {
    await studentGoToNthQuestionInAnswerKeysScreen(this, 'except last');
});

Given('student is at the last question', async function (this: IMasterWorld) {
    await studentGoToNthQuestionInAnswerKeysScreen(this, 'last');
});

Given('student is at random nth question', async function (this: IMasterWorld) {
    await studentGoToNthQuestionInAnswerKeysScreen(this, 'none');
});

Then('student is at [n+1]th question of Answer Keys', async function (this: IMasterWorld) {
    const questionIndex = this.scenario.get<number>(aliasLOCurrentQuestionIndex);
    await this.learner.instruction(
        `Student is at ${questionIndex + 2}th question`,
        async (learner) => {
            await learner.flutterDriver!.waitFor(
                new ByValueKey(SyllabusLearnerKeys.currentQuizNumber(questionIndex + 2))
            );
        }
    );
});

Then('student goes to {string}', async function (this: IMasterWorld, backScreen: string) {
    const context = this.scenario;
    const topicName = context.get<string>(aliasTopicName);
    await this.learner.instruction(`Student navigates to ${backScreen}`, async (learner) => {
        let pageKey = '';
        switch (backScreen) {
            case 'Todo screen':
                pageKey = SyllabusLearnerKeys.todos_page;
                break;
            case 'Quiz Finished Topic Screen':
                pageKey = SyllabusLearnerKeys.quizFinishedTopicProgressTitle;
                break;
            case 'Topic detail screen':
                pageKey = SyllabusLearnerKeys.lo_list_screen(topicName);
        }
        await learner.flutterDriver!.waitFor(new ByValueKey(pageKey));
    });
});
When('student selects top Back button in Answer Keys screen', async function (this: IMasterWorld) {
    await this.learner.instruction(`Student taps on back button`, async (learner) => {
        await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    });
});
