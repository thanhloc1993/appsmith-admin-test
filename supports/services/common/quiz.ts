import { sampleFlashcardCardImg } from '@supports/constants';

import { genId } from '../../../step-definitions/utils';
import shuffle from 'lodash/shuffle';
import { UpsertQuizRequest } from 'manabie-yasuo/course_pb';
import { RichText } from 'manabie-yasuo/quiz_pb';
import {
    ContentBasicInfo,
    QuizCore as QuizCoreV2,
    QuizItemAttribute,
    QuizItemAttributeConfig,
    QuizOption as QuizOptionV2,
    QuizType,
} from 'manabuf/common/v1/contents_pb';
import {
    QuizLO,
    UpsertQuizV2Request,
    UpsertSingleQuizRequest,
} from 'manabuf/eureka/v1/quiz_modifier_pb';
import { Int32Value } from 'manabuf/google/protobuf/wrappers_pb';

// TODO: To centralize, later we update from upsertQuiz to upsertQuizV2 easy
export interface Quiz extends Omit<QuizCoreV2.AsObject, 'info'> {
    loId: string;
    quizId?: string;
    externalId: string;
    schoolId: number;
    answerContent?: string;
    point?: Int32Value.AsObject;
}

type UpsertRequest =
    | UpsertQuizRequest.AsObject
    | UpsertQuizV2Request.AsObject
    | UpsertSingleQuizRequest.AsObject;

const isUpsertV2 = (media: UpsertRequest): media is UpsertQuizV2Request.AsObject => {
    return (media as UpsertQuizV2Request.AsObject).quizzesList !== undefined;
};

const isUpsertSingleQuiz = (media: UpsertRequest): media is UpsertSingleQuizRequest.AsObject => {
    return (media as UpsertSingleQuizRequest.AsObject).quizLo !== undefined;
};

export const convertUpsertQuizRequestToQuiz = (request: UpsertRequest): Quiz[] => {
    if (isUpsertSingleQuiz(request)) {
        return [
            {
                ...request.quizLo!.quiz!,
                loId: request.quizLo!.loId,
                schoolId: request.quizLo!.quiz!.info!.schoolId!,
            },
        ];
    }
    if (isUpsertV2(request)) {
        const quizzes: Quiz[] = [];
        request.quizzesList.forEach(({ loId, quiz }) => {
            if (quiz && quiz.info) {
                quizzes.push({
                    ...quiz!,
                    loId,
                    schoolId: quiz?.info?.schoolId,
                });
            }
        });
        return quizzes;
    }

    const requestV1 = request as unknown as UpsertQuizRequest.AsObject;

    return [
        {
            ...requestV1.quiz!,
            loId: requestV1.loId,
            questionTagIdsList: [],
        },
    ];
};

