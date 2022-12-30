import { asyncForEach, createNumberArrayWithLength, genId } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import {
    KeyAssignmentType,
    KeyLearningObjectiveType,
    LearningObjectiveType,
} from '@supports/services/bob-course/const';
import { createQuizContent, Quiz } from '@supports/services/common/quiz';
import { assignmentModifierServiceV2 } from '@supports/services/eureka/assignment';
import NsAssignmentModifierServiceRequest from '@supports/services/eureka/assignment/request-types';
import { examLOModifierService } from '@supports/services/eureka/exam-lo';
import NsExamLOModifierServiceRequest from '@supports/services/eureka/exam-lo/request-types';
import { flashcardModifierService } from '@supports/services/eureka/flashcard';
import NsFlashcardModifierServiceRequest from '@supports/services/eureka/flashcard/request-types';
import { LearningObjectiveModifierServiceV2 } from '@supports/services/eureka/learning-objective';
import NsLearningObjectiveModifierServiceRequest from '@supports/services/eureka/learning-objective/request-types';
import { quizClientService, quizModifierService } from '@supports/services/eureka/quiz';
import taskAssignmentModifierService from '@supports/services/eureka/task-assignment';
import { NsTaskAssignmentModifierService } from '@supports/services/eureka/task-assignment/request-types';
import { KeyQuizType } from '@supports/services/yasuo-course/const';

