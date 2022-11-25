import { CMSInterface } from '@supports/app-types';
import {
    User_RoleListV2Query,
    User_RoleListV2QueryVariables,
} from '@supports/graphql/bob/bob-types';
import userRolesBobQuery from '@supports/graphql/bob/role.query';
import { ArrayElement } from '@supports/types/cms-types';

export async function getTeacherAndSchoolAdminRoleList(
    cms: CMSInterface,
    variables?: User_RoleListV2QueryVariables
): Promise<User_RoleListV2Query['role']> {
    const resp = await cms.graphqlClient?.callGqlBob<User_RoleListV2Query>({
        body: userRolesBobQuery.getTeacherAndSchoolAdminRoleList(variables),
    });

    if (!resp?.data?.role) {
        throw new Error('Auth: Can not retrieve teacher and admin roles list');
    }

    return resp?.data?.role;
}

export function getOneTeacherRoleFromRolesList(
    rolesList: User_RoleListV2Query['role']
): ArrayElement<User_RoleListV2Query['role']> | undefined {
    return rolesList.find((role) => role.role_name === 'Teacher');
}
