import { genId } from '@legacy-step-definitions/utils';

import { Given, Then, When } from '@cucumber/cucumber';

import { featureFlagsHelper } from '@drivers/feature-flags/helper';

import { CMSInterface, IMasterWorld, LearnerInterface } from '@supports/app-types';
import { syllabusTaskAssignmentFeatureFlag } from '@supports/constants';
import { ScenarioContext } from '@supports/scenario-context';
import { LearningObjectiveType } from '@supports/services/bob-course/const';
import { convertUpsertQuizRequestToQuiz, Quiz } from '@supports/services/common/quiz';
import { KeyQuizType } from '@supports/services/yasuo-course/const';
import { CreatedAContentBookOption } from '@supports/types/cms-types';

import {
    aliasBookName,
    aliasCardInFlashcardQuantity,
    aliasContentBookLOQuestionQuantity,
    aliasContentBookLOQuestionType,
    aliasCourseName,
    aliasExamLOName,
    aliasFlashcardName,
    aliasLOName,
    aliasQuestionFIBList,
    aliasQuizQuestionNames,
    aliasQuizzesByLOName,
    aliasRandomAssignments,
    aliasRandomBookB1,
    aliasRandomBookB3,
    aliasRandomBooks,
    aliasRandomChapters,
    aliasRandomContentBookB1,
    aliasRandomContentBookB3,
    aliasRandomLearningObjectives,
    aliasRandomQuizzes,
    aliasRandomStudyPlanItems,
    aliasRandomStudyPlanItemsBookB1,
    aliasRandomStudyPlanItemsBookB3,
    aliasRandomTopics,
} from './alias-keys/syllabus';
import { dialogWithHeaderFooter } from './cms-selectors/cms-keys';
import {
    mergeAndSetRandomStudyPlanItemsContext,
    schoolAdminCreateRandomAssignmentAndSetContext,
    schoolAdminCreateRandomBooksAndSetContext,
    schoolAdminCreateRandomChaptersAndSetContext,
    schoolAdminCreateRandomExamLOsAndSetContext,
    schoolAdminCreateRandomFlashcardsAndSetContext,
    schoolAdminCreateRandomLOsAndSetContext,
    schoolAdminCreateRandomTaskAssignmentAndSetContext,
    schoolAdminCreateRandomTopicsForEachChapterAndSetContext,
} from './create-data-book-content-utils';
import { studentWaitingSelectChapterWithBookScreenLoaded } from './syllabus-add-book-to-course-definitions';
import {
    createRandomAssignmentsNotRequireGrade,
    createRandomLearningObjectivesWithMaterial,
    createRandomQuiz,
    createRandomTaskAssignmentsWithCorrectness,
    schoolAdminCreateABook,
    schoolAdminIsOnBookDetailsPage,
    schoolAdminSeeTotalNChapterItemInBookDetail,
} from './syllabus-content-book-create-definitions';
import {
    getQuizTypeValue,
    schoolAdminSeesErrorMessageField,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    studentTapBookNameAtSelectBookDialogInCourseDetail,
    studentTapSelectBookButtonInCourseDetail,
} from './syllabus-utils';
import { QuizType } from 'manabuf/common/v1/contents_pb';
import {
    Assignment,
    Book,
    Chapter,
    ContentBookProps,
    CreatedContentBookReturn,
    LearningObjective,
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

Given('school admin has created a content book', { timeout: 100000 }, async function () {
    await schoolAdminHasCreatedAContentBook(this.cms, this.scenario);
});

Given(
    'school admin has created {int} simple content books',
    { timeout: 100000 },
    async function (total: number) {
        const context = this.scenario;

        const books: CreatedContentBookReturn[] = [];
        for (let i = 0; i < total; i++) {
            const { bookList, chapterList, topicList, studyPlanItemList } =
                await schoolAdminHasCreatedAContentBook(this.cms, this.scenario, {
                    questionQuantity: 0,
                    topicQuantity: 1,
                    chapterQuantity: 1,
                });
            books.push({
                bookList,
                chapterList,
                topicList,
                studyPlanItemList,
            });
        }
        context.set(aliasRandomBooks, books);
    }
);

Given('school admin has created a content book B1', async function () {
    const context = this.scenario;

    const { bookList, studyPlanItemList } = await schoolAdminHasCreatedAContentBook(
        this.cms,
        this.scenario,
        {
            questionQuantity: 0,
        }
    );
    const chapterList = context.get<Chapter[]>(aliasRandomChapters);
    const topicList = context.get<Topic[]>(aliasRandomTopics);
    const loList = context.get<LearningObjective[]>(aliasRandomLearningObjectives);
    const assignmentList = context.get<Assignment[]>(aliasRandomAssignments);
    const contentBookB1: ContentBookProps = {
        book: bookList[0],
        chapterList,
        topicList,
        loList,
        assignmentList,
    };

    context.set(aliasRandomBookB1, bookList[0]);
    context.set(aliasRandomContentBookB1, contentBookB1);
    context.set(aliasRandomStudyPlanItemsBookB1, studyPlanItemList);
});

Given('school admin has created content book B3', async function () {
    const context = this.scenario;
    const topicListAllBooks = context.get<Topic[]>(aliasRandomTopics);
    const studyPlanItemListAllBooks = context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems) || [];

    const { bookList, topicList, studyPlanItemList } = await schoolAdminHasCreatedAContentBook(
        this.cms,
        this.scenario
    );

    const chapterList = context.get<Chapter[]>(aliasRandomChapters);
    const loList = context.get<LearningObjective[]>(aliasRandomLearningObjectives);
    const assignmentList = context.get<Assignment[]>(aliasRandomAssignments);
    const contentBookB3: ContentBookProps = {
        book: bookList[0],
        chapterList,
        topicList,
        loList,
        assignmentList,
    };

    context.set(aliasRandomBookB3, bookList[0]);
    context.set(aliasRandomContentBookB3, contentBookB3);
    context.set(aliasRandomStudyPlanItemsBookB3, studyPlanItemList);
    context.set(aliasRandomTopics, [...topicListAllBooks, ...topicList]);
    context.set(aliasRandomStudyPlanItems, [...studyPlanItemListAllBooks, ...studyPlanItemList]);
});