import {
    aliasAssignmentName,
    aliasBookIds,
    aliasChapterName,
    aliasChapterNames,
    aliasExamLOName,
    aliasFlashcardName,
    aliasLOId,
    aliasLOName,
    aliasRandomAssignments,
    aliasRandomBooks,
    aliasRandomChapters,
    aliasRandomLOs,
    aliasRandomQuizzesRaw,
    aliasRandomStudyPlanItems,
    aliasRandomTaskAssignments,
    aliasRandomTopics,
    aliasTaskAssignmentName,
    aliasTopicName,
    aliasTopicNames,
} from './alias-keys/syllabus';
import {
    createRandomAssignments,
    createRandomBookByGRPC,
    createRandomChapters,
    createRandomTopics,
} from './syllabus-content-book-create-definitions';
import { createRandomLearningObjectives } from './syllabus-learning-objectives-create-definitions';
import { schoolAdminShouldUseUpsertFlashcardContent } from './syllabus-migration-temp';
import { QuizType } from 'manabuf/common/v1/contents_pb';
import { AssignmentType } from 'manabuf/eureka/v1/enums_pb';
import {
    Assignment,
    Assignment_V2,
    Chapter,
    ExamLO,
    FlashCard,
    LearningObjective,
    LearningObjective_V2,
    StudyPlanItem,
    TaskAssignment,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export type CreateRandomFlashcardPayload =
    Partial<NsFlashcardModifierServiceRequest.InsertFlashcard> &
        Pick<NsFlashcardModifierServiceRequest.InsertFlashcard, 'topicId'>;

export type CreateRandomExamLOPayload = Partial<NsExamLOModifierServiceRequest.InsertExamLO> &
    Pick<NsExamLOModifierServiceRequest.InsertExamLO, 'topicId'>;

export type CreateRandomLearningObjectivePayload =
    Partial<NsLearningObjectiveModifierServiceRequest.InsertLearningObjective> &
        Pick<NsLearningObjectiveModifierServiceRequest.InsertLearningObjective, 'topicId'>;

export type CreateRandomTaskAssignmentPayload =
    Partial<NsTaskAssignmentModifierService.InsertTaskAssignment> &
        Pick<NsTaskAssignmentModifierService.InsertTaskAssignment, 'topicId'>;

export type CreateRandomAssignmentPayload =
    Partial<NsAssignmentModifierServiceRequest.InsertAssignment> &
        Pick<NsAssignmentModifierServiceRequest.InsertAssignment, 'topicId'>;

export async function createRandomLearningObjective(
    cms: CMSInterface,
    payload: CreateRandomLearningObjectivePayload,
    options: {
        quantity?: number;
    }
): Promise<LearningObjective_V2[]> {
    const [token] = await Promise.all([cms.getToken(), cms.getContentBasic()]);

    const { quantity } = options;

    const { topicId, studyGuide = '' } = payload;

    const insertMultipleLOsPromise = [...Array(quantity)].map(() => {
        const id = genId();
        const name = `LO ${id}`;

        const learningObjective: NsLearningObjectiveModifierServiceRequest.InsertLearningObjective =
            {
                name: name,
                topicId,
                studyGuide,
                videoId: '',
            };

        return LearningObjectiveModifierServiceV2.insertLearningObjective(token, learningObjective);
    });

    const learningObjectives = await Promise.all(insertMultipleLOsPromise);

    return learningObjectives.map<LearningObjective_V2>((learningObjective) => {
        const { request, response } = learningObjective;

        const { name, topicId } = request.learningObjective!.base!;
        const { learningMaterialId } = response!;

        const legacyPayload: LearningObjective = {
            gradeToPass: '',
            instruction: '',
            quizIdsList: [],
            manualGrading: false,
            prerequisitesList: [],
            studyGuide: '',
            video: '',
            type: LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING,
            topicId,
            info: {
                id: response!.learningMaterialId,
                name,
            },

            name,
            learningMaterialId,
            typeForLM: 'LEARNING_MATERIAL_LEARNING_OBJECTIVE',
        };

        return {
            ...legacyPayload,
            learningObjectiveId: learningMaterialId,
            name,
            learningMaterialId,
            typeForLM: 'LEARNING_MATERIAL_LEARNING_OBJECTIVE',
        };
    });
}

export async function createRandomExamLO(
    cms: CMSInterface,
    payload: CreateRandomExamLOPayload,
    options: {
        quantity?: number;
    }
): Promise<ExamLO[]> {
    const [token] = await Promise.all([cms.getToken(), cms.getContentBasic()]);

    const { quantity } = options;

    const { topicId, ...rest } = payload;

    const insertMultipleExamLOsPromise = [...Array(quantity)].map(() => {
        const id = genId();
        const name = `Exam LO ${id}`;

        const examLO: NsExamLOModifierServiceRequest.InsertExamLO = {
            name,
            topicId,
            instruction: '',
            gradeToPass: undefined,
            manualGrading: false,
            timeLimit: undefined,
            ...rest,
        };

        return examLOModifierService.insertExamLO(token, examLO);
    });

    const examLOs = await Promise.all(insertMultipleExamLOsPromise);

    return examLOs.map<ExamLO>((examLO) => {
        const { request, response } = examLO;

        const { name, topicId } = request.examLo!.base!;
        const { instruction, manualGrading, gradeToPass, timeLimit } = request.examLo!;
        const { learningMaterialId } = response!;

        const legacyPayload: LearningObjective = {
            gradeToPass: '',
            timeLimit: '',
            instruction: '',
            quizIdsList: [],
            manualGrading: false,
            prerequisitesList: [],
            studyGuide: '',
            video: '',
            type: LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO,
            topicId,
            info: {
                id: response!.learningMaterialId,
                name,
            },
            name,
            learningMaterialId,
            typeForLM: 'LEARNING_MATERIAL_EXAM_LO',
        };

        return {
            ...legacyPayload,
            manualGrading,
            instruction,
            gradeToPass,
            timeLimit,
            examLOId: learningMaterialId,
            name,
            learningMaterialId,
            typeForLM: 'LEARNING_MATERIAL_EXAM_LO',
        };
    });
}

export async function createRandomFlashcard(
    cms: CMSInterface,
    payload: CreateRandomFlashcardPayload,
    options: {
        quantity?: number;
    }
): Promise<FlashCard[]> {
    const [token] = await Promise.all([cms.getToken(), cms.getContentBasic()]);

    const { quantity } = options;
    const { topicId, ...rest } = payload;

    const insertMultipleFlashcardsPromise = [...Array(quantity)].map(() => {
        const id = genId();
        const name = `Flashcard ${id}`;

        const flashcard: NsFlashcardModifierServiceRequest.InsertFlashcard = {
            name,
            topicId,
            ...rest,
        };

        return flashcardModifierService.insertFlashcard(token, flashcard);
    });

    const flashcards = await Promise.all(insertMultipleFlashcardsPromise);

    return flashcards.map<FlashCard>((flashcard) => {
        const { request, response } = flashcard;

        const { name, topicId } = request.flashcard!.base!;
        const { learningMaterialId } = response!;

        const legacyPayload: LearningObjective = {
            gradeToPass: '',
            instruction: '',
            quizIdsList: [],
            manualGrading: false,
            prerequisitesList: [],
            studyGuide: '',
            video: '',
            type: LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD,
            topicId,
            info: {
                id: response!.learningMaterialId,
                name,
            },
            name,
            learningMaterialId,
            typeForLM: 'LEARNING_MATERIAL_FLASH_CARD',
        };

        return {
            ...legacyPayload,
            flashcardId: learningMaterialId,
            name,
            learningMaterialId,
            typeForLM: 'LEARNING_MATERIAL_FLASH_CARD',
        };
    });
}

export const createRandomTaskAssignment = async (
    cms: CMSInterface,
    payload: CreateRandomTaskAssignmentPayload,
    options: {
        quantity?: number;
    } = {}
): Promise<TaskAssignment[]> => {
    const token = await cms.getToken();

    const { quantity = 1 } = options;

    const {
        topicId,
        requireCorrectness = false,
        requireAssignmentNote = false,
        requireAttachment = false,
        requireDuration = false,
        requireUnderstandingLevel = false,
    } = payload;

    const insertMultipleTaskAssignmentsPromise = [...Array(quantity)].map(() => {
        const name = `Task ${genId()}`;
        const payload: NsTaskAssignmentModifierService.InsertTaskAssignment = {
            topicId,
            name,
            instruction: 'Task Instruction',
            attachmentsList: [],
            requireAssignmentNote,
            requireAttachment,
            requireCorrectness,
            requireDuration,
            requireUnderstandingLevel,
        };

        return taskAssignmentModifierService.insertTaskAssignment(token, payload);
    });

    const taskAssignments = await Promise.all(insertMultipleTaskAssignmentsPromise);

    return taskAssignments.map((taskAssignment) => {
        const { request, response } = taskAssignment;

        const { learningMaterialId } = response!;

        const {
            attachmentsList,
            instruction,
            requireAssignmentNote,
            requireAttachment,
            requireCompleteDate,
            requireCorrectness,
            requireDuration,
            requireUnderstandingLevel,
        } = request.taskAssignment!;

        const { name } = request.taskAssignment!.base!;

        const legacyAssignment: Assignment = {
            content: { topicId, loIdList: [] },
            assignmentId: learningMaterialId,
            assignmentType: AssignmentType.ASSIGNMENT_TYPE_TASK,
            attachmentsList,
            instruction,
            maxGrade: 0,
            name,
            requiredGrade: false,
            setting: {
                allowResubmission: false,
                allowLateSubmission: false,
                requireAttachment: false,
                requireAssignmentNote: false,
                requireVideoSubmission: false,
                requireCompleteDate: false,
                requireDuration: false,
                requireCorrectness: false,
                requireUnderstandingLevel: false,
            },

            typeForLM: 'LEARNING_MATERIAL_TASK_ASSIGNMENT',
            topicId,
            learningMaterialId,
        };
        return {
            ...legacyAssignment,
            learningMaterialId,
            topicId,
            assignmentId: learningMaterialId,
            taskAssignmentId: learningMaterialId,
            attachmentsList,
            instruction,
            requireAssignmentNote,
            requireAttachment,
            requireCompleteDate,
            requireCorrectness,
            requireDuration,
            requireUnderstandingLevel,
            typeForLM: 'LEARNING_MATERIAL_TASK_ASSIGNMENT',
        };
    });
};

export const createRandomAssignment = async (
    cms: CMSInterface,
    payload: CreateRandomAssignmentPayload,
    options: {
        quantity?: number;
    } = {}
): Promise<Assignment_V2[]> => {
    const token = await cms.getToken();

    const { quantity = 1 } = options;
    const { allowResubmission = false, maxGrade = 10, topicId, ...rest } = payload;

    const insertMultipleAssignmentsPromise = [...Array(quantity)].map(() => {
        const name = `Assignment ${genId()}`;
        const assignment: NsAssignmentModifierServiceRequest.InsertAssignment = {
            topicId,
            name,
            maxGrade,
            allowResubmission,
            isRequiredGrade: true,
            instruction: 'Assignment Instruction',
            attachmentsList: [],
            allowLateSubmission: false,
            requireAssignmentNote: false,
            requireAttachment: false,
            requireVideoSubmission: false,
            ...rest,
        };

        return assignmentModifierServiceV2.insertAssignment(token, assignment);
    });

    const assignments = await Promise.all(insertMultipleAssignmentsPromise);

    return assignments.map((assignment) => {
        const { request, response } = assignment;
        const { learningMaterialId } = response!;

        const {
            allowLateSubmission,
            allowResubmission,
            attachmentsList,
            requireAssignmentNote,
            requireAttachment,
            requireVideoSubmission,
            instruction,
            isRequiredGrade,
            maxGrade,
        } = request.assignment!;

        const { name } = request.assignment!.base!;

        const legacyAssignment: Assignment = {
            content: { topicId, loIdList: [] },
            assignmentId: learningMaterialId,
            assignmentType: AssignmentType.ASSIGNMENT_TYPE_LEARNING_OBJECTIVE,
            attachmentsList,
            instruction,
            maxGrade,
            name,
            requiredGrade: isRequiredGrade,
            setting: {
                allowResubmission,
                allowLateSubmission: false,
                requireAttachment: false,
                requireAssignmentNote: false,
                requireVideoSubmission: false,
                requireCompleteDate: false,
                requireDuration: false,
                requireCorrectness: false,
                requireUnderstandingLevel: false,
            },
            learningMaterialId,
            topicId,
            typeForLM: 'LEARNING_MATERIAL_GENERAL_ASSIGNMENT',
        };

        return {
            ...legacyAssignment,
            assignmentId: learningMaterialId,
            attachmentsList,
            instruction,
            learningMaterialId,
            maxGrade,
            name,
            isRequiredGrade,
            topicId,
            typeForLM: 'LEARNING_MATERIAL_GENERAL_ASSIGNMENT',
            allowLateSubmission,
            allowResubmission,
            requireAssignmentNote,
            requireAttachment,
            requireVideoSubmission,
        };
    });
};

export const schoolAdminCreateRandomBooksAndSetContext = async (
    cms: CMSInterface,
    scenario: ScenarioContext
) => {
    const {
        request: { booksList },
        // TODO: Remove scenario out of createRandomBookByGRPC
    } = await createRandomBookByGRPC(cms, scenario);

    const bookIds = booksList.map((item) => item.bookId);

    scenario.set(aliasRandomBooks, booksList);
    scenario.set(aliasBookIds, bookIds);
};

export const schoolAdminCreateRandomChaptersAndSetContext = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    payload: { bookId?: string; quantity?: number } = {}
) => {
    const { bookId, quantity = 1 } = payload;

    const finalBookId = bookId || scenario.get(aliasBookIds)[0];

    const {
        request: { chaptersList },
    } = await createRandomChapters(
        cms,
        {
            bookId: finalBookId,
        },
        {
            quantity,
        }
    );

    const chapterNames: string[] = chaptersList.map((chapter) => chapter.info!.name);

    scenario.set(aliasChapterNames, chapterNames);

    scenario.set(aliasChapterName, chapterNames[0]);
    scenario.set(aliasRandomChapters, chaptersList);
};

