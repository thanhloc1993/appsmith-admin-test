import { getProfileAliasToLoginsLearnerApp } from '@legacy-step-definitions/credential-account-definitions';
import { loginOnLearnerApp } from '@legacy-step-definitions/learner-email-login-definitions';
import { randomInteger } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, LearnerInterface } from '@supports/app-types';

import {
    aliasCourseName,
    aliasLOName,
    aliasQuizQuestionNames,
    aliasRemainingQuizCount,
    aliasTopicName,
    aliasTotalQuestionCount,
} from './alias-keys/syllabus';
import { doQuizWithIncorrectQuizzesAndBack } from './syllabus-complete-question-in-retry-mode-correct-all-definition';
import {
    studentGoesToLODetailsPage,
    studentSeesAndDoesLOQuestionsWithIncorrectQuizzes,
    studentSeesAndDoesLOQuestionsWithRandomIncorrectQuizzes,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { doQuizWithIncorrectQuizzesAndBackFromTodo } from './syllabus-retry-original-quiz-set-after-finishing-original-quiz-set-definitions';
import {
    studentGoesToTabInToDoScreen,
    studentGoesToTodosScreen,
    studentGoToCourseDetail,
    studentGoToStudyPlanItemDetailsFromTodo,
    studentRefreshHomeScreen,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

export type LearningFlow = 'todo flow' | 'course flow';

Given(`student has selected to practice again`, async function (this: IMasterWorld): Promise<void> {
    await this.learner.instruction(
        `student taps practice again button`,
        async function (learner: LearnerInterface) {
            const practiceAgainButtonFinder = new ByValueKey(SyllabusLearnerKeys.practiceAllButton);
            await learner.flutterDriver!.tap(practiceAgainButtonFinder);
        }
    );
});

Given(
    `student has selected to retry incorrect`,
    async function (this: IMasterWorld): Promise<void> {
        await this.learner.instruction(
            `student taps retry incorrect button`,
            async function (learner: LearnerInterface) {
                const retryIncorrectButtonFinder = new ByValueKey(
                    SyllabusLearnerKeys.retryIncorrectButton
                );
                await learner.flutterDriver!.tap(retryIncorrectButtonFinder);
            }
        );
    }
);

Given(
    `student has done {string} questions`,
    async function (this: IMasterWorld, randomNumberRangeString: string): Promise<void> {
        let numberOfQuiz = 1;
        switch (randomNumberRangeString) {
            case '1 of [1,2,3,4,5,6,7,8,9]':
                numberOfQuiz = randomInteger(1, 9);
                break;
            default:
                break;
        }
        let numberOfIncorrectQuiz = 1;
        numberOfIncorrectQuiz = randomInteger(1, numberOfQuiz);
        const context = this.scenario;
        const studyPlanItemName = context.get<string>(aliasLOName);
        const totalQuestionCount = this.scenario.get<number>(aliasTotalQuestionCount);
        const remainingQuiz = totalQuestionCount - numberOfQuiz;

        this.scenario.set(aliasRemainingQuizCount, remainingQuiz);
        this.scenario.set(aliasRemainingQuizCount, remainingQuiz);

        await this.learner.instruction(
            `Student does questions of this LO ${studyPlanItemName} on Learner App with ${numberOfQuiz} incorrect response`,
            async function (learner) {
                await studentSeesAndDoesLOQuestionsWithIncorrectQuizzes(
                    learner,
                    context,
                    numberOfIncorrectQuiz,
                    numberOfQuiz
                );
            }
        );
    }
);

Given(
    `student has done incorrect {string} questions`,
    async function (this: IMasterWorld, randomNumberRangeString: string): Promise<void> {
        let numberOfQuiz = 1;
        switch (randomNumberRangeString) {
            case '1 of [1,2,3,4]':
                numberOfQuiz = randomInteger(1, 4);
                break;
            default:
                break;
        }
        let numberOfIncorrectQuiz = 1;
        numberOfIncorrectQuiz = randomInteger(1, numberOfQuiz);
        const context = this.scenario;
        const studyPlanItemName = context.get<string>(aliasLOName);
        const questionNames = context.get<string[]>(aliasQuizQuestionNames);
        const incorrectQuestionCount = questionNames.length;
        const remainingQuiz = incorrectQuestionCount - numberOfQuiz;
        context.set(aliasRemainingQuizCount, remainingQuiz);

        await this.learner.instruction(
            `Student does questions of this LO ${studyPlanItemName} on Learner App with ${numberOfQuiz} incorrect response`,
            async function (learner) {
                await studentSeesAndDoesLOQuestionsWithIncorrectQuizzes(
                    learner,
                    context,
                    numberOfIncorrectQuiz,
                    numberOfQuiz
                );
            }
        );
    }
);

Given(
    'student has completed Quiz LO with {int} incorrect response in {string}',
    { timeout: 300000 },
    async function (this: IMasterWorld, randomNumOfIncorrect: number, learningFlow: LearningFlow) {
        const context = this.scenario;
        const topicName = context.get<string>(aliasTopicName);
        const studyPlanItemName = context.get<string>(aliasLOName);
        const courseName = context.get<string>(aliasCourseName);
        const learner = this.learner;
        const loName = context.get<string>(aliasLOName);
        if (learningFlow == 'course flow') {
            await this.learner.instruction(
                'Student refreshes home screen',
                async function (learner) {
                    await studentRefreshHomeScreen(learner);
                }
            );

            await this.learner.instruction(
                `Student goes to ${courseName} detail`,
                async function (learner) {
                    await studentGoToCourseDetail(learner, courseName);
                }
            );

            await this.learner.instruction(
                `Student goes to ${topicName} detail`,
                async function (learner) {
                    await studentGoToTopicDetail(learner, topicName);
                }
            );

            await this.learner.instruction(
                `Student goes to ${studyPlanItemName} detail`,
                async function (learner) {
                    await studentGoesToLODetailsPage(learner, topicName, studyPlanItemName);
                }
            );
            await doQuizWithIncorrectQuizzesAndBack(
                this.scenario,
                this.learner,
                randomNumOfIncorrect
            );
        } else {
            await studentGoesToTodosScreen(learner);

            await studentGoesToTabInToDoScreen(learner, context, 'active');

            await studentGoToStudyPlanItemDetailsFromTodo(learner, loName, 'active');

            await doQuizWithIncorrectQuizzesAndBackFromTodo(
                this.scenario,
                this.learner,
                randomNumOfIncorrect
            );
        }
    }
);

Given(
    'student has completed Quiz LO with {string} incorrect response in {string}',
    { timeout: 300000 },
    async function (
        this: IMasterWorld,
        randomNumberRangeString: string,
        learningFlow: LearningFlow
    ) {
        let numberOfQuiz = 1;
        switch (randomNumberRangeString) {
            case '1 of [0,1,2,3,4,5,6,7,8,9,10]':
                numberOfQuiz = randomInteger(0, 10);
                break;
            case '1 of [1,2,3,4,5,6,7,8,9]':
                numberOfQuiz = randomInteger(1, 9);
                break;
            case '1 of [5,6,7,8,9,10]':
                numberOfQuiz = randomInteger(5, 9);
                break;

            default:
                break;
        }
        const context = this.scenario;
        const topicName = context.get<string>(aliasTopicName);
        const studyPlanItemName = context.get<string>(aliasLOName);
        const courseName = context.get<string>(aliasCourseName);
        const learner = this.learner;
        const loName = context.get<string>(aliasLOName);
        if (learningFlow == 'course flow') {
            await this.learner.instruction(
                'Student refreshes home screen',
                async function (learner) {
                    await studentRefreshHomeScreen(learner);
                }
            );

            await this.learner.instruction(
                `Student goes to ${courseName} detail`,
                async function (learner) {
                    await studentGoToCourseDetail(learner, courseName);
                }
            );

            await this.learner.instruction(
                `Student goes to ${topicName} detail`,
                async function (learner) {
                    await studentGoToTopicDetail(learner, topicName);
                }
            );

            await this.learner.instruction(
                `Student goes to ${studyPlanItemName} detail`,
                async function (learner) {
                    await studentGoesToLODetailsPage(learner, topicName, studyPlanItemName);
                }
            );
            await doQuizWithIncorrectQuizzesAndBack(this.scenario, this.learner, numberOfQuiz);
        } else {
            await studentGoesToTodosScreen(learner);

            await studentGoesToTabInToDoScreen(learner, context, 'active');

            await studentGoToStudyPlanItemDetailsFromTodo(learner, loName, 'active');

            await doQuizWithIncorrectQuizzesAndBackFromTodo(
                this.scenario,
                this.learner,
                numberOfQuiz
            );
        }
    }
);

Given(`student stops learning`, async function (this: IMasterWorld): Promise<void> {
    await this.learner.instruction(
        `student tap back button`,
        async function (learner: LearnerInterface) {
            const backButtonFinder = new ByValueKey(SyllabusLearnerKeys.back_button);
            await learner.flutterDriver!.tap(backButtonFinder);
        }
    );
});

When(
    `student goes to Quiz LO again in {string}`,
    async function (this: IMasterWorld, learningFlow: LearningFlow): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const loName = context.get<string>(aliasLOName);
        const studyPlanItemName = context.get<string>(aliasLOName);
        const topicName = context.get<string>(aliasTopicName);
        if (learningFlow == 'course flow') {
            await this.learner.instruction(
                `Student goes to ${studyPlanItemName} detail`,
                async function (learner) {
                    await studentGoesToLODetailsPage(learner, topicName, studyPlanItemName);
                }
            );
        } else {
            await studentGoToStudyPlanItemDetailsFromTodo(learner, loName, 'completed');
        }
    }
);
When(
    `student goes to Quiz LO again in {string} from Home Screen`,
    { timeout: 200000 },
    async function (this: IMasterWorld, learningFlow: LearningFlow): Promise<void> {
        const context = this.scenario;
        const learner = this.learner;
        const loName = context.get<string>(aliasLOName);
        const studyPlanItemName = context.get<string>(aliasLOName);
        const topicName = context.get<string>(aliasTopicName);
        const courseName = context.get<string>(aliasCourseName);
        const learnerProfile = getProfileAliasToLoginsLearnerApp(this, 'student');
        try {
            await learner.flutterDriver!.waitFor(
                new ByValueKey(SyllabusLearnerKeys.homeScreen),
                20000
            );
        } catch {
            //Web log out student, need to login again
            await loginOnLearnerApp({
                learner,
                email: learnerProfile!.email,
                name: learnerProfile!.name,
                password: learnerProfile!.password,
            });
        }
        if (learningFlow == 'course flow') {
            await this.learner.instruction(
                `Student goes to ${courseName} detail`,
                async function (learner) {
                    await studentGoToCourseDetail(learner, courseName);
                }
            );

            await this.learner.instruction(
                `Student goes to ${topicName} detail`,
                async function (learner) {
                    await studentGoToTopicDetail(learner, topicName);
                }
            );

            await this.learner.instruction(
                `Student goes to ${studyPlanItemName} detail`,
                async function (learner) {
                    await studentGoesToLODetailsPage(learner, topicName, studyPlanItemName);
                }
            );
        } else {
            await studentGoesToTodosScreen(learner);

            await studentGoesToTabInToDoScreen(learner, context, 'completed');

            await studentGoToStudyPlanItemDetailsFromTodo(learner, loName, 'completed');
        }
    }
);

Then(`student resumes to current quiz set`, async function (this: IMasterWorld): Promise<void> {
    const context = this.scenario;
    const remainingQuiz = context.get<number>(aliasRemainingQuizCount);
    const studyPlanItemName = context.get<string>(aliasLOName);

    const loName = context.get<string>(aliasLOName);
    await this.learner.instruction(
        `student is on quiz screen`,
        async function (learner: LearnerInterface) {
            const quizScreenFinder = new ByValueKey(SyllabusLearnerKeys.quiz_screen(loName));
            await learner.flutterDriver!.tap(quizScreenFinder);
        }
    );
    await this.learner.instruction(
        `Student does questions of this LO ${studyPlanItemName} on Learner App with ${remainingQuiz} remainingQuiz`,
        async function (learner) {
            await studentSeesAndDoesLOQuestionsWithRandomIncorrectQuizzes(
                learner,
                context,
                remainingQuiz,
                false,
                true
            );
        }
    );
});
