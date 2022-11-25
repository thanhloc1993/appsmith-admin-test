import { randomInteger } from '@syllabus-utils/common';
import { getRandomQuestionTypeForLO } from '@syllabus-utils/question-utils';

import { Given } from '@cucumber/cucumber';

import { Books, CMSInterface, IMasterWorld, SchoolAdminRolesWithTenant } from '@supports/app-types';
import { ScenarioContext } from '@supports/scenario-context';
import { CreatedAContentBookOption } from '@supports/types/cms-types';

import {
    aliasBookNamesListTenantS1,
    aliasBookNamesListTenantS2,
    aliasBookNameTenantS1,
    aliasBookNameTenantS2,
    aliasContentBookLOQuestionQuantity,
    aliasExamLOTimeLimit,
    aliasQuizQuestionName,
    aliasQuizQuestionNames,
    aliasRandomBooks,
    aliasRandomExam,
    aliasRandomLearningObjectives,
    aliasRandomQuizzes,
    aliasRandomStudyPlanItems,
    aliasRandomStudyPlanItemsTenantS1,
    aliasRandomStudyPlanItemsTenantS2,
} from './alias-keys/syllabus';
import {
    mergeAndSetRandomStudyPlanItemsContext,
    schoolAdminCreateDefaultSimpleBookAndSetContext,
    schoolAdminCreateRandomBooksAndSetContext,
    schoolAdminCreateRandomCardsInFlashcardAndSetContext,
    schoolAdminCreateRandomChaptersAndSetContext,
    schoolAdminCreateRandomExamLOsAndSetContext,
    schoolAdminCreateRandomFlashcardsAndSetContext,
    schoolAdminCreateRandomLOsAndSetContext,
    schoolAdminCreateRandomQuestionsAndSetContext,
    schoolAdminCreateRandomTopicsForEachChapterAndSetContext,
} from './create-data-book-content-utils';
import {
    schoolAdminHasCreatedAChapterTopicOnlyBook,
    schoolAdminHasCreatedAContentBook as schoolAdminHasCreatedAContentBookShouldCheckAndRemove,
    schoolAdminHasCreatedAnEmptyBook,
    schoolAdminHasCreatedNEmptyChapterInBook,
} from './syllabus-content-book-create-definitions';
import { schoolAdminHasCreatedAContentBook } from './syllabus-content-book-create-steps';
import { Book } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

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
    | 'simple content 2 chapter without quiz'
    | 'simple content 2 topic without quiz'
    | 'simple content have 1 quiz'
    | 'simple content with 5 question exam lo'
    | 'simple content with all LO type'
    | 'simple content with an assignment'
    | 'simple content with 1 LO learning'
    | 'simple content with 1 LO exam'
    | 'simple content with 2 LO learning, exam'
    | 'simple content with 1 LO exam has 1 question'
    | 'simple content with multiple handwriting answers'
    | 'original content to duplicate'
    | 'has 2 chapter'
    | 'has 2 topic'
    | 'simple content to move content learning'
    | 'all learning materials'
    | '2 items each learning type'
    | 'simple content have 5 card for move card'
    | '1 LO learning with (2-3) random questions type'
    | '1 LO with a random question type'
    | '1 exam lo with random time limit'
    | 'has 1 multiple choices question in LO'
    | 'has 1 manual input question in LO'
    | '1 exam lo with 1 minute time limit'
    | 'has 1 multiple answers question in LO'
    | 'has 1 flashcard';

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

// TODO: Hieu will check and replace by new way
const createBookStrategy = {
    onlyEmptyBook: schoolAdminHasCreatedAnEmptyBook,
    onlyOneEmptyChapter: schoolAdminHasCreatedNEmptyChapterInBook,
    onlyOneChapterTopic: schoolAdminHasCreatedAChapterTopicOnlyBook,
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
            return createBookStrategy.onlyOneChapterTopic(cms, scenario);

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

        case 'simple content with 1 LO learning': {
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
        case 'simple content with multiple handwriting answers': {
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
        case '2 items each learning type': {
            contentBook = {
                chapterQuantity: 1,
                topicQuantity: 1,
                learningObjectiveQuantity: 1,
                assignmentQuantity: 1,
                taskAssignmentQuantity: 1,
                questionQuantity: 0,
                enabledCourseStatistics: true,
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
