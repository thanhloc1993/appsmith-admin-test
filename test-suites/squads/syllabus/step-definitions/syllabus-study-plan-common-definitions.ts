import {
    schoolAdminApplyFilterAdvanced,
    schoolAdminOpenFilterAdvanced,
} from '@legacy-step-definitions/cms-common-definitions';
import { asyncForEach, convertGradesToString, genId } from '@legacy-step-definitions/utils';
import { toShortenStr } from '@syllabus-utils/common';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';
import { learnerProfileAliasWithAccountRoleSuffix } from '@user-common/alias-keys/user';

import { Response } from 'playwright';

import { CMSInterface, StudyPlanItemStatus, TeacherInterface } from '@supports/app-types';
import { UserProfileEntity } from '@supports/entities/user-profile-entity';
import {
    StudyPlanOneV2Query,
    Syllabus_StudyPlanItems_MasterQuery,
} from '@supports/graphql/eureka/eureka-types';
import { eurekaStudyPlanQueries } from '@supports/graphql/eureka/study-plan.query';
import createGrpcMessageDecoder from '@supports/packages/grpc-message-decoder/grpc-message-decoder';
import { ScenarioContext } from '@supports/scenario-context';
import studyPlanModifierService from '@supports/services/eureka-study_plan_modifier-service';
import {
    StudyPlanItemAsObject,
    StudyPlanItemObject,
} from '@supports/services/eureka-study_plan_modifier-service/types';
import { ActionOptions } from '@supports/types/cms-types';
import { formatDate } from '@supports/utils/time/time';

