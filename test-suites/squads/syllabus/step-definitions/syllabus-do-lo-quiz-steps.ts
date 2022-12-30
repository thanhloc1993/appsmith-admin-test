import { asyncForEach, getRandomElement } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld, LOType } from '@supports/app-types';
import { Quiz } from '@supports/services/common/quiz';

import {
    aliasAccessAnswerIndexHistoryInQuestion,
    aliasCourseId,
    aliasCourseName,
    aliasCurrentAnswerIndexInQuestion,
    aliasListOfAnswerFilledText,
    aliasLOName,
    aliasLONameSelected,
    aliasLOTypeSelected,
    aliasQuizResult,
    aliasRandomQuizzes,
    aliasRandomQuizzesRaw,
    aliasTopicName,
} from './alias-keys/syllabus';
import { teacherSeesLatestQuizResult } from './syllabus-complete-question-in-retry-mode-correct-all-definition';
import {
    studentDoesQuizQuestion,
    studentGoesToLODetailsPage,
    studentSubmitsQuizAnswer,
    teacherGoesToStudyPlanItemDetails,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    learnerAnswerMathAtPosition,
    learnerEnterHandwritingMode,
    learnerLeaveHandwritingMode,
    learnerTapToHandwritingFIBAnswerAtPosition,
    learnerTypeToFIBAnswerAtPosition,
    studentCannotSeeWhiteboard,
    studentCanSeeWhiteboard,
    studentGoesToLearningMaterial,
    studentSeeFillInTheBlankQuestionTitle,
    studentSeesLOAchievement,
    studentSeesLOOnTodo,
    studentSeesLOQuestionsResult,
    studentSeesNextButton,
    studentSeesSubmitButton,
    studentSeesTopicProgress,
    studentTapCloseButtonOnWhiteboard,
    teacherSeesLatestQuizResultOnStudyPlanTable,
} from './syllabus-do-lo-quiz-definitions';
import { studentStartExamLOFromInstructionScreen } from './syllabus-exam-lo-common-definition';
import { getHandwritingOption, HandwritingOption } from './syllabus-question-utils';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import {
    HandwritingLanguage,
    mappedLOTypeWithAliasStringName,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    studentTapButtonOnScreen,
    TypingLanguage,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { QuizItemAttributeConfig } from 'manabuf/common/v1/contents_pb';
import { mathHandwritingAnswer } from 'test-suites/squads/lesson/common/constants';
import {
    convertOneOfStringTypeToArray,
    randomInteger,
} from 'test-suites/squads/syllabus/utils/common';

When(
    'student does the question',
    { timeout: 120000 },
    // waiting for doing questions in book and see new question added
    async function () {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const studyPlanItemName = scenario.get<string>(aliasLOName);
        const quizzesRaw = this.scenario.get<Quiz[]>(aliasRandomQuizzesRaw);

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

        await asyncForEach(quizzesRaw, async (quiz) => {
            const questionName = quiz.question!.raw;
            const questionKind = quiz.kind;

            await studentDoesQuizQuestion(this.learner, questionKind, questionName);
            await studentSubmitsQuizAnswer(this.learner, questionName);
        });
    }
);

Then(
    'learning progress of student is updated on Learner App',
    { timeout: 90000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;
        const loName = scenario.get<string>(aliasLOName);
        const topicName = scenario.get<string>(aliasTopicName);

        await this.learner.instruction(
            `student sees LO questions result`,
            async function (learner) {
                await studentSeesLOQuestionsResult(learner, scenario, loName);
            }
        );

        await this.learner.instruction(
            `student goes next to quiz achievement screen`,
            async function (learner) {
                const learningQuizFinishedScreen = SyllabusLearnerKeys.quiz_finished_screen(loName);
                const nextButton = SyllabusLearnerKeys.next_button;
                await studentTapButtonOnScreen(learner, learningQuizFinishedScreen, nextButton);
            }
        );

        await this.learner.instruction(
            `student sees crown equivalent to quiz achievement`,
            async function (learner) {
                await studentSeesLOAchievement(learner, scenario, loName);
            }
        );

        await this.learner.instruction(
            `student goes next to topic progress screen`,
            async function (learner) {
                const learningFinishedAchievementScreen =
                    SyllabusLearnerKeys.quiz_finished_achievement_screen(loName);
                const nextButton = SyllabusLearnerKeys.next_button;
                await studentTapButtonOnScreen(
                    learner,
                    learningFinishedAchievementScreen,
                    nextButton
                );
            }
        );

        await this.learner.instruction(`student sees topic progress`, async function (learner) {
            await studentSeesTopicProgress(learner, scenario);
        });

        // TODO: "keyValueString":"Completed To-Dos Page" is not stabled
        await this.learner.instruction(
            `student sees the LO on complete tab on todo page`,
            async function (learner) {
                await studentSeesLOOnTodo(learner, topicName, loName);
            }
        );
    }
);

Then('learning progress of student is updated on Teacher App', async function (this: IMasterWorld) {
    const scenario = this.scenario;
    const courseName = scenario.get<string>(aliasCourseName);
    const courseId = scenario.get<string>(aliasCourseId);
    const quizResult = scenario.get<string>(aliasQuizResult);
    const studentId = await this.learner.getUserId();
    const studyPlanItemName = scenario.get<string>(aliasLOName);

    await this.teacher.instruction(
        `Teacher goes to course ${courseName} student tab from home page`,
        async function (teacher) {
            await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
        }
    );

    await this.teacher.instruction(
        `Teacher sees latest quiz result of the ${studyPlanItemName} on study plan table on Teacher App`,
        async function (teacher) {
            await teacherSeesLatestQuizResultOnStudyPlanTable(
                teacher,
                studyPlanItemName,
                quizResult
            );
        }
    );

    await this.teacher.instruction(
        `Teacher goes to view the study plan item details`,
        async function (teacher) {
            await teacherGoesToStudyPlanItemDetails(teacher, studyPlanItemName);
        }
    );

    await this.teacher.instruction(
        `Teacher sees latest quiz result of the ${studyPlanItemName} on LO detail on Teacher App`,
        async function (teacher) {
            await teacherSeesLatestQuizResult(
                teacher,
                quizResult,
                courseId,
                studentId,
                studyPlanItemName
            );
        }
    );
});

Given(
    'student has gone to {string}',
    { timeout: 100000 },
    async function (this: IMasterWorld, loType: LOType) {
        const courseName = this.scenario.get<string>(aliasCourseName);
        const topicName = this.scenario.get<string>(aliasTopicName);

        const list = convertOneOfStringTypeToArray<LOType>(loType);
        const type = getRandomElement<LOType>(list);
        const studyPlanItemName = this.scenario.get<string>(mappedLOTypeWithAliasStringName[type]);

        await studentGoesToLearningMaterial(
            this.learner,
            courseName,
            topicName,
            studyPlanItemName,
            type
        );
    }
);

When('student practices exam lo', { timeout: 100000 }, async function (this: IMasterWorld) {
    const courseName = this.scenario.get<string>(aliasCourseName);
    const topicName = this.scenario.get<string>(aliasTopicName);

    const studyPlanItemName = this.scenario.get<string>(mappedLOTypeWithAliasStringName['exam LO']);

    await studentGoesToLearningMaterial(
        this.learner,
        courseName,
        topicName,
        studyPlanItemName,
        'exam LO'
    );
});

Then('student is at fill in the blank question screen', { timeout: 100000 }, async function () {
    const scenario = this.scenario;

    const courseName = scenario.get<string>(aliasCourseName);
    const topicName = scenario.get<string>(aliasTopicName);
    const loName = scenario.get<string>(aliasLONameSelected);
    const loType = scenario.get<LOType>(aliasLOTypeSelected);

    await this.learner.instruction('Student refreshes home screen', async () => {
        await studentRefreshHomeScreen(this.learner);
    });

    await this.learner.instruction(`Student goes to ${courseName} detail`, async () => {
        await studentGoToCourseDetail(this.learner, courseName);
    });

    await this.learner.instruction(`Student goes to ${topicName} detail`, async () => {
        await studentGoToTopicDetail(this.learner, topicName);
    });

    await this.learner.instruction(`Student goes to ${loName} detail`, async () => {
        await studentGoesToLODetailsPage(this.learner, topicName, loName);
        if (loType == 'exam LO') {
            await studentStartExamLOFromInstructionScreen(this.learner);
        }
    });

    await this.learner.instruction(`Student sees fill in the blank question`, async () => {
        await studentSeeFillInTheBlankQuestionTitle(this.learner);
    });
});

Given('student chooses the answer enabled handwriting', async function (this: IMasterWorld) {
    const scenario = this.scenario;

    const quizQuestionNames = await this.learner.getQuizNameList();
    const currentQuizQuestionName = quizQuestionNames[0];
    const quizzes = scenario.get<Quiz[]>(aliasRandomQuizzes);
    const accessAnswerIndexHistory =
        scenario.get<number[]>(aliasAccessAnswerIndexHistoryInQuestion) ?? [];
    const currentQuiz = quizzes.find((quiz) => {
        return currentQuizQuestionName.includes(quiz.externalId);
    });
    const languageConfig =
        randomInteger(0, 1) == 0
            ? QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG
            : QuizItemAttributeConfig.LANGUAGE_CONFIG_JP;
    const handWritingAnswerIndex = currentQuiz!.optionsList.findIndex((option) =>
        option.attribute!.configsList.includes(languageConfig)
    );
    accessAnswerIndexHistory.push(handWritingAnswerIndex);
    scenario.set(aliasCurrentAnswerIndexInQuestion, handWritingAnswerIndex);
    scenario.set(aliasAccessAnswerIndexHistoryInQuestion, accessAnswerIndexHistory);

    await this.learner.instruction(
        `student taps to the handwriting enabled answer with config ${
            languageConfig == QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG ? 'ENGLISH' : 'JAPANESE'
        }`,
        async () => {
            await learnerTapToHandwritingFIBAnswerAtPosition(
                this.learner,
                handWritingAnswerIndex + 1
            );
        }
    );
});

Given(
    'student chooses the answer enabled handwriting by {string}',
    async function (this: IMasterWorld, handwritingLanguage: HandwritingLanguage) {
        const scenario = this.scenario;

        const quizQuestionNames = await this.learner.getQuizNameList();
        const currentQuizQuestionName = quizQuestionNames[0];
        const quizzes = scenario.get<Quiz[]>(aliasRandomQuizzes);
        const accessAnswerIndexHistory =
            scenario.get<number[]>(aliasAccessAnswerIndexHistoryInQuestion) ?? [];
        const currentQuiz = quizzes.find((quiz) => {
            return currentQuizQuestionName.includes(quiz.externalId);
        });

        let languageConfig = QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE;
        switch (handwritingLanguage) {
            case 'English':
                languageConfig = QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG;
                break;
            case 'Japanese':
                languageConfig = QuizItemAttributeConfig.LANGUAGE_CONFIG_JP;
                break;
            case 'Math':
                languageConfig = QuizItemAttributeConfig.MATH_CONFIG;
                break;
        }

        const handWritingAnswerIndex = currentQuiz!.optionsList.findIndex((option) =>
            option.attribute!.configsList.includes(languageConfig)
        );
        accessAnswerIndexHistory.push(handWritingAnswerIndex);
        scenario.set(aliasCurrentAnswerIndexInQuestion, handWritingAnswerIndex);
        scenario.set(aliasAccessAnswerIndexHistoryInQuestion, accessAnswerIndexHistory);

        await this.learner.instruction(
            `student has tapped to the handwriting enabled answer with config ${handwritingLanguage}`,
            async () => {
                await learnerTapToHandwritingFIBAnswerAtPosition(
                    this.learner,
                    handWritingAnswerIndex + 1
                );
            }
        );
    }
);

When('student taps to change to handwriting button', async function (this: IMasterWorld) {
    await this.learner.instruction(`student taps to change to handwriting button`, async () => {
        const driver = this.learner.flutterDriver!;

        await driver.tap(new ByValueKey(SyllabusLearnerKeys.changeToHandWritingButton));
    });
});

When('student taps on X button', async function (this: IMasterWorld) {
    await this.learner.instruction(`student taps on X button`, async () => {
        await studentTapCloseButtonOnWhiteboard(this.learner);
    });
});

Then('student sees the {string} appear', async function (this: IMasterWorld, button: string) {
    if (button == 'next button') {
        await this.learner.instruction(`student sees the submit button appear`, async () => {
            await studentSeesNextButton(this.learner);
        });
    } else {
        await this.learner.instruction(`student sees the submit button appear`, async () => {
            await studentSeesSubmitButton(this.learner);
        });
    }
});

When('student taps to change to keyboard button', async function (this: IMasterWorld) {
    await this.learner.instruction(`student taps to change to keyboard button`, async () => {
        await learnerLeaveHandwritingMode(this.learner);
    });
});

When('student enters handwriting mode', async function (this: IMasterWorld) {
    await this.learner.instruction(`student enters handwriting mode`, async () => {
        await learnerEnterHandwritingMode(this.learner);
    });
});

When('student enters keyboard mode', async function (this: IMasterWorld) {
    await this.learner.instruction(`student enters keyboard mode`, async () => {
        await learnerLeaveHandwritingMode(this.learner);
    });
});

When(
    'student types the answer by {string}',
    async function (this: IMasterWorld, language: TypingLanguage) {
        const handWritingAnswerIndex = this.scenario.get<number>(aliasCurrentAnswerIndexInQuestion);
        const handWritingAnswerNumber = handWritingAnswerIndex + 1;
        const handWritingAnswerText = `Answer ${handWritingAnswerNumber}`;

        await this.learner.instruction(
            `student types the text ${handWritingAnswerText} by ${language} in answer ${handWritingAnswerNumber}`,
            async () => {
                await learnerTypeToFIBAnswerAtPosition(
                    this.learner,
                    handWritingAnswerText,
                    handWritingAnswerNumber
                );
            }
        );
    }
);

Then('student sees the whiteboard appear', async function (this: IMasterWorld) {
    await this.learner.instruction(`student sees the whiteboard appear`, async () => {
        await studentCanSeeWhiteboard(this.learner);
    });
});

Then('student sees the whiteboard disappear', async function (this: IMasterWorld) {
    await this.learner.instruction(`student sees the whiteboard disappear`, async () => {
        await studentCannotSeeWhiteboard(this.learner);
    });
});

Then('student sees the whiteboard is empty', async function (this: IMasterWorld) {
    await this.learner.instruction(`student sees the whiteboard is empty`, async () => {
        const driver = this.learner.flutterDriver!;

        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.whiteboardEmpty));
    });
});

