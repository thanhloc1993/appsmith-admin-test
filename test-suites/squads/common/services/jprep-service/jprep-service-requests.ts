import { getRandomNumber } from '@legacy-step-definitions/utils';

import { defaultKeyCloakUserPassword } from 'test-suites/squads/common/constants/jprep';
import {
    UserKeyCloak,
    UserTypeKeyCloak,
} from 'test-suites/squads/common/services/jprep-service/types';

export function createUserKeyCloakRequest() {
    const username = `e2e-user.${getRandomNumber()}@manabie.com`;

    return {
        enabled: true,
        username: username,
        email: username,
        firstName: username,
        lastName: username,
        credentials: [{ type: 'password', value: defaultKeyCloakUserPassword, temporary: true }],
    };
}

export function updateUserKeyCloakRequest(params: { userId: string; typeUser: UserTypeKeyCloak }) {
    const { userId, typeUser } = params;

    return {
        attributes: {
            uid: userId,
            ...(typeUser === 'student' ? { student_division: 'kids' } : undefined),
        },
    };
}

export function syncStudentRequest(student: UserKeyCloak) {
    return {
        m_student: [
            {
                action_kind: 'upserted',
                student_divs: [{ m_student_div_id: 1 }],
                student_id: student.id,
                last_name: student.lastName,
                given_name: 'Jprep Student',
                regularcourses: [],
            },
        ],
    };
}

export function syncTeacherRequest(teacher: UserKeyCloak) {
    return {
        m_staff: [
            {
                action_kind: 'upserted',
                staff_id: teacher.id,
                name: teacher.firstName,
            },
        ],
    };
}

export function userRegistrationRequest(params: { student: UserKeyCloak; teacher: UserKeyCloak }) {
    const { student, teacher } = params;
    const now = Math.round(new Date().getTime() / 1000);

    return {
        timestamp: now,
        payload: {
            ...syncStudentRequest(student),
            ...syncTeacherRequest(teacher),
        },
    };
}

export function courseRegistrationRequest() {
    const now = Math.round(new Date().getTime() / 1000);
    const randomId = getRandomNumber();

    return {
        timestamp: now,
        payload: {
            m_course_name: [
                {
                    action_kind: 'upserted',
                    m_course_name_id: randomId,
                    course_name: `Jprep Course ${randomId}`,
                    m_course_student_div_id: 2,
                },
            ],
            m_regular_course: [
                {
                    action_kind: 'upserted',
                    m_course_id: randomId,
                    m_course_name_id: randomId,
                    startdate: '2022/10/10',
                    enddate: '2023/10/10',
                    m_class_name: `Jprep Class ${randomId}`,
                    m_academic_year_id: 1,
                },
            ],
            m_lesson: [
                {
                    m_lesson_id: randomId,
                    action_kind: 'upserted',
                    lesson_type: 'online',
                    m_course_name_id: randomId,
                    start_datetime: 1604552036,
                    end_datetime: 1604572036,
                    class_name: `Jprep Class ${randomId}`,
                    week: `Jprep Lesson ${randomId}`,
                },
            ],
            m_academic_year: [
                {
                    year_name: '2021',
                    action_kind: 'upserted',
                    end_year_date: 1646697599,
                    start_year_date: 1615248000,
                    academic_year_cd: '2021',
                    m_academic_year_id: 7,
                },
            ],
        },
    };
}

export function syncCourseWithStudentRequest(params: { studentId: string; lessonId: number }) {
    const { studentId, lessonId } = params;
    const now = Math.round(new Date().getTime() / 1000);

    return {
        timestamp: now,
        payload: {
            student_lesson: [
                {
                    action_kind: 'upserted',
                    student_id: studentId,
                    m_lesson_ids: [lessonId],
                },
            ],
        },
    };
}
