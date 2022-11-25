import { avatarUpload } from '@legacy-step-definitions/cms-selectors/course';
import {
    convertGradesToString,
    convertOneOfStringTypeToArray,
    getRandomElement,
    getRandomElementsWithLength,
    randomInteger,
    toShortenStr,
} from '@legacy-step-definitions/utils';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { ElementHandle } from 'playwright';

import { CMSInterface, LearnerInterface, LOType, TeacherInterface } from '@supports/app-types';
import { brightCoveSampleLink, sampleImageFilePath } from '@supports/constants';
import { Menu } from '@supports/enum';
import { ScenarioContext } from '@supports/scenario-context';
import { LearningObjectiveType } from '@supports/services/bob-course/const';
import { KeyQuizType } from '@supports/services/yasuo-course/const';
import { formatDate } from '@supports/utils/time/time';

import { KeyAssignmentType, KeyLearningObjectiveType } from '@services/bob-course/const';

import {
    aliasAssignmentName,
    aliasCurrentLearnerToDoTab,
    aliasExamLOName,
    aliasFlashcardName,
    aliasLOName,
    aliasTaskAssignmentName,
    aliasTopicName,
} from './alias-keys/syllabus';
import * as CMSKeys from './cms-selectors/cms-keys';
import { formHelperText } from './cms-selectors/cms-keys';
import {
    taskAssignmentSetting,
    TaskAssignmentSettingInfo,
} from './syllabus-create-task-assignment-definitions';
import { ByValueKey, delay, FlutterDriver } from 'flutter-driver-x';
import { QuizType } from 'manabuf/common/v1/contents_pb';
import { AssignmentType } from 'manabuf/eureka/v1/enums_pb';
import {
    Assignment,
    isAssignment,
    LearningObjective,
    LOTypeValueProps,
    LOTypeValueReturns,
    QuizTypeValueProps,
    QuizTypeValueReturns,
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { autocompleteLoading } from 'test-suites/squads/syllabus/step-definitions/cms-selectors/syllabus';

export type LearnerToDoTab = 'active' | 'completed' | 'overdue';

export type HandwritingLanguage = 'English' | 'Japanese' | 'Math';

export type SketchType = 'Empty' | 'Meaningless' | 'English' | 'Japanese' | 'Math';

export type TypingLanguage = 'English';

export async function waitForLoadingAbsent(flutterDriver: FlutterDriver, timeout = 10000) {
    const loadingDialog = new ByValueKey(SyllabusLearnerKeys.loading_dialog);

    await flutterDriver.waitForAbsent(loadingDialog, timeout);
}

// Actions to do something
export async function selectAllBooksInCourse(cms: CMSInterface) {
    await cms.waitForSkeletonLoading();
    await cms.page?.check(`${CMSKeys.tableCellHeader} input[type='checkbox']`);
}

export async function selectABookInCourse(cms: CMSInterface, bookName: string) {
    const bookItemRow = CMSKeys.tableRowByText(CMSKeys.bookTabTable, bookName);
    await cms.page?.waitForSelector(bookItemRow);
    await cms.page?.check(`${bookItemRow} input[type='checkbox']`);
}

export async function selectABookInBookList(cms: CMSInterface, bookName: string) {
    await cms.schoolAdminIsOnThePage(Menu.BOOKS, 'Book');

    await cms.waitForSkeletonLoading();

    await schoolAdminSearchAndSelectBook(cms, bookName);
    await cms.assertThePageTitle(`${bookName}`);
}

export const schoolAdminSearchAndSelectBook = async (cms: CMSInterface, bookName: string) => {
    await cms.searchInFilter(bookName);
    await cms.waitForSkeletonLoading();

    const selectedBook = await cms.assertTypographyWithTooltip('a', bookName);
    await selectedBook?.click();
};

export async function studentTapButtonOnScreen(
    learner: LearnerInterface,
    screenKey: string,
    buttonKey: string
) {
    await waitForLoadingAbsent(learner.flutterDriver!);
    await learner.flutterDriver!.waitFor(new ByValueKey(screenKey));
    await learner.flutterDriver!.tap(new ByValueKey(buttonKey));
}

// Assert
export const schoolAdminSeeTableCellValue = async (
    cms: CMSInterface,
    tableCell: { columnsSelector: string; rowIndex: number; cellValue: string }
) => {
    const { columnsSelector, rowIndex, cellValue } = tableCell;
    const cells = await cms.page!.$$(columnsSelector);

    if (rowIndex >= cells.length)
        throw Error(`Cannot found column ${columnsSelector} with row index ${rowIndex}`);

    const tableCellValue = await cells![rowIndex].innerText();

    weExpect(tableCellValue).toEqual(cellValue);
};

export const schoolAdminSeeTableRowTotal = async (
    cms: CMSInterface,
    table: { wrapper: string; rowTotal: number }
) => {
    const cmsPage = cms.page!;
    const { wrapper, rowTotal } = table;

    const tableRows = await cmsPage.$$(`${wrapper} ${CMSKeys.tableBaseRow}`);

    weExpect(tableRows?.length).toEqual(rowTotal);
};

export const schoolAdminSeesErrorMessageField = async (
    cms: CMSInterface,
    field: { wrapper: string; errorMessage?: string }
) => {
    const { wrapper, errorMessage } = field;

    if (errorMessage) {
        const errorText = await cms.getTextContentElement(`${wrapper} ${formHelperText}`);

        return weExpect(errorText, `Should see "${errorMessage}" message error field`).toEqual(
            errorMessage
        );
    }

    return await cms.page!.waitForSelector(`${wrapper} ${formHelperText}`);
};

export async function schoolAdminSeeBookInCourse(cms: CMSInterface, bookName: string) {
    await cms.page!.waitForSelector(CMSKeys.tableRowByText(CMSKeys.bookTabTable, bookName));
}

export const studentNotSeeSelectBookInCourseDetail = async (learner: LearnerInterface) => {
    const selectBookButtonKey = new ByValueKey(SyllabusLearnerKeys.select_book_button);
    try {
        await learner.flutterDriver!.waitForAbsent(selectBookButtonKey);
    } catch (e) {
        throw Error(`Expect select book button is not displayed`);
    }
};

export async function studentSeeBookNameAtSelectBookDialogInCourseDetail(
    learner: LearnerInterface,
    bookName: string
) {
    const selectBookButtonKey = new ByValueKey(SyllabusLearnerKeys.select_book_button);
    const listBookKey = new ByValueKey(SyllabusLearnerKeys.list_book);
    const bookItemKey = new ByValueKey(SyllabusLearnerKeys.book(bookName));

    await studentSeeChapterList(learner);
    await learner.flutterDriver!.tap(selectBookButtonKey);
    await learner.flutterDriver?.waitFor(listBookKey);
    await learner.instruction(`Display book ${bookName} in select book`, async function () {
        try {
            await learner.flutterDriver!.scrollUntilVisible(
                listBookKey,
                bookItemKey,
                0.0,
                0.0,
                -100
            );
        } catch (error) {
            throw Error(
                `Expect book ${bookName} is displayed in select book on Course detail screen`
            );
        }
    });
}

export async function studentTapSelectBookButtonInCourseDetail(learner: LearnerInterface) {
    const selectBookButtonKey = new ByValueKey(SyllabusLearnerKeys.select_book_button);
    await learner.flutterDriver!.tap(selectBookButtonKey);
}

export async function studentTapBookNameAtSelectBookDialogInCourseDetail(
    learner: LearnerInterface,
    bookName: string
) {
    const listBookKey = new ByValueKey(SyllabusLearnerKeys.list_book);
    const bookItemKey = new ByValueKey(SyllabusLearnerKeys.book(bookName));

    await learner.flutterDriver!.waitFor(listBookKey);
    try {
        await learner.flutterDriver!.scrollUntilTap(listBookKey, bookItemKey, 0.0, -100, 30000);
    } catch (error) {
        throw Error(`Expect book ${bookName} is displayed in select book on Course detail screen`);
    }
}

export async function studentSeeSelectedBookNameInCourseDetail(
    learner: LearnerInterface,
    bookName: string
) {
    const bookItemKey = new ByValueKey(SyllabusLearnerKeys.selectedBook(bookName));
    await learner.flutterDriver?.waitFor(bookItemKey);
}

export async function studentNotSeeSelectedBookNameInCourseDetail(
    learner: LearnerInterface,
    bookName: string
) {
    const bookItemKey = new ByValueKey(SyllabusLearnerKeys.selectedBook(bookName));
    await learner.flutterDriver?.waitForAbsent(bookItemKey);
}

export async function studentSeeAllChaptersInCourse(
    learner: LearnerInterface,
    chapterNames: string[]
) {
    for (const chapterName of chapterNames) {
        const chapterKey = new ByValueKey(SyllabusLearnerKeys.chapter(chapterName));
        await learner.flutterDriver?.waitFor(chapterKey);
    }
}

export async function studentNotSeeAllChaptersInCourse(
    learner: LearnerInterface,
    chapterNames: string[]
) {
    for (const chapterName of chapterNames) {
        const chapterKey = new ByValueKey(SyllabusLearnerKeys.chapter(chapterName));
        await learner.flutterDriver?.waitForAbsent(chapterKey);
    }
}

export async function studentSeeAllTopicsInCourse(learner: LearnerInterface, topicNames: string[]) {
    for (const topicName of topicNames) {
        const topicKey = new ByValueKey(SyllabusLearnerKeys.topic(topicName));
        await learner.flutterDriver?.waitFor(topicKey);
    }
}

export async function studentNotSeeAllTopicsInCourse(
    learner: LearnerInterface,
    topicNames: string[]
) {
    for (const topicName of topicNames) {
        const topicKey = new ByValueKey(SyllabusLearnerKeys.topic(topicName));
        await learner.flutterDriver?.waitForAbsent(topicKey);
    }
}

export async function studentNotSeeBookNameInCourseDetail(
    learner: LearnerInterface,
    bookName: string
) {
    const selectBookButtonKey = new ByValueKey(SyllabusLearnerKeys.select_book_button);
    const listBookKey = new ByValueKey(SyllabusLearnerKeys.list_book);
    const bookItemKey = new ByValueKey(SyllabusLearnerKeys.book(bookName));
    let isBookNamePresent = false;

    await studentSeeChapterList(learner);
    await learner.flutterDriver!.tap(selectBookButtonKey);
    await learner.flutterDriver?.waitFor(listBookKey);

    try {
        await learner.flutterDriver!.scrollUntilVisible(listBookKey, bookItemKey, 0.0, 0.0, -100);
        isBookNamePresent = true;
    } catch (error) {
        throw Error(`Not found book ${bookName} in select book`);
    }

    if (isBookNamePresent) {
        throw Error(
            `Expect book ${bookName} is not displayed in select book on Course detail screen`
        );
    }
}

export async function studentGoesToHomeTab(learner: LearnerInterface) {
    const homeTab = SyllabusLearnerKeys.learning_tab;

    try {
        await learner.flutterDriver?.waitFor(new ByValueKey(homeTab));

        await learner.instruction(`Student chooses Home tab`, async function () {
            await learner.clickOnTab(homeTab, SyllabusLearnerKeys.learning_page);
        });
    } catch (err) {
        await learner.instruction(`Student opens drawer`, async function () {
            await learner.openHomeDrawer();
        });

        await learner.instruction(`Student chooses Home tab`, async function () {
            await learner.clickOnTab(homeTab, SyllabusLearnerKeys.learning_page);
        });
    }
}

export async function studentGoesToTodosScreen(learner: LearnerInterface) {
    const todoTab = new ByValueKey(SyllabusLearnerKeys.todos_tab);

    try {
        await learner.flutterDriver?.waitFor(todoTab);

        await learner.instruction(`Student chooses Todos tab`, async function () {
            await learner.clickOnTab(SyllabusLearnerKeys.todos_tab, SyllabusLearnerKeys.todos_page);
        });
    } catch (err) {
        await learner.instruction(`Student opens drawer`, async function () {
            await learner.openHomeDrawer();
        });

        await learner.instruction(`Student chooses Todos tab`, async function () {
            await learner.clickOnTab(SyllabusLearnerKeys.todos_tab, SyllabusLearnerKeys.todos_page);
        });
    }
}

export async function studentGoesToPageFromHomeScreen(
    learner: LearnerInterface,
    tabKey: string,
    screenKey: string
) {
    try {
        await learner.flutterDriver?.waitFor(new ByValueKey(tabKey));

        await learner.instruction(`Student chooses ${tabKey}`, async function () {
            await learner.clickOnTab(tabKey, screenKey);
        });
    } catch (err) {
        await learner.instruction(`Student opens drawer`, async function () {
            await learner.openHomeDrawer();
        });

        await learner.instruction(`Student chooses ${tabKey}`, async function () {
            await learner.clickOnTab(tabKey, screenKey);
        });
    }
}

export async function studentGoesBackToHomeScreenFromCourseDetails(learner: LearnerInterface) {
    const bookDetailScreen = new ByValueKey(SyllabusLearnerKeys.book_detail_screen);
    const homeScreen = new ByValueKey(SyllabusLearnerKeys.homeScreen);
    const backButton = new ByValueKey(SyllabusLearnerKeys.back_button);

    await learner.flutterDriver!.waitFor(bookDetailScreen);
    await learner.flutterDriver!.waitFor(backButton);
    await learner.flutterDriver!.tap(backButton);
    await learner.flutterDriver!.waitFor(homeScreen);
}

export async function studentGoToCourseDetail(learner: LearnerInterface, courseName: string) {
    const listKey = new ByValueKey(SyllabusLearnerKeys.courseList);
    const itemKey = new ByValueKey(SyllabusLearnerKeys.course(courseName));
    await learner.flutterDriver!.waitFor(listKey);
    await learner.flutterDriver!.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -100);
    await learner.flutterDriver!.tap(itemKey);

    const bookDetailScreenFinder = new ByValueKey(SyllabusLearnerKeys.book_detail_screen);
    await learner.flutterDriver?.waitFor(bookDetailScreenFinder, 25000);
}

