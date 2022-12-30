import { KeyQuizType } from '@supports/services/yasuo-course/const';
import { genId } from '@supports/utils/ulid';

import { createDefaultQuizAttributes, Quiz } from '@services/common/quiz';

import { QuestionAnswerBase } from '../cms-models/question';
import {
    CreateDataQuestionListOptions,
    CreateDataQuizAnswerListOptions,
    QuizAnswer,
    QuizDescription,
    QuizDetail,
    QuizDifficultyLevels,
    QuizExplanation,
} from '../cms-models/quiz';
import { getQuizTypeValue } from '../syllabus-utils';
import { InputRange, QuizEditInfoTitle, QuizTypeTitle } from '../types/cms-types';
import { getRandomElement } from './common';
import { QuizType, RichText } from 'manabuf/common/v1/contents_pb';
import { LearningMaterialType } from 'manabuf/syllabus/v1/enums_pb';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

/**
 * @description Check if question has answer config
 */
export const hasAnswerConfig = (quizTypeTitle: QuizTypeTitle) => {
    const quizTypesHasAnswerConfig: QuizTypeTitle[] = ['fill in the blank', 'multiple answer'];
    return quizTypesHasAnswerConfig.includes(quizTypeTitle);
};

/**
 *
 * @description Check if user can edit question {info}
 */
export const canEditQuizInfo = (quizTypeTitle: QuizTypeTitle, info: QuizEditInfoTitle) => {
    if (info === 'type') return true;

    if (quizTypeTitle === 'manual input' && !['description', 'explanation'].includes(info))
        return false;

    switch (info) {
        case 'answer config':
            if (hasAnswerConfig(quizTypeTitle)) return true;
            return false;
        case 'number of answers':
            // TODO: return true by default. This is just to bypass in case that mobile hasn't handle multiple answers in FIB
            if (quizTypeTitle === 'fill in the blank') return false;
            return true;
        default:
            return true;
    }
};

/**
 *
 * @description Get randomly the valid points per question from 1 to 999
 */
export const getValidPointsPerQuestion = ({
    min = InputRange.NUM_1,
    max = InputRange.NUM_999,
}: Partial<{
    min: number;
    max: number;
}> = {}) => {
    if (min < InputRange.NUM_1 || max > InputRange.NUM_999 || min > max) {
        throw new Error(
            `Points per question must be from ${InputRange.NUM_1} to ${InputRange.NUM_999}`
        );
    }

    return randomInteger(min, max);
};

/**
 *
 * @description Get randomly the question type of learning objective
 */
export const getRandomQuestionTypeForLO = () => {
    // Consider create getAllQuestionStringTypesForLO
    const allQuestionTypes: (keyof typeof KeyQuizType)[] = [
        'QUIZ_TYPE_FIB',
        'QUIZ_TYPE_MCQ',
        'QUIZ_TYPE_MAQ',
        'QUIZ_TYPE_MIQ',
    ];
    return getRandomElement(allQuestionTypes);
};

/**
 *
 * @description Get randomly the question type of exam lo
 */
export const getRandomQuestionTypeForExamLO = () => {
    // Consider create getAllQuestionStringTypesForExamLO
    const allQuestionTypes: (keyof typeof KeyQuizType)[] = [
        'QUIZ_TYPE_FIB',
        'QUIZ_TYPE_MCQ',
        'QUIZ_TYPE_MAQ',
    ];
    return getRandomElement(allQuestionTypes);
};

/**
 * @description Random a question type by LM type
 */
export const getRandomQuestionTypeByLMType = (
    lmType: LearningMaterialType
): keyof typeof KeyQuizType => {
    if (lmType === LearningMaterialType.LEARNING_MATERIAL_LEARNING_OBJECTIVE) {
        return getRandomQuestionTypeForLO();
    }

    return getRandomQuestionTypeForExamLO();
};

/**
 *
 * @description Convert quiz info created by UI to QuizDetail
 */
export const getConvertedQuizDetail = (
    overrides: Partial<
        QuizDetail<Partial<QuizDescription>, Partial<QuizAnswer>[], Partial<QuizExplanation>>
    > = {}
): QuizDetail => {
    return {
        description: overrides.description as QuizDescription,
        answers: overrides.answers as QuizAnswer[],
        explanation: overrides.explanation as QuizExplanation,
    };
};

/**
 *
 * @description Convert Quiz[] created by gRPC to QuizDetail[]
 */
export const convertDataQuizToQuizDetails = (quizData: Quiz[]): QuizDetail[] => {
    return quizData.map((quiz) => {
        const { question, point, kind } = quiz;
        const { quizTypeTitle } = getQuizTypeValue({ quizTypeNumber: kind });

        if (!question) throw new Error(`Cannot get question content created by gRPC`);
        if (!point) throw new Error(`Cannot get point per question created by gRPC`);

        return getConvertedQuizDetail({
            description: {
                content: question.raw,
                point: point.value,
                type: quizTypeTitle,
            },
        });
    });
};

export const joinCommaDelimiter = (tags: string[]) => tags.join(', ');

/**
 *
 * @description Create data of editor input (rich text)
 */
export const createDataRichText = (rawText = ''): RichText.AsObject => {
    return {
        raw: rawText,
        rendered: rawText,
    };
};

/**
 *
 * @description Create data of an answer
 */
