import gql from 'graphql-tag';

import { convertArrayToPostgresArray } from '../utils';
import {
    FinishFeaturesMutationVariables,
    MutateFeaturesMutationVariables,
} from './types/draft-types';

const upsertFeatures = gql`
    mutation mutateFeatures($arg: e2e_features_insert_input!) {
        insert_e2e_features(
            objects: [$arg]
            on_conflict: { constraint: e2e_features_pkey, update_columns: [updated_at] }
        ) {
            affected_rows
            returning {
                feature_id
                instance_id
            }
        }
    }
`;
const finishFeatures = gql`
    mutation finishFeatures($arg: e2e_features_insert_input!) {
        insert_e2e_features(
            objects: [$arg]
            on_conflict: {
                constraint: e2e_features_pkey
                update_columns: [updated_at, status, ended_at]
            }
        ) {
            affected_rows
            returning {
                feature_id
                instance_id
            }
        }
    }
`;

class E2EFeaturesBob {
    finishFeatures(variables: FinishFeaturesMutationVariables) {
        const arg = variables.arg;

        return {
            mutation: finishFeatures,
            variables: {
                ...variables,
                arg: {
                    ...arg,
                },
            },
        };
    }
    upsertFeatures(variables: MutateFeaturesMutationVariables) {
        const arg = variables.arg;

        return {
            mutation: upsertFeatures,
            variables: {
                ...variables,
                arg: {
                    ...arg,
                    tags: convertArrayToPostgresArray(arg.tags),
                    rules: convertArrayToPostgresArray(arg.rules),
                },
            },
        };
    }
}

const featuresBob = new E2EFeaturesBob();

export default featuresBob;