Given('school admin has created a content book on CMS', async function (this: IMasterWorld) {
    await schoolAdminHasCreatedAContentBook(this.cms, this.scenario, {
        assignmentQuantity: 2,
        learningObjectiveQuantity: 2,
        questionQuantity: 0,
    });
});

Given(`student goes to Book Detail Screen`, async function (): Promise<void> {
    const context = this.scenario;
    const courseName = context.get<string>(aliasCourseName);

    await this.learner.instruction('Refresh learner app', async () => {
        await studentRefreshHomeScreen(this.learner);
    });

    await this.learner.instruction(`Student go to the course: ${courseName}`, async () => {
        await studentGoToCourseDetail(this.learner, courseName);
        await studentWaitingSelectChapterWithBookScreenLoaded(this.learner);
    });
});

export async function schoolAdminHasCreatedAContentBook(
    cms: CMSInterface,
    context: ScenarioContext,
    options?: CreatedAContentBookOption
): Promise<CreatedContentBookReturn> {
    const defaultOptions: Required<CreatedAContentBookOption> = {
        chapterQuantity: 2,
        topicQuantity: 2,
        learningObjectiveQuantity: 1,
        assignmentQuantity: 1,
        questionQuantity: 3,
        taskAssignmentQuantity: 1,
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
        loWithMaterialQuantity,
        assignmentNotRequireGradeQuantity,
        taskAssignmentWithCorrectnessQuantity,
        enabledFIBHandwritingAnswer,
        enabledCourseStatistics,
    }: CreatedAContentBookOption = { ...defaultOptions, ...safeOptions };

    const loQuizType = enabledCourseStatistics
        ? KeyQuizType.QUIZ_TYPE_MCQ
        : KeyQuizType.QUIZ_TYPE_FIB;
    const flashcardQuizType = KeyQuizType.QUIZ_TYPE_POW;

    await cms.instruction('creates a book by calling gRPC', async function (this: CMSInterface) {
        await schoolAdminCreateRandomBooksAndSetContext(cms, context);
    });

    const bookList = context.get<Book[]>(aliasRandomBooks);

    await cms.instruction('creates chapters by calling gRPC', async function (this: CMSInterface) {
        await schoolAdminCreateRandomChaptersAndSetContext(cms, context, {
            quantity: chapterQuantity,
        });
    });

    const chapterList = context.get<Chapter[]>(aliasRandomChapters);

    if (topicQuantity) {
        await cms.instruction('creates topics for each chapter by calling gRPC', async function () {
            await schoolAdminCreateRandomTopicsForEachChapterAndSetContext(cms, context, {
                quantity: topicQuantity,
            });
        });
    }

    const topicList = context.get<Topic[]>(aliasRandomTopics);

    if (learningObjectiveQuantity > 0) {
        await cms.instruction(
            'creates learning objectives for each topic by calling gRPC',
            async function (this: CMSInterface) {
                const allLearningMaterials = await Promise.all(
                    topicList.map(async ({ id: topicId }) => {
                        const flashcards = await schoolAdminCreateRandomFlashcardsAndSetContext(
                            cms,
                            context,
                            {
                                topicId,
                                quantity: learningObjectiveQuantity,
                            }
                        );

                        const lOs = await schoolAdminCreateRandomLOsAndSetContext(cms, context, {
                            topicId,
                            quantity: learningObjectiveQuantity,
                        });

                        const examLOs = await schoolAdminCreateRandomExamLOsAndSetContext(
                            cms,
                            context,
                            {
                                topicId,
                                quantity: learningObjectiveQuantity,
                            }
                        );

                        return [...examLOs, ...flashcards, ...lOs];
                    })
                );

                const learningObjectives = allLearningMaterials.reduce(
                    (previous, current) => previous.concat(current),
                    []
                );

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

                mergeAndSetRandomStudyPlanItemsContext(context, learningObjectives);
            }
        );
    }

    if (assignmentQuantity > 0) {
        await cms.instruction(
            'creates assignments for each topic by calling gRPC',
            async function (this: CMSInterface) {
                const assignmentReturns = await Promise.all(
                    topicList.map(async ({ id: topicId }) => {
                        return schoolAdminCreateRandomAssignmentAndSetContext(cms, context, {
                            quantity: assignmentQuantity,
                            topicId,
                        });
                    })
                );
                const assignments = assignmentReturns.reduce(
                    (previous, current) => previous.concat(current),
                    []
                );

                mergeAndSetRandomStudyPlanItemsContext(context, assignments);
            }
        );
    }

    const isEnabledTaskAssignment = await featureFlagsHelper.isEnabled(
        syllabusTaskAssignmentFeatureFlag
    );

    if (taskAssignmentQuantity > 0 && isEnabledTaskAssignment) {
        await cms.instruction(
            'creates task assignments for each topic by calling gRPC',
            async function (this: CMSInterface) {
                const taskAssignmentReturns = await Promise.all(
                    topicList.map(async ({ id: topicId }) => {
                        return schoolAdminCreateRandomTaskAssignmentAndSetContext(cms, context, {
                            topicId,
                            quantity: taskAssignmentQuantity,
                        });
                    })
                );
                const taskAssignments = taskAssignmentReturns.reduce(
                    (previous, current) => previous.concat(current),
                    []
                );

                mergeAndSetRandomStudyPlanItemsContext(context, taskAssignments);
            }
        );
    }

    await createRandomLearningObjectivesWithMaterial(
        cms,
        context,
        context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems),
        loWithMaterialQuantity
    );

    await createRandomAssignmentsNotRequireGrade(
        cms,
        context,
        context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems),
        assignmentNotRequireGradeQuantity
    );

    if (isEnabledTaskAssignment) {
        await createRandomTaskAssignmentsWithCorrectness(
            cms,
            context,
            context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems),
            taskAssignmentWithCorrectnessQuantity
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
                learningObjectives.map(async ({ info: { id, name }, type }) => {
                    const quizType =
                        type === LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD
                            ? flashcardQuizType
                            : loQuizType;

                    let quizzes: Quiz[] = [];

                    for (let i = 0; i < questionQuantity; i++) {
                        const { request } = await createRandomQuiz(this, {
                            learningObjectiveId: id,
                            type: quizType,
                            shouldCreateFIBWithOneAnswer: !enabledFIBHandwritingAnswer,
                        });

                        quizzes = [...quizzes, ...convertUpsertQuizRequestToQuiz(request)];
                    }
                    context.set(aliasQuizzesByLOName(name), quizzes);

                    return quizzes;
                })
            );
            const quizzes = quizReturns.reduce((previous, current) => previous.concat(current), []);

            /*
            Why the name of quiz is externalId?
            Because we are setting like that { name: externalId }
            */
            const quizzesName = quizzes.map((quiz) => quiz.externalId);
            const questionFIBList = quizzes.filter((quiz) => quiz.kind === QuizType[loQuizType]);
            context.set(aliasRandomQuizzes, quizzes);
            // List IDs of externalId
            context.set(aliasQuizQuestionNames, quizzesName);
            context.set(aliasContentBookLOQuestionQuantity, questionQuantity);
            // set aliasCardInFlashcardQuantity to replace aliasContentBookLOQuestionQuantity
            context.set(aliasCardInFlashcardQuantity, questionQuantity);
            context.set(aliasQuestionFIBList, questionFIBList);
            const quizTypeKey = loQuizType;
            const { quizTypeTitle } = getQuizTypeValue({ quizTypeKey });
            context.set(aliasContentBookLOQuestionType, quizTypeTitle);
        }
    );

    return {
        bookList,
        chapterList,
        topicList,
        studyPlanItemList: context.get<StudyPlanItem[]>(aliasRandomStudyPlanItems),
    };
}

