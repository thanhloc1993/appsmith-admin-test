import { gql } from 'graphql-tag';

import { Users_PrefectureListQueryVariables } from '@supports/graphql/bob/bob-types';
import { GraphqlBody } from '@supports/packages/graphql-client';

const getListQuery = gql`
    query Users_PrefectureList {
        prefecture(order_by: { prefecture_code: asc }) {
            prefecture_id
            name
        }
    }
`;

class PrefectureBobQuery {
    getList(
        variables?: Users_PrefectureListQueryVariables
    ): GraphqlBody<Users_PrefectureListQueryVariables> {
        return { query: getListQuery, variables };
    }
}

const prefectureBobQuery = new PrefectureBobQuery();

export default prefectureBobQuery;
