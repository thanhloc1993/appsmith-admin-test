import { CourseTab } from '@supports/types/cms-types';

import { getTestId } from './cms-keys';

export const bookTabRoot = '[data-testid="BookTab__root"]';
export const bookTabTable = '[data-testid="BookTab__table"]';
export const bookListCheckbox = '[data-testid="BookList__checkbox"] input';

export const studyPlanCollapseRow = (name: string) => {
    return `[data-testid="TableRowCollapse__row"]:has-text("${name}")`;
};

export const getStudyPlanNameSelector = (name: string) => {
    return `${studyPlanName}:has-text("${name}")`;
};
export const addStudyPlan = 'StudyPlan__addBtn';
export const studyPlanForm = '[data-testid="StudyPlanForm"]';
export const uploadInput = '[data-testid="UploadInput__inputFile"]';
export const studyPlanName = '[data-testid="StudyPlanNameColumn__name"]';
export const studentStudyPlanTab = '[data-testid="StudyPlanTab__student"]';
export const studentStudyPlanV2Tab = '[data-testid="CourseShow__studyPlanV2Tab"]';
export const studyPlanUploading = '[data-testid="StudyPlanNameColumn__uploading"]';
export const getCourseTab = (tabName: CourseTab) => `[data-testid="CourseShow__${tabName}Tab"]`;
export const courseForm = '[data-testid="CourseForm__root"]';
export const courseFormName = '[data-testid="CourseForm__root"] input[name="name"]';
export const courseTableName = '[data-testid="CourseTable__courseName"]';
export const courseDetailsSettingTab = '[data-testid="CourseShow__settingTab"]';
export const courseDetailsSettingTabCourseName = '[data-testid="SettingsTabForm__courseName"]';
export const courseTable = '[data-testid="CourseTable__table"]';
export const actionPanelTrigger = '[data-testid="ActionPanel__trigger"]';

// Create course page
export const studentStudyPlanCheckBox = '[data-testid="StudentStudyPlan__checkbox"] input';

export const tableStudyPlanRowCollapse = '[data-testid="TableRowCollapse__row"]';
export const courseStudyPlanTable = '[data-testid="CourseStudyPlanTable"]';

/// Edit course page
export const imgAltAvatar = 'img[alt="Avatar"]';
export const imgSmallAvatar = 'img.Manaverse-MuiAvatar-img';
export const inputAvatar = 'input[id="imageUpload"]';
export const avatarUpload = getTestId('AvatarInput__labelHtmlFor');