export const createDataQuestionAnswer = (
    overrides: Partial<QuestionAnswerBase> = {}
): QuestionAnswerBase => {
    const {
        content = createDataRichText(`Answer ${genId()}`),
        correctness = true,
        configsList = [],
        label = '',
        key = `${genId()}`,
        attribute = createDefaultQuizAttributes(),
    } = overrides;
    return {
        correctness,
        configsList,
        label,
        key,
        attribute,
        content,
    };
};

/**
 *
 * @description Create gRPC data - Answer list by a question type
 */
export const createDataQuestionAnswerList = (
    info: { questionType: QuizType },
    options: Partial<CreateDataQuizAnswerListOptions> = {}
): Array<QuestionAnswerBase> => {
    const { questionType } = info;
    const { answerList = [] } = options;

    if (!answerList.length) {
        switch (questionType) {
            case QuizType.QUIZ_TYPE_MCQ:
            case QuizType.QUIZ_TYPE_MAQ:
            case QuizType.QUIZ_TYPE_MIQ:
                return [
                    createDataQuestionAnswer({
                        content: createDataRichText('Answer 1'),
                    }),
                    createDataQuestionAnswer({
                        content: createDataRichText('Answer 2'),
                        correctness: false,
                    }),
                ];
            case QuizType.QUIZ_TYPE_FIB:
                return [
                    createDataQuestionAnswer({
                        content: createDataRichText('Answer 1'),
                    }),
                ];
            default:
                return [];
        }
    }

    switch (questionType) {
        case QuizType.QUIZ_TYPE_FIB: {
            return answerList.map(
                (answer: Partial<Omit<QuestionAnswerBase, 'correctness'>>, index) => {
                    const answerNumber = index + 1;
                    const { content = createDataRichText(`Answer ${answerNumber}`), ...rest } =
                        answer;
                    return createDataQuestionAnswer({ content, ...rest });
                }
            );
        }
        case QuizType.QUIZ_TYPE_MIQ: {
            const answerListMIQ = answerList.length === 2 ? answerList : answerList.slice(0, 2);
            return answerListMIQ.map((answer, index) => {
                const answerNumber = index + 1;
                const {
                    content = createDataRichText(`Answer ${answerNumber}`),
                    correctness = answerNumber === 1,
                } = answer;
                return createDataQuestionAnswer({ content, correctness });
            });
        }
        case QuizType.QUIZ_TYPE_MCQ:
        case QuizType.QUIZ_TYPE_MAQ: {
            return answerList.map(
                (answer: Partial<Omit<QuestionAnswerBase, 'configsList' | 'labelList'>>, index) => {
                    const answerNumber = index + 1;
                    const {
                        content = createDataRichText(`Answer ${answerNumber}`),
                        correctness = answerNumber === 1,
                        ...rest
                    } = answer;
                    return createDataQuestionAnswer({ content, correctness, ...rest });
                }
            );
        }
        default:
            return [];
    }
};

/**
 * @description Create gRPC request data - A question by learning material type
 *
 * @param info - Required data to create a question
 * @param {string} info.loId - ID of LM contains a question
 * @param {string} info.schoolId
 *
 * @param [options={}] - Custom data to create a question
 * @param {string} [options.externalId=`${genId()}`]
 * @param {Int32Value.AsObject} [options.point={value:1}]
 * @param {QuizDifficultyLevels} [options.difficultyLevel=QuizDifficultyLevels.ONE]
 * @param {Quiz.configList} [options.configList=[]]
 * @param {LearningMaterialType} [options.lmType=LearningMaterialType.LEARNING_MATERIAL_LEARNING_OBJECTIVE]
 *
 */
export const createDataQuestion = (
    info: Required<Pick<Quiz, 'loId' | 'schoolId'>>,
    options: Partial<
        Omit<Quiz, 'loId' | 'schoolId'> & {
            lmType:
                | LearningMaterialType.LEARNING_MATERIAL_LEARNING_OBJECTIVE
                | LearningMaterialType.LEARNING_MATERIAL_EXAM_LO;
        }
    > = {}
): Quiz => {
    const {
        externalId = `${genId()}`,
        kind,
        point = { value: 1 },
        difficultyLevel = QuizDifficultyLevels.ONE,
        questionTagIdsList = [],
        taggedLosList = [],
        question,
        optionsList,
        explanation = createDataRichText(),
        configList = [],
        attribute = createDefaultQuizAttributes(),
        lmType = LearningMaterialType.LEARNING_MATERIAL_LEARNING_OBJECTIVE,
    } = options;
    const questionTypeKey = getRandomQuestionTypeByLMType(lmType);

    const questionType = kind || QuizType[questionTypeKey];
    const questionContent =
        question || createDataRichText(`[E2E] Question ${questionTypeKey} ${genId()}`);
    const answerList = optionsList || createDataQuestionAnswerList({ questionType });

    return {
        externalId,
        kind: questionType,
        point,
        difficultyLevel,
        question: questionContent,
        optionsList: answerList,
        questionTagIdsList,
        taggedLosList,
        explanation,
        configList,
        attribute,
        ...info,
    };
};

/**
 *
 * @description Create data list of questions
 */
export const createDataQuestionList = (
    info: { loId: Quiz['loId']; schoolId: Quiz['schoolId'] },
    options: Partial<CreateDataQuestionListOptions>
): Array<Quiz> => {
    const { questionList = [], lmType } = options;

    return questionList.map((question) => {
        return createDataQuestion(info, { ...question, lmType });
    });
};