import {
    aliasCourseId,
    aliasStudentStudyPlanRowIndex,
    aliasStudyPlanName,
    aliasTopicStudyPlanItemRowIndex,
} from './alias-keys/syllabus';
import * as CMSKeys from './cms-selectors/cms-keys';
import {
    actionPanelTriggerButton,
    bookAutocompleteHFRoot,
    breadcrumb,
    entityIconButton,
    getButtonSelectorByAction,
    tableBaseRow,
} from './cms-selectors/cms-keys';
import * as StudyPlanKeys from './cms-selectors/study-plan';
import { itemTopicNameColumn } from './cms-selectors/study-plan';
import { schoolAdminGotoCourseDetail } from './create-course-studyplan-definitions';
import { randomGradeList } from './search-course-study-plan-definitions';
import { schoolAdminAddBooksToCourseByCallingGRPC } from './syllabus-add-book-to-course-definitions';
import { StudyPlanTestCase } from './syllabus-book-csv';
import { modifyStudyPlanItems } from './syllabus-study-plan-item-common-definitions';
import {
    getGradesStringOrEmptyGradesString,
    schoolAdminSeesErrorMessageField,
    schoolAdminSeeTableCellValue,
    schoolAdminSeeTableRowTotal,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { StudyPlanItemStatus as StudyPlanItemStatusEnumProto } from 'manabuf/eureka/v1/assignments_pb';
import { StudyPlanStatus } from 'manabuf/eureka/v1/enums_pb';
import {
    UpsertStudyPlanRequest,
    UpsertStudyPlanResponse,
} from 'manabuf/eureka/v1/study_plan_modifier_pb';
import { schoolAdminChooseTabInCourseDetail } from 'test-suites/common/step-definitions/course-definitions';
import {
    Assignment,
    Book,
    isAssignment,
    LearningObjective,
    StudyPlan,
    StudyPlanItem,
    Topic,
} from 'test-suites/squads/syllabus/step-definitions/cms-models/content';
import { getTestId } from 'test-suites/squads/syllabus/utils/common';
import { retry } from 'ts-retry-promise';

export type EditMenuAction = 'edit school date' | 'edit time' | 'archive' | 'unarchive';

export type StudyPlanPageType = 'master' | 'individual';

export const shortDateTimePattern = /\d{2}\/\d{2},\s\d{2}:\d{2}/;
export const fullDateTimePattern = /\d{4}\/\d{2}\/\d{2},\s\d{2}:\d{2}/;

export type StudyPlanInfoType =
    | 'full'
    | 'name'
    | 'book and name'
    | 'grades, tracked school progress'
    | 'empty book'
    | 'empty name'
    | 'empty grades, untracked school progress';

export type StudyPlanStatusType = 'active' | 'archived';

export const schoolAdminSelectStudyPlanTabByType = async (
    cms: CMSInterface,
    tabType: 'course' | 'student' | 'master' | 'individual'
) => {
    let tab: typeof tabType = tabType;

    if (tab === 'master') tab = 'course';
    else if (tab === 'individual') tab = 'student';

    await cms.page?.click(`${CMSKeys.toggleButtonBase}[value="${tab}_study_plans"]`);
    await cms.waitForSkeletonLoading();
};

export const schoolAdminGoesToStudentStudyPlanDetailPage = async (
    cms: CMSInterface,
    student: { name: string; studyPlanName: string }
) => {
    const { name, studyPlanName } = student;
    const studyPlanNameLink = await cms.page!.waitForSelector(
        StudyPlanKeys.studyPlanNameLinkByStudent(name, studyPlanName)
    );

    await studyPlanNameLink?.click();
    await cms.waitingForLoadingIcon();
    await cms.waitForSkeletonLoading();
};

export const schoolAdminGoesToIndividualStudyPlan = async (
    cms: CMSInterface,
    context: ScenarioContext,
    student: 'student S1' | 'student S2'
) => {
    const courseId = context.get(aliasCourseId);
    const studyPlanName = context.get(aliasStudyPlanName);

    const learner = context.get<UserProfileEntity>(
        learnerProfileAliasWithAccountRoleSuffix(student)
    );

    await schoolAdminGotoCourseDetail(cms, courseId);
    await schoolAdminSelectStudyPlanTabByType(cms, 'individual');
    await schoolAdminSelectStudyPlanOfStudent(cms, learner.name, studyPlanName);
    await schoolAdminWaitingStudyPlanDetailLoading(cms);
};

export const schoolAdminGoesToCourseStudyPlanDetailPage = async (
    cms: CMSInterface,
    studyPlanName: string
) => {
    await schoolAdminFilterShowArchivedStudyPlan(cms, true);
    await schoolAdminSelectCourseStudyPlan(cms, studyPlanName);

    await schoolAdminWaitingStudyPlanDetailLoading(cms);
};

export const schoolAdminClickAddStudyPlanButton = async (cms: CMSInterface) => {
    const cmsPage = cms.page!;
    const studyPlanAddButton = await cmsPage.waitForSelector(StudyPlanKeys.addButton);

    await studyPlanAddButton?.click();
    await cmsPage.waitForSelector(StudyPlanKeys.studyPlanDialog);
};

export const schoolAdminSeesStudyPlanContentActionState = async (
    cms: CMSInterface,
    actionState: boolean
) => {
    const cmsPage = cms.page!;

    const hiddenItemCheckbox = await cmsPage.waitForSelector(
        StudyPlanKeys.displayHiddenItemsCheckbox
    );
    const editStudyPlanItemButton = await cmsPage.waitForSelector(
        StudyPlanKeys.editStudyPlanItemButton
    );

    const isDisabledCheckbox = await hiddenItemCheckbox.isDisabled();
    const isDisabledButton = await editStudyPlanItemButton.isDisabled();

    weExpect(isDisabledCheckbox, 'Display hidden items checkbox').toEqual(actionState);
    weExpect(isDisabledButton, 'StudyPlanItem edit button').toEqual(actionState);
};

export const schoolAdminSeeActionButtonInStudyPlanDetailPage = async (
    cms: CMSInterface,
    action: ActionOptions.EDIT | ActionOptions.ARCHIVE | ActionOptions.UNARCHIVE
) => {
    const cmsPage = cms.page!;
    const editButtonSelector = getButtonSelectorByAction(ActionOptions.EDIT);
    const archiveButtonSelector = getButtonSelectorByAction(ActionOptions.ARCHIVE);
    const unarchiveButtonSelector = getButtonSelectorByAction(ActionOptions.UNARCHIVE);

    const isDisabledEditButton = await cmsPage.getAttribute(editButtonSelector, 'aria-disabled');

    switch (action) {
        case ActionOptions.EDIT:
        case ActionOptions.ARCHIVE: {
            const isDisabledArchiveButton = await cmsPage.getAttribute(
                archiveButtonSelector,
                'aria-disabled'
            );

            await cmsPage.waitForSelector(unarchiveButtonSelector, {
                state: 'detached',
            });

            weExpect(isDisabledEditButton, 'Edit button should be enabled').toBeNull();
            weExpect(isDisabledArchiveButton, 'Archive button should be enabled').toBeNull();
            break;
        }

        case ActionOptions.UNARCHIVE: {
            const isDisabledUnarchiveButton = await cmsPage.getAttribute(
                unarchiveButtonSelector,
                'aria-disabled'
            );

            await cmsPage.waitForSelector(archiveButtonSelector, {
                state: 'detached',
            });

            weExpect(
                isDisabledEditButton,
                'Edit button aria-disabled should have true value'
            ).toEqual('true');

            weExpect(isDisabledUnarchiveButton, 'Unarchive button should be enabled').toBeNull();
            break;
        }
        default:
            break;
    }
};

export const schoolAdminClickActionButtonInStudyPlanDetailPage = async (
    cms: CMSInterface,
    action: ActionOptions.EDIT | ActionOptions.ARCHIVE | ActionOptions.UNARCHIVE
) => {
    const cmsPage = cms.page!;
    const actionButtonSelector = getButtonSelectorByAction(action);

    await cmsPage.click(actionPanelTriggerButton);

    await schoolAdminSeeActionButtonInStudyPlanDetailPage(cms, action);

    await cmsPage.click(actionButtonSelector);
};

export const schoolAdminCannotClickActionButtonInStudyPlanDetailPage = async (
    cms: CMSInterface,
    action: ActionOptions.EDIT | ActionOptions.ARCHIVE | ActionOptions.UNARCHIVE
) => {
    const cmsPage = cms.page!;

    await cmsPage.click(actionPanelTriggerButton);

    await schoolAdminSeeActionButtonInStudyPlanDetailPage(cms, action);
};

export const schoolAdminSubmitStudyPlanDialog = async (cms: CMSInterface) => {
    await cms.confirmDialogAction();
};

export const schoolAdminIsOnStudyPlanTab = async (
    cms: CMSInterface,
    courseId: string,
    studyPlanType: StudyPlanPageType
) => {
    await schoolAdminGotoCourseDetail(cms, courseId);
    await schoolAdminChooseTabInCourseDetail(cms, 'studyPlan');
    await cms.waitingForLoadingIcon();
    await cms.waitForSkeletonLoading();

    if (studyPlanType === 'individual') {
        await schoolAdminSelectStudyPlanTabByType(cms, 'student');
    }
};

export const schoolAdminGoesToCourseViaBreadcrumbs = async (
    cms: CMSInterface,
    courseName: string
) => {
    const courseBreadcrumbItem = await cms.waitForSelectorHasText(
        `${breadcrumb} a`,
        toShortenStr(courseName)
    );

    await courseBreadcrumbItem?.click();
};

export const schoolAdminGoesToStudyPlanTabFromCourse = async (
    cms: CMSInterface,
    studyPlanType: StudyPlanPageType
) => {
    await schoolAdminChooseTabInCourseDetail(cms, 'studyPlan');
    await cms.waitingForLoadingIcon();
    await cms.waitForSkeletonLoading();

    if (studyPlanType === 'individual') {
        await schoolAdminSelectStudyPlanTabByType(cms, 'student');
    }
};

export const schoolAdminSeeErrorMessageFieldInStudyPlanForm = async (
    cms: CMSInterface,
    missingField: StudyPlanInfoType
) => {
    switch (missingField) {
        case 'empty book':
            return await schoolAdminSeesErrorMessageField(cms, {
                wrapper: bookAutocompleteHFRoot,
                errorMessage: 'This field is required',
            });
        case 'empty name':
            return await schoolAdminSeesErrorMessageField(cms, {
                wrapper: StudyPlanKeys.studyPlanNameHFRoot,
                errorMessage: 'This field is required',
            });
        default:
            return;
    }
};

export const schoolAdminSeeStudyPlanInfo = async (
    cms: CMSInterface,
    courseStudyPlan: StudyPlan
): Promise<void> => {
    const { name: studyPlanName, bookName, trackSchoolProgress, gradesList } = courseStudyPlan;

    await cms.assertThePageTitle(studyPlanName);

    const bookNameInfo = await cms.getTextContentElement(StudyPlanKeys.bookNameInfo);
    const trackSchoolProgressInfo = await cms.getTextContentElement(
        StudyPlanKeys.trackSchoolProgressInfo
    );
    const gradesElement = await cms.page!.$(StudyPlanKeys.gradesInfo);
    const gradesInfo = await gradesElement!.textContent();

    weExpect(bookNameInfo).toEqual(bookName);
    weExpect(trackSchoolProgressInfo).toEqual(trackSchoolProgress ? 'Yes' : 'No');
    weExpect(gradesInfo).toEqual(gradesList.length ? convertGradesToString(gradesList) : '');
};

export const schoolAdminSeeStudyPlanByStudent = async (
    cms: CMSInterface,
    studentName: string,
    courseStudyPlan: { studyPlanName?: string; bookName?: string; gradesList?: number[] }
) => {
    const cmsPage = cms.page!;
    const { studyPlanName = '--', bookName = '--', gradesList = [] } = courseStudyPlan;

    const studyPlanNameColumnOfStudent = StudyPlanKeys.getStudyPlanNameColumnOfStudent(
        studentName,
        studyPlanName
    );
    const bookNameColumnOfStudentStudyPlan = StudyPlanKeys.getStudyPlanBookNameColumnOfStudent(
        studyPlanNameColumnOfStudent,
        bookName
    );
    const gradesColumnOfStudentStudyPlan = StudyPlanKeys.getStudyPlanGradesColumnOfStudent(
        bookNameColumnOfStudentStudyPlan,
        getGradesStringOrEmptyGradesString(gradesList)
    );

    await cmsPage.waitForSelector(studyPlanNameColumnOfStudent);
    await cmsPage.waitForSelector(bookNameColumnOfStudentStudyPlan);
    await cmsPage.waitForSelector(gradesColumnOfStudentStudyPlan);
};

export const schoolAdminSeeStudyPlanByStudentRowIndex = async (
    cms: CMSInterface,
    studentStudyPlanIndex: number,
    courseStudyPlan: { studyPlanName?: string; bookName?: string; gradesString?: string }
) => {
    const { studyPlanName = '--', bookName = '--', gradesString = '--' } = courseStudyPlan;

    await schoolAdminSeeTableCellValue(cms, {
        columnsSelector: StudyPlanKeys.studentStudyPlanNameColumn,
        rowIndex: studentStudyPlanIndex,
        cellValue: studyPlanName,
    });

    await schoolAdminSeeTableCellValue(cms, {
        columnsSelector: StudyPlanKeys.studentBookNameColumn,
        rowIndex: studentStudyPlanIndex,
        cellValue: bookName,
    });

    await schoolAdminSeeTableCellValue(cms, {
        columnsSelector: StudyPlanKeys.studentGradeColumn,
        rowIndex: studentStudyPlanIndex,
        cellValue: gradesString,
    });
};

export const schoolAdminSeeDatesOfStudyPlanItemByTopicRowIndex = async (
    cms: CMSInterface,
    studyPlanItemIndexByTopic: number,
    studyPlanItem: {
        availableFromDate?: string;
        availableUntilDate?: string;
        startDate?: string;
        endDate?: string;
    }
) => {
    const {
        availableFromDate = '--',
        availableUntilDate = '--',
        startDate = '--',
        endDate = '--',
    } = studyPlanItem;

    await schoolAdminSeeTableCellValue(cms, {
        columnsSelector: StudyPlanKeys.itemAvailableFromColumn,
        rowIndex: studyPlanItemIndexByTopic,
        cellValue: availableFromDate,
    });
    await schoolAdminSeeTableCellValue(cms, {
        columnsSelector: StudyPlanKeys.itemAvailableUntilColumn,
        rowIndex: studyPlanItemIndexByTopic,
        cellValue: availableUntilDate,
    });
    await schoolAdminSeeTableCellValue(cms, {
        columnsSelector: StudyPlanKeys.itemStartDateColumn,
        rowIndex: studyPlanItemIndexByTopic,
        cellValue: startDate,
    });
    await schoolAdminSeeTableCellValue(cms, {
        columnsSelector: StudyPlanKeys.itemEndDateColumn,
        rowIndex: studyPlanItemIndexByTopic,
        cellValue: endDate,
    });
};

// TODO: remove context out of params
export const schoolAdminSeeStudyPlanItemsByTopicsBaseOnBook = async (
    cms: CMSInterface,
    context: ScenarioContext,
    topicList: Topic[],
    studyPlanItemList: StudyPlanItem[]
): Promise<void> => {
    if (!topicList.length) throw Error('Not found any topics in study plan');
    if (!studyPlanItemList.length) throw Error('Not found any study plan items in study plan');

    context.set(aliasTopicStudyPlanItemRowIndex, 0);

    await cms.waitForSkeletonLoading();

    await schoolAdminSeeTableRowTotal(cms, {
        wrapper: StudyPlanKeys.itemTable,
        rowTotal: studyPlanItemList.length,
    });
};

export const schoolAdminSeeAllStudyPlansByStudent = async (
    cms: CMSInterface,
    context: ScenarioContext,
    studentProfile: { name: UserProfileEntity['name']; index: number },
    activeCourseStudyPlanList: StudyPlan[]
): Promise<void> => {
    if (!activeCourseStudyPlanList.length)
        throw Error('Not found any active study plans by student');

    const studentRowIndex = context.get<number>(aliasStudentStudyPlanRowIndex) || 0;

    await schoolAdminSeeTableCellValue(cms, {
        columnsSelector: StudyPlanKeys.studentNameCellWithRowspan(activeCourseStudyPlanList.length),
        rowIndex: studentProfile.index,
        cellValue: studentProfile.name,
    });

    await cms.waitForSelectorHasTextWithOptions(StudyPlanKeys.studentBookNameColumn, '--', {
        state: 'hidden',
    });

    await asyncForEach(
        activeCourseStudyPlanList,
        async (activeCourseStudyPlan, activeCourseStudyPlanIndex) => {
            const { name: studyPlanName, bookName, gradesList } = activeCourseStudyPlan;
            const studentStudyPlanIndex = studentRowIndex + activeCourseStudyPlanIndex;
            const gradesString = getGradesStringOrEmptyGradesString(gradesList);

            await schoolAdminSeeStudyPlanByStudentRowIndex(cms, studentStudyPlanIndex, {
                studyPlanName,
                bookName,
                gradesString,
            });
        }
    );

    context.set(aliasStudentStudyPlanRowIndex, studentRowIndex + activeCourseStudyPlanList.length);
};

export const schoolAdminDoesNotSeeStudyPlanByStudents = async (
    cms: CMSInterface,
    studentProfileList: UserProfileEntity[]
): Promise<void> => {
    await asyncForEach(studentProfileList, async (student) => {
        await schoolAdminSeeStudyPlanByStudent(cms, student.name, {});
    });
};

export const schoolAdminSeeStudentStudyPlansBaseOnActiveCourseStudyPlans = async (
    cms: CMSInterface,
    context: ScenarioContext,
    studentProfileList: UserProfileEntity[],
    activeCourseStudyPlanList: StudyPlan[]
): Promise<void> => {
    if (!studentProfileList.length) throw Error('Not found any students in course');
    if (!activeCourseStudyPlanList.length)
        throw Error('Not found any active study plans in course');

    context.set(aliasStudentStudyPlanRowIndex, 0);

    const studentStudyPlanTotal = activeCourseStudyPlanList.length * studentProfileList.length;

    await schoolAdminSeeTableRowTotal(cms, {
        wrapper: StudyPlanKeys.studentTable,
        rowTotal: studentStudyPlanTotal,
    });

    await asyncForEach(studentProfileList, async (studentProfile, studentProfileIndex) => {
        await schoolAdminSeeAllStudyPlansByStudent(
            cms,
            context,
            {
                name: studentProfile.name,
                index: studentProfileIndex,
            },
            activeCourseStudyPlanList
        );
    });
};

export async function teacherChoosesEditStudyPlanItem(
    teacher: TeacherInterface,
    action: EditMenuAction
): Promise<void> {
    const driver = teacher.flutterDriver!;

    let key: string;

    switch (action) {
        case 'edit time':
            key = SyllabusTeacherKeys.editStudyPlanItemTimeButton;
            break;
        case 'edit school date':
            key = SyllabusTeacherKeys.editStudyPlanItemSchoolDateMenuPopupButton;
            break;
        case 'archive':
            key = SyllabusTeacherKeys.archiveStudyPlanItemMenuPopupButton;
            break;
        case 'unarchive':
            key = SyllabusTeacherKeys.reactivateStudyPlanItemMenuPopupButton;
            break;
    }

    const studyPlanDetailMoreButton = new ByValueKey(SyllabusTeacherKeys.studyPlanDetailMoreButton);

    await driver.tap(studyPlanDetailMoreButton);

    const button = new ByValueKey(key);

    await driver.tap(button);
}

export async function teacherSeeStudyPlanItemSchoolDate(
    teacher: TeacherInterface,
    studyPlanName: string,
    schoolDate: Date
): Promise<void> {
    const driver = teacher.flutterDriver!;

    let schoolDateString = '--';
    const currentYear = new Date().getFullYear();

    if (currentYear != schoolDate.getFullYear()) {
        schoolDateString = formatDate(schoolDate, 'YYYY/MM/DD');
    } else {
        schoolDateString = formatDate(schoolDate, 'MM/DD');
    }

    const studyPlanItemSchoolDate = new ByValueKey(
        SyllabusTeacherKeys.studyPlanItemV2SchoolDate(studyPlanName, schoolDateString)
    );

    await driver.waitFor(studyPlanItemSchoolDate);
}

export async function teacherSeesTopicGradeAtStudyplanTable(
    teacher: TeacherInterface,
    topicName: string,
    grade: number
): Promise<void> {
    const topicGrade = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanTopicGrade(topicName));

    await teacher.flutterDriver?.waitFor(topicGrade, 100000);

    const topicGradeText = await teacher.flutterDriver?.getText(topicGrade);

    weExpect(topicGradeText).toEqual(`${grade}%`);
}