export async function studentGoToStudyPlanItemDetail(
    learner: LearnerInterface,
    topicName: string,
    studyPlanItemName: string
) {
    const listKey = new ByValueKey(SyllabusLearnerKeys.lo_list_screen(topicName));
    const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));

    await learner.flutterDriver!.waitFor(listKey);
    await learner.flutterDriver!.scrollUntilVisible(listKey, itemKey, 0.0, 0.0, -100, 20000);

    await learner.flutterDriver!.tap(itemKey);
}

export async function studentRefreshHomeScreen(learner: LearnerInterface) {
    try {
        await learner.flutterDriver!.waitFor(new ByValueKey(SyllabusLearnerKeys.courseList));
        await learner.flutterDriver!.scroll(
            new ByValueKey(SyllabusLearnerKeys.courseList),
            0.0,
            4000,
            1000,
            60
        );
    } catch (err) {
        await learner.flutterDriver!.scroll(
            new ByValueKey(SyllabusLearnerKeys.learning_page),
            0.0,
            4000,
            1000,
            60
        ); /// No course case
    }
}

export async function studentRefreshToDoScreen(learner: LearnerInterface, toDoTabPage: string) {
    await learner.flutterDriver!.waitFor(new ByValueKey(toDoTabPage), 2000);
    //scroll to top
    await learner.flutterDriver!.scroll(new ByValueKey(toDoTabPage), 0.0, 8000, 1000, 60);
    //refresh
    await learner.flutterDriver!.scroll(new ByValueKey(toDoTabPage), 0.0, 4000, 1000, 60);
}

