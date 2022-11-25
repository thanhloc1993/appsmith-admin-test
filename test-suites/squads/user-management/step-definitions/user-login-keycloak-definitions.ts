import { getRandomNumber } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import { EndpointKeyCloakAndJPREP, PathnameSyncJPREP } from '@supports/enum';

import {
    httpClientSyncDataFromJPREPPartner,
    httpClientUserKeyCloak,
} from './user-definition-utils';

export enum AccountKeyCloakAdmin {
    USERNAME = 'manabie_admin_minhthao_nguyen',
    PASSWORD = 'minhthao56',
}

export enum UserKeyCloakTypes {
    TEACHER = 'teacher',
    STUDENT = 'student',
}

interface UserRespCloakTypes {
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

type UpdateUserKeyCloakReqProps = {
    typeUser: UserKeyCloakTypes;
    userId: string;
};

const createUserKeyCloakReq = () => {
    const username = `e2e-student.${getRandomNumber()}@manabie.com`;
    const req = {
        enabled: true,
        username: username,
        email: username,
        firstName: username,
        lastName: username,
        credentials: [
            {
                type: 'password',
                value: '123123',
                temporary: true,
            },
        ],
    };

    return req;
};

const updateUserKeyCloakReq = ({ userId, typeUser }: UpdateUserKeyCloakReqProps) => {
    let req: any = {
        attributes: {
            uid: userId,
        },
    };
    if (typeUser === UserKeyCloakTypes.STUDENT) {
        req = {
            attributes: {
                ...req.attributes,
                student_division: 'kids',
            },
        };
    }
    return req;
};

export async function randomCreateUserOnKeyCloak(
    token: string,
    typeUser: UserKeyCloakTypes
): Promise<UserRespCloakTypes> {
    try {
        const respCreate = await httpClientUserKeyCloak({
            method: 'post',
            data: createUserKeyCloakReq(),
            token,
        });

        const locations = respCreate.headers.location.split('/');

        const length = locations.length;

        const userId = locations[length - 1];

        await httpClientUserKeyCloak({
            method: 'put',
            data: updateUserKeyCloakReq({ userId, typeUser }),
            token,
            userId,
        });

        const user = await httpClientUserKeyCloak({ method: 'get', token, userId });

        return user.data;
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
}

export async function gotoAdminKeyCloakAuthPageAndGetToken(cms: CMSInterface) {
    const newPage = await cms.page?.context().newPage();

    await newPage?.goto(EndpointKeyCloakAndJPREP.URL_AUTH);

    await newPage?.click('text=Administration Console');

    await newPage?.fill('#username', AccountKeyCloakAdmin.USERNAME);

    await newPage?.fill('#password', AccountKeyCloakAdmin.PASSWORD);

    await newPage?.click('#kc-login');

    const resp = await newPage?.waitForResponse(
        (resp) => resp.url() === EndpointKeyCloakAndJPREP.URL_TOKEN
    );

    const respBody: any = await resp?.json();

    const accessToken = respBody?.access_token;

    await newPage?.close();

    return accessToken;
}

type SyncStudentAndTeacherReqProps = {
    teacher?: UserRespCloakTypes;
    student?: UserRespCloakTypes;
};

const syncStudentOrTeacherFromJPREPReq = ({ teacher, student }: SyncStudentAndTeacherReqProps) => {
    const now = Math.round(new Date().getTime() / 1000);

    let req = {
        timestamp: now,
        payload: {},
    };

    if (student) {
        const reqStudent = {
            m_student: [
                {
                    action_kind: 'upserted',
                    student_divs: [
                        {
                            m_student_div_id: 1,
                        },
                    ],
                    student_id: student.id,
                    last_name: student.lastName,
                    given_name: student.firstName,
                },
            ],
        };
        req = { ...req, payload: { ...req.payload, ...reqStudent } };
    }

    if (teacher) {
        const reqTeacher = {
            m_staff: [
                {
                    action_kind: 'upserted',
                    staff_id: teacher.id,
                    name: teacher.firstName,
                },
            ],
        };
        req = { ...req, payload: { ...req.payload, ...reqTeacher } };
    }

    return req;
};

const syncStudentAndTeacherFromJPREP = async ({
    teacher,
    student,
}: SyncStudentAndTeacherReqProps) => {
    try {
        const result = await httpClientSyncDataFromJPREPPartner({
            method: 'put',
            data: syncStudentOrTeacherFromJPREPReq({ student, teacher }),
            pathname: PathnameSyncJPREP.USER_REGISTRATION,
        });
        return result.data;
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
};

export async function loginKeyCloakAuthPage(cms: CMSInterface, username: string, password: string) {
    await cms.instruction('School admin types username, password and login', async function () {
        await cms.page?.fill('#username', username);

        await cms.page?.fill('#password', password);
    });
    await cms.instruction('School admin waits for login', async function () {
        await Promise.all([cms.page?.waitForEvent('load'), cms.page?.click('#kc-login')]);
    });
}

export async function syncStudentAndTeacherFromJPREPPartner(cms: CMSInterface) {
    const accessToken = await gotoAdminKeyCloakAuthPageAndGetToken(cms);

    const student = await randomCreateUserOnKeyCloak(accessToken, UserKeyCloakTypes.STUDENT);

    const teacher = await randomCreateUserOnKeyCloak(accessToken, UserKeyCloakTypes.TEACHER);

    const result = await syncStudentAndTeacherFromJPREP({ student, teacher });

    // TODO: Implement login on leaner and teacher JPREP after fix bug auto login account test on both app
    console.log({ result });
    console.log({ teacher });
    console.log({ student });
}

export async function checkSchoolAdminLoginOnJPREPPartner(cms: CMSInterface) {
    const profile = await cms.getProfile();

    await cms.page?.waitForSelector('img[alt="JPREP logo"]');

    weExpect(profile.schoolId).toEqual(-2147483647);
}
