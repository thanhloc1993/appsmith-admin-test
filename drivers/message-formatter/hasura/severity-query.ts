import gql from 'graphql-tag';

import { MutateSeverityMutationVariables } from './types/draft-types';

const upsertScenarioSeverity = gql`
    mutation mutateSeverity($arg: [e2e_scenario_severity_insert_input!]!) {
        insert_e2e_scenario_severity(
            objects: $arg
            on_conflict: {
                constraint: e2e_scenario_severity_pkey
                update_columns: [feature_name, severity_tags, keyword, updated_at]
            }
        ) {
            affected_rows
            returning {
                feature_path
                scenario_name
            }
        }
    }
`;

class E2ESeverityBob {
    upsertScenarioSeverity(variables: MutateSeverityMutationVariables) {
        return {
            mutation: upsertScenarioSeverity,
            variables: {
                ...variables,
            },
        };
    }
}

const scenarioSeverityBob = new E2ESeverityBob();

export default scenarioSeverityBob;