Given(`school admin is at book page`, async function (this: IMasterWorld): Promise<void> {
    await this.cms.instruction(
        `select menu item Book, see the book page`,
        async function (this: CMSInterface) {
            await this.selectMenuItemInSidebarByAriaLabel(`Book`);
            await this.assertThePageTitle(`Book`);
        }
    );
});

Given(
    'school admin goes to book detail page of the content book',
    async function (this: IMasterWorld): Promise<void> {
        const context = this.scenario;

        await this.cms.instruction(
            'School admin goes to the created content book page',
            async function (cms) {
                await schoolAdminIsOnBookDetailsPage(cms, context);
            }
        );
    }
);

When(`school admin creates a book`, async function (this: IMasterWorld) {
    const bookName = `BookName ${genId()}`;
    this.scenario.set(aliasBookName, bookName);

    await this.cms.instruction(
        `select create book button, fill book form data and save to create`,
        async () => {
            await schoolAdminCreateABook(this.cms, bookName);
        }
    );
});

Then('school admin sees a new empty book on CMS', async function (this: IMasterWorld) {
    await this.cms.instruction(`select book item just created and go to book details`, async () => {
        await schoolAdminIsOnBookDetailsPage(this.cms, this.scenario);
    });

    await this.cms.instruction('shool admin see book do not contain any chapter', async () => {
        await schoolAdminSeeTotalNChapterItemInBookDetail(this.cms, 0);
    });
});