export async function teacherSeeStudyPlanItemWithStatus(
    teacher: TeacherInterface,
    studyPlanItemName: string,
    status: StudyPlanItemStatus
): Promise<void> {
    const driver = teacher.flutterDriver!;

    const itemKey = new ByValueKey(SyllabusTeacherKeys.studentStudyPlanItemRow(studyPlanItemName));

    await driver.waitFor(itemKey, 20000);

    switch (status) {
        case 'active':
            await driver.waitForAbsent(
                new ByValueKey(
                    SyllabusTeacherKeys.studentStudyPlanItemStatusArchived(studyPlanItemName)
                )
            );
            break;
        case 'archived':
            await driver.waitFor(
                new ByValueKey(
                    SyllabusTeacherKeys.studentStudyPlanItemStatusArchived(studyPlanItemName)
                )
            );
            break;
        case 'completed':
            await driver.waitFor(
                new ByValueKey(
                    SyllabusTeacherKeys.studentStudyPlanItemStatusCompleted(studyPlanItemName)
                )
            );
            break;
        case 'default':
            await driver.waitFor(
                new ByValueKey(
                    SyllabusTeacherKeys.studentStudyPlanItemStatusDefault(studyPlanItemName)
                )
            );
            break;
        case 'in progress':
            await driver.waitFor(
                new ByValueKey(
                    SyllabusTeacherKeys.studentStudyPlanItemStatusInProgress(studyPlanItemName)
                )
            );
            break;
        case 'incomplete':
            await driver.waitFor(
                new ByValueKey(
                    SyllabusTeacherKeys.studentStudyPlanItemStatusIncomplete(studyPlanItemName)
                )
            );
            break;
        case 'marked':
            await driver.waitFor(
                new ByValueKey(
                    SyllabusTeacherKeys.studentStudyPlanItemStatusMarked(studyPlanItemName)
                )
            );
            break;
        case 'not marked':
            await driver.waitFor(
                new ByValueKey(
                    SyllabusTeacherKeys.studentStudyPlanItemStatusNotMarked(studyPlanItemName)
                )
            );
            break;
        case 'returned':
            await driver.waitFor(
                new ByValueKey(
                    SyllabusTeacherKeys.studentStudyPlanItemStatusReturned(studyPlanItemName)
                )
            );
            break;
    }
}

