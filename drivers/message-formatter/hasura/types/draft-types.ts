import * as Types from '../__generated__/draft/root-types';

export type MutateFeaturesMutationVariables = Types.Exact<{
  arg: Types.E2e_Features_Insert_Input;
}>;


export type MutateFeaturesMutation = { insert_e2e_features?: { affected_rows: number, returning: Array<{ feature_id: string, instance_id: string }> } | null | undefined };

export type FinishFeaturesMutationVariables = Types.Exact<{
  arg: Types.E2e_Features_Insert_Input;
}>;


export type FinishFeaturesMutation = { insert_e2e_features?: { affected_rows: number, returning: Array<{ feature_id: string, instance_id: string }> } | null | undefined };

export type MutateInstancesMutationVariables = Types.Exact<{
  arg: Types.E2e_Instances_Insert_Input;
}>;


export type MutateInstancesMutation = { insert_e2e_instances?: { affected_rows: number, returning: Array<{ instance_id: string }> } | null | undefined };

export type MutateScenariosMutationVariables = Types.Exact<{
  arg: Types.E2e_Scenarios_Insert_Input;
}>;


export type MutateScenariosMutation = { insert_e2e_scenarios?: { affected_rows: number, returning: Array<{ scenario_id: string, feature_id: string }> } | null | undefined };

export type MutateSeverityMutationVariables = Types.Exact<{
  arg: Array<Types.E2e_Scenario_Severity_Insert_Input> | Types.E2e_Scenario_Severity_Insert_Input;
}>;


export type MutateSeverityMutation = { insert_e2e_scenario_severity?: { affected_rows: number, returning: Array<{ feature_path: string, scenario_name: string }> } | null | undefined };

export type UpdateResultStepsMutationVariables = Types.Exact<{
  arg: Types.E2e_Steps_Insert_Input;
}>;


export type UpdateResultStepsMutation = { insert_e2e_steps?: { affected_rows: number, returning: Array<{ step_id: string, embeddings?: any | null | undefined }> } | null | undefined };

export type AppendEmbeddingsMutationVariables = Types.Exact<{
  arg: Types.E2e_Steps_Insert_Input;
}>;


export type AppendEmbeddingsMutation = { insert_e2e_steps?: { affected_rows: number, returning: Array<{ step_id: string, embeddings?: any | null | undefined }> } | null | undefined };

export type UpsertStepsMutationVariables = Types.Exact<{
  arg: Types.E2e_Steps_Insert_Input;
}>;


export type UpsertStepsMutation = { insert_e2e_steps?: { affected_rows: number, returning: Array<{ step_id: string }> } | null | undefined };
