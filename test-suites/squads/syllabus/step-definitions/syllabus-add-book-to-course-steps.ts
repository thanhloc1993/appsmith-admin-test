import { genId } from '@legacy-step-definitions/utils';
import { asyncForEach } from '@syllabus-utils/common';
import {
    getRandomQuestionTypeForExamLO,
    getRandomQuestionTypeForLO,
} from '@syllabus-utils/question-utils';

import { Given, When } from '@cucumber/cucumber';

import { Books, CMSInterface, IMasterWorld, SchoolAdminRolesWithTenant } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { createDefaultQuizAttributes, createQuizContent } from '@supports/services/common/quiz';
import { Quiz } from '@supports/services/common/quiz';
import { CreatedAContentBookOption } from '@supports/types/cms-types';

import {
    aliasBookNamesListTenantS1,
    aliasBookNamesListTenantS2,
    aliasBookNameTenantS1,
    aliasBookNameTenantS2,
    aliasCardInFlashcardQuantity,
    aliasContentBookLOQuestionQuantity,
    aliasExamLOId,
    aliasExamLOManualGrading,
    aliasExamLOPointPerQuestion,
    aliasExamLOTimeLimit,
    aliasQuizQuestionName,
    aliasQuizQuestionNames,
    aliasRandomBooks,
    aliasRandomExam,
    aliasRandomLearningObjectives,
    aliasRandomQuizzes,
    aliasRandomQuizzesRaw,
    aliasRandomStudyPlanItems,
    aliasRandomStudyPlanItemsTenantS1,
    aliasRandomStudyPlanItemsTenantS2,
    aliasTaskAssignmentSetting,
    aliasTotalQuestionCount,
} from './alias-keys/syllabus';
import {
    mergeAndSetRandomStudyPlanItemsContext,
    schoolAdminCreateDefaultSimpleBookAndSetContext,
    schoolAdminCreateRandomAssignmentAndSetContext,
    schoolAdminCreateRandomBooksAndSetContext,
    schoolAdminCreateRandomCardsInFlashcardAndSetContext,
    schoolAdminCreateRandomChaptersAndSetContext,
    schoolAdminCreateRandomExamLOsAndSetContext,
    schoolAdminCreateRandomFlashcardsAndSetContext,
    schoolAdminCreateRandomLOsAndSetContext,
    schoolAdminCreateRandomQuestionsAndSetContext,
    schoolAdminCreateRandomTaskAssignmentAndSetContext,
    schoolAdminCreateRandomTopicsForEachChapterAndSetContext,
} from './create-data-book-content-utils';
import { schoolAdminHasCreatedRandomQuestionExamLO } from './preconditions/book-general/question.definitions';
import {
    schoolAdminHasCreatedAContentBook as schoolAdminHasCreatedAContentBookShouldCheckAndRemove,
    schoolAdminHasCreatedAnEmptyBook,
    schoolAdminHasCreatedNEmptyChapterInBook,
} from './syllabus-content-book-create-definitions';
import { schoolAdminHasCreatedAContentBook } from './syllabus-content-book-create-steps';
import {
    randomTaskAssignmentSettingInfos,
    TaskAssignmentInfo,
} from './syllabus-create-task-assignment-definitions';
import { upsertSampleBrightCoveLinkByGRPC } from './syllabus-edit-assignment-definitions';
import shuffle from 'lodash/shuffle';
import { QuizItemAttributeConfig, QuizType } from 'manabuf/common/v1/contents_pb';
import { Book } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

