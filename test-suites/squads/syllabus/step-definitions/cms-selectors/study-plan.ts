import { tableBaseBody, tableBaseRow } from './cms-keys';
import { getTestId } from 'test-suites/squads/syllabus/utils/common';

// COURSE STUDY PLAN
// Button
export const addButton = getTestId('StudyPlanTab__addStudyPlan');

export const displayHiddenItemsCheckbox = `${getTestId(
    'StudyPlanItemTableAction__root'
)} input[type='checkbox']`;

export const editStudyPlanItemButton = `${getTestId(
    'StudyPlanItemTableAction__root'
)} button[aria-label="Edit"]`;

// Info
// TODO: Refactor to data-testid after updating on CMS
export const bookNameInfo = 'a:right-of(:text("Book"))';

export const trackSchoolProgressInfo = 'p:right-of(:text("Track School Progress"))';

export const gradesInfo = 'p:right-of(:text("Grade"))';

// Field
export const studyPlanDialog = getTestId('DialogUpsertStudyplan__root');

export const studyPlanNameHFRoot = getTestId('StudyPlanForm__studyPlanName');

export const studyPlanNameHFInput = `${studyPlanNameHFRoot} input[name="name"]`;

export const trackSchoolProgressHFRoot = getTestId('StudyPlanForm__trackSchoolProgress');

export const trackSchoolProgressHFCheckbox = `${trackSchoolProgressHFRoot} input[name="trackSchoolProgress"]`;

//Table
export const courseStudyPlanTable = getTestId('CourseStudyPlanTable');

export const courseStudyPlanTableRow = `${courseStudyPlanTable} ${tableBaseRow}`;

export const getCourseStudyPlanNameLink = (studyPlanName: string) =>
    `${tableBaseRow} a:has-text("${studyPlanName}")`;

// STUDY PLAN ITEM
// Table
export const itemTable = getTestId('StudyPlanItemTable');

export const itemTopicNameColumn = `td${getTestId('StudyPlanItemTableColumns__topicName')}`;

export const getItemTopicNameColumnWithName = (name: string) =>
    `${itemTopicNameColumn}:has-text("${name}")`;

export const itemNameColumn = `${tableBaseBody} ${getTestId('StudyPlanItemTableColumns__loName')}`;

export const studyPlanItemAvailableFromCell = getTestId('StudyPlanItemTableColumns__availableFrom');
export const studyPlanItemAvailableUtilCell = getTestId(
    'StudyPlanItemTableColumns__availableUntil'
);
export const studyPlanItemEndDateCell = getTestId('StudyPlanItemTableColumns__endDate');
export const studyPlanItemStartDateCell = getTestId('StudyPlanItemTableColumns__startDate');

export const itemAvailableFromColumn = `${tableBaseBody} ${studyPlanItemAvailableFromCell}`;
export const itemAvailableUntilColumn = `${tableBaseBody} ${studyPlanItemAvailableUtilCell}`;
export const itemStartDateColumn = `${tableBaseBody} ${studyPlanItemStartDateCell}`;
export const itemEndDateColumn = `${tableBaseBody} ${studyPlanItemEndDateCell}`;

export const topicNameCellWithRowspan = (rowspan = 1) =>
    `${itemTopicNameColumn}[rowspan="${rowspan}"]`;

// STUDENT STUDY PLAN
// Table
export const studentTable = getTestId('StudentStudyPlanTable');

export const studentStudyPlanTableRow = `${studentTable} ${tableBaseRow}`;

export const studentNameColumn = `td${getTestId('StudentStudyPlanTableColumns__studentName')}`;

export const studentStudyPlanNameColumn = `td${getTestId(
    'StudentStudyPlanTableColumns__studyPlanName'
)}`;

export const studentBookNameColumn = `td${getTestId(
    'StudentStudyPlanTableColumns__bookAssociation'
)}`;

export const studentGradeColumn = `td${getTestId('StudentStudyPlanTableColumns__grade')}`;

export const studentStudyPlanNameLink = getTestId(
    'StudentStudyPlanTableBodyColumns__studyPlanName'
);

export const getStudentStudyPlanNameLink = (studyPlanName: string) =>
    `${studentStudyPlanNameLink}:has-text('${studyPlanName}')`;

export const studyPlanNameLinkByStudent = (studentName: string, studyPlanName: string) =>
    `${studentStudyPlanNameLink}:has-text('${studyPlanName}'):right-of(${studentNameColumn}:has-text('${studentName}'))`;

export const studentNameCellWithRowspan = (rowspan = 1) =>
    `${studentNameColumn}[rowspan="${rowspan}"]`;

export const getStudyPlanNameColumnOfStudent = (studentName: string, studyPlanName: string) =>
    `${studentStudyPlanNameColumn}:has-text("${studyPlanName}"):right-of(${studentNameColumn}:has-text("${studentName}"))`;

export const getStudyPlanBookNameColumnOfStudent = (
    studyPlanNameColumnOfStudent: string,
    bookName: string
) => `${studentBookNameColumn}:has-text("${bookName}"):right-of(${studyPlanNameColumnOfStudent})`;

export const getStudyPlanGradesColumnOfStudent = (
    bookNameColumnOfStudentStudyPlan: string,
    grades: string
) => `${studentGradeColumn}:has-text("${grades}"):right-of(${bookNameColumnOfStudentStudyPlan})`;

export const dropdownMenuButton = getTestId('ButtonDropdownMenu__button');

export const getBulkEditDialogTabInput = (type: string) =>
    getTestId(`BulkEditStudyPlanItemDialog__${type}Input`);

export const loNameColumn = 'StudyPlanItemTableColumns__loName';

export const studyPlanItemShowIcon = getTestId('ButtonShowHide__iconShow');

export const studyPlanItemHideIcon = getTestId('ButtonShowHide__iconHide');

export const studyPlanItemDateDisplay = getTestId('StudyPlanItem__dateDisplay');