export async function studentGoesToTabInToDoScreen(
    learner: LearnerInterface,
    context: ScenarioContext,
    toDoTabPage: LearnerToDoTab
) {
    await learner.instruction(
        `Student goes to ${toDoTabPage} tab in todo screen`,
        async function (learner) {
            const { pageKey, tabKey } = getLearnerToDoKeys(toDoTabPage);
            await learner.clickOnTab(tabKey, pageKey);
            await studentRefreshToDoScreen(learner, pageKey);
            context.set(aliasCurrentLearnerToDoTab, toDoTabPage);
        }
    );
}

export async function studentSeeStudyPlanItemInToDoTab(
    learner: LearnerInterface,
    studyPlanItemName: string,
    toDoTabPage: LearnerToDoTab
) {
    await learner.instruction(
        `Student sees ${studyPlanItemName} in tab ${toDoTabPage} in todo screen`,
        async function (learner) {
            const { pageKey } = getLearnerToDoKeys(toDoTabPage);

            const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));
            const listKey = new ByValueKey(pageKey);
            try {
                await learner.flutterDriver!.waitFor(listKey);

                await learner.flutterDriver!.scrollUntilVisible(
                    listKey,
                    itemKey,
                    0.0,
                    0.0,
                    -350,
                    20000
                );
            } catch (error) {
                throw Error(
                    `Expect study plan item ${studyPlanItemName} is displayed in ${toDoTabPage} Todos screen`
                );
            }
        }
    );
}

