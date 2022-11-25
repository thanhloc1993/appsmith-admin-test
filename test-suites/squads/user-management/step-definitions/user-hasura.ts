import { arrayHasItem } from '@legacy-step-definitions/utils';

import { CMSInterface } from '@supports/app-types';
import {
    UserByEmailQuery,
    UserByEmailQueryVariables,
    User_Eibanam_GetPartnerInternalIdByLocationIdsQueryVariables,
    User_Eibanam_GetPartnerInternalIdByLocationIdsQuery,
} from '@supports/graphql/bob/bob-types';
import locationBobQuery from '@supports/graphql/bob/locations.query';
import userBobQuery from '@supports/graphql/bob/user.query';

export async function checkExistedUser(
    cms: CMSInterface,
    variables: UserByEmailQueryVariables
): Promise<boolean> {
    const resp = await cms.graphqlClient?.callGqlBob<UserByEmailQuery>({
        body: userBobQuery.getOne(variables),
    });

    if (resp && arrayHasItem(resp.data.users)) {
        return true;
    }
    return false;
}

export async function getPartnerInternalLocationIds(
    cms: CMSInterface,
    variables: User_Eibanam_GetPartnerInternalIdByLocationIdsQueryVariables
): Promise<User_Eibanam_GetPartnerInternalIdByLocationIdsQuery | undefined> {
    const resp =
        await cms.graphqlClient?.callGqlBob<User_Eibanam_GetPartnerInternalIdByLocationIdsQuery>({
            body: locationBobQuery.getPartnerInternalLocationIdByLocationIds(variables),
        });

    return resp?.data;
}