export const schoolAdminSelectEditStudyPlanItems = async (cms: CMSInterface) => {
    await cms.selectAButtonByAriaLabel('Edit');
};

export const schoolAdminSeeStudyPlanItemShouldDisableOrNot = async (
    cms: CMSInterface,
    name: number | string,
    shouldDisable = true
) => {
    const entityIconElement = await cms.page?.waitForSelector(
        `${entityIconButton}:left-of(:has-text("${name}"))`
    );
    const disabled = await entityIconElement?.isDisabled();

    if (shouldDisable && disabled) return;

    if (!shouldDisable && disabled) {
        throw new Error(`Expect study plan ${name} should be active but UI was be disabled`);
    }
};

export const schoolAdminSelectCourseStudyPlan = async (
    cms: CMSInterface,
    studyPlanName: string
) => {
    const studyPlanHref = await cms.waitForSelectorHasText(`${tableBaseRow} a`, studyPlanName);
    await studyPlanHref?.click();
};

export const schoolAdminSelectStudyPlanOfStudent = async (
    cms: CMSInterface,
    studentName: string,
    studyPlanName: string
) => {
    const studyPlanSelector = `${tableBaseRow} p:has-text("${studyPlanName}"):right-of(:has-text("${studentName}"))`;
    const studyPlanElement = await cms.page?.waitForSelector(studyPlanSelector);

    await studyPlanElement?.click();
};