export async function studentDoesNotSeeStudyPlanItemInToDoTab(
    learner: LearnerInterface,
    studyPlanItemName: string,
    toDoTabPage: LearnerToDoTab
) {
    await learner.instruction(
        `Student does not sees ${studyPlanItemName} in tab ${toDoTabPage} in todo screen`,
        async function (learner) {
            const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));
            await learner.flutterDriver!.waitForAbsent(itemKey);
        }
    );
}

export async function studentGoToStudyPlanItemDetailsFromTodo(
    learner: LearnerInterface,
    studyPlanItemName: string,
    toDoTabPage: LearnerToDoTab
) {
    await learner.instruction(
        `Student tap to ${studyPlanItemName} in tab ${toDoTabPage} in todo screen`,
        async function (learner) {
            const { pageKey } = getLearnerToDoKeys(toDoTabPage);

            const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(studyPlanItemName));
            await learner.flutterDriver!.waitFor(new ByValueKey(pageKey), 2000);
            await learner.flutterDriver!.scrollUntilTap(
                new ByValueKey(pageKey),
                itemKey,
                0.0,
                -300,
                30000
            );
        }
    );
}

export function getLearnerToDoKeys(todoTab: LearnerToDoTab): { pageKey: string; tabKey: string } {
    let pageKey = '';
    let tabKey = '';
    switch (todoTab) {
        case 'active': {
            pageKey = SyllabusLearnerKeys.active_page;
            tabKey = SyllabusLearnerKeys.active_tab;
            break;
        }
        case 'completed': {
            pageKey = SyllabusLearnerKeys.completed_page;
            tabKey = SyllabusLearnerKeys.completed_tab;
            break;
        }
        case 'overdue': {
            pageKey = SyllabusLearnerKeys.overdue_page;
            tabKey = SyllabusLearnerKeys.overdue_tab;
            break;
        }
    }
    return { pageKey, tabKey };
}

