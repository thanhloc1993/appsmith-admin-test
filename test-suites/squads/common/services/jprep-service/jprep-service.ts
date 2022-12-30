import {
    httpClientSyncDataFromJPREPPartner,
    httpClientUserKeyCloak,
} from 'test-suites/squads/common/services/jprep-service/jprep-service-clients';
import {
    courseRegistrationRequest,
    createUserKeyCloakRequest,
    syncCourseWithStudentRequest,
    updateUserKeyCloakRequest,
    userRegistrationRequest,
} from 'test-suites/squads/common/services/jprep-service/jprep-service-requests';
import {
    UserKeyCloak,
    UserTypeKeyCloak,
} from 'test-suites/squads/common/services/jprep-service/types';

export async function createRandomUserOnKeyCloak(
    token: string,
    typeUser: UserTypeKeyCloak
): Promise<UserKeyCloak> {
    try {
        const respCreate = await httpClientUserKeyCloak({
            method: 'post',
            data: createUserKeyCloakRequest(),
            token,
        });

        const locations: string[] = respCreate.headers.location.split('/');
        const userId = locations.pop() || '';

        await httpClientUserKeyCloak({
            method: 'put',
            data: updateUserKeyCloakRequest({ userId, typeUser }),
            token,
            userId,
        });

        const user = await httpClientUserKeyCloak({ method: 'get', token, userId });

        return user.data;
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export async function syncStudentAndTeacherJPREP(params: {
    teacher: UserKeyCloak;
    student: UserKeyCloak;
}) {
    const { teacher, student } = params;

    try {
        const result = await httpClientSyncDataFromJPREPPartner({
            method: 'put',
            data: userRegistrationRequest({ student, teacher }),
            pathname: 'user-registration',
        });
        return result.data;
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export async function createRandomCourseWithOnlineLessonJPREP() {
    try {
        const data = courseRegistrationRequest();

        await httpClientSyncDataFromJPREPPartner({
            method: 'put',
            data,
            pathname: 'master-registration',
        });

        return { course: data.payload.m_course_name[0], lesson: data.payload.m_lesson[0] };
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export async function syncStudentWithCourseJPREP(params: { studentId: string; lessonId: number }) {
    const { studentId, lessonId } = params;

    try {
        await httpClientSyncDataFromJPREPPartner({
            method: 'put',
            data: syncCourseWithStudentRequest({ studentId, lessonId }),
            pathname: 'user-course',
        });
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}
