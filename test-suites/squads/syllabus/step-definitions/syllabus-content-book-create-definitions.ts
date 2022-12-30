import { genId } from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';

import { CMSInterface, LearnerInterface } from '@supports/app-types';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { ILearningMaterialBase } from '@supports/services/common/learning-material';
import {
    convertUpsertQuizRequestToQuiz,
    createQuizContent,
    Quiz,
} from '@supports/services/common/quiz';
import {
    assignmentModifierService,
    assignmentModifierServiceV2,
} from '@supports/services/eureka/assignment';
import NsAssignmentModifierServiceRequest from '@supports/services/eureka/assignment/request-types';
import { bookModifierService } from '@supports/services/eureka/book';
import { chapterModifierService } from '@supports/services/eureka/chapter';
import { quizClientService, quizModifierService } from '@supports/services/eureka/quiz';
import { topicModifierService } from '@supports/services/eureka/topic';

import {
    KeyAssignmentType,
    KeyLearningObjectiveType,
    LearningObjectiveType,
} from '@services/bob-course/const';
import NsBobCourseServiceRequest from '@services/bob-course/request-types';
import NsEurekaAssignmentModifierServiceRequest from '@services/eureka-assignment-modifier/request-types';
import { KeyQuizType } from '@services/yasuo-course/const';
import NsYasuoCourseServiceRequest from '@services/yasuo-course/request-types';

