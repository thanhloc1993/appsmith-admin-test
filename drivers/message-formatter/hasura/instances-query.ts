import gql from 'graphql-tag';

import { convertArrayToPostgresArray, isOnTrunk } from '../utils';
import { MutateInstancesMutationVariables } from './types/draft-types';

const upsertInstance = gql`
    mutation mutateInstances($arg: e2e_instances_insert_input!) {
        insert_e2e_instances(
            objects: [$arg]
            on_conflict: {
                constraint: e2e_instances_pkey
                update_columns: [
                    updated_at
                    status
                    message
                    ended_at
                    duration
                    status_statistics
                    metadata
                ]
            }
        ) {
            affected_rows
            returning {
                instance_id
            }
        }
    }
`;

class E2EInstancesBob {
    upsertInstance(variables: MutateInstancesMutationVariables) {
        const arg = variables.arg;

        return {
            mutation: upsertInstance,
            variables: {
                arg: {
                    ...arg,
                    tags: convertArrayToPostgresArray(arg.tags || []),
                    squad_tags: convertArrayToPostgresArray(arg.squad_tags || []),
                    on_trunk: isOnTrunk(),
                },
            },
        };
    }
}

const instancesBob = new E2EInstancesBob();

export default instancesBob;
