import gql from 'graphql-tag';

import {
    AppendEmbeddingsMutationVariables,
    UpdateResultStepsMutationVariables,
    UpsertStepsMutationVariables,
} from './types/draft-types';

const updateResultSteps = gql`
    mutation UpdateResultSteps($arg: e2e_steps_insert_input!) {
        insert_e2e_steps(
            objects: [$arg]
            on_conflict: {
                constraint: e2e_steps_pkey
                update_columns: [
                    updated_at
                    duration
                    ended_at
                    message
                    will_be_retried
                    status
                    embeddings
                ]
            }
        ) {
            affected_rows
            returning {
                step_id
                embeddings
            }
        }
    }
`;

const appendEmbeddings = gql`
    mutation AppendEmbeddings($arg: e2e_steps_insert_input!) {
        insert_e2e_steps(
            objects: [$arg]
            on_conflict: { constraint: e2e_steps_pkey, update_columns: [updated_at, embeddings] }
        ) {
            affected_rows
            returning {
                step_id
                embeddings
            }
        }
    }
`;

const upsertSteps = gql`
    mutation UpsertSteps($arg: e2e_steps_insert_input!) {
        insert_e2e_steps(
            objects: [$arg]
            on_conflict: {
                constraint: e2e_steps_pkey
                update_columns: [
                    updated_at
                    is_hook
                    name
                    uri
                    keyword
                    started_at
                    scenario_id
                    index
                ]
            }
        ) {
            affected_rows
            returning {
                step_id
            }
        }
    }
`;
class E2EStepsBob {
    appendEmbeddings(variables: AppendEmbeddingsMutationVariables) {
        return {
            mutation: appendEmbeddings,
            variables: {
                ...variables,
            },
        };
    }
    upsertSteps(variables: UpsertStepsMutationVariables) {
        const arg = variables.arg;

        return {
            mutation: upsertSteps,
            variables: {
                ...variables,
                arg: {
                    ...arg,
                },
            },
        };
    }
    updateResultSteps(variables: UpdateResultStepsMutationVariables) {
        const arg = variables.arg;

        return {
            mutation: updateResultSteps,
            variables: {
                ...variables,
                arg: {
                    ...arg,
                },
            },
        };
    }
}

const stepsBob = new E2EStepsBob();

export default stepsBob;