import {
    aliasAssignmentNotRequireGradeName,
    aliasBookDetailsPage,
    aliasBookName,
    aliasChapterName,
    aliasChapterNames,
    aliasContentBookLOQuestionQuantity,
    aliasContentBookLOQuestionType,
    aliasLOWithMaterialName,
    aliasQuestionFIBList,
    aliasQuizAnswerByQuestionName,
    aliasQuizQuestionNames,
    aliasQuizzesByLOName,
    aliasRandomAssignmentNotRequireGrades,
    aliasRandomAssignments,
    aliasRandomBooks,
    aliasRandomChapters,
    aliasRandomLearningObjectives,
    aliasRandomLearningObjectivesWithMaterial,
    aliasRandomQuizzes,
    aliasRandomStudyPlanItems,
    aliasRandomTaskAssignments,
    aliasRandomTaskAssignmentsWithCorrectness,
    aliasRandomTopics,
    aliasTaskAssignmentWithCorrectnessName,
    aliasTopicNames,
} from './alias-keys/syllabus';
import { schoolAdminWaitingBookDetailPage } from './book-definitions';
import {
    chapterItem,
    chapterItemRoot,
    createTopicButton,
    expandedItem,
    formInput,
    quizAnswerBox,
    quizQuestionBox,
    textBox,
    topicItem,
} from './cms-selectors/cms-keys';
import { chapterFormSubmit } from './cms-selectors/syllabus';
import {
    createRandomAssignment,
    createRandomTaskAssignment,
} from './create-data-book-content-utils';
import { createRandomLearningObjectives } from './syllabus-learning-objectives-create-definitions';
import {
    schoolAdminShouldUseInsertAssignment,
    schoolAdminShouldUseUpsertFlashcardContent,
} from './syllabus-migration-temp';
import {
    getLOTypeValue,
    getQuizTypeValue,
    schoolAdminUploadAvatarInput,
    studentSeeChapterList,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { QuizType } from 'manabuf/common/v1/contents_pb';
import { AssignmentType } from 'manabuf/eureka/v1/enums_pb';
import {
    Assignment,
    LearningObjective,
    StudyPlanItem,
    Topic,
    TopicForm,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

//TODO: Refactor to remove the context param
export async function schoolAdminIsOnBookDetailsPage(cms: CMSInterface, context: ScenarioContext) {
    const cmsPage = cms.page!;
    const bookName = context.get(aliasBookName);

    await cms.schoolAdminIsOnThePage(Menu.BOOKS, 'Book');

    await cms.searchInFilter(bookName);
    await cms.waitForSkeletonLoading();

    await cmsPage.click(`[title="${bookName}"]`);

    await schoolAdminWaitingBookDetailPage(cms, bookName);

    context.set(aliasBookDetailsPage, cmsPage.url());
}

export async function schoolAdminCreateABook(cms: CMSInterface, bookName?: string) {
    await cms.selectAButtonByAriaLabel(`Create`);

    if (bookName) await schoolAdminFillBookForm(cms, bookName);

    await cms.selectAButtonByAriaLabel(`Save`);
}

export const schoolAdminSeeTotalNChapterItemInBookDetail = async (
    cms: CMSInterface,
    quantity: number
) => {
    const elements = await cms.page?.$$(chapterItemRoot);

    weExpect(elements, `Expect book detail should have ${quantity} chapters`).toHaveLength(
        quantity
    );
};

export const schoolAdminFillBookForm = async (cms: CMSInterface, bookName: string) => {
    await cms.instruction(
        `School admin fill data to create a book name = ${bookName}`,
        async function (this: CMSInterface) {
            const cms = this.page!;
            await cms.fill(`#name`, bookName);
        }
    );
};

export async function schoolAdminCreateAChapter(
    cms: CMSInterface,
    chapterName?: string
): Promise<void> {
    await cms.page!.click(`[data-testid="ChapterForm__visibleFormControl"]`);

    if (chapterName) await schoolAdminFillChapterData(cms, chapterName);

    await cms.page!.click(chapterFormSubmit);
}

export async function schoolAdminFillChapterData(
    cms: CMSInterface,
    chapterName: string
): Promise<void> {
    await cms.instruction(
        `School admin fill data to create a chapter name = ${chapterName}`,
        async function (this: CMSInterface) {
            const cms = this.page!;
            await cms.fill(formInput, chapterName);
        }
    );
}

export const schoolAdminClickCreateTopicInChapter = async (
    cms: CMSInterface,
    chapterName: string
) => {
    const createTopicBtn = await cms
        .page!.waitForSelector(chapterItem(chapterName))
        .then((chapterRow) => chapterRow.waitForSelector(createTopicButton));

    await createTopicBtn.click();
};

export async function schoolAdminCreateATopic(
    cms: CMSInterface,
    chapterName: string,
    topic: TopicForm
) {
    await schoolAdminClickCreateTopicInChapter(cms, chapterName);

    await schoolAdminFillTopicForm(cms, topic);

    await cms.selectAButtonByAriaLabel(`Save`);
}

export async function schoolAdminFillTopicForm(cms: CMSInterface, topic: TopicForm): Promise<void> {
    const { icon, name } = topic;

    await cms.instruction(`School admin fill data to create a topic name = ${name}`, async () => {
        await cms.page?.fill(formInput, name);
    });

    if (icon) await schoolAdminUploadAvatarInput(cms);
}

export async function schoolAdminFillFlashCardQuestionData(cms: CMSInterface): Promise<void> {
    await cms.instruction(
        `school admin fill data for creating flashcard question`,
        async function () {
            const page = cms.page!;
            const questionEditor = await page
                .waitForSelector(quizQuestionBox)
                .then((questionArea) => questionArea.waitForSelector(textBox));

            await questionEditor.fill(`Term ${genId()}`);

            const answerEditor = await page
                .waitForSelector(quizAnswerBox)
                .then((explanationArea) => explanationArea.waitForSelector(textBox));

            await answerEditor.fill(`Answer ${genId()}`);
        }
    );

    await cms.selectAButtonByAriaLabel(`Save`);
}

export async function expandAllChapters(cms: CMSInterface, context: ScenarioContext) {
    if (context.has(aliasChapterNames)) {
        const chapters = context.get<string[]>(aliasChapterNames);
        for (let i = 0; i < chapters.length; i++) {
            const chapterName = chapters[i];
            await expandAChapter(cms, chapterName);
        }
    }
}

export async function expandAChapter(cms: CMSInterface, chapterName: string) {
    await cms.instruction(`expand chapter ${chapterName}`, async function () {
        const chapterRow = await cms.page!.waitForSelector(chapterItem(chapterName));
        const expanded = await chapterRow.$(expandedItem);
        if (!expanded) {
            await chapterRow.click();
        }
    });
}

export async function expandATopic(cms: CMSInterface, topicName: string) {
    await cms.instruction(`expand topic ${topicName}`, async function () {
        const topicRow = await cms.page!.waitForSelector(topicItem(topicName));
        const expanded = await topicRow.$(expandedItem);
        if (!expanded) {
            await topicRow.click();
        }
    });
}

export async function expandAllChaptersTopics(cms: CMSInterface, context: ScenarioContext) {
    await expandAllChapters(cms, context);

    if (context.has(aliasTopicNames)) {
        const topics = context.get<string[]>(aliasTopicNames);
        for (let i = 0; i < topics.length; i++) {
            await expandATopic(cms, topics[i]);
        }
    }
}

export async function studentSeeChapter(learner: LearnerInterface, chapterName: string) {
    const listKey = new ByValueKey(SyllabusLearnerKeys.chapter_with_topic_list);
    const chapterKey = new ByValueKey(SyllabusLearnerKeys.chapter(chapterName));

    await learner.instruction(`Assert chapter name: ${chapterName}`, async function () {
        await studentSeeChapterList(learner);
        await learner.flutterDriver!.scrollUntilVisible(listKey, chapterKey, 0.0, 0.0, -100);
    });
}

export async function createRandomBookByGRPC(
    cms: CMSInterface,
    context: ScenarioContext,
    quantity = 1
) {
    if (quantity < 1) throw Error("Can't create random book with quantity less than 1");

    const [token, { schoolId }] = await Promise.all([cms.getToken(), cms.getContentBasic()]);

    const bookList = [...Array(quantity)].map<NsYasuoCourseServiceRequest.UpsertBooks>(() => {
        const bookId = genId();
        const name = `Book ${bookId}`;

        return {
            bookId,
            name,
            schoolId,
            chapterIdsList: [],
        };
    });

    const { request, response } = await bookModifierService.upsertBooks(bookList, token);

    const bookName = request.booksList[0].name;
    context.set(aliasBookName, bookName);

    return { request, response };
}

export const createRandomChapters = async (
    cms: CMSInterface,
    payload: { bookId: string; displayOrderFrom?: number },
    options: {
        quantity?: number;
    } = {}
) => {
    const { quantity = 1 } = options;
    const { bookId, displayOrderFrom = 1 } = payload;

    if (quantity < 1) throw new Error("Can't create chapters with quantity less than 1");

    const [token, { schoolId }] = await Promise.all([cms.getToken(), cms.getContentBasic()]);

    const chapters = [...Array(quantity)].map<NsYasuoCourseServiceRequest.UpsertChapters[0]>(
        (_, index) => {
            const id = genId();

            return {
                chapterId: id,
                chapterName: `Chapter ${id}`,
                displayOrder: displayOrderFrom + index,
                schoolId,
            };
        }
    );

    return await chapterModifierService.upsertChapters(token, bookId, chapters);
};

export async function createRandomTopics(
    cms: CMSInterface,
    {
        quantity = 1,
        chapterId,
        displayOrderFrom = 1,
    }: { quantity?: number; chapterId: string; displayOrderFrom?: number }
) {
    if (quantity < 1) throw new Error("Can't create topics with quantity less than 1");

    const [token, { iconUrl, schoolId }] = await Promise.all([
        cms.getToken(),
        cms.getContentBasic(),
    ]);
    const topics = [...Array(quantity)].map<NsBobCourseServiceRequest.UpsertTopics>((_, index) => {
        const id = genId();

        return {
            id,
            name: `Topic ${id}`,
            displayOrder: displayOrderFrom + index,
            iconUrl,
            chapterId,
            schoolId,
        };
    });

    return await topicModifierService.upsertTopics(token, topics);
}

type CreateRandomAssignmentsReturnType = Promise<{
    request: { assignmentsList: (ILearningMaterialBase & Assignment)[] };
}>;

export async function createRandomAssignments(
    cms: CMSInterface,
    {
        quantity = 1,
        topicId,
        displayOrderFrom = 1,
        allowResubmission = false,
        requireCorrectness = false,
        requireVideoSubmission = false,
        attachmentsList = [],
        maxGrade = 10,
        type = KeyAssignmentType.ASSIGNMENT_TYPE_LEARNING_OBJECTIVE,
        requireUnderstandingLevel,
        requireAssignmentNote,
        requireAttachment,
        requireDuration,
    }: {
        quantity?: number;
        topicId: string;
        displayOrderFrom?: number;
        allowResubmission?: boolean;
        requireCorrectness?: boolean;
        requireVideoSubmission?: boolean;
        attachmentsList?: string[];
        maxGrade?: number;
        type?: keyof typeof KeyAssignmentType;
        requireUnderstandingLevel?: boolean;
        requireAssignmentNote?: boolean;
        requireAttachment?: boolean;
        requireDuration?: boolean;
    }
): CreateRandomAssignmentsReturnType {
    if (quantity < 1) throw new Error("Can't create assignments with quantity less than 1");

    const { loTypeTitle } = getLOTypeValue({ loTypeKey: type });

    const assignmentType = AssignmentType[type];

    const shouldUseInsertAssignment = await schoolAdminShouldUseInsertAssignment();
    if (shouldUseInsertAssignment && type === 'ASSIGNMENT_TYPE_LEARNING_OBJECTIVE') {
        const assignments = await createRandomAssignment(
            cms,
            {
                topicId,
                allowResubmission,
                maxGrade,
            },
            {
                quantity,
            }
        );

        return {
            request: {
                assignmentsList: assignments,
            },
        };
    }

    if (shouldUseInsertAssignment && type === 'ASSIGNMENT_TYPE_TASK') {
        const taskAssignments = await createRandomTaskAssignment(
            cms,
            {
                topicId,
                requireCorrectness,
                requireUnderstandingLevel,
                requireAssignmentNote,
                requireAttachment,
                requireDuration,
            },
            { quantity }
        );

        return {
            request: {
                assignmentsList: taskAssignments,
            },
        };
    }

    const token = await cms.getToken();

    const assignments = [
        ...Array(quantity),
    ].map<NsEurekaAssignmentModifierServiceRequest.UpsertAssignments>((_, index) => {
        const id = genId();

        return {
            assignmentId: id,
            name: `${loTypeTitle} ${id}`,
            content: { topicId, loIdList: [] },
            attachmentsList,
            maxGrade,
            assignmentType,
            instruction: `${loTypeTitle} instruction`,
            displayOrder: displayOrderFrom + index,
            requiredGrade: true,
            setting: {
                allowLateSubmission: false,
                allowResubmission,
                requireAssignmentNote: requireAssignmentNote || false,
                requireAttachment: requireAttachment || false,
                requireVideoSubmission,
                requireCompleteDate: assignmentType === AssignmentType.ASSIGNMENT_TYPE_TASK,
                requireCorrectness,
                requireDuration: requireDuration || false,
                requireUnderstandingLevel: requireUnderstandingLevel || false,
            },
        };
    });

    const { request } = await assignmentModifierService.upsertAssignments(token, assignments);

    return {
        request: {
            assignmentsList: request.assignmentsList.map((assignment) => {
                const { assignmentId, name } = assignment;

                const learningMaterial: ILearningMaterialBase = {
                    learningMaterialId: assignmentId,
                    name,
                    topicId,
                    // TODO: Hard code because we don't use it for now
                    typeForLM: 'LEARNING_MATERIAL_LEARNING_OBJECTIVE',
                };

                return {
                    ...learningMaterial,
                    ...assignment,
                };
            }),
        },
    };
}

// Please restrict using this function, we can create data we want instead of update it after create
export const schoolAdminUpdateAssignmentViaGrpc = async (
    cms: CMSInterface,
    payload: NsAssignmentModifierServiceRequest.UpdateAssignment
) => {
    const token = await cms.getToken();

    assignmentModifierServiceV2.updateAssignment(token, payload);
};

export async function createRandomQuiz(
    cms: CMSInterface,
    {
        learningObjectiveId,
        type,
        shouldCreateFIBWithOneAnswer,
    }: {
        learningObjectiveId: string;
        type: keyof typeof KeyQuizType;
        shouldCreateFIBWithOneAnswer?: boolean;
    }
) {
    const [token, { id, schoolId }] = await Promise.all([cms.getToken(), cms.getContentBasic()]);
    const shouldUseUpsertFlashcardContent = await schoolAdminShouldUseUpsertFlashcardContent();

    const kind = QuizType[type];

    const quiz = createQuizContent(
        {
            loId: learningObjectiveId,
            externalId: id,
            difficultyLevel: 1,
            kind,
            schoolId,
        },
        {
            shouldCreateFIBWithOneAnswer,
            applyHandwriting: shouldUseUpsertFlashcardContent,
        }
    );

    switch (kind) {
        case QuizType.QUIZ_TYPE_POW: {
            if (shouldUseUpsertFlashcardContent) {
                return quizClientService.upsertFlashcardContent(token, {
                    kind: QuizType.QUIZ_TYPE_POW,
                    flashcardId: learningObjectiveId,
                    quizzes: [quiz],
                });
            }

            return await quizModifierService.upsertQuizV2(token, {
                kind,
                quizes: [quiz],
            });
        }

        default: {
            return await quizModifierService.upsertSingleQuiz(token, {
                quiz: quiz,
            });
        }
    }
}

// TODO: Remove and use createRandomQuiz
export async function createQuizWithAnswer({
    learningObjectiveId,
    type,
    token,
    id,
    schoolId,
    answerContent,
}: {
    learningObjectiveId: string;
    type: keyof typeof KeyQuizType;
    token: string;
    id: string;
    schoolId: number;
    answerContent: string;
}) {
    const kind = QuizType[type];
    const shouldUseUpsertFlashcardContent = await schoolAdminShouldUseUpsertFlashcardContent();

    const quiz = createQuizContent(
        {
            loId: learningObjectiveId,
            externalId: id,
            difficultyLevel: 1,
            kind,
            schoolId,
            answerContent: answerContent,
        },
        { applyHandwriting: shouldUseUpsertFlashcardContent }
    );

    switch (kind) {
        case QuizType.QUIZ_TYPE_POW: {
            if (shouldUseUpsertFlashcardContent) {
                return quizClientService.upsertFlashcardContent(token, {
                    kind: QuizType.QUIZ_TYPE_POW,
                    flashcardId: learningObjectiveId,
                    quizzes: [quiz],
                });
            }

            return await quizModifierService.upsertQuizV2(token, {
                kind,
                quizes: [quiz],
            });
        }

        default: {
            return await quizModifierService.upsertSingleQuiz(token, {
                quiz: quiz,
            });
        }
    }
}

export async function schoolAdminHasCreatedAnEmptyBook(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    await cms.instruction(`An empty book is created`, async function (this: CMSInterface) {
        const {
            request: { booksList },
        } = await createRandomBookByGRPC(this, scenario);
        scenario.set(aliasRandomBooks, booksList);
    });
}

export async function schoolAdminHasCreatedNEmptyChapterInBook(
    cms: CMSInterface,
    scenario: ScenarioContext,
    quantity = 1
) {
    await cms.instruction(
        `A chapter and topic only book is created`,
        async function (this: CMSInterface) {
            const {
                request: { booksList: books },
            } = await createRandomBookByGRPC(this, scenario);
            scenario.set(aliasRandomBooks, books);

            const {
                request: { chaptersList },
            } = await createRandomChapters(this, { bookId: books[0].bookId }, { quantity });
            scenario.set(
                aliasChapterNames,
                chaptersList.map((chapter) => chapter.info!.name)
            );
            scenario.set(aliasRandomChapters, chaptersList);
            scenario.set(aliasChapterName, chaptersList[0].info!.name);
        }
    );
}

export async function schoolAdminHasCreatedAContentBook(
    cms: CMSInterface,
    scenario: ScenarioContext
) {
    await cms.instruction(`A content book is created`, async function (this: CMSInterface) {
        const {
            request: { booksList: books },
        } = await createRandomBookByGRPC(this, scenario);
        const {
            request: { chaptersList },
        } = await createRandomChapters(this, { bookId: books[0].bookId }, { quantity: 2 });
        scenario.set(
            aliasChapterNames,
            chaptersList.map((chapter) => chapter.info!.name)
        );

        const topicList: NsBobCourseServiceRequest.UpsertTopics[] = [];
        await Promise.all(
            chaptersList.map(async (chapter) => {
                const { request } = await createRandomTopics(this, {
                    quantity: 2,
                    chapterId: chapter.info!.id,
                });
                topicList.push(...request.topicsList);
            })
        );
        scenario.set(
            aliasTopicNames,
            topicList.map((topic) => topic.name)
        );

        await Promise.all(
            topicList.map(async (topic) => {
                const {
                    request: { learningObjectivesList: loList },
                } = await createRandomLearningObjectives(this, {
                    quantity: 1,
                    topicId: topic.id,
                    type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING,
                });

                loList.forEach(async (lo) => {
                    const learningObjectiveId = lo.info!.id;

                    await createRandomQuiz(this, {
                        learningObjectiveId,
                        type: KeyQuizType.QUIZ_TYPE_MCQ,
                    });
                    await createRandomQuiz(this, {
                        learningObjectiveId,
                        type: KeyQuizType.QUIZ_TYPE_FIB,
                    });
                });

                const {
                    request: { learningObjectivesList: flashcardList },
                } = await createRandomLearningObjectives(this, {
                    quantity: 1,
                    topicId: topic.id,
                    type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD,
                });

                flashcardList.forEach(async (flashcard) => {
                    const learningObjectiveId = flashcard.info!.id;

                    await createRandomQuiz(this, {
                        learningObjectiveId,
                        type: KeyQuizType.QUIZ_TYPE_POW,
                    });
                    await createRandomQuiz(this, {
                        learningObjectiveId,
                        type: KeyQuizType.QUIZ_TYPE_POW,
                    });
                });

                const {
                    request: { learningObjectivesList: examLOs },
                } = await createRandomLearningObjectives(this, {
                    quantity: 1,
                    topicId: topic.id,
                    type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO,
                });

                examLOs.forEach(async (examLO) => {
                    const learningObjectiveId = examLO.info!.id;

                    await createRandomQuiz(this, {
                        learningObjectiveId,
                        type: KeyQuizType.QUIZ_TYPE_FIB,
                    });
                    await createRandomQuiz(this, {
                        learningObjectiveId,
                        type: KeyQuizType.QUIZ_TYPE_FIB,
                    });
                });

                await createRandomAssignments(this, {
                    quantity: 1,
                    topicId: topic.id,
                });
            })
        );
    });
}

export const schoolAdminHasCreateQuizzesForLOsWithAnswer = async (
    cms: CMSInterface,
    context: ScenarioContext,
    questionQuantity: number,
    nonQuizLoName: string
) => {
    const learningObjectives = (
        context.get<LearningObjective[]>(aliasRandomLearningObjectives) || []
    ).filter(
        ({ type }) =>
            type === LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING ||
            type === LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO ||
            type === LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD
    );
    const loQuizType = KeyQuizType.QUIZ_TYPE_MCQ;
    const flashcardQuizType = KeyQuizType.QUIZ_TYPE_POW;
    const quizReturns = await Promise.all(
        learningObjectives.map(async ({ info: { id, name }, type }) => {
            const quizType =
                type === LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD
                    ? flashcardQuizType
                    : loQuizType;

            let quizzes: Quiz[] = [];
            const learningObjectiveId = id;

            if (name != nonQuizLoName) {
                for (let i = 0; i < questionQuantity; i++) {
                    const [token, { id, schoolId }] = await Promise.all([
                        cms.getToken(),
                        cms.getContentBasic(),
                    ]);
                    const answerContent = `Answer ${genId()}`;
                    context.set(aliasQuizAnswerByQuestionName(id), answerContent);
                    const { request } = await createQuizWithAnswer({
                        learningObjectiveId: learningObjectiveId,
                        type: quizType,
                        token: token,
                        id: id,
                        schoolId: schoolId,
                        answerContent: answerContent,
                    });

                    quizzes = [...quizzes, ...convertUpsertQuizRequestToQuiz(request)];
                }
            }

            context.set(aliasQuizzesByLOName(name), quizzes);

            return quizzes;
        })
    );
    const quizzes = quizReturns.reduce((previous, current) => previous.concat(current), []);
    const quizzesName = quizzes.map((quiz) => quiz.externalId);
    const questionFIBList = quizzes.filter((quiz) => quiz.kind === QuizType[loQuizType]);
    context.set(aliasRandomQuizzes, quizzes);
    context.set(aliasQuizQuestionNames, quizzesName);
    context.set(aliasContentBookLOQuestionQuantity, questionQuantity);
    context.set(aliasQuestionFIBList, questionFIBList);
    const quizTypeKey = loQuizType;
    const { quizTypeTitle } = getQuizTypeValue({ quizTypeKey });
    context.set(aliasContentBookLOQuestionType, quizTypeTitle);
};

export async function createRandomLearningObjectivesWithMaterial(
    cms: CMSInterface,
    context: ScenarioContext,
    studyPlanItemList: StudyPlanItem[],
    quantity: number
) {
    if (quantity < 1) return;

    const topicList = context.get<Topic[]>(aliasRandomTopics);
    const learningObjectives =
        context.get<LearningObjective[]>(aliasRandomLearningObjectives) || [];
    const assignments = context.get<Assignment[]>(aliasRandomAssignments) || [];
    const taskAssignments = context.get<Assignment[]>(aliasRandomTaskAssignments) || [];
    const studyPlanItems = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];

    await cms.instruction(
        'creates learning objectives with material for each topic by calling gRPC',
        async function (this: CMSInterface) {
            const learningObjectiveReturns = await Promise.all(
                topicList.map(async ({ id }) => {
                    const displayOrderFrom =
                        learningObjectives.filter(({ topicId }) => topicId === id).length +
                        assignments.filter(({ content }) => content?.topicId === id).length +
                        taskAssignments.filter(({ content }) => content?.topicId === id).length +
                        1;

                    const {
                        request: { learningObjectivesList: learningObjectivesWithMaterial },
                    } = await createRandomLearningObjectives(this, {
                        quantity,
                        topicId: id,
                        type: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING,
                        shouldHaveMaterial: true,
                        displayOrderFrom,
                    });

                    return learningObjectivesWithMaterial;
                })
            );
            const learningObjectivesWithMaterial = learningObjectiveReturns.reduce(
                (previous, current) => previous.concat(current),
                []
            );

            context.set(aliasLOWithMaterialName, learningObjectivesWithMaterial?.[0]?.info?.name);
            context.set(aliasRandomLearningObjectivesWithMaterial, learningObjectivesWithMaterial);

            studyPlanItemList = [
                ...studyPlanItems,
                ...learningObjectivesWithMaterial,
            ] as StudyPlanItem[];
            context.set(aliasRandomStudyPlanItems, studyPlanItemList);
        }
    );
}

export async function createRandomAssignmentsNotRequireGrade(
    cms: CMSInterface,
    context: ScenarioContext,
    studyPlanItemList: StudyPlanItem[],
    quantity: number
) {
    if (quantity < 1) return;

    const topicList = context.get<Topic[]>(aliasRandomTopics);
    const learningObjectives =
        context.get<LearningObjective[]>(aliasRandomLearningObjectives) || [];
    const assignments = context.get<Assignment[]>(aliasRandomAssignments) || [];
    const taskAssignments = context.get<Assignment[]>(aliasRandomTaskAssignments) || [];
    const learningObjectivesWithMaterial =
        context.get<LearningObjective[]>(aliasRandomLearningObjectivesWithMaterial) || [];
    const studyPlanItems = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];

    await cms.instruction(
        'creates assignments not require grade for each topic by calling gRPC',
        async function (this: CMSInterface) {
            const assignmentNotRequireGradeReturns = await Promise.all(
                topicList.map(async ({ id }) => {
                    const displayOrderFrom =
                        learningObjectives.filter(({ topicId }) => topicId === id).length +
                        assignments.filter(({ content }) => content?.topicId === id).length +
                        taskAssignments.filter(({ content }) => content?.topicId === id).length +
                        learningObjectivesWithMaterial.filter(({ topicId }) => topicId === id)
                            .length +
                        1;

                    const {
                        request: { assignmentsList },
                    } = await createRandomAssignments(this, {
                        quantity,
                        topicId: id,
                        displayOrderFrom,
                        maxGrade: 0,
                    });

                    return assignmentsList;
                })
            );
            const assignmentNotRequireGrades = assignmentNotRequireGradeReturns.reduce(
                (previous, current) => previous.concat(current),
                []
            );

            context.set(aliasAssignmentNotRequireGradeName, assignmentNotRequireGrades[0].name);
            context.set(aliasRandomAssignmentNotRequireGrades, assignmentNotRequireGrades);

            studyPlanItemList = [...studyPlanItems, ...assignmentNotRequireGrades];
            context.set(aliasRandomStudyPlanItems, studyPlanItemList);
        }
    );
}

