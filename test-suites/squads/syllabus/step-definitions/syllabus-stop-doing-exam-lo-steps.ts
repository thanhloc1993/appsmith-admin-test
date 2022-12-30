import { getRandomElements } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasContentBookLOQuestionQuantity,
    aliasCourseId,
    aliasCourseName,
    aliasExamLOName,
    aliasStopLearningAction,
    aliasTopicName,
} from './alias-keys/syllabus';
import { studentSeeStudyPlanItemInTodoTab } from './syllabus-archive-study-plan-item-definitions';
import {
    getQuizTypeNumberFromModel,
    studentDoesQuizQuestion,
    studentGoesToLODetailsPage,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { studentSubmitExamLO } from './syllabus-do-exam-lo-definitions';
import { studentStartExamLOFromInstructionScreen } from './syllabus-exam-lo-common-definition';
import { teacherScrollIntoTopic } from './syllabus-expand-collapse-topic-definitions';
import { studentGoesBackToHomeScreenFromDoingExamLoScreen } from './syllabus-stop-doing-exam-lo-definitions';
import { teacherSeeStudyPlanItemWithStatus } from './syllabus-study-plan-common-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import {
    studentGoToCourseDetail,
    studentGoesToTabInToDoScreen,
    studentGoesToTodosScreen,
    studentRefreshHomeScreen,
    LearnerToDoTab,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export type StopAction = 'kill app' | 'pop back';
export type QuizProgressItemState =
    | 'correct'
    | 'incorrect'
    | 'availableAndCorrect'
    | 'availableAndIncorrect'
    | 'unavailable'
    | 'availableAndDidNotAnswer'
    | 'availableAndAnswered'
    | 'unavailableAndAnswered';

Given(`student has done some questions of exam lo`, async function (this: IMasterWorld) {
    const context = this.scenario;
    const learner = this.learner;
    const quizQuestionNames = await this.learner.getQuizNameList();
    const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);
    const doingQuestionNumbers = getRandomElements(Array.from(Array(questionQuantity).keys()));

    for (const index of doingQuestionNumbers) {
        await learner.instruction(`Student does a ${index + 1}th question`, async (learner) => {
            await learner.flutterDriver!.tap(
                new ByValueKey(SyllabusLearnerKeys.quizProgressIndex(index + 1))
            );
            const quizTypeNumber = getQuizTypeNumberFromModel(context, quizQuestionNames[index]);
            await studentDoesQuizQuestion(learner, quizTypeNumber!, quizQuestionNames[index]);
        });
    }
});

Given(
    `student has submitted exam lo nth times`,
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const learner = this.learner;
        const examLOName = context.get<string>(aliasExamLOName);
        const courseName = context.get<string>(aliasCourseName);
        const topicName = context.get<string>(aliasTopicName);

        await learner.instruction('Student refreshes home screen', async (learner) => {
            await studentRefreshHomeScreen(learner);
        });

        await learner.instruction(`Student goes to ${courseName} detail`, async (learner) => {
            await studentGoToCourseDetail(learner, courseName);
        });

        await learner.instruction(`Student goes to ${topicName} detail`, async (learner) => {
            await studentGoToTopicDetail(learner, topicName);
        });

        for (let index = 0; index < 3; index++) {
            await learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
                await studentGoesToLODetailsPage(learner, topicName, examLOName);
                if (index == 0) {
                    await studentStartExamLOFromInstructionScreen(learner);
                }
            });

            if (index != 0) {
                await learner.instruction(`Student takes again ${examLOName}`, async (learner) => {
                    await learner.flutterDriver?.tap(
                        new ByValueKey(SyllabusLearnerKeys.takeAgainButton)
                    );
                    await studentStartExamLOFromInstructionScreen(learner);
                });
            }

            await learner.instruction(`Student submits ${examLOName}`, async (learner) => {
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

            await this.learner.instruction(`Student taps on back button`, async (learner) => {
                await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
            });
        }

        await learner.instruction(`Student goes back to home screen`, async (learner) => {
            await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.book_detail_screen)
            );
            await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
            await learner.flutterDriver?.waitFor(new ByValueKey(SyllabusLearnerKeys.homeScreen));
        });
    }
);

When(
    `student stops doing exam lo by {string}`,
    async function (this: IMasterWorld, action: StopAction) {
        const context = this.scenario;
        const learner = this.learner;
        switch (action) {
            case 'pop back':
                await learner.instruction(
                    `Student goes back when viewing answer keys`,
                    async (learner) => {
                        await learner.flutterDriver!.tap(
                            new ByValueKey(SyllabusLearnerKeys.back_button)
                        );
                        await learner.flutterDriver!.tap(
                            new ByValueKey(SyllabusLearnerKeys.leaveButtonKey)
                        );
                    }
                );

                break;
            case 'kill app':
                await learner.instruction(
                    `Student kill app when viewing answer keys`,
                    async (learner) => {
                        await learner.flutterDriver!.reload();
                        await learner.flutterDriver!.waitFor(
                            new ByValueKey(SyllabusLearnerKeys.homeScreen),
                            20000
                        );
                    }
                );
                break;
        }
        context.set(aliasStopLearningAction, action);
    }
);