export const schoolAdminCreateRandomTopicsForEachChapterAndSetContext = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    payload: {
        quantity?: number;
    } = {}
) => {
    const chapters = scenario.get<Chapter[]>(aliasRandomChapters);

    const { quantity } = payload;

    const createMultipleTopicsPromise = chapters.map(({ info }) =>
        createRandomTopics(cms, { quantity, chapterId: info!.id })
    );

    const createMultipleTopicsResult = await Promise.all(createMultipleTopicsPromise);

    const topics = createMultipleTopicsResult
        .map(({ request: { topicsList } }) => topicsList)
        .reduce((previous, current) => previous.concat(current), []);

    const topicNames: string[] = topics.map((topic) => topic.name);
    const firstTopicName = topicNames[0];

    scenario.set(aliasTopicName, firstTopicName);
    scenario.set(aliasTopicNames, topicNames);
    scenario.set(aliasRandomTopics, topics);
};

export const schoolAdminCreateDefaultSimpleBookAndSetContext = async (
    cms: CMSInterface,
    scenario: ScenarioContext
) => {
    await schoolAdminCreateRandomBooksAndSetContext(cms, scenario);
    await schoolAdminCreateRandomChaptersAndSetContext(cms, scenario);
    await schoolAdminCreateRandomTopicsForEachChapterAndSetContext(cms, scenario);
};

