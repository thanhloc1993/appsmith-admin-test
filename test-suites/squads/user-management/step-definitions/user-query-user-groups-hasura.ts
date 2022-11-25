import { CMSInterface } from '@supports/app-types';
import { nameUserGroupTeacher } from '@supports/constants';
import {
    User_UserGroupListV2Query,
    User_UserGroupListV2QueryVariables,
} from '@supports/graphql/bob/bob-types';
import userGroupQueriesBob from '@supports/graphql/bob/user-group.query';

export async function getUserGroupsWithTeacherRole(
    cms: CMSInterface,
    variables?: User_UserGroupListV2QueryVariables
): Promise<User_UserGroupListV2Query['user_group']> {
    const resp = await cms.graphqlClient?.callGqlBob<User_UserGroupListV2Query>({
        body: userGroupQueriesBob.getListWithFilter(variables),
    });

    if (!resp?.data?.user_group) {
        throw Error('Auth: Can not retrieve user groups list, getUserGroupWithTeacherRole');
    }

    const teacherGroups = resp?.data?.user_group?.filter(
        (userGroup) => userGroup.user_group_name === nameUserGroupTeacher
    );
    if (!teacherGroups.length) {
        throw Error('Auth: Can not get user group with teacher role. getUserGroupWithTeacherRole');
    }

    return teacherGroups;
}

export async function getUserGroupList(
    cms: CMSInterface,
    variables?: User_UserGroupListV2QueryVariables
): Promise<User_UserGroupListV2Query['user_group']> {
    const resp = await cms.graphqlClient?.callGqlBob<User_UserGroupListV2Query>({
        body: userGroupQueriesBob.getListWithFilter(variables),
    });

    if (!resp?.data?.user_group) {
        throw Error('Auth: Can not retrieve user groups list API');
    }

    return resp?.data?.user_group;
}