export const schoolAdminSeesStudyPlanOfStudent = async (
    cms: CMSInterface,
    studentName: string,
    studyPlanName: string
) => {
    const studyPlanSelector = `${tableBaseRow} p:has-text("${studyPlanName}"):right-of(:has-text("${studentName}"))`;
    await cms.page?.waitForSelector(studyPlanSelector);
};

export const schoolAdminDoesNotSeeStudyPlanOfStudent = async (
    cms: CMSInterface,
    studentName: string,
    studyPlanName: string
) => {
    const studyPlanSelector = `${tableBaseRow} p:has-text("${studyPlanName}"):right-of(:has-text("${studentName}"))`;
    await cms.page?.waitForSelector(studyPlanSelector, { state: 'detached' });
};

export const schoolAdminGetOneStudyPlan = async (cms: CMSInterface, studyPlanId: string) => {
    const data = await cms.graphqlClient?.callGqlEureka<StudyPlanOneV2Query>({
        body: eurekaStudyPlanQueries.getOne({ study_plan_id: studyPlanId }),
    });

    if (data && data.data && data.data.study_plans) return data;

    throw new Error(
        `schoolAdminGetOneStudyPlan eurekaStudyPlanQueries.getOne ${studyPlanId} is not success: ${JSON.stringify(
            data
        )}`
    );
};

