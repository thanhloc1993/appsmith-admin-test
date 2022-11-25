import { courseStudyPlanTable } from '@legacy-step-definitions/cms-selectors/course';
import { SearchStringCase } from '@legacy-step-definitions/types/common';
import {
    asyncForEach,
    getRandomElement,
    gradesCMSMap,
    randomBoolean,
    randomInteger,
    randomUniqueIntegers,
} from '@legacy-step-definitions/utils';

import { genId } from '@drivers/message-formatter/utils';

import { CMSInterface } from '@supports/app-types';

import {
    autocompleteBaseOption,
    gradeAutoCompleteHFInput,
    tableEmptyMessage,
} from './cms-selectors/cms-keys';
import { StudyPlanStatus } from 'manabuf/eureka/v1/enums_pb';
import { UpsertStudyPlanRequest } from 'manabuf/eureka/v1/study_plan_modifier_pb';
import { Book } from 'test-suites/squads/syllabus/step-definitions/cms-models/content';

export type GradeAndBookFilterStudyPlanCase =
    | 'none'
    | 'grade and book'
    | 'grade or book'
    | 'multiple grade and book'
    | 'multiple grade or book';

export interface FilterStudyPlan {
    searchKeyWord?: string;
    grades?: number[];
    status?: StudyPlanStatus;
    books?: Pick<Book, 'name' | 'bookId'>[];
}

export const randomGradeList = (maxSize: number, minSize = 0) => {
    const maxGrade = 15;
    return randomUniqueIntegers(maxGrade, randomInteger(minSize, maxSize), 1).sort();
};

const randomStudyPlanStatus = () => {
    return getRandomElement([
        StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE,
        StudyPlanStatus.STUDY_PLAN_STATUS_ARCHIVED,
    ]);
};

export const schoolAdminSeeEmptyCourseStudyPlan = async (cms: CMSInterface) => {
    await cms.page?.waitForSelector(`${courseStudyPlanTable} ${tableEmptyMessage}`);
};

export const schoolAdminCreateNStudyPlansPayLoadToFilter = ({
    bookIds,
    courseId,
    schoolId,
    status,
    total = 10,
}: {
    bookIds: string[];
    courseId: string;
    schoolId: number;
    status?: StudyPlanStatus;
    total?: number;
}) => {
    const studyPlans: UpsertStudyPlanRequest.AsObject[] = [];

    const nameTemplates = ['Action', 'Learn', 'Music', 'Cook'];

    for (let i = 0; i < total; i++) {
        const name = `${getRandomElement(nameTemplates)} ${genId()}`;

        const gradesList = randomGradeList(3, 1);

        const bookId = getRandomElement(bookIds);

        const studyPlan: UpsertStudyPlanRequest.AsObject = {
            bookId,
            courseId,
            schoolId,
            status: typeof status !== 'undefined' ? status : randomStudyPlanStatus(),
            gradesList,
            trackSchoolProgress: randomBoolean(),
            name,
        };

        studyPlans.push(studyPlan);
    }

    return studyPlans;
};

export const createStudyPlanFilters = (
    gradeAndBook: GradeAndBookFilterStudyPlanCase,
    bookList: Book[],
    studyPlan: UpsertStudyPlanRequest.AsObject
): FilterStudyPlan => {
    const { gradesList = [], bookId: toBeIncludedBookId, status } = studyPlan;

    let grades: number[] = [...new Set([...(gradesList || []), ...randomGradeList(3)])];
    let booksFilter: Pick<Book, 'name' | 'bookId'>[] = randomUniqueIntegers(
        bookList.length - 1,
        3
    ).map((bookIndex) => {
        const { bookId, name } = bookList[bookIndex];
        return { bookId, name };
    });

    const isHasBookShouldInclude = booksFilter.find(({ bookId }) => bookId === toBeIncludedBookId);

    const bookIndex = bookList.findIndex(({ bookId }) => bookId === toBeIncludedBookId);

    if (!isHasBookShouldInclude) {
        booksFilter.push(bookList[bookIndex]);
    }

    switch (gradeAndBook) {
        case 'grade and book': {
            const { bookId, name } = bookList[bookIndex];
            booksFilter = [{ name, bookId }];
            grades = [getRandomElement(gradesList)];
            break;
        }
        case 'grade or book': {
            if (randomBoolean()) {
                const { bookId, name } = bookList[bookIndex];
                booksFilter = [{ name, bookId }];
                grades = [];
                break;
            }
            grades = [getRandomElement(gradesList)];
            booksFilter = [];
            break;
        }
        case 'multiple grade or book': {
            if (randomBoolean()) {
                booksFilter = [];
                break;
            }
            grades = [];
            break;
        }
        case 'none': {
            booksFilter = [];
            grades = [];
            break;
        }
        default:
            break;
    }

    return {
        grades,
        books: booksFilter,
        status,
    };
};