Then('student sees the whiteboard is not empty', async function (this: IMasterWorld) {
    await this.learner.instruction(`student sees the whiteboard is not empty`, async () => {
        const driver = this.learner.flutterDriver!;

        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.whiteboardNotEmpty));
    });
});

Then('student sees the change to handwriting button', async function (this: IMasterWorld) {
    await this.learner.instruction(`student sees the change to handwriting button`, async () => {
        const driver = this.learner.flutterDriver!;

        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.changeToHandWritingButton));
    });
});

Then('student sees the change to keyboard button', async function (this: IMasterWorld) {
    await this.learner.instruction(`student sees the change to keyboard button`, async () => {
        const driver = this.learner.flutterDriver!;

        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.changeToKeyboardButton));
    });
});

When('student chooses the answer not enabled handwriting', async function (this: IMasterWorld) {
    const scenario = this.scenario;
    const quizQuestionNames = await this.learner.getQuizNameList();
    const currentQuizQuestionName = quizQuestionNames[0];
    const quizzes = scenario.get<Quiz[]>(aliasRandomQuizzes);
    const accessAnswerIndexHistory =
        scenario.get<number[]>(aliasAccessAnswerIndexHistoryInQuestion) ?? [];
    const currentQuiz = quizzes.find((quiz) => {
        return currentQuizQuestionName.includes(quiz.externalId);
    });
    const handwritingOptions: HandwritingOption[] = currentQuiz!.optionsList.map((question) =>
        getHandwritingOption({
            key: question.attribute?.configsList[0],
        })
    );
    const handWritingAnswerIndex = handwritingOptions.findIndex(
        (option) => option.key === QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_NONE
    );
    accessAnswerIndexHistory.push(handWritingAnswerIndex);
    scenario.set(aliasCurrentAnswerIndexInQuestion, handWritingAnswerIndex);
    scenario.set(aliasAccessAnswerIndexHistoryInQuestion, accessAnswerIndexHistory);

    await this.learner.instruction(
        `student taps to the answer not enabled handwriting`,
        async () => {
            await learnerTapToHandwritingFIBAnswerAtPosition(
                this.learner,
                handWritingAnswerIndex + 1
            );
        }
    );
});