export const mergeAndSetRandomStudyPlanItemsContext = (
    scenario: ScenarioContext,
    items: StudyPlanItem | StudyPlanItem[]
) => {
    const previousStudyPlanItem = scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];

    scenario.set(aliasRandomStudyPlanItems, previousStudyPlanItem.concat(items));
};

export const mergeAndSetRandomQuizzesRawContext = (
    scenario: ScenarioContext,
    items: Quiz | Quiz[]
) => {
    const previousQuizzesRaw = scenario.get<Quiz[]>(aliasRandomQuizzesRaw) || [];

    scenario.set(aliasRandomQuizzesRaw, previousQuizzesRaw.concat(items));
};

const getTopicIdsFromRandomTopicAlias = (scenario: ScenarioContext) => {
    const ids = scenario.get<Topic[]>(aliasRandomTopics).map((topic) => topic.id);

    return ids;
};

export const schoolAdminCreateRandomExamLOsAndSetContext = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    options: Omit<CreateRandomExamLOPayload, 'topicId'> & {
        quantity?: number;
        topicId?: string;
    } = {}
) => {
    const { quantity, topicId, timeLimit, manualGrading, gradeToPass } = options;

    const finalTopicId = topicId || getTopicIdsFromRandomTopicAlias(scenario)[0];

    const {
        request: { learningObjectivesList: examLOs },
    } = await createRandomLearningObjectives(cms, {
        quantity,
        topicId: finalTopicId,
        type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO,
        // TODO: Just is a trick, in the future we don't need to it so we will remove
        displayOrderFrom: 5,
        timeLimit: timeLimit,
        manualGrading: manualGrading,
        gradeToPass: gradeToPass,
    });

    scenario.set(aliasExamLOName, examLOs[0].name);
    // TODO: Consider set randomExamLOs alias

    return examLOs;
};

