export type ConditionFilterCurrentSchool = 'only current school' | 'include all school';

export type SchoolHistoryFields =
    | 'School Level'
    | 'School Name'
    | 'School Course'
    | 'Start Date'
    | 'End Date'
    | 'School Name & School Course '
    | 'School Level & School Name & School Course & Start Date & End Date';

export type ExpectedSchoolHistoryOptionTypes =
    | 'full options'
    | 'on optional'
    | 'School Name belong to School Level'
    | 'School Level auto-fill option belong to School Name';
