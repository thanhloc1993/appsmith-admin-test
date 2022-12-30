import { getSchoolAdminTenantInterfaceFromRole } from '@legacy-step-definitions/utils';

import { CMSInterface, IMasterWorld, SchoolAdminRolesWithTenant } from '@supports/app-types';
import { Menu } from '@supports/enum';
import {
    KeyAssignmentType,
    KeyLearningObjectiveType,
    LearningObjectiveType,
} from '@supports/services/bob-course/const';
import { convertUpsertQuizRequestToQuiz, Quiz } from '@supports/services/common/quiz';
import { KeyQuizType } from '@supports/services/yasuo-course/const';
import { CreatedAContentBookOption } from '@supports/types/cms-types';

import {
    aliasAssignmentName,
    aliasBookIds,
    aliasChapterName,
    aliasChapterNames,
    aliasContentBookLOQuestionQuantity,
    aliasContentBookLOQuestionType,
    aliasExamLOName,
    aliasFlashcardName,
    aliasLOName,
    aliasQuizQuestionNames,
    aliasRandomAssignments,
    aliasRandomBooks,
    aliasRandomChapters,
    aliasRandomLearningObjectives,
    aliasRandomQuizzes,
    aliasRandomStudyPlanItems,
    aliasRandomTaskAssignments,
    aliasRandomTopics,
    aliasTaskAssignmentName,
    aliasTopicName,
    aliasTopicNames,
} from './alias-keys/syllabus';
import { chapterItem, topicItem } from './cms-selectors/cms-keys';
import {
    createRandomAssignments,
    createRandomBookByGRPC,
    createRandomChapters,
    createRandomQuiz,
    createRandomTopics,
} from './syllabus-content-book-create-definitions';
import { createRandomLearningObjectives } from './syllabus-learning-objectives-create-definitions';
import { getQuizTypeValue } from './syllabus-utils';
import {
    Assignment,
    Book,
    Chapter,
    CreatedTenantContentBookReturn,
    LearningObjective,
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export async function schoolAdminTenantHasCreatedAContentBook(
    masterWorld: IMasterWorld,
    schoolAdminRole: SchoolAdminRolesWithTenant,
    options?: CreatedAContentBookOption
): Promise<CreatedTenantContentBookReturn> {
    const context = masterWorld.scenario;
    const defaultOptions: Required<CreatedAContentBookOption> = {
        chapterQuantity: 1,
        topicQuantity: 1,
        learningObjectiveQuantity: 1,
        assignmentQuantity: 1,
        questionQuantity: 3,
        taskAssignmentQuantity: 0,
        loWithMaterialQuantity: 0,
        assignmentNotRequireGradeQuantity: 0,
        taskAssignmentWithCorrectnessQuantity: 0,
        enabledFIBHandwritingAnswer: false,
        enabledCourseStatistics: false,
    };
    const safeOptions = options ? options : {};
    const {
        chapterQuantity,
        topicQuantity,
        learningObjectiveQuantity,
        assignmentQuantity,
        questionQuantity,
        taskAssignmentQuantity,
    }: CreatedAContentBookOption = { ...defaultOptions, ...safeOptions };

    let studyPlanItemList: StudyPlanItem[] = [];
    const loQuizType = KeyQuizType.QUIZ_TYPE_FIB;
    const flashcardQuizType = KeyQuizType.QUIZ_TYPE_POW;
    const cms = getSchoolAdminTenantInterfaceFromRole(masterWorld, schoolAdminRole);

    await cms.instruction('creates a book by calling gRPC', async function (this: CMSInterface) {
        const {
            request: { booksList },
        } = await createRandomBookByGRPC(this, context);

        const bookIds = booksList.map((item) => item.bookId);
        context.set(aliasRandomBooks, booksList);
        context.set(aliasBookIds, bookIds);
    });

    const bookList = context.get<Book[]>(aliasRandomBooks);
    await cms.instruction('creates chapters by calling gRPC', async function (this: CMSInterface) {
        const book = bookList[0];
        const {
            request: { chaptersList },
        } = await createRandomChapters(
            this,
            {
                bookId: book.bookId,
            },
            { quantity: chapterQuantity }
        );
        const chapterNames: string[] = chaptersList.map((chapter) => chapter.info!.name);
        context.set(aliasChapterNames, chapterNames);
        context.set(aliasChapterName, chaptersList[0].info!.name);
        context.set(aliasRandomChapters, chaptersList);
    });

    const chaptersList = context.get<Chapter[]>(aliasRandomChapters);

    await cms.instruction(
        'creates topics for each chapter by calling gRPC',
        async function (this: CMSInterface) {
            const chapters = context.get<Chapter[]>(aliasRandomChapters);
            const topicReturns = await Promise.all(
                chapters.map(({ info }) =>
                    createRandomTopics(this, { quantity: topicQuantity, chapterId: info!.id })
                )
            );
            const topics = topicReturns
                .map(({ request: { topicsList } }) => topicsList)
                .reduce((previous, current) => previous.concat(current), []);

            context.set(aliasTopicName, topics[0].name);
            context.set(aliasRandomTopics, topics);

            const topicNames: string[] = topics.map((topic) => topic.name);
            context.set(aliasTopicNames, topicNames);
        }
    );

    const topicList = context.get<Topic[]>(aliasRandomTopics);

    if (learningObjectiveQuantity > 0) {
        await cms.instruction(
            'creates learning objectives for each topic by calling gRPC',
            async function (this: CMSInterface) {
                const learningObjectiveReturns = await Promise.all(
                    topicList.map(async ({ id }) => {
                        const {
                            request: { learningObjectivesList: learningObjectives },
                        } = await createRandomLearningObjectives(this, {
                            quantity: learningObjectiveQuantity,
                            topicId: id,
                            type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING,
                        });
                        const {
                            request: { learningObjectivesList: flashCards },
                        } = await createRandomLearningObjectives(this, {
                            quantity: learningObjectiveQuantity,
                            topicId: id,
                            type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD,
                            displayOrderFrom: learningObjectives.length + 1,
                        });
                        const {
                            request: { learningObjectivesList: examLOs },
                        } = await createRandomLearningObjectives(this, {
                            quantity: learningObjectiveQuantity,
                            topicId: id,
                            type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO,
                            displayOrderFrom: learningObjectives.length + flashCards.length + 1,
                        });
                        return [...learningObjectives, ...flashCards, ...examLOs];
                    })
                );
                const learningObjectives = learningObjectiveReturns.reduce(
                    (previous, current) => previous.concat(current),
                    []
                );

                context.set(aliasLOName, learningObjectives[0].info!.name);
                const learningObjectiveNames: string[] = [];
                const flashCardNames: string[] = [];
                const examLONames: string[] = [];

                learningObjectives.forEach(({ info, type }) => {
                    const name = info!.name;
                    switch (type) {
                        case LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD:
                            flashCardNames.push(name);
                            break;
                        case LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING:
                            learningObjectiveNames.push(name);
                            break;
                        case LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO:
                            examLONames.push(name);
                            break;
                    }
                });

                context.set(aliasLOName, learningObjectiveNames[0]);
                context.set(aliasFlashcardName, flashCardNames[0]);
                context.set(aliasExamLOName, examLONames[0]);
                context.set(aliasRandomLearningObjectives, learningObjectives);
                context.set(aliasRandomStudyPlanItems, learningObjectives);
            }
        );
    }

    if (assignmentQuantity > 0) {
        await cms.instruction(
            'creates assignments for each topic by calling gRPC',
            async function (this: CMSInterface) {
                const learningObjectives =
                    context.get<LearningObjective[]>(aliasRandomLearningObjectives) || [];
                const studyPlanItems =
                    context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];
                const assignmentReturns: Assignment[][] = await Promise.all(
                    topicList.map(async ({ id }) => {
                        const displayOrderFrom =
                            learningObjectives.filter(({ topicId }) => topicId === id).length + 1;
                        const {
                            request: { assignmentsList },
                        } = await createRandomAssignments(this, {
                            quantity: assignmentQuantity,
                            topicId: id,
                            displayOrderFrom,
                        });

                        return assignmentsList;
                    })
                );
                const assignments = assignmentReturns.reduce(
                    (previous, current) => previous.concat(current),
                    []
                );

                context.set(aliasAssignmentName, assignments[0].name);
                context.set(aliasRandomAssignments, assignments);

                studyPlanItemList = [...studyPlanItems, ...assignments];
                context.set(aliasRandomStudyPlanItems, studyPlanItemList);
            }
        );
    }

    if (taskAssignmentQuantity > 0) {
        await cms.instruction(
            'creates task assignments for each topic by calling gRPC',
            async function (this: CMSInterface) {
                const learningObjectives =
                    context.get<LearningObjective[]>(aliasRandomLearningObjectives) || [];
                const assignments = context.get<Assignment[]>(aliasRandomAssignments) || [];
                const studyPlanItems =
                    context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];
                const taskAssignmentReturns = await Promise.all(
                    topicList.map(async ({ id }) => {
                        const displayOrderFrom =
                            learningObjectives.filter(({ topicId }) => topicId === id).length +
                            assignments.filter(({ content }) => content?.topicId === id).length +
                            1;

                        const {
                            request: { assignmentsList },
                        } = await createRandomAssignments(this, {
                            quantity: taskAssignmentQuantity,
                            topicId: id,
                            displayOrderFrom,
                            type: KeyAssignmentType.ASSIGNMENT_TYPE_TASK,
                            maxGrade: 0,
                        });

                        return assignmentsList;
                    })
                );
                const taskAssignments = taskAssignmentReturns.reduce(
                    (previous, current) => previous.concat(current),
                    []
                );

                context.set(aliasTaskAssignmentName, taskAssignments[0].name);
                context.set(aliasRandomTaskAssignments, taskAssignments);

                studyPlanItemList = [...studyPlanItems, ...taskAssignments];
                context.set(aliasRandomStudyPlanItems, studyPlanItemList);
            }
        );
    }

    await cms.instruction(
        'creates questions for each learning objective and flashcard by calling gRPC',
        async function (this: CMSInterface) {
            const learningObjectives = (
                context.get<LearningObjective[]>(aliasRandomLearningObjectives) || []
            ).filter(
                ({ type }) =>
                    type === LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING ||
                    type === LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO ||
                    type === LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD
            );
            const quizReturns = await Promise.all(
                learningObjectives.map(async ({ info: { id }, type }) => {
                    const quizType =
                        type === LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD
                            ? flashcardQuizType
                            : loQuizType;

                    let quizzes: Quiz[] = [];

                    for (let i = 0; i < questionQuantity; i++) {
                        const { request } = await createRandomQuiz(this, {
                            learningObjectiveId: id,
                            type: quizType,
                        });

                        quizzes = [...quizzes, ...convertUpsertQuizRequestToQuiz(request)];
                    }

                    return quizzes;
                })
            );
            const quizzes = quizReturns.reduce((previous, current) => previous.concat(current), []);
            const quizzesName = quizzes.map((quiz) => quiz.externalId);
            context.set(aliasRandomQuizzes, quizzes);
            context.set(aliasQuizQuestionNames, quizzesName);
            context.set(aliasContentBookLOQuestionQuantity, questionQuantity);
            const quizTypeKey = loQuizType;
            const { quizTypeTitle } = getQuizTypeValue({ quizTypeKey });
            context.set(aliasContentBookLOQuestionType, quizTypeTitle);
        }
    );

    return {
        bookList,
        chaptersList,
        topicList,
        studyPlanItemList,
    };
}

