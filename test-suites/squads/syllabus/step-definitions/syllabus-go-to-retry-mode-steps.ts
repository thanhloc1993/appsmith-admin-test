import { randomInteger } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { aliasCourseName, aliasLOName, aliasTopicName } from './alias-keys/syllabus';
import {
    createNewQuizzes,
    doQuizWithIncorrectQuizzesAndBack,
} from './syllabus-complete-question-in-retry-mode-correct-all-definition';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import {
    schoolAdminGoesToLODetailsPage,
    studentGoesToLODetailsPage,
    studentSeesAndDoesLOQuestionsWithRandomIncorrectQuizzes,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { doQuizWithRandomIncorrectQuizzesAndBack } from './syllabus-go-to-retry-mode-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

Given(
    'school admin creates {int} questions in Quiz LO',
    { timeout: 200000 },
    async function (this: IMasterWorld, numOfQuestions: number) {
        const cms = this.cms;
        const scenario = this.scenario;
        const loName = scenario.get<string>(aliasLOName);

        await cms.instruction('school admin is on book details page', async () => {
            await schoolAdminIsOnBookDetailsPage(cms, scenario);
        });

        await cms.instruction('school admin goes to LO details page', async () => {
            await schoolAdminGoesToLODetailsPage(cms, loName);
        });

        await cms.instruction(`school admin create 10 new questions in LO`, async () => {
            await createNewQuizzes(this.cms, scenario, numOfQuestions);
        });
    }
);

Given(
    'student has completed Quiz LO with {string} incorrect response',
    { timeout: 300000 },
    async function (this: IMasterWorld, numOfQuestions) {
        let numberOfQuiz = 1;
        switch (numOfQuestions) {
            case '1 of [0,1,2,3,4,5,6,7,8,9,10]':
                numberOfQuiz = randomInteger(0, 10);
                break;
            case '1 of [1,2,3]':
                numberOfQuiz = randomInteger(1, 3);
                break;
            case '1 of [1,2,3,4,5,6,7,8,9,10]':
                numberOfQuiz = randomInteger(1, 10);
                break;
            case '1 of [5,6,7,8,9,10]':
                numberOfQuiz = randomInteger(5, 10);
                break;
            default:
                break;
        }

        const scenario = this.scenario;
        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const studyPlanItemName = scenario.get<string>(aliasLOName);

        await this.learner.instruction('Student refreshes home screen', async function (learner) {
            await studentRefreshHomeScreen(learner);
        });

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

        await doQuizWithRandomIncorrectQuizzesAndBack(this.scenario, this.learner, numberOfQuiz);
    }
);

Given(
    'student has completed the incorrect quiz set with {string} incorrect response',
    { timeout: 100000 },
    async function (this: IMasterWorld, randomNumOfIncorrect: string) {
        let numberOfQuiz = 1;
        switch (randomNumOfIncorrect) {
            case '1 of [1,2,3,4,5]':
                numberOfQuiz = randomInteger(1, 5);
                break;
            case '1 of [1,2]':
                numberOfQuiz = randomInteger(1, 2);
                break;
            default:
                numberOfQuiz = 1;
                break;
        }

        const scenario = this.scenario;
        const loName = scenario.get<string>(aliasLOName);

        await this.learner.instruction(
            `Student is at Retry Attempt Screen`,
            async function (learner) {
                const retryAttemptScreenFinder = new ByValueKey(
                    SyllabusLearnerKeys.attemptHistoryScreen
                );
                await learner.flutterDriver!.waitFor(retryAttemptScreenFinder);
            }
        );

        await this.learner.instruction(`Student chooses Retry Incorrect`, async function (learner) {
            const retryIncorrectButtonFinder = new ByValueKey(
                SyllabusLearnerKeys.retryIncorrectButton
            );
            await learner.flutterDriver!.tap(retryIncorrectButtonFinder);
        });

        await this.learner.instruction(`Student is at Quiz Screen`, async function (learner) {
            const quizScreenFinder = new ByValueKey(SyllabusLearnerKeys.quiz_screen(loName));
            await learner.flutterDriver!.waitFor(quizScreenFinder);
        });

        await doQuizWithRandomIncorrectQuizzesAndBack(this.scenario, this.learner, numberOfQuiz);
    }
);

Given(
    'student has completed the incorrect quiz set with {int} incorrect response',
    { timeout: 100000 },
    async function (this: IMasterWorld, numOfIncorrect: number) {
        const scenario = this.scenario;
        const loName = scenario.get<string>(aliasLOName);

        await this.learner.instruction(
            `Student is at Retry Attempt Screen`,
            async function (learner) {
                const retryAttemptScreenFinder = new ByValueKey(
                    SyllabusLearnerKeys.attemptHistoryScreen
                );
                await learner.flutterDriver!.waitFor(retryAttemptScreenFinder);
            }
        );

        await this.learner.instruction(`Student chooses Retry Incorrect`, async function (learner) {
            const retryIncorrectButtonFinder = new ByValueKey(
                SyllabusLearnerKeys.retryIncorrectButton
            );
            await learner.flutterDriver!.tap(retryIncorrectButtonFinder);
        });

        await this.learner.instruction(`Student is at Quiz Screen`, async function (learner) {
            const quizScreenFinder = new ByValueKey(SyllabusLearnerKeys.quiz_screen(loName));
            await learner.flutterDriver!.waitFor(quizScreenFinder);
        });

        await doQuizWithIncorrectQuizzesAndBack(this.scenario, this.learner, numOfIncorrect);
    }
);

Given('student is on retry attempt screen of the lo', async function (this: IMasterWorld) {
    await this.learner.instruction(`Student is at Retry Attempt Screen`, async function (learner) {
        const retryAttemptScreenFinder = new ByValueKey(SyllabusLearnerKeys.attemptHistoryScreen);
        await learner.flutterDriver!.waitFor(retryAttemptScreenFinder);
    });
});

When('student selects to retry incorrect', async function (this: IMasterWorld) {
    await this.learner.instruction(`Student chooses Retry Incorrect`, async function (learner) {
        const retryIncorrectButtonFinder = new ByValueKey(SyllabusLearnerKeys.retryIncorrectButton);
        await learner.flutterDriver!.tap(retryIncorrectButtonFinder);
    });
});

Then(
    'student sees incorrect quiz set with {string} questions',
    async function (this: IMasterWorld, randomNumOfIncorrectQuiz: string) {
        const loName = this.scenario.get<string>(aliasLOName);
        const context = this.scenario;
        await this.learner.instruction(`Student is at Quiz Screen`, async function (learner) {
            const quizScreenFinder = new ByValueKey(SyllabusLearnerKeys.quiz_screen(loName));
            await learner.flutterDriver!.waitFor(quizScreenFinder);
        });
        await this.learner.instruction(
            `Student see incorrect ${randomNumOfIncorrectQuiz} quiz set`,
            async function (learner) {
                await studentSeesAndDoesLOQuestionsWithRandomIncorrectQuizzes(
                    learner,
                    context,
                    1,
                    true,
                    false
                );
            }
        );
    }
);