When(`student reopens exam lo`, async function (this: IMasterWorld) {
    const context = this.scenario;
    const learner = this.learner;
    const action = context.get<StopAction>(aliasStopLearningAction);
    const examLOName = context.get<string>(aliasExamLOName);
    const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);
    const courseName = context.get<string>(aliasCourseName);
    const topicName = context.get<string>(aliasTopicName);
    switch (action) {
        case 'pop back':
            await learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
                await studentGoesToLODetailsPage(learner, topicName, examLOName);
                try {
                    await studentStartExamLOFromInstructionScreen(learner);
                } catch {
                    console.warn('Not found Exam LO Instruction screen');
                }
                await learner.flutterDriver?.waitFor(
                    new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity))
                );
            });
            break;
        case 'kill app':
            await learner.instruction(`Student goes to ${courseName} detail`, async (learner) => {
                await studentGoToCourseDetail(learner, courseName);
            });

            await learner.instruction(`Student goes to ${topicName} detail`, async (learner) => {
                await studentGoToTopicDetail(learner, topicName);
            });
            await learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
                await studentGoesToLODetailsPage(learner, topicName, examLOName);
                try {
                    await studentStartExamLOFromInstructionScreen(learner);
                } catch {
                    console.warn('Not found Exam LO Instruction screen');
                }
            });
            break;
    }
});

Then(`student doesn't see the attempt history screen`, async function (this: IMasterWorld) {
    const learner = this.learner;
    await learner.instruction(`student doesn't see the attempt history screen`, async (learner) => {
        await learner.flutterDriver!.waitForAbsent(
            new ByValueKey(SyllabusLearnerKeys.attemptHistoryScreen)
        );
    });
});

Then(
    `student sees the Attempt history screen with nothing changed`,
    async function (this: IMasterWorld) {
        const learner = this.learner;
        await learner.instruction(
            `student sees the Attempt history screen with nothing changed`,
            async (learner) => {
                await learner.flutterDriver!.waitFor(
                    new ByValueKey(SyllabusLearnerKeys.attemptHistoryScreen)
                );
                await learner.flutterDriver!.waitFor(
                    new ByValueKey(SyllabusLearnerKeys.attemptHistoryRecord(3))
                );
            }
        );
    }
);

Then(`student goes to take again mode again`, async function (this: IMasterWorld) {
    const learner = this.learner;
    const context = this.scenario;
    const examLOName = context.get<string>(aliasExamLOName);
    const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);
    await learner.instruction(`Student takes again ${examLOName}`, async (learner) => {
        await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.takeAgainButton));
        await studentStartExamLOFromInstructionScreen(learner);
        await learner.flutterDriver?.waitFor(
            new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity))
        );
    });
});

Then(`student is at 1st question of exam lo`, async function (this: IMasterWorld) {
    const learner = this.learner;
    await learner.instruction(`student is at 1st question of exam lo`, async (learner) => {
        await learner.flutterDriver?.waitFor(
            new ByValueKey(SyllabusLearnerKeys.currentQuizNumber(1))
        );
    });
});

Then(`student sees status of full quiz set is unanswered`, async function (this: IMasterWorld) {
    const context = this.scenario;
    const learner = this.learner;
    const questionQuantity = context.get<number>(aliasContentBookLOQuestionQuantity);
    await learner.instruction(
        `student sees status of full quiz set is unanswered`,
        async (learner) => {
            await learner.flutterDriver?.waitFor(
                new ByValueKey(
                    SyllabusLearnerKeys.quizProgressIndexWithState(1, 'availableAndDidNotAnswer')
                )
            );
            for (let index = 1; index < questionQuantity; index++)
                await learner.flutterDriver?.waitFor(
                    new ByValueKey(
                        SyllabusLearnerKeys.quizProgressIndexWithState(index + 1, 'unavailable')
                    )
                );
        }
    );
});

Then(
    `student sees exam LO displayed in Todo screen-{string} tab`,
    async function (this: IMasterWorld, todoTab: LearnerToDoTab) {
        const context = this.scenario;
        const learner = this.learner;
        const examLOName = context.get<string>(aliasExamLOName);
        await learner.instruction(
            'Student goes back to home screen from doing exam lo screen',
            async (learner) => {
                await studentGoesBackToHomeScreenFromDoingExamLoScreen(learner);
            }
        );
        await learner.instruction(`student goes to active tab in todo screen`, async (learner) => {
            await studentGoesToTodosScreen(learner);
            await studentGoesToTabInToDoScreen(learner, context, todoTab);
        });
        await learner.instruction(`student sees exam lo is in active tab`, async (learner) => {
            await studentSeeStudyPlanItemInTodoTab(learner, examLOName, todoTab);
        });
    }
);

Then(
    `teacher sees student's progress of the exam LO is empty`,
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const teacher = this.teacher;
        const courseName = context.get<string>(aliasCourseName);
        const examLOName = context.get<string>(aliasExamLOName);
        const topicName = context.get<string>(aliasTopicName);
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();
        await teacher.instruction(
            `Teacher goes to course ${courseName} student tab from home page`,
            async (teacher) => {
                await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
            }
        );
        await teacher.instruction(
            `teacher sees student's progress of the exam LO is empty`,
            async (teacher) => {
                await teacherScrollIntoTopic(teacher, topicName);
                await teacherSeeStudyPlanItemWithStatus(teacher, examLOName, 'default');
            }
        );
    }
);

Then(
    `teacher sees student's progress of the exam LO with nothing changed`,
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const teacher = this.teacher;
        const courseName = context.get<string>(aliasCourseName);
        const examLOName = context.get<string>(aliasExamLOName);
        const topicName = context.get<string>(aliasTopicName);
        const courseId = context.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();
        await teacher.instruction(
            `Teacher goes to course ${courseName} student tab from home page`,
            async (teacher) => {
                await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
            }
        );
        await teacher.instruction(
            `teacher sees student's progress of the exam LO with nothing changed`,
            async (teacher) => {
                await teacherScrollIntoTopic(teacher, topicName);
                await teacherSeeStudyPlanItemWithStatus(teacher, examLOName, 'completed');
            }
        );
    }
);