export async function createRandomTaskAssignmentsWithCorrectness(
    cms: CMSInterface,
    context: ScenarioContext,
    studyPlanItemList: StudyPlanItem[],
    quantity: number
) {
    if (quantity < 1) return;

    const topicList = context.get<Topic[]>(aliasRandomTopics);
    const learningObjectives =
        context.get<LearningObjective[]>(aliasRandomLearningObjectives) || [];
    const assignments = context.get<Assignment[]>(aliasRandomAssignments) || [];
    const taskAssignments = context.get<Assignment[]>(aliasRandomTaskAssignments) || [];
    const learningObjectivesWithMaterial =
        context.get<LearningObjective[]>(aliasRandomLearningObjectivesWithMaterial) || [];
    const assignmentNotRequireGrades =
        context.get<Assignment[]>(aliasRandomAssignmentNotRequireGrades) || [];
    const studyPlanItems = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];

    await cms.instruction(
        'creates task assignments with correctness for each topic by calling gRPC',
        async function (this: CMSInterface) {
            const taskAssignmentWithCorrectnessReturns = await Promise.all(
                topicList.map(async ({ id }) => {
                    const displayOrderFrom =
                        learningObjectives.filter(({ topicId }) => topicId === id).length +
                        assignments.filter(({ content }) => content?.topicId === id).length +
                        taskAssignments.filter(({ content }) => content?.topicId === id).length +
                        learningObjectivesWithMaterial.filter(({ topicId }) => topicId === id)
                            .length +
                        assignmentNotRequireGrades.filter(({ content }) => content?.topicId === id)
                            .length +
                        1;

                    const {
                        request: { assignmentsList },
                    } = await createRandomAssignments(this, {
                        quantity,
                        topicId: id,
                        displayOrderFrom,
                        type: KeyAssignmentType.ASSIGNMENT_TYPE_TASK,
                        maxGrade: 0,
                        requireCorrectness: true,
                    });

                    return assignmentsList;
                })
            );
            const taskAssignmentsWithCorrectness = taskAssignmentWithCorrectnessReturns.reduce(
                (previous, current) => previous.concat(current),
                []
            );

            context.set(
                aliasTaskAssignmentWithCorrectnessName,
                taskAssignmentsWithCorrectness[0].name
            );
            context.set(aliasRandomTaskAssignmentsWithCorrectness, taskAssignmentsWithCorrectness);

            studyPlanItemList = [...studyPlanItems, ...taskAssignmentsWithCorrectness];
            context.set(aliasRandomStudyPlanItems, studyPlanItemList);
        }
    );
}