export const schoolAdminCreateRandomLOsAndSetContext = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    options: Omit<CreateRandomLearningObjectivePayload, 'topicId'> & {
        quantity?: number;
        topicId?: string;
    } = {}
) => {
    const { quantity, topicId, studyGuide } = options;

    const finalTopicId = topicId || getTopicIdsFromRandomTopicAlias(scenario)[0];

    const {
        request: { learningObjectivesList: learningObjectives },
    } = await createRandomLearningObjectives(cms, {
        quantity,
        topicId: finalTopicId,
        type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING,
        shouldHaveMaterial: Boolean(studyGuide),
        displayOrderFrom: 10,
    });

    const { name, learningMaterialId } = learningObjectives[0];
    scenario.set(aliasLOName, name);
    scenario.set(aliasLOId, learningMaterialId);
    scenario.set(aliasRandomLOs, learningObjectives);

    return learningObjectives;
};

export const schoolAdminCreateRandomFlashcardsAndSetContext = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    options: Omit<CreateRandomFlashcardPayload, 'topicId'> & {
        quantity?: number;
        topicId?: string;
    } = {}
) => {
    const { quantity, topicId } = options;

    const finalTopicId = topicId || getTopicIdsFromRandomTopicAlias(scenario)[0];

    const {
        request: { learningObjectivesList: flashcards },
    } = await createRandomLearningObjectives(cms, {
        quantity,
        topicId: finalTopicId,
        type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD,
        displayOrderFrom: 15,
    });

    scenario.set(aliasFlashcardName, flashcards[0].name);
    // TODO: Consider set randomFlashcards alias

    return flashcards;
};

export const schoolAdminCreateRandomAssignmentAndSetContext = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    options: Omit<CreateRandomAssignmentPayload, 'topicId'> & {
        quantity?: number;
        topicId?: string;
    } = {}
) => {
    const { topicId, quantity } = options;

    const finalTopicId = topicId || getTopicIdsFromRandomTopicAlias(scenario)[0];

    const {
        request: { assignmentsList },
    } = await createRandomAssignments(cms, {
        quantity,
        topicId: finalTopicId,
        displayOrderFrom: 20,
        ...options,
    });

    scenario.set(aliasAssignmentName, assignmentsList[0].name);
    scenario.set(aliasRandomAssignments, assignmentsList);

    return assignmentsList;
};