When(
    'school admin creates a book with missing {string}',
    async function (this: IMasterWorld, _: string) {
        await this.cms.instruction(
            `select create book button, fill book form data and save to create`,
            async () => {
                await schoolAdminCreateABook(this.cms);
            }
        );
    }
);

Then('user cannot create any book', async function (this: IMasterWorld) {
    await this.cms.instruction(
        'school admin still see dialog add book form with error message',
        async () => {
            await schoolAdminSeesErrorMessageField(this.cms, {
                wrapper: dialogWithHeaderFooter,
            });
        }
    );
});

Given(
    `student selects book {string}`,
    async function (this: IMasterWorld, book: string): Promise<void> {
        const learner = this.learner;
        const context = this.scenario;

        let bookContent: ContentBookProps;
        switch (book) {
            case 'B1':
                bookContent = context.get<ContentBookProps>(aliasRandomContentBookB1);
                break;
            case 'B3':
                bookContent = context.get<ContentBookProps>(aliasRandomContentBookB3);
                break;
            default:
                throw 'Not implement';
        }

        const bookName = bookContent.book.name;

        await learner.instruction(
            `student tap on select book button`,
            async function (this: LearnerInterface) {
                await studentTapSelectBookButtonInCourseDetail(this);
            }
        );

        await learner.instruction(
            `student select ${bookName}`,
            async function (this: LearnerInterface) {
                await studentTapBookNameAtSelectBookDialogInCourseDetail(this, bookName);
            }
        );
    }
);