export const schoolAdminGetMasterStudyPlanItems = async (
    cms: CMSInterface,
    studyPlanId: string
) => {
    const data = await cms.graphqlClient?.callGqlEureka<Syllabus_StudyPlanItems_MasterQuery>({
        body: eurekaStudyPlanQueries.getMasterStudyPlanItems({ study_plan_id: studyPlanId }),
    });

    if (data && data.data && data.data.master_study_plan_view) return data;

    throw new Error(
        `schoolAdminGetMasterStudyPlanItems eurekaStudyPlanQueries.getMasterStudyPlanItems ${studyPlanId} is not success: ${JSON.stringify(
            data
        )}`
    );
};

const findStudyPlanItemId = (
    data: StudyPlanOneV2Query,
    id: string
): { studyPlanItemId: string; chapterId: string } | undefined => {
    const studyPlanItems = data.study_plans[0].study_plan_items;

    for (let i = 0; i < studyPlanItems.length; i++) {
        const contentStructure = studyPlanItems[i].content_structure;
        const finalId = contentStructure.lo_id || contentStructure.assignment_id;
        if (finalId === id) {
            return {
                chapterId: contentStructure.chapter_id,
                studyPlanItemId: studyPlanItems[i].study_plan_item_id,
            };
        }
    }
};

type CreateStudyPlanOptions = {
    studyPlanItems?: (LearningObjective | Assignment)[];
    studyplanTestCase?: StudyPlanTestCase;
    customStudyPlan?: Partial<UpsertStudyPlanRequest.AsObject>;
    generatorStudyPlanItems?: <T>(studyPlanItems: T[]) => T[];
    shouldKeepDefaultStudyPlanItems?: boolean;
};

const createStudyPlan = async (
    token: string,
    {
        schoolId,
        courseId,
        bookId,
        studyPlanName,
        customStudyPlan,
    }: {
        schoolId: number;
        courseId: string;
        bookId: string;
        studyPlanName: string;
        customStudyPlan: CreateStudyPlanOptions['customStudyPlan'];
    }
) => {
    const { response } = await studyPlanModifierService.upsertStudyPlan(token, {
        bookId,
        courseId,
        gradesList: [],
        name: studyPlanName,
        schoolId,
        status: StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE,
        trackSchoolProgress: false,
        ...customStudyPlan,
    });
    if (!response?.studyPlanId) throw new Error('After creating study plan not return studyPlanId');

    return response;
};

