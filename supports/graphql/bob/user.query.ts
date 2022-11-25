import { gql } from 'graphql-tag';

import { UserByEmailQueryVariables } from '@supports/graphql/bob/bob-types';
import { GraphqlBody } from '@supports/packages/graphql-client';

export const userFragment = gql`
    fragment UserAttrs on users {
        user_id
        name
        email
        avatar
        phone_number
        user_group
        country
    }
`;

export const getOne = gql`
    query UserByEmail($email: String, $phone_number: String, $user_id: String) {
        users(
            where: {
                email: { _eq: $email }
                phone_number: { _eq: $phone_number }
                user_id: { _neq: $user_id }
            }
        ) {
            ...UserAttrs
        }
    }
    ${userFragment}
`;

class UserBobQuery {
    getOne(variables?: UserByEmailQueryVariables): GraphqlBody<UserByEmailQueryVariables> {
        return { query: getOne, variables };
    }
}

const userBobQuery = new UserBobQuery();

export default userBobQuery;