// Helpers
export function getLOTypeValue({ loType, loTypeKey }: LOTypeValueProps): LOTypeValueReturns {
    switch (loType || loTypeKey) {
        case 'learning objective':
        case KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING:
            return {
                loTypeKey: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING,
                loTypeNumber: LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_LEARNING,
                loTypeTitle: 'Learning Objective',
            };
        case 'assignment':
        case KeyAssignmentType.ASSIGNMENT_TYPE_LEARNING_OBJECTIVE:
            return {
                loTypeKey: 'ASSIGNMENT',
                loTypeNumber: AssignmentType.ASSIGNMENT_TYPE_LEARNING_OBJECTIVE,
                loTypeTitle: 'Assignment',
            };
        case 'task assignment':
        case KeyAssignmentType.ASSIGNMENT_TYPE_TASK:
            return {
                loTypeKey: 'TASK_ASSIGNMENT',
                loTypeNumber: AssignmentType.ASSIGNMENT_TYPE_TASK,
                loTypeTitle: 'Task',
            };
        case 'flashcard':
        case KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD:
            return {
                loTypeKey: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD,
                loTypeNumber: LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_FLASH_CARD,
                loTypeTitle: 'Flashcard',
            };
        case 'exam LO':
        case KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO:
            return {
                loTypeKey: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO,
                loTypeNumber: LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_EXAM_LO,
                loTypeTitle: 'Exam LO',
            };
        default:
            return {
                loTypeKey: KeyLearningObjectiveType.LEARNING_OBJECTIVE_TYPE_NONE,
                loTypeNumber: LearningObjectiveType.LEARNING_OBJECTIVE_TYPE_NONE,
                loTypeTitle: '',
            };
    }
}

export function convertToStudyPlanItemNamesByTopicId(
    studyPlanItems: StudyPlanItem[]
): Map<string, string[]> {
    const studyPlanItemsByTopicIds = new Map<string, string[]>();
    for (const studyPlanItem of studyPlanItems) {
        let topicId: string | undefined;
        let studyPlanItemName: string;

        if (isAssignment(studyPlanItem)) {
            const assignment = studyPlanItem as Assignment;
            topicId = assignment.content?.topicId;
            studyPlanItemName = assignment.name;
        } else {
            const lo = studyPlanItem as LearningObjective;
            topicId = lo.topicId;
            studyPlanItemName = lo.info.name;
        }
        if (topicId != undefined) {
            const studyPlanItemsByTopicId = studyPlanItemsByTopicIds.get(topicId);
            if (studyPlanItemsByTopicId == undefined) {
                studyPlanItemsByTopicIds.set(topicId, [studyPlanItemName]);
            } else {
                studyPlanItemsByTopicId.push(studyPlanItemName);
            }
        }
    }
    return studyPlanItemsByTopicIds;
}