export const schoolAdminHasCreatedStudyPlanV2 = async (
    cms: CMSInterface,
    courseId: string,
    bookList: Book[],
    options?: CreateStudyPlanOptions
) => {
    const token = await cms.getToken();
    const timezone = await cms.getTimezone();
    const { schoolId } = await cms.getContentBasic();
    const bookIds = bookList.map((book) => book.bookId);

    await schoolAdminAddBooksToCourseByCallingGRPC(cms, courseId, bookIds);

    const {
        customStudyPlan = {},
        studyPlanItems = [],
        generatorStudyPlanItems,
        studyplanTestCase = 'random',
        shouldKeepDefaultStudyPlanItems = false,
    } = options || {};

    const studyPlanName = `Study plan test ${genId()}`;

    const response = await createStudyPlan(token, {
        schoolId,
        courseId,
        bookId: bookIds[0],
        studyPlanName,
        customStudyPlan,
    });

    const studyPlanId = response.studyPlanId;

    const { data: studyPlanData } = await retry(
        () => schoolAdminGetOneStudyPlan(cms, studyPlanId),
        {
            retries: 7,
            backoff: 'EXPONENTIAL',
            delay: 3500,
        }
    );

    const studyPlanItemsList: StudyPlanItemObject[] = studyPlanItems.map((studyPlanItem) => {
        if (isAssignment(studyPlanItem)) {
            const { content, assignmentId } = studyPlanItem as Assignment;
            const studyPlanItemStructure = findStudyPlanItemId(studyPlanData, assignmentId);
            if (!content || !studyPlanItemStructure)
                throw Error('Assignment missing content or study plan item');

            const { topicId } = content;
            const studyPlanItemDraft: StudyPlanItemObject = {
                status: StudyPlanItemStatusEnumProto.STUDY_PLAN_ITEM_STATUS_ACTIVE,
                contentStructureFlatten: '',
                studyPlanId,
                studyPlanItemId: studyPlanItemStructure.studyPlanItemId,
                contentStructure: {
                    bookId: bookIds[0],
                    chapterId: studyPlanItemStructure.chapterId,
                    courseId,
                    topicId,
                    assignmentId,
                },
            };
            return studyPlanItemDraft;
        }

        const { info, topicId } = studyPlanItem as LearningObjective;

        if (!info) throw Error('LO missing info property');

        const { id, name } = info;

        const studyPlanItemStructure = findStudyPlanItemId(studyPlanData, id);

        if (!studyPlanItemStructure) throw Error(`Cannot find study plan item of LO ${name}`);

        const studyPlanItemDraft: StudyPlanItemObject = {
            status: StudyPlanItemStatusEnumProto.STUDY_PLAN_ITEM_STATUS_ACTIVE,
            contentStructureFlatten: '',
            studyPlanId,
            studyPlanItemId: studyPlanItemStructure.studyPlanItemId,
            contentStructure: {
                bookId: bookIds[0],
                chapterId: studyPlanItemStructure.chapterId,
                courseId,
                topicId,
                loId: id,
            },
        };
        return studyPlanItemDraft;
    });

    if (shouldKeepDefaultStudyPlanItems) {
        return { studyPlanName, studyPlanItemRaws: studyPlanItemsList };
    }

    const finalStudyPlanItemsData = generatorStudyPlanItems
        ? generatorStudyPlanItems<StudyPlanItemObject>(studyPlanItemsList)
        : modifyStudyPlanItems<StudyPlanItemObject>(studyPlanItemsList, studyplanTestCase);

    await studyPlanModifierService.upsertStudyPlanItems(
        token,
        finalStudyPlanItemsData,
        timezone.value
    );

    return { studyPlanId, studyPlanName, studyPlanItemRaws: finalStudyPlanItemsData };
};

export const schoolAdminHasCreatedStudyPlanWithUpsertMasterInfo = async (
    cms: CMSInterface,
    courseId: string,
    bookList: Book[],
    options?: CreateStudyPlanOptions
) => {
    const token = await cms.getToken();
    const timezone = await cms.getTimezone();
    const { schoolId } = await cms.getContentBasic();
    // create book
    const bookIds = bookList.map((book) => book.bookId);
    await schoolAdminAddBooksToCourseByCallingGRPC(cms, courseId, bookIds);

    // create study plan
    const {
        customStudyPlan = {},
        studyPlanItems = [],
        generatorStudyPlanItems,
        studyplanTestCase = 'random',
        shouldKeepDefaultStudyPlanItems = false,
    } = options || {};

    const studyPlanName = `Study plan test ${genId()}`;

    const { studyPlanId } = await createStudyPlan(token, {
        schoolId,
        courseId,
        bookId: bookIds[0],
        studyPlanName,
        customStudyPlan,
    });

    // // get master study plan items list
    // const { data } = await retry(() => schoolAdminGetMasterStudyPlanItems(cms, studyPlanId), {
    //     retries: 7,
    //     backoff: 'EXPONENTIAL',
    //     // delay: 3500,
    // });

    const studyPlanItemsList: StudyPlanItemAsObject[] = studyPlanItems.map((studyPlanItem) => {
        const { learningMaterialId } = studyPlanItem;

        const studyPlanItemDraft = {
            studyPlanId,
            learningMaterialId,
            status: StudyPlanItemStatusEnumProto.STUDY_PLAN_ITEM_STATUS_ACTIVE,
        };

        return studyPlanItemDraft;
    });

    if (shouldKeepDefaultStudyPlanItems) {
        return { studyPlanName, studyPlanItemRaws: studyPlanItemsList };
    }

    const finalStudyPlanItemsData = generatorStudyPlanItems
        ? generatorStudyPlanItems<StudyPlanItemAsObject>(studyPlanItemsList)
        : modifyStudyPlanItems<StudyPlanItemAsObject>(studyPlanItemsList, studyplanTestCase);

    // upsert master study plan item infos
    await studyPlanModifierService.upsertMasterStudyPlanItems(
        token,
        finalStudyPlanItemsData,
        timezone.value
    );

    return { studyPlanName, studyPlanItemRaws: finalStudyPlanItemsData };
};

export const schoolAdminWaitingStudyPlanDetailLoading = async (cms: CMSInterface) => {
    // Loading file chunk
    await cms.waitingForLoadingIcon();
    // Loading study plan info
    await cms.waitForSkeletonLoading();
};

export const schoolAdminIsAtStudyPlanDetailsPage = async (
    cms: CMSInterface,
    studyPlanName: string,
    studyPlanPageType: StudyPlanPageType
) => {
    if (studyPlanPageType === 'individual') {
        await schoolAdminSelectStudyPlanTabByType(cms, 'student');
        await cms.waitForSkeletonLoading();
    }

    await cms.searchInFilter(studyPlanName);
    await cms.waitForSkeletonLoading();
    await schoolAdminSelectCourseStudyPlan(cms, studyPlanName);
    await schoolAdminWaitingStudyPlanDetailLoading(cms);
};

