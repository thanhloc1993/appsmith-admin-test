export type SearchStringCase = 'none' | 'correct' | 'incorrect';

export type KeyCourseTab = 'lesson' | 'book' | 'studyPlan' | 'setting' | 'studyPlanCSV';

export type DecideActions = 'cancels' | 'confirms';

export type WithOrWithout = 'with' | 'without';

export type LOPlace = 'book' | 'detail';

export enum StatusTypes {
    ENROLLED = 'Enrolled',
    POTENTIAL = 'Potential',
    LOA = 'LOA',
    WITHDRAWN = 'Withdrawn',
    GRADUATED = 'Graduated',
}

export type LoadingStatus = 'loading' | 'success' | 'error' | 'idle';

export enum UserRole {
    SCHOOL_ADMIN = 'School Admin',
    TEACHER = 'Teacher',
}
