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
    TEACHER_LEAD = 'Teacher Lead',
    CENTRE_MANAGER = 'Centre Manager',
    CENTRE_STAFF = 'Centre Staff',
    CENTRE_LEAD = 'Centre Lead',
    HQ_STAFF = 'HQ Staff',
    STUDENT = 'Student',
    PARENT = 'Parent',
}
