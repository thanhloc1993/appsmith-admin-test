import { asyncForEach } from '@legacy-step-definitions/utils';

import { Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';
import { Quiz } from '@supports/services/common/quiz';

import {
    aliasAccessAnswerIndexHistoryInQuestion,
    aliasCurrentAnswerFilledText,
    aliasCurrentAnswerIndexInQuestion,
    aliasListOfAnswerFilledText,
    aliasRandomQuizzes,
    aliasSketchWhiteboard,
} from './alias-keys/syllabus';
import {
    studentCloseTheErrorMessage,
    studentContinueSketchesWhiteboardEnglish,
    studentEraseWhiteboard,
    studentScanWhiteboard,
    studentSeeTheAnswerFilled,
    studentSeeTheAnswerNotFilled,
    studentSeeTheAnswerNotUpdated,
    studentSeeTheAnswerUpdated,
    studentSeeTheErrorMessage,
    studentSeeWhiteboardEmpty,
    studentSeeWhiteboardNotChange,
    studentSeeWhiteboardSketched,
    studentSketchesWhiteboardEnglish,
    studentSketchesWhiteboardJapanese,
    studentSketchesWhiteboardMath,
    studentSketchesWhiteboardMeaningless,
    studentTapTheAnswerAtIndex,
} from './syllabus-sketch-whiteboard-definitions';
import { SketchType } from './syllabus-utils';
import { QuizItemAttributeConfig } from 'manabuf/common/v1/contents_pb';

When(
    `student sketches the answer by {string} on the whiteboard`,
    async function (this: IMasterWorld, sketchType: SketchType) {
        const learner = this.learner;
        const scenario = this.scenario;
        let isSketch = true;
        await learner.instruction(`student sketches ${sketchType}`, async () => {
            switch (sketchType) {
                case 'Meaningless':
                    return await studentSketchesWhiteboardMeaningless(learner);
                case 'English':
                    return await studentSketchesWhiteboardEnglish(learner);
                case 'Japanese':
                    return await studentSketchesWhiteboardJapanese(learner);
                case 'Math':
                    return await studentSketchesWhiteboardMath(learner);
                case 'Empty':
                    isSketch = false;
                    break;
                default:
                    throw 'Not implemented';
            }
        });
        scenario.set(aliasSketchWhiteboard, isSketch);
    }
);

When(`student sketches the answer on the whiteboard`, async function () {
    const learner = this.learner;
    const scenario = this.scenario;
    await learner.instruction(`student sketches the whiteboard`, async () => {
        await studentEraseWhiteboard(learner);
        await studentSketchesWhiteboardEnglish(learner);
    });
    scenario.set(aliasSketchWhiteboard, true);
});

When(`student continue sketches the answer on the whiteboard`, async function () {
    const learner = this.learner;
    const scenario = this.scenario;
    await learner.instruction(`student continue sketches the whiteboard`, async () => {
        await studentContinueSketchesWhiteboardEnglish(learner);
    });
    scenario.set(aliasSketchWhiteboard, true);
});

When(`student scans the handwriting`, async function (this: IMasterWorld) {
    await this.learner.instruction('student scans the handwriting', async () => {
        await studentScanWhiteboard(this.learner);
    });
});

Then(`student sees the whiteboard is sketched`, async function (this: IMasterWorld) {
    await this.learner.instruction('student sees the whiteboard is sketched', async () => {
        await studentSeeWhiteboardSketched(this.learner);
    });
});

Then(`student sees the answer filled`, async function (this: IMasterWorld) {
    const currentAnswerIndex = this.scenario.get<number>(aliasCurrentAnswerIndexInQuestion);

    await this.learner.instruction(
        `student sees the answer ${currentAnswerIndex + 1} filled`,
        async () => {
            const answerFieldText = await studentSeeTheAnswerFilled(
                this.learner,
                currentAnswerIndex
            );
            this.scenario.set(aliasCurrentAnswerFilledText, answerFieldText);
        }
    );
});

Then(`student sees the answer updated`, async function () {
    const currentAnswerIndex = this.scenario.get<number>(aliasCurrentAnswerIndexInQuestion);
    const lastAnswerFilledText = this.scenario.get<string>(aliasCurrentAnswerFilledText);

    await this.learner.instruction(
        `student sees the answer ${currentAnswerIndex + 1} updated`,
        async () => {
            const answerFieldText = await studentSeeTheAnswerUpdated(
                this.learner,
                lastAnswerFilledText,
                currentAnswerIndex
            );
            this.scenario.set(aliasCurrentAnswerFilledText, answerFieldText);
        }
    );
});

When(
    'student scans to answer other question enabled handwriting',
    async function (this: IMasterWorld) {
        const scenario = this.scenario;

        const quizQuestionNames = await this.learner.getQuizNameList();
        const currentQuizQuestionName = quizQuestionNames[0];
        const quizzes = scenario.get<Quiz[]>(aliasRandomQuizzes);
        const accessAnswerIndexHistory =
            scenario.get<number[]>(aliasAccessAnswerIndexHistoryInQuestion) ?? [];

        const currentQuiz = quizzes.find((quiz) => {
            return currentQuizQuestionName.includes(quiz.externalId);
        });
        const currentHandWritingAnswerIndex = scenario.get<number>(
            aliasCurrentAnswerIndexInQuestion
        );

        const handWritingAnswerIndex = currentQuiz!.optionsList.findIndex((option, index) => {
            if (index == currentHandWritingAnswerIndex) return false;
            return (
                option.attribute!.configsList.includes(
                    QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG
                ) ||
                option.attribute!.configsList.includes(
                    QuizItemAttributeConfig.LANGUAGE_CONFIG_JP
                ) ||
                option.attribute!.configsList.includes(QuizItemAttributeConfig.MATH_CONFIG)
            );
        });
        accessAnswerIndexHistory.push(handWritingAnswerIndex);
        scenario.set(aliasCurrentAnswerIndexInQuestion, handWritingAnswerIndex);
        scenario.set(aliasAccessAnswerIndexHistoryInQuestion, accessAnswerIndexHistory);

        await this.learner.instruction(
            `student taps to answer ${handWritingAnswerIndex + 1} enabled handwriting`,
            async () => {
                await studentTapTheAnswerAtIndex(this.learner, handWritingAnswerIndex);
            }
        );

        await this.learner.instruction('student scans the handwriting', async () => {
            await studentScanWhiteboard(this.learner);
        });
    }
);

Then(`student sees both answers filled`, async function (this: IMasterWorld) {
    const learner = this.learner;
    const scenario = this.scenario;

    const handWritingAnswerIndexes =
        scenario.get<number[]>(aliasAccessAnswerIndexHistoryInQuestion) ?? [];
    await asyncForEach<number, void>(handWritingAnswerIndexes, async (index) => {
        await learner.instruction(`student sees the answer ${index + 1} filled`, async () => {
            const answerFieldText = await studentSeeTheAnswerFilled(this.learner, index);
            this.scenario.set(aliasCurrentAnswerFilledText, answerFieldText);
        });
    });
});

Then(`student sees the answer doesn't fill`, async function () {
    const currentAnswerIndex = this.scenario.get<number>(aliasCurrentAnswerIndexInQuestion);

    await this.learner.instruction(
        `student sees the answer ${currentAnswerIndex + 1} doesn't filled`,
        async () => {
            const answerFieldText = await studentSeeTheAnswerNotFilled(
                this.learner,
                currentAnswerIndex
            );
            this.scenario.set(aliasCurrentAnswerFilledText, answerFieldText);
        }
    );
});

Then(`student sees error message`, async function () {
    await this.learner.instruction('student sees error message dialog', async () => {
        await studentSeeTheErrorMessage(this.learner);
    });
    await this.learner.instruction('student closes error message dialog', async () => {
        await studentCloseTheErrorMessage(this.learner);
    });
});

Then(`student sees the whiteboard is not reset`, async function () {
    const isSketchWhiteboard = this.scenario.get<boolean>(aliasSketchWhiteboard);

    await this.learner.instruction(
        `student sees the whiteboard is ${isSketchWhiteboard ? 'not' : ''} empty`,
        async () => {
            await studentSeeWhiteboardNotChange(this.learner, isSketchWhiteboard);
        }
    );
});

When(`student erases the whiteboard`, async function () {
    await this.learner.instruction('student tap the erase button on whiteboard', async () => {
        await studentEraseWhiteboard(this.learner);
        this.scenario.set(aliasSketchWhiteboard, false);
    });
});

Then(`student sees the answer has been reset`, async function () {
    const currentAnswerIndex = this.scenario.get<number>(aliasCurrentAnswerIndexInQuestion);

    await this.learner.instruction(
        `student sees the answer ${currentAnswerIndex + 1} doesn't filled`,
        async () => {
            const answerFieldText = await studentSeeTheAnswerNotFilled(
                this.learner,
                currentAnswerIndex
            );
            this.scenario.set(aliasCurrentAnswerFilledText, answerFieldText);
        }
    );
});

Then(`student sees the whiteboard has been reset`, async function () {
    await this.learner.instruction(`student sees the whiteboard is empty`, async () => {
        await studentSeeWhiteboardEmpty(this.learner);
    });
});

Then(`student sees the other answers unchanged`, async function (this: IMasterWorld) {
    const learner = this.learner;
    const scenario = this.scenario;

    const quizQuestionNames = await this.learner.getQuizNameList();
    const currentQuizQuestionName = quizQuestionNames[0];
    const quizzes = scenario.get<Quiz[]>(aliasRandomQuizzes);
    const currentAnswerIndex = this.scenario.get<number>(aliasCurrentAnswerIndexInQuestion);
    const listOfAnswerFilledText = scenario.get<string[]>(aliasListOfAnswerFilledText);

    const currentQuiz = quizzes.find((quiz) => {
        return currentQuizQuestionName.includes(quiz.externalId);
    });

    const otherAnswersIndex = currentQuiz!.optionsList.reduce<number[]>(function (a, _, i) {
        if (i !== currentAnswerIndex) a.push(i);
        return a;
    }, []);
    await asyncForEach<number, void>(otherAnswersIndex, async (index) => {
        await learner.instruction(`student sees the answer ${index + 1} not changed`, async () => {
            await studentSeeTheAnswerNotUpdated(this.learner, listOfAnswerFilledText[index], index);
        });
    });
});