export const toRichText = (override?: string) => {
    const richText = new RichText();
    const content = override ? override : `Question ${genId()}`;
    const raw = {
        blocks: [
            {
                key: '32km2',
                text: content,
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
        ],
        entityMap: {},
    };

    richText.setRaw(JSON.stringify(raw));

    richText.setRendered(
        `<div data-contents="true" data-dynamic="${override ? genId() : null}">
             <div class="" data-block="true" data-editor="94c2a" data-offset-key="32km2-0-0">
                 <div data-offset-key="32km2-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr">
                     <span data-offset-key="32km2-0-0">
                         <span data-text="true">description</span>
                     </span>
                </div>
             </div>
        </div>`
            .replace(/(>)\s/g, '')
            .replace('description', content)
    );

    return richText;
};

export const constructAnswersV2 = (answers: QuizOptionV2.AsObject[]) => {
    return answers.map((answer) => {
        const { correctness, configsList, label, attribute, content, key } = answer;
        const remoteAnswer = new QuizOptionV2();

        remoteAnswer.setCorrectness(correctness);
        remoteAnswer.setConfigsList(configsList);
        remoteAnswer.setLabel(label);
        remoteAnswer.setKey(key);
        remoteAnswer.setContent(content ? toRichText(content.raw) : toRichText());

        if (attribute) {
            remoteAnswer.setAttribute(constructQuizAttribute(attribute));
        }

        return remoteAnswer;
    });
};

export const constructQuizAttribute = (attr: QuizItemAttribute.AsObject): QuizItemAttribute => {
    const { configsList, audioLink, imgLink } = attr;

    const attribute = new QuizItemAttribute();
    attribute.setConfigsList(configsList);

    if (audioLink) {
        attribute.setAudioLink(audioLink);
    }

    if (imgLink) {
        attribute.setImgLink(imgLink);
    }

    return attribute;
};

const constructQuizCoreV2 = (quiz: Quiz) => {
    const { kind, attribute, schoolId, taggedLosList, optionsList, question, point } = quiz;

    const quizCore = new QuizCoreV2();
    const contentInfo = new ContentBasicInfo();
    const pointInt32 = new Int32Value();

    pointInt32.setValue(point?.value || 1);

    contentInfo.setSchoolId(schoolId);

    quizCore.setPoint(pointInt32);

    quizCore.setInfo(contentInfo);
    quizCore.setExternalId(quiz.externalId);

    quizCore.setKind(kind);
    quizCore.setQuestion(question ? toRichText(question.raw) : toRichText());
    quizCore.setExplanation(toRichText());
    quizCore.setDifficultyLevel(quiz.difficultyLevel || 1);
    quizCore.setOptionsList(constructAnswersV2(optionsList));

    quizCore.setTaggedLosList(taggedLosList);

    if (attribute) {
        quizCore.setAttribute(constructQuizAttribute(attribute));
    }

    return quizCore;
};

export const createUpsertSingleQuizRequest = ({ quiz }: { quiz: Quiz }) => {
    const request = new UpsertSingleQuizRequest();

    const quizLO = new QuizLO();

    quizLO.setLoId(quiz.loId);
    quizLO.setQuiz(constructQuizCoreV2(quiz));

    request.setQuizLo(quizLO);

    return request;
};

export const createQuizV2Request = ({ kind, quizes }: { kind: QuizType; quizes: Quiz[] }) => {
    const request = new UpsertQuizV2Request();

    request.setKind(kind);
    quizes.forEach((currentQuiz) => {
        const quizLO = new QuizLO();
        quizLO.setQuiz(constructQuizCoreV2(currentQuiz));
        quizLO.setLoId(currentQuiz.loId);
        request.addQuizzes(quizLO);
    });

    return request;
};

export const createDefaultQuizAttributes = (
    overrides: Partial<QuizItemAttribute.AsObject> = {}
): QuizItemAttribute.AsObject => {
    return {
        audioLink: '',
        imgLink: '',
        configsList: [],
        ...overrides,
    };
};

export const createQuizContent = (
    info: Pick<
        Quiz,
        'kind' | 'loId' | 'schoolId' | 'externalId' | 'point' | 'difficultyLevel' | 'answerContent'
    >,
    payload: {
        // TODO: Hieu tracking and refactor later
        optionsList?: Quiz['optionsList'];
        configList?: Quiz['configList'];
        question?: Quiz['question'];
        point?: Int32Value.AsObject['value'];
        attribute?: Quiz['attribute'];
        // TODO: Remove this option
        shouldCreateFIBWithOneAnswer?: boolean;
    } = {}
): Quiz => {
    const { shouldCreateFIBWithOneAnswer, point, ...rest } = payload;
    switch (info.kind) {
        case QuizType.QUIZ_TYPE_POW: {
            return {
                taggedLosList: [],
                configList: [],
                optionsList: [
                    {
                        correctness: true,
                        configsList: [],
                        key: '',
                        label: '',
                        attribute: createDefaultQuizAttributes({
                            configsList: [QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_ENG],
                        }),
                        content: {
                            // TODO: Please don't use answerContent we will remove
                            raw: info.answerContent ?? '',
                            rendered: info.answerContent ?? '',
                        },
                    },
                ],
                attribute: {
                    configsList: [QuizItemAttributeConfig.FLASHCARD_LANGUAGE_CONFIG_JP],
                    audioLink: '',
                    imgLink: info.answerContent ? '' : sampleFlashcardCardImg, // because if there is img in learner app, cannot find the answer field key
                },
                point: {
                    value: point || 1,
                },
                questionTagIdsList: [],
                ...info,
                ...rest,
            };
        }
        case QuizType.QUIZ_TYPE_FIB: {
            const optionsList = shouldCreateFIBWithOneAnswer
                ? [
                      {
                          correctness: true,
                          configsList: [],
                          key: `${genId()}`,
                          label: '',
                          attribute: createDefaultQuizAttributes(),
                      },
                  ]
                : createFIBHandwritingAnswers();
            return {
                taggedLosList: [],
                configList: [],
                question: {
                    raw: info.externalId,
                    rendered: info.externalId,
                },
                optionsList,
                attribute: createDefaultQuizAttributes(),
                point: {
                    value: point || 1,
                },
                questionTagIdsList: [],
                ...info,
                ...rest,
            };
        }
        default: {
            return {
                configList: [],
                taggedLosList: [],
                optionsList: [
                    {
                        correctness: true,
                        configsList: [],
                        key: `${genId()}`,
                        label: '',
                        attribute: createDefaultQuizAttributes(),
                    },
                    {
                        correctness: false,
                        configsList: [],
                        key: `${genId()}`,
                        label: '',
                        attribute: createDefaultQuizAttributes(),
                    },
                ],
                attribute: createDefaultQuizAttributes(),
                point: {
                    value: point || 1,
                },
                questionTagIdsList: [],
                ...info,
                ...rest,
            };
        }
    }
};

export const createFIBHandwritingAnswers = (): QuizOptionV2.AsObject[] => {
    return shuffle([
        {
            correctness: true,
            configsList: [],
            key: `${genId()}`,
            label: '',
            attribute: createDefaultQuizAttributes(),
        },
        {
            correctness: true,
            configsList: [],
            key: `${genId()}`,
            label: '',
            attribute: createDefaultQuizAttributes({
                configsList: [QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG],
            }),
            content: {
                raw: 'ZL',
                rendered: 'ZL',
            },
        },
        {
            correctness: true,
            configsList: [],
            key: `${genId()}`,
            label: '',
            attribute: createDefaultQuizAttributes({
                configsList: [QuizItemAttributeConfig.LANGUAGE_CONFIG_JP],
            }),
            content: {
                raw: '二三',
                rendered: '二三',
            },
        },
        {
            correctness: true,
            configsList: [],
            key: `${genId()}`,
            label: '',
            attribute: createDefaultQuizAttributes({
                configsList: [QuizItemAttributeConfig.MATH_CONFIG],
            }),
            content: {
                raw: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
                rendered: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
            },
        },
    ]);
};