export const getStudyPlanItemNames = (studyPlanItems: StudyPlanItem[]) => {
    const names: string[] = [];

    studyPlanItems.forEach((studyPlanItem) => {
        if (isAssignment(studyPlanItem)) {
            const assignment = studyPlanItem as Assignment;
            names.push(assignment.name);
            return;
        }

        const lo = studyPlanItem as LearningObjective;
        names.push(lo.info.name);
    });

    return names;
};

export function getStudyPlanItemNamesByTopicIdAndType(
    topicId: string,
    studyPlanItemList: StudyPlanItem[],
    typeNumber: LOTypeValueReturns['loTypeNumber']
): { assignmentNames: string[]; loNames: string[] } {
    let assignmentNames: string[] = [];
    let loNames: string[] = [];
    studyPlanItemList.forEach((studyPlanItem) => {
        if (isAssignment(studyPlanItem)) {
            const assignment = studyPlanItem as Assignment;
            if (
                assignment.content?.topicId === topicId &&
                assignment.assignmentType === typeNumber
            ) {
                assignmentNames = [...assignmentNames, assignment.name];
            }
            return;
        }

        const lo = studyPlanItem as LearningObjective;
        if (lo.topicId === topicId && lo.type === typeNumber) {
            loNames = [...loNames, lo.info.name];
        }
    });

    return { assignmentNames, loNames };
}

export function getDataByStudyPlanItemListWithTopicId(
    topicId: string,
    studyPlanItemList: StudyPlanItem[]
): {
    loListByTopicId: LearningObjective[];
    assignmentListByTopicId: Assignment[];
    studyPlanItemListByTopicId: StudyPlanItem[];
} {
    let loListByTopicId: LearningObjective[] = [];
    let assignmentListByTopicId: Assignment[] = [];
    const studyPlanItemListByTopicId = studyPlanItemList.filter((studyPlanItem) => {
        if (isAssignment(studyPlanItem)) {
            const data = studyPlanItem as Assignment;
            if (data.content?.topicId === topicId) {
                assignmentListByTopicId = [...assignmentListByTopicId, ...[data]];
                return data;
            }
        }

        const data = studyPlanItem as LearningObjective;
        if (data.topicId === topicId) {
            loListByTopicId = [...loListByTopicId, ...[data]];
            return data;
        }
    });

    return {
        loListByTopicId,
        assignmentListByTopicId,
        studyPlanItemListByTopicId,
    };
}

export function getQuizTypeValue({
    quizTypeTitle,
    quizTypeNumber,
    quizTypeKey,
}: QuizTypeValueProps): QuizTypeValueReturns {
    switch (quizTypeTitle || quizTypeNumber || quizTypeKey) {
        case 'multiple choice':
        case QuizType.QUIZ_TYPE_MCQ:
        case KeyQuizType.QUIZ_TYPE_MCQ:
            return {
                quizTypeKey: KeyQuizType.QUIZ_TYPE_MCQ,
                quizTypeNumber: QuizType.QUIZ_TYPE_MCQ,
                quizTypeTitle: 'multiple choice',
            };
        case 'fill in the blank':
        case QuizType.QUIZ_TYPE_FIB:
        case KeyQuizType.QUIZ_TYPE_FIB:
            return {
                quizTypeKey: KeyQuizType.QUIZ_TYPE_FIB,
                quizTypeNumber: QuizType.QUIZ_TYPE_FIB,
                quizTypeTitle: 'fill in the blank',
            };
        case 'manual input':
        case QuizType.QUIZ_TYPE_MIQ:
        case KeyQuizType.QUIZ_TYPE_MIQ:
            return {
                quizTypeKey: KeyQuizType.QUIZ_TYPE_MIQ,
                quizTypeNumber: QuizType.QUIZ_TYPE_MIQ,
                quizTypeTitle: 'manual input',
            };
        case 'multiple answer':
        case QuizType.QUIZ_TYPE_MAQ:
        case KeyQuizType.QUIZ_TYPE_MAQ:
            return {
                quizTypeKey: KeyQuizType.QUIZ_TYPE_MAQ,
                quizTypeNumber: QuizType.QUIZ_TYPE_MAQ,
                quizTypeTitle: 'multiple answer',
            };
        default:
            return {
                quizTypeKey: KeyQuizType.QUIZ_TYPE_FIB,
                quizTypeNumber: QuizType.QUIZ_TYPE_FIB,
                quizTypeTitle: 'fill in the blank',
            };
    }
}

export const getGradesStringOrEmptyGradesString = (grades: number[], emptyGradesString = '--') => {
    return grades.length ? convertGradesToString(grades) : emptyGradesString;
};