export const schoolAdminCreateRandomTaskAssignmentAndSetContext = async (
    cms: CMSInterface,
    scenario: ScenarioContext,
    options: Omit<CreateRandomTaskAssignmentPayload, 'topicId'> & {
        quantity?: number;
        topicId?: string;
    } = {}
) => {
    const {
        topicId,
        quantity,
        requireCorrectness,
        requireUnderstandingLevel,
        requireAssignmentNote,
        requireAttachment,
        requireDuration,
    } = options;

    const finalTopicId = topicId || getTopicIdsFromRandomTopicAlias(scenario)[0];

    const {
        request: { assignmentsList: taskAssignments },
    } = await createRandomAssignments(cms, {
        quantity,
        topicId: finalTopicId,
        type: KeyAssignmentType.ASSIGNMENT_TYPE_TASK,
        displayOrderFrom: 25,
        requireCorrectness,
        requireUnderstandingLevel,
        requireAssignmentNote,
        requireAttachment,
        requireDuration,
    });

    scenario.set(aliasTaskAssignmentName, taskAssignments[0].name);
    scenario.set(aliasRandomTaskAssignments, taskAssignments);

    return taskAssignments;
};

export const createRandomCardsInFlashCard = async (
    cms: CMSInterface,
    flashcardId: string,
    cards: Quiz[]
) => {
    const token = await cms.getToken();

    const shouldUseUpsertFlashcardContent = await schoolAdminShouldUseUpsertFlashcardContent();

    if (shouldUseUpsertFlashcardContent) {
        const { request } = await quizClientService.upsertFlashcardContent(token, {
            kind: QuizType.QUIZ_TYPE_POW,
            flashcardId,
            quizzes: cards,
        });

        return request.quizzesList;
    }

    const { request } = await quizModifierService.upsertQuizV2(token, {
        kind: QuizType.QUIZ_TYPE_POW,
        quizes: cards,
    });

    return request.quizzesList;
};

export const createRandomQuestions = async (cms: CMSInterface, questions: Quiz[]) => {
    const token = await cms.getToken();

    return asyncForEach(questions, async (question) => {
        await quizModifierService.upsertSingleQuiz(token, {
            quiz: question,
        });
    });
};

/* 
FEEDBACK: 
    I want create n question with random type(Hieu)
*/
export const schoolAdminCreateRandomQuestionsAndSetContext = async (
    cms: CMSInterface,
    // TODO: Tracking to set alias later
    _scenario: ScenarioContext,
    options: {
        parentId: string;
        quantity?: number;
        questions?: Quiz[];
        type?: keyof typeof KeyQuizType | (() => keyof typeof KeyQuizType);
        point?: number;
    }
) => {
    const { quantity = 1, questions, parentId, type = 'QUIZ_TYPE_FIB', point = 1 } = options;

    const { schoolId } = await cms.getContentBasic();

    const getQuestionType = () => {
        if (typeof type === 'function') return type();
        return type;
    };

    const finalQuestions =
        questions ||
        createNumberArrayWithLength(quantity).map(() => {
            const questionType = getQuestionType();
            const externalId = genId();

            return createQuizContent(
                {
                    externalId,
                    kind: QuizType[questionType],
                    difficultyLevel: 1,
                    schoolId,
                    loId: parentId,
                },
                {
                    question: {
                        raw: `Question ${questionType} ${genId()}`,
                        rendered: '',
                    },
                    // TODO: I will check and rm in the next PR
                    shouldCreateFIBWithOneAnswer: true,
                    point: point,
                }
            );
        });

    await createRandomQuestions(cms, finalQuestions);

    return {
        quizRaws: finalQuestions,
        names: finalQuestions.map(({ question }) => question!.raw),
    };
};

export const schoolAdminCreateRandomCardsInFlashcardAndSetContext = async (
    cms: CMSInterface,
    // TODO: Tracking to set alias later
    _scenario: ScenarioContext,
    options: {
        flashcardId: string;
        quantity?: number;
        cards?: Quiz[];
    }
) => {
    const { quantity = 1, cards, flashcardId } = options;

    const { schoolId } = await cms.getContentBasic();
    const shouldUseUpsertFlashcardContent = await schoolAdminShouldUseUpsertFlashcardContent();

    const finalCards =
        cards ||
        createNumberArrayWithLength(quantity).map(() => {
            return createQuizContent(
                {
                    externalId: genId(),
                    kind: QuizType.QUIZ_TYPE_POW,
                    difficultyLevel: 1,
                    schoolId,
                    loId: flashcardId,
                },
                {
                    applyHandwriting: shouldUseUpsertFlashcardContent,
                }
            );
        });

    await createRandomCardsInFlashCard(cms, flashcardId, finalCards);

    return {
        quizRaws: finalCards,
    };
};
