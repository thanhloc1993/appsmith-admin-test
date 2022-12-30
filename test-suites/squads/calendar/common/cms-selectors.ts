export const appBarProfileButton = 'button[data-testid="Appbar__profileButton"]';
export const locationSettingDialog = '[data-testid="DialogLocationSelectOnNav__dialog"]';
export const locationSettingOption = '[role="menuitem"][data-testid="UserMenu__setting"]';
export const locationSettingCheckboxById = (locationId: string) =>
    `[data-testid="CheckBoxLocation__${locationId}"]`;

// Menu
export const menuItem = (item: string) =>
    `[data-testid="MenuItemLink__root"][aria-label="${item}"]`;

export const calendarContainer = '[data-testid="Calendar__container"]';
export const locationType = '[data-testid="SelectLocationType__select"] [role="button"] > p';
export const locationAutocomplete = '[data-testid="AutocompleteLocation__autocomplete"]';
export const locationAutocompleteInput = `${locationAutocomplete} #AutocompleteLocation__autocomplete`;
export const selectCalendarView = '[data-testid="Toolbar__selectCalendarView"]';
export const selectCalendarViewInput = `${selectCalendarView} input`;
export const dateHeaderDayLabel = '[data-testid="CalendarDateHeader__dayLabel"]';
export const btnCalendarToday = '[data-testid="Toolbar__buttonToday"]';
export const btnCalendarNext = '[data-testid="Toolbar__iconButtonRight"]';
export const btnCalendarPrev = '[data-testid="Toolbar__iconButtonLeft"]';
export const groupSlots = '[data-group-slots]';
export const groupSlotTime = `${groupSlots} > td:nth-child(1)`;

export const btnShowMoreSelector = (timeSlot: number, dateToday: number) =>
    `${calendarContainer} [data-time-slot="${timeSlot}"] > [data-date-by-range="${dateToday}"] [data-testid="EventsPerCell__buttonShowMore"]`;

export const addButton = '[data-testid="StyledButtonDropdown"]:has-text("Add")';
export const popoverAddButton = '[data-testid="StyledButtonDropdown__popover"]';
export const addLessonButton = '[role="menuitem"]:has-text("Lesson")';
export const radioWrapRecurringLesson = '[data-testid="FormLessonUpsertV3__radioRecurringLesson"]';
export const radioWeeklyRecurringLesson = `${radioWrapRecurringLesson} [data-testid="Radio__CREATE_LESSON_SAVING_METHOD_RECURRENCE"]`;

export const locationCheckBox = (locationId: string) =>
    `[data-testid='CheckBoxLocation__${locationId}'] input`;

export const optionsButton = `button[data-testid="ActionPanel__trigger"]`;
export const drawerHeaderSelector = '[data-testid="HeaderLessonDetailWithAction__root"]';
export const deleteMenuItem = '[data-testid="ActionPanel__menuList"] [aria-label="Delete"]';
export const dialogDeleteLessonOnetime = '[data-testid="DialogDeleteLesson__dialog"]';
export const dialogDeleteLessonRecurrence =
    '[data-testid="DialogDeleteRecurringLessonMethod__dialog"]';
export const dialogButtonSave = '[data-testid="FooterDialogConfirm__buttonSave"]';
export const deleteLessonOptionOnetime =
    '[data-testid="Radio__CREATE_LESSON_SAVING_METHOD_ONE_TIME"] input';
export const deleteLessonOptionRecurrence =
    '[data-testid="Radio__CREATE_LESSON_SAVING_METHOD_RECURRENCE"] input';
