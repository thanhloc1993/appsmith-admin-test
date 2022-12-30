import { AccountRoles } from '@supports/app-types';

export const tableLessonRows = `[data-testid="LiveLessonsList__root"] tr`;

export const tableLessonNameCol = `[data-testid="TableLiveLessons__name"]`;

export const tableLessonTeacherNamesCol = `[data-testid="TableLiveLessons__teacherNames"]`;

export const tableLessonCourseNamesCol = `[data-testid="TableLiveLessons__courseNames"]`;

export const lessonUpsertStartDatePicker = `[data-testid="LiveLessonsUpsert__startDatePicker"]`;

export const lessonUpsertEndDatePicker = `[data-testid="LiveLessonsUpsert__endDatePicker"]`;

export const lessonUpsertStartTimePicker = `[data-testid="LiveLessonsUpsert__startTimePicker"]`;

export const lessonUpsertEndTimePicker = `[data-testid="LiveLessonsUpsert__endTimePicker"]`;

export const lessonTeachingMediumOfflineRatioButton = `[data-testid="Radio__LESSON_TEACHING_MEDIUM_OFFLINE"]`;

export const lessonTeachingMediumOnlineRatioButton = `[data-testid="Radio__LESSON_TEACHING_MEDIUM_ONLINE"]`;

export const lessonTeachingMediumGeneralInfo = `[data-testid="LessonDetailsGeneralInfo__teachingMedium"]`;

export const uploadMaterialInput = '[data-testid="UploadInput"] input';

export const chipFileContainer = '[data-testid="ChipFileDescription"]';

export const generalInfoLessonName = (nameUpdated: string) =>
    `[data-testid="GeneralInfo__lessonName"] :text("${nameUpdated}")`;

export const generalInfoTime = (date: string) =>
    `[data-testid="GeneralInfo__time"] :has-text("${date}")`;

export const tableCoursesCourseName = (courseName: string) =>
    `[data-testid="TableCourses__courseName"]:has-text("${courseName}")`;

export const generalInfoTeacherName = (teacherName: string) =>
    `[data-testid="GeneralInfo__teacherName"]:has-text("${teacherName}")`;

export const tableStudentStudentEmail = (studentEmail: string) =>
    `[data-testid="TableStudent__studentEmail"]:has-text("${studentEmail}")`;

export const tableMaterialInfo = '[data-testid="MediaListing"]';
export const tableCourseRoot = '[data-testid="TableCourse__root"]';
export const tableDeleteButton = '[data-testid="TableAction__buttonDelete"]';
export const chipAutocomplete = '[data-testid="ChipAutocomplete"]';
export const chipAutocompleteText = `${chipAutocomplete} span`;
export const chipAutocompleteIconDelete = '[data-testid="ChipAutocomplete__iconDelete"]';
export const teacherContainer = '[data-testid="AutocompleteTeachersHF__autocomplete"]';
export const teacherItem = (teacherName: string) =>
    `[data-testid="ChipAutocomplete"] span:has-text("${teacherName}")`;
export const tableStudentRoot = '[data-testid="TableStudent__root"]';
export const learnerProfileAlias = `learnerProfileAlias`;
export function studentProfileAliasWithAccountRoleSuffix(accountRoles: AccountRoles) {
    return `${learnerProfileAlias}-${accountRoles}`;
}

export const courseDetailTitle = (courseName: string) =>
    `[aria-label="title"]:text-is("${courseName}")`;

export const locationLabelInLocationPopupOfCourse = (locationName: string) =>
    `p:text-is("${locationName}")`;

export const lessonDeleteOnlyThisLessonRadioButton =
    '[data-testid="Radio__CREATE_LESSON_SAVING_METHOD_ONE_TIME"]';

export const lessonDeleteThisAndFollowingRadioButton =
    '[data-testid="Radio__CREATE_LESSON_SAVING_METHOD_RECURRENCE"]';

export const lessonCloseVideoMaterial = '[data-testid="FormDialog__title"] button';

export const lessonSaveOnlyThisLessonRadioButton =
    '[data-testid="DialogConfirmSavingMethod__radioRecurringLesson"] [data-testid="Radio__CREATE_LESSON_SAVING_METHOD_ONE_TIME"]';
export const lessonSaveThisAndFollowingRadioButton =
    '[data-testid="DialogConfirmSavingMethod__radioRecurringLesson"] [data-testid="Radio__CREATE_LESSON_SAVING_METHOD_RECURRENCE"]';