export async function schoolAdminIsOnBookDetailsPageWithBookName(
    cms: CMSInterface,
    bookName: string
) {
    await cms.schoolAdminIsOnThePage(Menu.BOOKS, 'Book');
    await cms.searchInFilter(bookName);
    await cms.waitForSkeletonLoading();

    await cms.page!.click(`[title="${bookName}"]`);
    await cms.assertThePageTitle(`${bookName}`);
}

export async function schoolAdminCanNotSeeBook(cms: CMSInterface, bookName: string) {
    await cms.schoolAdminIsOnThePage(Menu.BOOKS, 'Book');
    await cms.searchInFilter(bookName);
    await cms.waitForSkeletonLoading();

    await cms.page!.waitForSelector(`[title="${bookName}"]`, { state: 'hidden' });
}

export async function schoolAdminSeeCreatedTopicWithTopicName(
    cms: CMSInterface,
    topicName: string
): Promise<void> {
    if (!topicName) {
        throw Error('Can not find the created topic');
    }

    await cms.page!.waitForSelector(topicItem(topicName));
}

export async function schoolAdminSeeCreatedChapterWithChapterName(
    cms: CMSInterface,
    chapterName: string
): Promise<void> {
    if (!chapterName) {
        throw Error('Can not find the created chapter');
    }

    await cms.page!.waitForSelector(chapterItem(chapterName));
}
