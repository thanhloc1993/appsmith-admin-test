export interface UserKeyCloak {
    id: string;
    createdTimestamp: string;
    username: string;
    enabled: boolean;
    totp: boolean;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    attributes: { uid: any; student_division?: any };
    disableableCredentialTypes: any[];
    requiredActions: string[];
    notBefore: number;
    access: {
        manageGroupMembership: boolean;
        view: boolean;
        mapRoles: boolean;
        impersonate: boolean;
        manage: boolean;
    };
}

export interface CourseJPREP {
    action_kind: string;
    m_course_name_id: number;
    course_name: string;
    m_course_student_div_id: number;
}

export interface LessonJPREP {
    m_lesson_id: number;
    action_kind: string;
    lesson_type: string;
    m_course_name_id: number;
    start_datetime: number;
    end_datetime: number;
    class_name: string;
    week: string;
}

export type UserTypeKeyCloak = 'teacher' | 'student';
export type PathnameSyncJPREP = 'user-registration' | 'master-registration' | 'user-course';