export async function studentSeeChapterList(learner: LearnerInterface) {
    const chapterTopicListKey = new ByValueKey(SyllabusLearnerKeys.chapter_with_topic_list);
    let foundKey = false;
    while (!foundKey) {
        try {
            await learner.flutterDriver!.waitFor(chapterTopicListKey);
            foundKey = true;
        } catch (e) {
            const emptyChapterList = new ByValueKey(SyllabusLearnerKeys.empty_chapter_list);
            await learner.flutterDriver!.waitFor(emptyChapterList);
            await learner.flutterDriver!.scroll(emptyChapterList, 0.0, 6000, 1000, 60);
            await delay(3000);
        }
    }
}

export function getTopicId(context: ScenarioContext): string {
    const topicName = context.get<string>(aliasTopicName);
    const topicId = topicName!.split(' ')[1];
    return topicId;
}

export function getTopicsByChapterId(
    topicList: Topic[],
    chapterId: string
): {
    topicsByChapterId: Topic[];
    topicNamesByChapterId: string[];
    remainedTopics: Topic[];
    remainedTopicNames: string[];
} {
    let topicsByChapterId: Topic[] = [];
    let remainedTopics: Topic[] = [];

    for (const topic of topicList) {
        if (topic.chapterId === chapterId) {
            topicsByChapterId = [...topicsByChapterId, topic];
        } else {
            remainedTopics = [...remainedTopics, topic];
        }
    }

    const topicNamesByChapterId = topicsByChapterId.map((topic) => topic.name);
    const remainedTopicNames = remainedTopics.map((topic) => topic.name);

    return { topicsByChapterId, topicNamesByChapterId, remainedTopics, remainedTopicNames };
}

export function getConvertedStringType<T>(string: string): T {
    if (string.startsWith('1 of [')) {
        return getRandomElement<T>(convertOneOfStringTypeToArray(string));
    }

    return string as unknown as T;
}

export async function schoolAdminCheckGradesAutocompleteEmpty(
    cms: CMSInterface,
    wrapper: string
): Promise<boolean> {
    const cmsPage = cms.page!;
    const gradeTags = await cmsPage.$$(`${wrapper} [data-testid="AutocompleteBase__tagBox"]`);

    return !gradeTags.length;
}

export const assertStudyPlanItemDateError = async (
    cms: CMSInterface,
    input: ElementHandle<SVGElement | HTMLElement>,
    message: string
) => {
    await input.hover();
    await cms.page!.waitForSelector(`text="${message}"`);
};

export const enterStudyPlanItemDates = async (
    inputs: ElementHandle<SVGElement | HTMLElement>[],
    dates: Date[],
    withTime = true
) => {
    if (inputs.length !== dates.length) {
        throw new Error('Number of inputs must equal to number of dates');
    }

    for (let i = 0; i < inputs.length; i++) {
        await inputs[i].type(formatDate(dates[i], withTime ? 'YYYY/MM/DD, HH:mm' : 'YYYY/MM/DD'));
        await inputs[i].press('Tab');
    }
};

export const schoolAdminUploadAvatarInput = async (
    cms: CMSInterface,
    filePath: string = sampleImageFilePath
) => {
    await cms.page!.setInputFiles(avatarUpload, filePath);
};

export const schoolAdminSeeLOsItemInBook = async (cms: CMSInterface, name: string) => {
    await cms.page?.waitForSelector(CMSKeys.loAndAssignmentByName(name));
};

export const schoolAdminNotSeeLOsItemInBook = async (cms: CMSInterface, name: string) => {
    await cms.page?.waitForSelector(CMSKeys.loAndAssignmentByName(name), {
        state: 'detached',
    });
};

export const schoolAdminGetABrightCoveVideo = () => {
    return { src: brightCoveSampleLink };
};

export const schoolAdminGetSampleFiles = () => {
    const sampleFiles = [
        'sample-pdf.pdf',
        'sample-video.mp4',
        'sample-audio.mp3',
        'sample-image.jpeg',
    ];
    const filePaths: string[] = sampleFiles.map((file) => `./assets/${file}`);

    return { sampleFiles, filePaths };
};

export const schoolAdminSeeFileMediaChip = async (cms: CMSInterface, name: string) => {
    await cms.page?.waitForSelector(CMSKeys.fileChipName(toShortenStr(name, 20)));
};