export type TypeBook =
    | 'empty'
    | '1 empty chapter'
    | 'has chapter and topic only'
    | 'content'
    | 'content without quiz'
    | 'simple content with a task assignment'
    | 'simple content without quiz'
    | 'simple content without card'
    | 'simple content have 5 card'
    | '1 flashcard have 5 card'
    | 'simple content 2 chapter without quiz'
    | 'simple content 2 topic without quiz'
    | 'simple content have 1 quiz'
    | 'simple content with 5 question exam lo'
    | 'simple content with all LO type'
    | 'simple content with an assignment'
    | 'has 1 learning objective'
    | 'simple content with 1 LO exam'
    | 'simple content with 2 LO learning, exam'
    | 'simple content with 1 LO exam has 1 question'
    | 'content with 4 grade to pass LO exams and each has 3 questions'
    | 'simple content with multiple handwriting answers'
    | 'has multiple handwriting answers in LO, Exam LO'
    | 'original content to duplicate'
    | 'has 2 chapter'
    | 'has 2 topic'
    | 'simple content to move content learning'
    | 'all learning materials'
    | 'course statistics'
    | 'simple content have 5 card for move card'
    | '1 LO learning with (2-3) random questions type'
    | '1 LO with a random question type'
    | '1 LO without quiz'
    | '1 exam lo with random time limit'
    | 'has 1 multiple choices question in LO'
    | '1 exam lo with 2 questions random points'
    | '1 exam lo with 1 question random points'
    | 'has 1 manual input question in LO'
    | '1 exam lo with 1 minute time limit'
    | 'has 1 multiple answers question in LO'
    | 'has 1 flashcard'
    | 'has 1 assignment'
    | 'has 1 assignment require recorded video submission'
    | 'has 1 task assignment'
    | '1 flashcard with some handwriting cards'
    | 'exam lo with manual grading is off'
    | 'exam lo with manual grading is on';

Given(
    'school admin has created a {string} book',
    async function (this: IMasterWorld, typeBook: TypeBook): Promise<void> {
        const scenario = this.scenario;

        await this.cms.instruction(
            `Create a ${typeBook} book`,
            async (cms: CMSInterface) => await createBook(cms, scenario, typeBook)
        );
    }
);