export const createNStudyPlansPayLoadByInfo = ({
    quantity,
    info: {
        schoolId,
        courseId,
        bookId,
        bookName,
        status,
        gradesList = [],
        trackSchoolProgress = false,
    },
}: {
    quantity: number;
    info: {
        schoolId: number;
        bookId: string;
        bookName: string;
        courseId: string;
        status: StudyPlanStatus;
        trackSchoolProgress?: boolean;
        gradesList?: number[];
    };
}) => {
    const studyPlansPayload: UpsertStudyPlanRequest.AsObject[] = [];
    const studyPlansWithBookName: StudyPlan[] = [];

    for (let i = 0; i < quantity; i++) {
        const name = `Study plan ${genId()}`;

        const studyPlanPayload: UpsertStudyPlanRequest.AsObject = {
            name,
            bookId,
            courseId,
            schoolId,
            status,
            gradesList,
            trackSchoolProgress,
        };

        const studyPlanWithBookName: StudyPlan = {
            ...studyPlanPayload,
            bookName,
        };

        studyPlansPayload.push(studyPlanPayload);
        studyPlansWithBookName.push(studyPlanWithBookName);
    }

    return { studyPlansPayload, studyPlansWithBookName };
};

export const generateFormDataByStudyPlanInfo = (
    formData: StudyPlan,
    field?: StudyPlanInfoType
): StudyPlan => {
    switch (field) {
        case 'full':
        case 'grades, tracked school progress': {
            formData.gradesList = randomGradeList(3, 1);
            formData.trackSchoolProgress = true;
            return formData;
        }
        case 'name': {
            formData.name = `Edited Study Plan ${genId()}`;
            return formData;
        }
        case 'empty grades, untracked school progress': {
            formData.gradesList = [];
            formData.trackSchoolProgress = false;
            return formData;
        }
        case 'empty book': {
            formData.bookId = '';
            formData.bookName = '';
            return formData;
        }
        case 'empty name': {
            formData.name = '';
            return formData;
        }
        default:
            return formData;
    }
};

export const schoolAdminDecodeUpsertStudyPlan = async (response: Response) => {
    const decoder = createGrpcMessageDecoder(UpsertStudyPlanResponse);
    const encodedResponseText = await response?.text();
    const decodedResponse = decoder.decodeMessage(encodedResponseText);

    return decodedResponse!.toObject();
};

export const schoolAdminSeeStudyPlanInMasterTable = async (cms: CMSInterface, name: string) => {
    await cms.page?.waitForSelector(`${tableBaseRow}:has-text("${name}")`, {
        state: 'attached',
    });
};

export const getStudyPlanListByAllStatus = (studyPlanList: StudyPlan[]) => {
    let activeStudyPlanList: StudyPlan[] = [];
    let archivedStudyPlanList: StudyPlan[] = [];

    if (studyPlanList.length) {
        studyPlanList.forEach((studyPlan) => {
            if (studyPlan.status === StudyPlanStatus.STUDY_PLAN_STATUS_ACTIVE) {
                activeStudyPlanList = [...activeStudyPlanList, studyPlan];
            } else {
                archivedStudyPlanList = [...archivedStudyPlanList, studyPlan];
            }
        });
    }

    return { activeStudyPlanList, archivedStudyPlanList };
};

export const getStudyPlanListByStatus = (studyPlanList: StudyPlan[], status: StudyPlanStatus) => {
    let studyPlanListByStatus: StudyPlan[] = [];

    if (studyPlanList.length) {
        studyPlanList.forEach((studyPlan) => {
            if (studyPlan.status === status) {
                studyPlanListByStatus = [...studyPlanListByStatus, studyPlan];
            }
        });
    }

    return studyPlanListByStatus;
};

export const schoolAdminFilterShowArchivedStudyPlan = async (
    cms: CMSInterface,
    shouldCheck: boolean
) => {
    const cmsPage = cms.page!;

    await schoolAdminOpenFilterAdvanced(cms);

    if (shouldCheck) {
        await cmsPage.check('input[type="checkbox"]');
    } else {
        await cmsPage.uncheck('input[type="checkbox"]');
    }

    await schoolAdminApplyFilterAdvanced(cms);
    await cmsPage.keyboard.press('Escape');

    await cms.waitForSkeletonLoading();
};

export const schoolAdminSeeTopicAtIndexInStudyPlanDetail = async (
    cms: CMSInterface,
    topic: { name: string; index: number }
) => {
    const { name, index } = topic;
    const topicRows = await cms.page!.$$(itemTopicNameColumn);

    const topicNameAtIndex = await topicRows[index].textContent();

    weExpect(topicNameAtIndex, `the topic is at index ${index}`).toBe(name);
};

export const schoolAdminGoesToBookDetailByBookNameInStudyPlanDetail = async (
    cms: CMSInterface,
    bookName: string
) => {
    const linkByText = `${getTestId('StudyPlanInfo__bookLink')} p:has-text("${bookName}")`;

    const element = await cms.page!.waitForSelector(linkByText);
    await element.click();
};