export const getStudyPlanNameForSearch = (
    testCase: SearchStringCase,
    studyPlanShouldMatch: UpsertStudyPlanRequest.AsObject
) => {
    if (testCase === 'none') return undefined;
    if (testCase === 'incorrect') return genId();

    return studyPlanShouldMatch.name.split(' ')[0];
};

export const getStudyPlansMatchedWithFilters = (
    studyPlans: UpsertStudyPlanRequest.AsObject[],
    filters: FilterStudyPlan,
    isStudentStudyPlan?: boolean
): UpsertStudyPlanRequest.AsObject[] => {
    const matches: UpsertStudyPlanRequest.AsObject[] = [];
    const { books = [], grades = [], searchKeyWord, status: statusFilter } = filters;

    const bookIds = books.map((book) => book.bookId);

    for (let i = 0; i < studyPlans.length; i++) {
        const currentStudyplan = studyPlans[i];
        const { name, bookId, gradesList, status } = currentStudyplan;
        const isArchivedStudyPlan = status === StudyPlanStatus.STUDY_PLAN_STATUS_ARCHIVED;

        if (searchKeyWord) {
            const nameMatched = name.includes(searchKeyWord);
            if (!nameMatched) continue;
        }

        if (books.length) {
            if (!bookIds.includes(bookId)) continue;
        }

        if (grades.length) {
            const matchesGrade = gradesList.some((grade) => grades.includes(grade));
            if (!matchesGrade) continue;
        }

        // For student study plan we only show the study plan active
        if (isStudentStudyPlan && isArchivedStudyPlan) continue;

        // For course study plan when statusFilter is STUDY_PLAN_STATUS_ARCHIVED we will show a both status
        // Otherwise only STUDY_PLAN_STATUS_ACTIVE is display
        if (statusFilter === StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE && isArchivedStudyPlan) {
            continue;
        }

        matches.push(currentStudyplan);
    }

    return matches;
};

export const schoolAdminFilterAdvancedStudyPlan = async (
    cms: CMSInterface,
    filters: FilterStudyPlan
) => {
    const { books = [], grades = [], status } = filters;
    // TODO: Update
    const bookInputSelector = 'input[name="books"]';

    if (grades.length) {
        await cms.page?.click(gradeAutoCompleteHFInput);

        await asyncForEach(grades, async (grade) => {
            const gradeOption = gradesCMSMap[grade as unknown as keyof typeof gradesCMSMap];
            await cms.instruction(`User select grade ${gradeOption}`, async () => {
                await cms.page?.click(`${autocompleteBaseOption}:has-text("${gradeOption}")`);
            });
        });

        await cms.page?.keyboard.press('Escape');
    }

    await cms.waitingAutocompleteLoading();
    if (books.length) {
        await asyncForEach(books, async ({ name }) => {
            await cms.instruction(`User select book ${name}`, async () => {
                await cms.page?.fill(bookInputSelector, name);
                await cms.waitingAutocompleteLoading();
                await cms.chooseOptionInAutoCompleteBoxByText(name);

                await cms.page?.fill(bookInputSelector, '');
            });
        });
        await cms.page?.keyboard.press('Escape');
    }

    if (status === StudyPlanStatus.STUDY_PLAN_STATUS_ARCHIVED) {
        await cms.instruction('User will show study plans archived', async () => {
            await cms.page?.click('input[type="checkbox"]');
        });
    }
};