Given(
    'school admin has created a content with 1 exam lo and has manual grading {string} and 1 question book',
    async function (status: string) {
        const scenario = this.scenario;
        await this.cms.instruction(
            `Create a content with 1 exam lo and 1 question and has manual grading ${status}`,
            async (cms: CMSInterface) => {
                await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

                const examLO = await schoolAdminCreateRandomExamLOsAndSetContext(cms, scenario, {
                    manualGrading: status === 'on' ? true : false,
                });

                const { quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(
                    cms,
                    scenario,
                    {
                        quantity: 1,
                        parentId: examLO[0].learningMaterialId,
                    }
                );

                scenario.set(aliasRandomQuizzes, quizRaws);
                scenario.set(aliasRandomLearningObjectives, examLO);

                mergeAndSetRandomStudyPlanItemsContext(scenario, examLO);
            }
        );
    }
);

Given(
    'school admin has created a {string} book {string}',
    async function (this: IMasterWorld, typeBook: TypeBook, book: Books): Promise<void> {
        const scenario = this.scenario;
        await this.cms.instruction(
            `Create a ${typeBook} book ${book}`,
            async (cms: CMSInterface) => await createBook(cms, scenario, typeBook, book)
        );
    }
);

Given(
    '{string} has created a {string} {string}',
    async function (
        this: IMasterWorld,
        role: SchoolAdminRolesWithTenant,
        typeBook: TypeBook,
        bookName: string
    ): Promise<void> {
        const scenario = this.scenario;
        const cms = role === 'school admin Tenant S1' ? this.cms : this.cms2;
        await cms.instruction(
            `Create a ${typeBook} ${bookName}`,
            async (cms: CMSInterface) => await createBook(cms, scenario, typeBook)
        );
        const bookList = scenario.get<Book[]>(aliasRandomBooks);
        const tenantBookNameList =
            scenario.get<string[]>(
                role === 'school admin Tenant S1'
                    ? aliasBookNamesListTenantS1
                    : aliasBookNamesListTenantS2
            ) ?? [];

        scenario.set(
            role === 'school admin Tenant S1' ? aliasBookNameTenantS1 : aliasBookNameTenantS2,
            bookList[0].name
        );
        scenario.set(
            role === 'school admin Tenant S1'
                ? aliasBookNamesListTenantS1
                : aliasBookNamesListTenantS2,
            [...tenantBookNameList, bookList[0].name]
        );
        const studyPlanItems = scenario.get<Book[]>(aliasRandomStudyPlanItems);
        scenario.set(
            role === 'school admin Tenant S1'
                ? aliasRandomStudyPlanItemsTenantS1
                : aliasRandomStudyPlanItemsTenantS2,
            studyPlanItems
        );
    }
);

Given(
    'school admin has created {int} random questions to do LO quiz',
    async function (totalQuestion: number) {
        await schoolAdminCreateDefaultSimpleBookAndSetContext(this.cms, this.scenario);

        const learningObjective = await schoolAdminCreateRandomLOsAndSetContext(
            this.cms,
            this.scenario,
            {
                quantity: 1,
            }
        );

        const { learningMaterialId } = learningObjective[0];

        const { quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(
            this.cms,
            this.scenario,
            {
                parentId: learningMaterialId,

                type: getRandomQuestionTypeForLO,
                quantity: totalQuestion,
            }
        );

        this.scenario.set(aliasRandomQuizzesRaw, quizRaws);

        this.scenario.set(aliasTotalQuestionCount, totalQuestion);

        mergeAndSetRandomStudyPlanItemsContext(this.scenario, learningObjective);
    }
);

// TODO: Hieu will check and replace by new way
const createBookStrategy = {
    onlyEmptyBook: schoolAdminHasCreatedAnEmptyBook,
    onlyOneEmptyChapter: schoolAdminHasCreatedNEmptyChapterInBook,
};

const schoolAdminHasCreateFlashcardForHandwriting = async (
    cms: CMSInterface,
    scenario: ScenarioContext
) => {
    const { schoolId } = await cms.getContentBasic();

    await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
    const flashcards = await schoolAdminCreateRandomFlashcardsAndSetContext(cms, scenario);

    const learningMaterialId = flashcards[0].learningMaterialId;
    await schoolAdminCreateRandomCardsInFlashcardAndSetContext(cms, scenario, {
        flashcardId: learningMaterialId,
        cards: shuffle([
            createQuizContent(
                {
                    externalId: genId(),
                    kind: QuizType.QUIZ_TYPE_POW,
                    difficultyLevel: 1,
                    schoolId,
                    loId: learningMaterialId,
                },
                {
                    attribute: createDefaultQuizAttributes({
                        configsList: [QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG],
                    }),
                    optionsList: [
                        {
                            correctness: true,
                            configsList: [],
                            key: '',
                            label: '',
                            attribute: createDefaultQuizAttributes({
                                configsList: [QuizItemAttributeConfig.LANGUAGE_CONFIG_JP],
                            }),
                            content: {
                                raw: 'JP',
                                rendered: '',
                            },
                        },
                    ],
                }
            ),
            createQuizContent(
                {
                    externalId: genId(),
                    kind: QuizType.QUIZ_TYPE_POW,
                    difficultyLevel: 1,
                    schoolId,
                    loId: learningMaterialId,
                },
                {
                    attribute: createDefaultQuizAttributes({
                        configsList: [QuizItemAttributeConfig.LANGUAGE_CONFIG_JP],
                    }),
                    optionsList: [
                        {
                            correctness: true,
                            configsList: [],
                            key: '',
                            label: '',
                            attribute: createDefaultQuizAttributes({
                                configsList: [QuizItemAttributeConfig.LANGUAGE_CONFIG_ENG],
                            }),
                            content: {
                                raw: 'EN',
                                rendered: '',
                            },
                        },
                    ],
                }
            ),
        ]),
    });

    scenario.set(aliasCardInFlashcardQuantity, 2);
    mergeAndSetRandomStudyPlanItemsContext(scenario, flashcards);
};

export async function createBook(
    cms: CMSInterface,
    scenario: ScenarioContext,
    typeBook: TypeBook,
    book?: Books
): Promise<void> {
    let contentBook: CreatedAContentBookOption = {};

    switch (typeBook) {
        case 'empty':
            return createBookStrategy.onlyEmptyBook(cms, scenario);
        case '1 empty chapter':
            return createBookStrategy.onlyOneEmptyChapter(cms, scenario);
        case 'has chapter and topic only':
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            return;

        case 'content':
            return schoolAdminHasCreatedAContentBookShouldCheckAndRemove(cms, scenario);
        case 'simple content with a task assignment': {
            contentBook = {
                chapterQuantity: 1,
                topicQuantity: 1,
                questionQuantity: 0,
                learningObjectiveQuantity: 0,
                assignmentQuantity: 0,
                taskAssignmentQuantity: 1,
            };
            break;
        }
        case 'simple content without card':
        case 'simple content without quiz': {
            contentBook = {
                assignmentQuantity: 1,
                chapterQuantity: 1,
                topicQuantity: 1,
                learningObjectiveQuantity: 1,
                questionQuantity: 0,
            };
            break;
        }

        case 'simple content have 5 card': {
            contentBook = {
                assignmentQuantity: 1,
                chapterQuantity: 1,
                topicQuantity: 1,
                learningObjectiveQuantity: 1,
                questionQuantity: 5,
            };
            break;
        }
        case 'simple content 2 chapter without quiz': {
            contentBook = {
                chapterQuantity: 2,
                assignmentQuantity: 1,
                topicQuantity: 1,
                learningObjectiveQuantity: 1,
                questionQuantity: 0,
            };
            break;
        }
        case 'simple content 2 topic without quiz': {
            contentBook = {
                topicQuantity: 2,
                chapterQuantity: 1,
                assignmentQuantity: 1,
                learningObjectiveQuantity: 1,
                questionQuantity: 0,
            };
            break;
        }
        case 'content without quiz': {
            contentBook = {
                questionQuantity: 0,
            };
            break;
        }
        case 'simple content have 1 quiz': {
            contentBook = {
                topicQuantity: 1,
                chapterQuantity: 1,
                assignmentQuantity: 1,
                learningObjectiveQuantity: 1,
                questionQuantity: 1,
            };
            break;
        }
        case 'simple content with 5 question exam lo': {
            contentBook = {
                topicQuantity: 1,
                chapterQuantity: 1,
                assignmentQuantity: 1,
                learningObjectiveQuantity: 1,
                questionQuantity: 5,
            };
            break;
        }
        case 'simple content with all LO type': {
            contentBook = {
                topicQuantity: 1,
                chapterQuantity: 1,
                learningObjectiveQuantity: 1,
                assignmentQuantity: 0,
                questionQuantity: 0,
                taskAssignmentQuantity: 0,
            };
            break;
        }
        case 'simple content with an assignment': {
            contentBook = {
                topicQuantity: 1,
                chapterQuantity: 1,
                assignmentQuantity: 1,
                questionQuantity: 0,
                taskAssignmentQuantity: 0,
            };
            break;
        }

        case 'has 1 multiple answers question in LO': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            const learningObjective = await schoolAdminCreateRandomLOsAndSetContext(cms, scenario);

            const { names, quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(
                cms,
                scenario,
                {
                    parentId: learningObjective[0].learningMaterialId,
                    type: 'QUIZ_TYPE_MAQ',
                }
            );

            scenario.set(aliasQuizQuestionName, names[0]);
            scenario.set(aliasRandomQuizzes, quizRaws);

            return;
        }

        case 'has 1 manual input question in LO': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            const learningObjective = await schoolAdminCreateRandomLOsAndSetContext(cms, scenario);

            const { names, quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(
                cms,
                scenario,
                {
                    parentId: learningObjective[0].learningMaterialId,

                    type: 'QUIZ_TYPE_MIQ',
                }
            );

            scenario.set(aliasQuizQuestionName, names[0]);
            scenario.set(aliasRandomQuizzes, quizRaws);

            return;
        }

        case '1 flashcard with some handwriting cards': {
            await schoolAdminHasCreateFlashcardForHandwriting(cms, scenario);
            return;
        }

        case 'has 1 multiple choices question in LO': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            const learningObjective = await schoolAdminCreateRandomLOsAndSetContext(cms, scenario);

            const { names, quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(
                cms,
                scenario,
                {
                    parentId: learningObjective[0].learningMaterialId,
                    type: 'QUIZ_TYPE_MCQ',
                }
            );

            scenario.set(aliasQuizQuestionName, names[0]);
            scenario.set(aliasRandomQuizzes, quizRaws);

            return;
        }

        case 'simple content have 5 card for move card': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            const flashcards = await schoolAdminCreateRandomFlashcardsAndSetContext(cms, scenario);

            await schoolAdminCreateRandomCardsInFlashcardAndSetContext(cms, scenario, {
                flashcardId: flashcards[0].learningMaterialId,
                quantity: 5,
            });

            return;
        }

        case '1 flashcard have 5 card': {
            const cardQuantity = 5;

            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            const flashcards = await schoolAdminCreateRandomFlashcardsAndSetContext(cms, scenario);

            await schoolAdminCreateRandomCardsInFlashcardAndSetContext(cms, scenario, {
                flashcardId: flashcards[0].learningMaterialId,
                quantity: cardQuantity,
            });

            mergeAndSetRandomStudyPlanItemsContext(scenario, flashcards);

            scenario.set(aliasCardInFlashcardQuantity, cardQuantity);
            return;
        }

        case 'has 1 learning objective': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const learningObjective = await schoolAdminCreateRandomLOsAndSetContext(cms, scenario);

            mergeAndSetRandomStudyPlanItemsContext(scenario, learningObjective);
            return;
        }

        case 'has 1 flashcard': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const flashcards = await schoolAdminCreateRandomFlashcardsAndSetContext(cms, scenario);

            mergeAndSetRandomStudyPlanItemsContext(scenario, flashcards);
            return;
        }

        case 'has 1 assignment': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const assignment = await schoolAdminCreateRandomAssignmentAndSetContext(cms, scenario);

            mergeAndSetRandomStudyPlanItemsContext(scenario, assignment);
            return;
        }

        case 'has 1 task assignment': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const taskAssignment = await schoolAdminCreateRandomTaskAssignmentAndSetContext(
                cms,
                scenario
            );

            mergeAndSetRandomStudyPlanItemsContext(scenario, taskAssignment);
            return;
        }

        case 'has 1 assignment require recorded video submission': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const { response: brightCoveResponse } = await upsertSampleBrightCoveLinkByGRPC(cms);

            const assignment = await schoolAdminCreateRandomAssignmentAndSetContext(cms, scenario, {
                requireVideoSubmission: true,
                attachmentsList: [brightCoveResponse!.mediaIdsList[0]],
            });

            mergeAndSetRandomStudyPlanItemsContext(scenario, assignment);
            return;
        }

        case 'simple content with 1 LO exam': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            await schoolAdminCreateRandomExamLOsAndSetContext(cms, scenario);

            return;
        }
        case 'simple content with 2 LO learning, exam': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const learningObjective = await schoolAdminCreateRandomLOsAndSetContext(cms, scenario);
            const examLO = await schoolAdminCreateRandomExamLOsAndSetContext(cms, scenario);

            scenario.set(aliasRandomLearningObjectives, learningObjective);
            scenario.set(aliasRandomExam, examLO);

            mergeAndSetRandomStudyPlanItemsContext(scenario, learningObjective.concat(examLO));
            return;
        }

        case '1 LO learning with (2-3) random questions type': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            const learningObjectives = await schoolAdminCreateRandomLOsAndSetContext(cms, scenario);

            const { names } = await schoolAdminCreateRandomQuestionsAndSetContext(cms, scenario, {
                quantity: randomInteger(2, 3),
                parentId: learningObjectives[0].learningMaterialId,
                type: getRandomQuestionTypeForLO,
            });

            scenario.set(aliasQuizQuestionNames, names);
            return;
        }

        case 'simple content with 1 LO exam has 1 question': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const examLO = await schoolAdminCreateRandomExamLOsAndSetContext(cms, scenario);
            const questionQuantity = 1;
            const { quizRaws, names } = await schoolAdminCreateRandomQuestionsAndSetContext(
                cms,
                scenario,
                {
                    quantity: questionQuantity,
                    parentId: examLO[0].learningMaterialId,
                }
            );

            scenario.set(aliasRandomQuizzes, quizRaws);
            scenario.set(aliasQuizQuestionNames, names);
            scenario.set(aliasRandomLearningObjectives, examLO);
            scenario.set(aliasExamLOId, examLO[0].learningMaterialId);

            mergeAndSetRandomStudyPlanItemsContext(scenario, examLO);
            return;
        }

        case 'content with 4 grade to pass LO exams and each has 3 questions': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const examLOs = await schoolAdminCreateRandomExamLOsAndSetContext(cms, scenario, {
                quantity: 4,
                gradeToPass: 3,
            });

            let quizzes: Quiz[] = [];

            await asyncForEach(examLOs, async (examLO) => {
                const { quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(
                    cms,
                    scenario,
                    {
                        quantity: 3,
                        parentId: examLO.learningMaterialId,
                        type: 'QUIZ_TYPE_MCQ',
                    }
                );

                quizzes = [...quizzes, ...quizRaws];
            });

            scenario.set(aliasRandomQuizzes, quizzes);
            scenario.set(aliasRandomLearningObjectives, examLOs);

            mergeAndSetRandomStudyPlanItemsContext(scenario, examLOs);
            return;
        }

        case '1 exam lo with 1 question random points': {
            return await schoolAdminHasCreatedRandomQuestionExamLO(cms, scenario);
        }

        case '1 exam lo with 2 questions random points': {
            return await schoolAdminHasCreatedRandomQuestionExamLO(cms, scenario, {
                quantityQuestion: 2,
            });
        }

        case 'exam lo with manual grading is off':
        case 'exam lo with manual grading is on': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const manualGrading = typeBook == 'exam lo with manual grading is on';
            const examLO = await schoolAdminCreateRandomExamLOsAndSetContext(cms, scenario, {
                manualGrading: manualGrading,
            });
            const questionQuantity = 4;
            const pointPerQuestion = 10;
            const { quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(
                cms,
                scenario,
                {
                    quantity: questionQuantity,
                    parentId: examLO[0].learningMaterialId,
                    type: getRandomQuestionTypeForExamLO,
                    point: pointPerQuestion,
                }
            );

            scenario.set(aliasRandomQuizzes, quizRaws);
            scenario.set(aliasExamLOManualGrading, manualGrading);
            scenario.set(aliasContentBookLOQuestionQuantity, questionQuantity);
            scenario.set(aliasExamLOPointPerQuestion, pointPerQuestion);

            mergeAndSetRandomStudyPlanItemsContext(scenario, examLO);
            return;
        }

        case '1 exam lo with 1 minute time limit':
        case '1 exam lo with random time limit': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);

            const timeLimit =
                typeBook == '1 exam lo with 1 minute time limit' ? 1 : randomInteger(1, 180);
            const examLO = await schoolAdminCreateRandomExamLOsAndSetContext(cms, scenario, {
                timeLimit: timeLimit,
            });
            const questionQuantity = 3;
            const { quizRaws } = await schoolAdminCreateRandomQuestionsAndSetContext(
                cms,
                scenario,
                {
                    quantity: questionQuantity,
                    parentId: examLO[0].learningMaterialId,
                    type: 'QUIZ_TYPE_MCQ', //Dont need to check other type
                }
            );

            scenario.set(aliasRandomQuizzes, quizRaws);
            scenario.set(aliasExamLOTimeLimit, timeLimit);
            scenario.set(aliasContentBookLOQuestionQuantity, questionQuantity);

            mergeAndSetRandomStudyPlanItemsContext(scenario, examLO);
            return;
        }

        case '1 LO with a random question type': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            const learningObjectives = await schoolAdminCreateRandomLOsAndSetContext(cms, scenario);

            const { names } = await schoolAdminCreateRandomQuestionsAndSetContext(cms, scenario, {
                quantity: 1,
                parentId: learningObjectives[0].learningMaterialId,
                type: getRandomQuestionTypeForLO(),
            });

            scenario.set(aliasQuizQuestionName, names[0]);

            return;
        }

        case '1 LO without quiz': {
            await schoolAdminCreateDefaultSimpleBookAndSetContext(cms, scenario);
            await schoolAdminCreateRandomLOsAndSetContext(cms, scenario);

            return;
        }

        case 'original content to duplicate': {
            contentBook = {
                assignmentQuantity: 1,
                chapterQuantity: 1,
                topicQuantity: 1,
                learningObjectiveQuantity: 1,
                questionQuantity: 1,
                taskAssignmentQuantity: 1,
            };
            break;
        }

        case 'has 2 chapter': {
            await schoolAdminCreateRandomBooksAndSetContext(cms, scenario);
            await schoolAdminCreateRandomChaptersAndSetContext(cms, scenario, {
                quantity: 2,
            });

            return;
        }
        case 'has 2 topic': {
            await schoolAdminCreateRandomBooksAndSetContext(cms, scenario);
            await schoolAdminCreateRandomChaptersAndSetContext(cms, scenario);
            await schoolAdminCreateRandomTopicsForEachChapterAndSetContext(cms, scenario, {
                quantity: 2,
            });
            return;
        }
        case 'simple content with multiple handwriting answers':
        case 'has multiple handwriting answers in LO, Exam LO': {
            contentBook = {
                chapterQuantity: 1,
                topicQuantity: 1,
                learningObjectiveQuantity: 1,
                questionQuantity: 1,
                assignmentQuantity: 0,
                taskAssignmentQuantity: 0,
                enabledFIBHandwritingAnswer: true,
            };
            break;
        }
        case 'simple content to move content learning': {
            contentBook = {
                chapterQuantity: 1,
                topicQuantity: 1,
                learningObjectiveQuantity: 2,
                assignmentQuantity: 1,
                taskAssignmentQuantity: 2,
                questionQuantity: 0,
            };
            break;
        }
        case 'all learning materials': {
            contentBook = {
                chapterQuantity: 1,
                topicQuantity: 1,
                learningObjectiveQuantity: 1,
                assignmentQuantity: 1,
                taskAssignmentQuantity: 1,
                questionQuantity: 1,
            };
            break;
        }
        case 'course statistics': {
            contentBook = {
                chapterQuantity: 1,
                topicQuantity: 1,
                enabledCourseStatistics: true,
                questionQuantity: 0,
                learningObjectiveQuantity: 1,
                assignmentQuantity: 1,
                taskAssignmentQuantity: 1,
                taskAssignmentWithCorrectnessQuantity: 1,
                assignmentNotRequireGradeQuantity: 1,
                loWithMaterialQuantity: 1,
            };
            break;
        }
        default:
            break;
    }

    const bookData = await schoolAdminHasCreatedAContentBook(cms, scenario, contentBook);

    if (book) {
        scenario.set(book, bookData);
    }
}

When(
    'school admin has created a task assignment with {string}',
    async function (info: TaskAssignmentInfo) {
        switch (info) {
            case 'any required item': {
                const settings = randomTaskAssignmentSettingInfos();
                const taskAssignment = await schoolAdminCreateRandomTaskAssignmentAndSetContext(
                    this.cms,
                    this.scenario,
                    {
                        requireAssignmentNote: settings.includes('Text note'),
                        requireDuration: settings.includes('Duration'),
                        requireCorrectness: settings.includes('Correctness'),
                        requireAttachment: settings.includes('File attachment'),
                        requireUnderstandingLevel: settings.includes('Understanding level'),
                    }
                );

                this.scenario.set(aliasTaskAssignmentSetting, settings);
                mergeAndSetRandomStudyPlanItemsContext(this.scenario, taskAssignment);
                return;
            }
            case 'no required items': {
                const taskAssignment = await schoolAdminCreateRandomTaskAssignmentAndSetContext(
                    this.cms,
                    this.scenario
                );

                mergeAndSetRandomStudyPlanItemsContext(this.scenario, taskAssignment);
                return;
            }
            default: {
                throw new Error(`Missing implement for case: ${info}`);
            }
        }
    }
);
