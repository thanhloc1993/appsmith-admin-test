import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import {
    aliasCourseId,
    aliasCourseName,
    aliasDecimalHighestQuizResult,
    aliasHighestQuizResult,
    aliasLOName,
    aliasQuizByAttempt,
    aliasQuizResult,
    aliasTopicName,
    aliasTotalAttempts,
} from './alias-keys/syllabus';
import {
    doQuizWithIncorrectQuizzesAndBack,
    teacherSeesLatestQuizResult,
} from './syllabus-complete-question-in-retry-mode-correct-all-definition';
import {
    studentGoesToLODetailsPage,
    teacherGoesToSeeNextQuizQuestion,
    teacherGoesToStudyPlanItemDetails,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import { studentGoToCourseDetail, studentRefreshHomeScreen } from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';

Given(
    'student has completed Quiz LO with {int} incorrect response',
    { timeout: 300000 },
    async function (this: IMasterWorld, randomNumOfIncorrect: number) {
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

        await doQuizWithIncorrectQuizzesAndBack(this.scenario, this.learner, randomNumOfIncorrect);
    }
);

Given('student has gone to retry incorrect mode', async function (this: IMasterWorld) {
    const scenario = this.scenario;
    const loName = scenario.get<string>(aliasLOName);

    await this.learner.instruction(`Student is at Retry Attempt Screen`, async function (learner) {
        const retryAttemptScreenFinder = new ByValueKey(SyllabusLearnerKeys.attemptHistoryScreen);
        await learner.flutterDriver!.waitFor(retryAttemptScreenFinder);
    });

    await this.learner.instruction(`Student chooses Retry Incorrect`, async function (learner) {
        const retryIncorrectButtonFinder = new ByValueKey(SyllabusLearnerKeys.retryIncorrectButton);
        await learner.flutterDriver!.tap(retryIncorrectButtonFinder);
    });

    await this.learner.instruction(`Student is at Quiz Screen`, async function (learner) {
        const quizScreenFinder = new ByValueKey(SyllabusLearnerKeys.quiz_screen(loName));
        await learner.flutterDriver!.waitFor(quizScreenFinder);
    });
});

When(
    'student completes all question in incorrect quiz set with {int} incorrect response',
    async function (this: IMasterWorld, numOfIncorrect: number) {
        await doQuizWithIncorrectQuizzesAndBack(this.scenario, this.learner, numOfIncorrect);
    }
);

Given(
    'student has completed all question in incorrect quiz set with {int} incorrect response',
    async function (this: IMasterWorld, numOfIncorrect: number) {
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
        await doQuizWithIncorrectQuizzesAndBack(this.scenario, this.learner, numOfIncorrect);
    }
);

Then(
    'retry incorrect result of student is updated on Learner App',
    async function (this: IMasterWorld) {
        const context = this.scenario;
        const masteryLevel = context.get<string>(aliasHighestQuizResult);
        let highestAchievementCrown = '';

        const decimalHighestScore = context.get<number>(aliasDecimalHighestQuizResult);
        if (decimalHighestScore < 0.6) {
            highestAchievementCrown = SyllabusLearnerKeys.noColorCrown;
        } else if (decimalHighestScore >= 0.6 && decimalHighestScore < 0.8) {
            highestAchievementCrown = SyllabusLearnerKeys.bronzeCrown;
        } else if (decimalHighestScore >= 0.8 && decimalHighestScore < 1) {
            highestAchievementCrown = SyllabusLearnerKeys.silverCrown;
        } else {
            highestAchievementCrown = SyllabusLearnerKeys.goldCrown;
        }

        const latestScore = context.get<string>(aliasQuizResult);
        const totalAttempts = context.get<number>(aliasTotalAttempts);

        await this.learner.instruction(
            `Student sees total attempts ${totalAttempts}`,
            async function (learner) {
                const totalAttemptsFinder = new ByValueKey(
                    SyllabusLearnerKeys.totalAttempts(totalAttempts)
                );
                await learner.flutterDriver!.waitFor(totalAttemptsFinder);
            }
        );

        await this.learner.instruction(
            `Student sees mastery level ${masteryLevel}`,
            async function (learner) {
                const masteryLevelFinder = new ByValueKey(
                    SyllabusLearnerKeys.masteryLevel(masteryLevel)
                );
                await learner.flutterDriver!.waitFor(masteryLevelFinder);
            }
        );

        await this.learner.instruction(
            `Student sees highest achievement crown ${highestAchievementCrown}`,
            async function (learner) {
                const highestAchievementCrownFinder = new ByValueKey(highestAchievementCrown);
                await learner.flutterDriver!.waitFor(highestAchievementCrownFinder);
            }
        );

        await this.learner.instruction(
            `Student sees latest attempts score ${latestScore}`,
            async function (learner) {
                const latestScoreFinder = new ByValueKey(
                    SyllabusLearnerKeys.quizSetResult(0, latestScore)
                );
                await learner.flutterDriver!.waitFor(latestScoreFinder);
            }
        );

        await this.learner.instruction(
            `Student sees retry icon of the latest attempt`,
            async function (learner) {
                const retryIconFinder = new ByValueKey(
                    SyllabusLearnerKeys.quizSetRetryIcon(0, true)
                );
                await learner.flutterDriver!.waitFor(retryIconFinder);
            }
        );
        await this.learner.instruction(
            `Student sees Practice Again Button`,
            async function (learner) {
                const practiceAgainButtonFinder = new ByValueKey(
                    SyllabusLearnerKeys.practiceAllButton
                );
                await learner.flutterDriver!.waitFor(practiceAgainButtonFinder);
            }
        );

        if (decimalHighestScore === 1) {
            await this.learner.instruction(
                `Student doesn't see Retry Incorrect Button`,
                async function (learner) {
                    const retryIncorrectButtonFinder = new ByValueKey(
                        SyllabusLearnerKeys.retryIncorrectButton
                    );
                    await learner.flutterDriver!.waitForAbsent(retryIncorrectButtonFinder);
                }
            );
        } else {
            await this.learner.instruction(
                `Student sees Retry Incorrect Button`,
                async function (learner) {
                    const retryIconFinder = new ByValueKey(
                        SyllabusLearnerKeys.quizSetRetryIcon(0, true)
                    );
                    await learner.flutterDriver!.waitFor(retryIconFinder);
                }
            );
        }
    }
);

Then(
    'retry incorrect result of student is updated on Teacher App',
    async function (this: IMasterWorld) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const courseId = scenario.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();
        const studyPlanItemName = scenario.get<string>(aliasLOName);
        const latestResult = scenario.get<string>(aliasQuizResult);
        const totalAttempts = scenario.get<number>(aliasTotalAttempts);

        await this.teacher.instruction(
            `Teacher goes to course ${courseName} student tab from home page`,
            async function (teacher) {
                await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `Teacher goes to view the study plan item details`,
            async function (teacher) {
                await teacherGoesToStudyPlanItemDetails(teacher, studyPlanItemName);
            }
        );

        await this.teacher.instruction(
            `Teacher sees result of the latest student's quiz attempt`,
            async function (teacher) {
                await teacherSeesLatestQuizResult(
                    teacher,
                    latestResult,
                    courseId,
                    studentId,
                    studyPlanItemName
                );
            }
        );

        await this.teacher.instruction(
            `Teacher sees retry icon of the latest student's quiz attempt`,
            async function (teacher) {
                const retryIconFinder = new ByValueKey(SyllabusTeacherKeys.retryIcon(0, true));
                await teacher.flutterDriver!.waitFor(retryIconFinder);
            }
        );
        for (let i = 0; i < totalAttempts; i++) {
            await this.teacher.instruction(
                `Teacher chooses the ${i} attempt`,
                async function (teacher) {
                    if (i == 0) {
                        const attemptFinder = new ByValueKey(
                            SyllabusTeacherKeys.retryIcon(i, true)
                        );
                        await teacher.flutterDriver!.tap(attemptFinder);
                        await teacher.flutterDriver!.tap(attemptFinder); // to close the popup
                    } else {
                        const dropDownFinder = new ByValueKey(
                            SyllabusTeacherKeys.retryIcon(0, true)
                        );
                        await teacher.flutterDriver!.tap(dropDownFinder); // to open the popup
                        const attemptFinder = new ByValueKey(
                            SyllabusTeacherKeys.retryIcon(i, false)
                        );
                        await teacher.flutterDriver!.tap(attemptFinder);
                    }
                }
            );
            const numberOfQuestion = 3;
            const quizByAttempt = scenario.get<number[]>(aliasQuizByAttempt);
            const correctAnswers =
                quizByAttempt[numberOfQuestion - i - 2] - quizByAttempt[numberOfQuestion - i - 1];
            for (let j = 0; j < correctAnswers; j++) {
                await this.teacher.instruction(
                    `Teacher sees the ${j} quiz answer that is correct`,
                    async function (teacher) {
                        const correctFinder = new ByValueKey(
                            SyllabusTeacherKeys.quizCorrectness(0, true)
                        );
                        await teacher.flutterDriver!.waitFor(correctFinder);
                    }
                );
                await teacherGoesToSeeNextQuizQuestion(this.teacher);
            }
            for (let j = correctAnswers; j < quizByAttempt[totalAttempts - 1 - i]; j++) {
                await this.teacher.instruction(
                    `Teacher sees the ${j} quiz answer that is incorrect`,
                    async function (teacher) {
                        const correctFinder = new ByValueKey(
                            SyllabusTeacherKeys.quizCorrectness(0, false)
                        );
                        await teacher.flutterDriver!.waitFor(correctFinder);
                    }
                );
                await teacherGoesToSeeNextQuizQuestion(this.teacher);
            }
        }
    }
);
