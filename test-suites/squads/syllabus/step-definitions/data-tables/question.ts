import {
    parseDTStringToArrayValue,
    parseDTValueToNumber,
    parseDTValueToString,
} from '@syllabus-utils/data-table';

import { Quiz } from '@services/common/quiz';

import { LMTypeShortMappedKey } from '../cms-models/learning-material';
import {
    DTQuestionDescription,
    QuestionTypeShortByLMTypeShort,
    QuestionTypeShortMappedKey,
} from '../cms-models/question';
import { QuizDifficultyLevels } from '../cms-models/quiz';
import { QuizType } from 'manabuf/common/v1/contents_pb';
import { getArrayElementWithLength } from 'test-suites/squads/syllabus/utils/common';

// TODO: Continue to implement later, please ignore this file
const convertDTQuestionDescriptionToQuiz = (
    data: Omit<DTQuestionDescription, 'type'> & { arrayType: Array<DTQuestionDescription['type']> }
): Partial<Quiz> => {
    const { arrayType, point = 1, difficultLevel = QuizDifficultyLevels.ONE } = data;
    const parsedQuestionType = parseDTValueToString(arrayType);
    const quizType = QuizType[QuestionTypeShortMappedKey[parsedQuestionType]];
    const parsedPoint = { value: parseDTValueToNumber(point) };
    const parsedDifficultLevel = parseDTValueToNumber(difficultLevel);

    return {
        kind: quizType,
        point: parsedPoint,
        difficultyLevel: parsedDifficultLevel,
    };
};

export const transformDTHashesQuestionDescription = ({
    lmType,
    dataHashes,
}: {
    lmType: keyof typeof LMTypeShortMappedKey;
    dataHashes: Array<DTQuestionDescription & { quantity: number }>;
}): Array<Partial<Quiz>> => {
    let result: Array<Partial<Quiz>> = [];

    dataHashes.forEach((data) => {
        const { quantity, type, point, difficultLevel } = data;
        const arrayType = parseDTStringToArrayValue(type, {
            arrayPattern: QuestionTypeShortByLMTypeShort[lmType],
        });

        const arrayQuestion = getArrayElementWithLength<Partial<Quiz>>(quantity, () =>
            convertDTQuestionDescriptionToQuiz({ arrayType, point, difficultLevel })
        );

        result = [...result, ...arrayQuestion];
    });

    return result;
};