export const parseTeacherDurationToStudentDuration = (teacherDuration: string): string => {
    let formattedSubmittedDuration = '';
    const hourInNumber = parseInt(teacherDuration.split('hour')[0]);
    if (hourInNumber > 1) {
        formattedSubmittedDuration = `${teacherDuration.split('s')[0]} ${
            teacherDuration.split('s')[1].split('min')[0]
        }min`;
    } else {
        formattedSubmittedDuration = `${teacherDuration.split('hour')[0]}hour ${
            teacherDuration.split('hour')[1].split('min')[0]
        }min`;
    }
    return formattedSubmittedDuration;
};

export const parseStudentDurationToTeacherDuration = (studentDuration: string): string => {
    let formattedSubmittedDuration = '';

    const hour = studentDuration.split(' ')[0];
    const hourInNumber = parseInt(hour.split('hour')[0]) ?? 0;
    const min = studentDuration.split(' ')[1];
    const minInNumber = parseInt(min) ?? 0;
    if (hourInNumber > 1 && minInNumber > 1) {
        return (formattedSubmittedDuration = `${hourInNumber}hours${minInNumber}minutes`);
    }
    if (hourInNumber > 1 && minInNumber <= 1) {
        return (formattedSubmittedDuration = `${hourInNumber}hours${minInNumber}minute`);
    }
    if (hourInNumber <= 1 && minInNumber <= 1) {
        return (formattedSubmittedDuration = `${hourInNumber}hour${minInNumber}minute`);
    }
    if (hourInNumber <= 1 && minInNumber > 1) {
        return (formattedSubmittedDuration = `${hourInNumber}hour${minInNumber}minutes`);
    }
    return formattedSubmittedDuration;
};

export const parseTeacherCompleteDateToStudentCompleteDate = (
    teacherCompleteDate: string
): string => {
    let formattedTeacherCompleteDate = teacherCompleteDate;
    const elements = teacherCompleteDate.split('/')[0];
    const now = new Date();
    const thisYear = now.getFullYear();
    if (elements.length == 2) {
        formattedTeacherCompleteDate = `${thisYear.toString()}/${
            teacherCompleteDate.split('/')[0]
        }/${teacherCompleteDate.split('/')[1]}`;
    }
    return formattedTeacherCompleteDate;
};

export const getRandomTaskAssignmentSettings = () => {
    const settingQuantity = randomInteger(1, Object.keys(taskAssignmentSetting).length);
    return getRandomElementsWithLength(
        Object.keys(taskAssignmentSetting),
        settingQuantity
    ) as TaskAssignmentSettingInfo[];
};

export const calculateStudentGradeInPercent = (studentGrade: string): number => {
    const correctness = parseInt(studentGrade.split('/')[0]);
    const totalScore = parseInt(studentGrade.split('/')[1]);

    return (correctness / totalScore) * 100;
};

export const schoolAdminGetBookNameDuplicated = (bookName: string) => `Duplicate - ${bookName}`;

export const studentTodoName = (prefix: string) => `${prefix}'s To-do`;

export async function studentWaitingQuizScreen(learner: LearnerInterface, loName: string) {
    const driver = learner.flutterDriver!;

    await driver.runUnsynchronized(async () => {
        await driver.waitFor(new ByValueKey(SyllabusLearnerKeys.quiz_screen(loName)));
    });
}

export const mappedLOTypeWithAliasStringName: { [x in LOType]: string } = {
    assignment: aliasAssignmentName,
    flashcard: aliasFlashcardName,
    'learning objective': aliasLOName,
    'exam LO': aliasExamLOName,
    'task assignment': aliasTaskAssignmentName,
};

export const teacherClicksBackButtonOnActionBar = async (teacher: TeacherInterface) => {
    const backButtonKey = new ByValueKey(SyllabusTeacherKeys.backButton);
    await teacher.flutterDriver!.tap(backButtonKey);
};

export const draw = async (
    driver: FlutterDriver,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
) => {
    await driver.webDriver!.page.mouse.move(fromX, fromY, { steps: 1 });
    await driver.webDriver!.page.mouse.down();
    await driver.webDriver!.page.mouse.move(toX, toY, { steps: 40 });
    await driver.webDriver!.page.mouse.up();
};

export const schoolAdminSeeFileIconVideo = async (cms: CMSInterface) => {
    await cms.page!.waitForSelector(CMSKeys.fileIconVideo);
};

export const schoolAdminWaitForAutocomplete = async (cms: CMSInterface) => {
    await cms.page!.waitForSelector(autocompleteLoading, { state: 'hidden' });
};