When('student chooses the previous answer', async function (this: IMasterWorld) {
    const scenario = this.scenario;
    const accessAnswerIndexHistory = scenario.get<number[]>(
        aliasAccessAnswerIndexHistoryInQuestion
    );
    const previousAnswer = accessAnswerIndexHistory[accessAnswerIndexHistory.length - 2];
    accessAnswerIndexHistory.push(previousAnswer);
    scenario.set(aliasCurrentAnswerIndexInQuestion, previousAnswer);
    scenario.set(aliasAccessAnswerIndexHistoryInQuestion, accessAnswerIndexHistory);

    await this.learner.instruction(`student taps to the previous answer`, async () => {
        await learnerTapToHandwritingFIBAnswerAtPosition(this.learner, previousAnswer + 1);
    });
});

Given('student answers all answers in question', async function () {
    const scenario = this.scenario;
    const quizQuestionNames = await this.learner.getQuizNameList();
    const currentQuizQuestionName = quizQuestionNames[0];
    const quizzes = scenario.get<Quiz[]>(aliasRandomQuizzes);
    const currentQuiz = quizzes.find((quiz) => {
        return currentQuizQuestionName.includes(quiz.externalId);
    });
    const listOfAnswerFilledText: string[] = [];

    for (let index = 0; index < currentQuiz!.optionsList.length; index++) {
        await this.learner.instruction(`student answers the answer ${index + 1}`, async () => {
            const answerFilledText = `Sample answer ${index + 1}`;
            const isMath = !currentQuiz!.optionsList[index].attribute!.configsList.includes(
                QuizItemAttributeConfig.MATH_CONFIG
            );
            if (isMath) {
                await learnerTypeToFIBAnswerAtPosition(this.learner, answerFilledText, index + 1);
                listOfAnswerFilledText.push(answerFilledText);
            } else {
                await learnerAnswerMathAtPosition(this.learner, index + 1);
                listOfAnswerFilledText.push(mathHandwritingAnswer);
            }
        });
    }
    scenario.set(aliasListOfAnswerFilledText, listOfAnswerFilledText);
});
