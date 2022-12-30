import gql from 'graphql-tag';

import { convertArrayToPostgresArray } from '../utils';
import { MutateScenariosMutationVariables } from './types/draft-types';

const upsertScenarios = gql`
    mutation mutateScenarios($arg: e2e_scenarios_insert_input!) {
        insert_e2e_scenarios(
            objects: [$arg]
            on_conflict: {
                constraint: e2e_scenarios_pkey
                update_columns: [
                    updated_at
                    status
                    steps
                    name
                    keyword
                    description
                    started_at
                    ended_at
                    pickle
                    test_case
                    feature_path
                ]
            }
        ) {
            affected_rows
            returning {
                scenario_id
                feature_id
            }
        }
    }
`;

class E2EScenariosBob {
    upsertScenarios(variables: MutateScenariosMutationVariables) {
        const arg = variables.arg;
        return {
            mutation: upsertScenarios,
            variables: {
                arg: {
                    ...arg,
                    tags: convertArrayToPostgresArray(arg.tags),
                },
            },
        };
    }
}

const scenariosBob = new E2EScenariosBob();

export default scenariosBob;
