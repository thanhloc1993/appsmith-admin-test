export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _text: any;
  bigint: bigint;
  json: any;
  jsonb: any;
  numeric: number;
  smallint: number;
  timestamptz: any;
};

export type Boolean_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _cast?: InputMaybe<Boolean_Cast_Exp>;
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type Int_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _cast?: InputMaybe<Int_Cast_Exp>;
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "_text". All fields are combined with logical 'AND'. */
export type _Text_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['_text']>;
  _gt?: InputMaybe<Scalars['_text']>;
  _gte?: InputMaybe<Scalars['_text']>;
  _in?: InputMaybe<Array<Scalars['_text']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['_text']>;
  _lte?: InputMaybe<Scalars['_text']>;
  _neq?: InputMaybe<Scalars['_text']>;
  _nin?: InputMaybe<Array<Scalars['_text']>>;
};

export type Bigint_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _cast?: InputMaybe<Bigint_Cast_Exp>;
  _eq?: InputMaybe<Scalars['bigint']>;
  _gt?: InputMaybe<Scalars['bigint']>;
  _gte?: InputMaybe<Scalars['bigint']>;
  _in?: InputMaybe<Array<Scalars['bigint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bigint']>;
  _lte?: InputMaybe<Scalars['bigint']>;
  _neq?: InputMaybe<Scalars['bigint']>;
  _nin?: InputMaybe<Array<Scalars['bigint']>>;
};

export type Count_Instances_Group_By_Date_Args = {
  _date_from?: InputMaybe<Scalars['timestamptz']>;
  _date_till?: InputMaybe<Scalars['timestamptz']>;
  _environment?: InputMaybe<Scalars['String']>;
  _feature_tag?: InputMaybe<Scalars['_text']>;
  _group_by?: InputMaybe<Scalars['String']>;
  _on_trunk?: InputMaybe<Scalars['Boolean']>;
  _squad_tags?: InputMaybe<Scalars['_text']>;
};

export type Count_Instances_Group_By_Status_Args = {
  _date_from?: InputMaybe<Scalars['timestamptz']>;
  _date_till?: InputMaybe<Scalars['timestamptz']>;
  _environment?: InputMaybe<Scalars['String']>;
  _feature_tag?: InputMaybe<Scalars['_text']>;
  _on_trunk?: InputMaybe<Scalars['Boolean']>;
  _squad_tags?: InputMaybe<Scalars['_text']>;
};

/** columns and relationships of "e2e_features" */
export type E2e_Features = {
  background?: Maybe<Scalars['jsonb']>;
  children?: Maybe<Scalars['jsonb']>;
  created_at: Scalars['timestamptz'];
  data?: Maybe<Scalars['String']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  /** An object relationship */
  e2e_instance?: Maybe<E2e_Instances>;
  elements?: Maybe<Scalars['_text']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  feature_id: Scalars['String'];
  instance_id: Scalars['String'];
  keyword?: Maybe<Scalars['String']>;
  media_type?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  on_trunk?: Maybe<Scalars['Boolean']>;
  rules?: Maybe<Scalars['_text']>;
  scenarios?: Maybe<Scalars['jsonb']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['_text']>;
  updated_at: Scalars['timestamptz'];
  uri?: Maybe<Scalars['String']>;
  worker_id?: Maybe<Scalars['Int']>;
};


/** columns and relationships of "e2e_features" */
export type E2e_FeaturesBackgroundArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "e2e_features" */
export type E2e_FeaturesChildrenArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "e2e_features" */
export type E2e_FeaturesScenariosArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "e2e_features" */
export type E2e_Features_Aggregate = {
  aggregate?: Maybe<E2e_Features_Aggregate_Fields>;
  nodes: Array<E2e_Features>;
};

/** aggregate fields of "e2e_features" */
export type E2e_Features_Aggregate_Fields = {
  avg?: Maybe<E2e_Features_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<E2e_Features_Max_Fields>;
  min?: Maybe<E2e_Features_Min_Fields>;
  stddev?: Maybe<E2e_Features_Stddev_Fields>;
  stddev_pop?: Maybe<E2e_Features_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<E2e_Features_Stddev_Samp_Fields>;
  sum?: Maybe<E2e_Features_Sum_Fields>;
  var_pop?: Maybe<E2e_Features_Var_Pop_Fields>;
  var_samp?: Maybe<E2e_Features_Var_Samp_Fields>;
  variance?: Maybe<E2e_Features_Variance_Fields>;
};


/** aggregate fields of "e2e_features" */
export type E2e_Features_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Features_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "e2e_features" */
export type E2e_Features_Aggregate_Order_By = {
  avg?: InputMaybe<E2e_Features_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<E2e_Features_Max_Order_By>;
  min?: InputMaybe<E2e_Features_Min_Order_By>;
  stddev?: InputMaybe<E2e_Features_Stddev_Order_By>;
  stddev_pop?: InputMaybe<E2e_Features_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<E2e_Features_Stddev_Samp_Order_By>;
  sum?: InputMaybe<E2e_Features_Sum_Order_By>;
  var_pop?: InputMaybe<E2e_Features_Var_Pop_Order_By>;
  var_samp?: InputMaybe<E2e_Features_Var_Samp_Order_By>;
  variance?: InputMaybe<E2e_Features_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type E2e_Features_Append_Input = {
  background?: InputMaybe<Scalars['jsonb']>;
  children?: InputMaybe<Scalars['jsonb']>;
  scenarios?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "e2e_features" */
export type E2e_Features_Arr_Rel_Insert_Input = {
  data: Array<E2e_Features_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<E2e_Features_On_Conflict>;
};

/** aggregate avg on columns */
export type E2e_Features_Avg_Fields = {
  duration?: Maybe<Scalars['Float']>;
  worker_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "e2e_features" */
export type E2e_Features_Avg_Order_By = {
  duration?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "e2e_features". All fields are combined with a logical 'AND'. */
export type E2e_Features_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Features_Bool_Exp>>;
  _not?: InputMaybe<E2e_Features_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Features_Bool_Exp>>;
  background?: InputMaybe<Jsonb_Comparison_Exp>;
  children?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<String_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  duration?: InputMaybe<Int_Comparison_Exp>;
  e2e_instance?: InputMaybe<E2e_Instances_Bool_Exp>;
  elements?: InputMaybe<_Text_Comparison_Exp>;
  ended_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  feature_id?: InputMaybe<String_Comparison_Exp>;
  instance_id?: InputMaybe<String_Comparison_Exp>;
  keyword?: InputMaybe<String_Comparison_Exp>;
  media_type?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  on_trunk?: InputMaybe<Boolean_Comparison_Exp>;
  rules?: InputMaybe<_Text_Comparison_Exp>;
  scenarios?: InputMaybe<Jsonb_Comparison_Exp>;
  started_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  tags?: InputMaybe<_Text_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  uri?: InputMaybe<String_Comparison_Exp>;
  worker_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "e2e_features" */
export enum E2e_Features_Constraint {
  /** unique or primary key constraint on columns "instance_id", "uri" */
  E2eFeaturesInstanceIdUriIdx = 'e2e_features_instance_id_uri__idx',
  /** unique or primary key constraint on columns "feature_id" */
  E2eFeaturesPkey = 'e2e_features_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type E2e_Features_Delete_At_Path_Input = {
  background?: InputMaybe<Array<Scalars['String']>>;
  children?: InputMaybe<Array<Scalars['String']>>;
  scenarios?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type E2e_Features_Delete_Elem_Input = {
  background?: InputMaybe<Scalars['Int']>;
  children?: InputMaybe<Scalars['Int']>;
  scenarios?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type E2e_Features_Delete_Key_Input = {
  background?: InputMaybe<Scalars['String']>;
  children?: InputMaybe<Scalars['String']>;
  scenarios?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "e2e_features" */
export type E2e_Features_Inc_Input = {
  duration?: InputMaybe<Scalars['Int']>;
  worker_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "e2e_features" */
export type E2e_Features_Insert_Input = {
  background?: InputMaybe<Scalars['jsonb']>;
  children?: InputMaybe<Scalars['jsonb']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  data?: InputMaybe<Scalars['String']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['Int']>;
  e2e_instance?: InputMaybe<E2e_Instances_Obj_Rel_Insert_Input>;
  elements?: InputMaybe<Scalars['_text']>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  feature_id?: InputMaybe<Scalars['String']>;
  instance_id?: InputMaybe<Scalars['String']>;
  keyword?: InputMaybe<Scalars['String']>;
  media_type?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  on_trunk?: InputMaybe<Scalars['Boolean']>;
  rules?: InputMaybe<Scalars['_text']>;
  scenarios?: InputMaybe<Scalars['jsonb']>;
  started_at?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Scalars['_text']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  uri?: InputMaybe<Scalars['String']>;
  worker_id?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type E2e_Features_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  data?: Maybe<Scalars['String']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  feature_id?: Maybe<Scalars['String']>;
  instance_id?: Maybe<Scalars['String']>;
  keyword?: Maybe<Scalars['String']>;
  media_type?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uri?: Maybe<Scalars['String']>;
  worker_id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "e2e_features" */
export type E2e_Features_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  feature_id?: InputMaybe<Order_By>;
  instance_id?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  media_type?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  uri?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type E2e_Features_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  data?: Maybe<Scalars['String']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  feature_id?: Maybe<Scalars['String']>;
  instance_id?: Maybe<Scalars['String']>;
  keyword?: Maybe<Scalars['String']>;
  media_type?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uri?: Maybe<Scalars['String']>;
  worker_id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "e2e_features" */
export type E2e_Features_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  feature_id?: InputMaybe<Order_By>;
  instance_id?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  media_type?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  uri?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "e2e_features" */
export type E2e_Features_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<E2e_Features>;
};

/** input type for inserting object relation for remote table "e2e_features" */
export type E2e_Features_Obj_Rel_Insert_Input = {
  data: E2e_Features_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<E2e_Features_On_Conflict>;
};

/** on_conflict condition type for table "e2e_features" */
export type E2e_Features_On_Conflict = {
  constraint: E2e_Features_Constraint;
  update_columns?: Array<E2e_Features_Update_Column>;
  where?: InputMaybe<E2e_Features_Bool_Exp>;
};

/** Ordering options when selecting data from "e2e_features". */
export type E2e_Features_Order_By = {
  background?: InputMaybe<Order_By>;
  children?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  e2e_instance?: InputMaybe<E2e_Instances_Order_By>;
  elements?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  feature_id?: InputMaybe<Order_By>;
  instance_id?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  media_type?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  on_trunk?: InputMaybe<Order_By>;
  rules?: InputMaybe<Order_By>;
  scenarios?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  uri?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: e2e_features */
export type E2e_Features_Pk_Columns_Input = {
  feature_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type E2e_Features_Prepend_Input = {
  background?: InputMaybe<Scalars['jsonb']>;
  children?: InputMaybe<Scalars['jsonb']>;
  scenarios?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "e2e_features" */
export enum E2e_Features_Select_Column {
  /** column name */
  Background = 'background',
  /** column name */
  Children = 'children',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Description = 'description',
  /** column name */
  Duration = 'duration',
  /** column name */
  Elements = 'elements',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  FeatureId = 'feature_id',
  /** column name */
  InstanceId = 'instance_id',
  /** column name */
  Keyword = 'keyword',
  /** column name */
  MediaType = 'media_type',
  /** column name */
  Name = 'name',
  /** column name */
  OnTrunk = 'on_trunk',
  /** column name */
  Rules = 'rules',
  /** column name */
  Scenarios = 'scenarios',
  /** column name */
  StartedAt = 'started_at',
  /** column name */
  Status = 'status',
  /** column name */
  Tags = 'tags',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Uri = 'uri',
  /** column name */
  WorkerId = 'worker_id'
}

/** input type for updating data in table "e2e_features" */
export type E2e_Features_Set_Input = {
  background?: InputMaybe<Scalars['jsonb']>;
  children?: InputMaybe<Scalars['jsonb']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  data?: InputMaybe<Scalars['String']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['Int']>;
  elements?: InputMaybe<Scalars['_text']>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  feature_id?: InputMaybe<Scalars['String']>;
  instance_id?: InputMaybe<Scalars['String']>;
  keyword?: InputMaybe<Scalars['String']>;
  media_type?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  on_trunk?: InputMaybe<Scalars['Boolean']>;
  rules?: InputMaybe<Scalars['_text']>;
  scenarios?: InputMaybe<Scalars['jsonb']>;
  started_at?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Scalars['_text']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  uri?: InputMaybe<Scalars['String']>;
  worker_id?: InputMaybe<Scalars['Int']>;
};

/** columns and relationships of "e2e_features_status" */
export type E2e_Features_Status = {
  count?: Maybe<Scalars['bigint']>;
  feature_ids?: Maybe<Scalars['_text']>;
  instance_ids?: Maybe<Scalars['_text']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['_text']>;
};

/** aggregated selection of "e2e_features_status" */
export type E2e_Features_Status_Aggregate = {
  aggregate?: Maybe<E2e_Features_Status_Aggregate_Fields>;
  nodes: Array<E2e_Features_Status>;
};

/** aggregate fields of "e2e_features_status" */
export type E2e_Features_Status_Aggregate_Fields = {
  avg?: Maybe<E2e_Features_Status_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<E2e_Features_Status_Max_Fields>;
  min?: Maybe<E2e_Features_Status_Min_Fields>;
  stddev?: Maybe<E2e_Features_Status_Stddev_Fields>;
  stddev_pop?: Maybe<E2e_Features_Status_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<E2e_Features_Status_Stddev_Samp_Fields>;
  sum?: Maybe<E2e_Features_Status_Sum_Fields>;
  var_pop?: Maybe<E2e_Features_Status_Var_Pop_Fields>;
  var_samp?: Maybe<E2e_Features_Status_Var_Samp_Fields>;
  variance?: Maybe<E2e_Features_Status_Variance_Fields>;
};


/** aggregate fields of "e2e_features_status" */
export type E2e_Features_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Features_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type E2e_Features_Status_Avg_Fields = {
  count?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "e2e_features_status". All fields are combined with a logical 'AND'. */
export type E2e_Features_Status_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Features_Status_Bool_Exp>>;
  _not?: InputMaybe<E2e_Features_Status_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Features_Status_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  feature_ids?: InputMaybe<_Text_Comparison_Exp>;
  instance_ids?: InputMaybe<_Text_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<_Text_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "e2e_features_status" */
export type E2e_Features_Status_Inc_Input = {
  count?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "e2e_features_status" */
export type E2e_Features_Status_Insert_Input = {
  count?: InputMaybe<Scalars['bigint']>;
  feature_ids?: InputMaybe<Scalars['_text']>;
  instance_ids?: InputMaybe<Scalars['_text']>;
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['_text']>;
};

/** aggregate max on columns */
export type E2e_Features_Status_Max_Fields = {
  count?: Maybe<Scalars['bigint']>;
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type E2e_Features_Status_Min_Fields = {
  count?: Maybe<Scalars['bigint']>;
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "e2e_features_status" */
export type E2e_Features_Status_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<E2e_Features_Status>;
};

/** Ordering options when selecting data from "e2e_features_status". */
export type E2e_Features_Status_Order_By = {
  count?: InputMaybe<Order_By>;
  feature_ids?: InputMaybe<Order_By>;
  instance_ids?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** select columns of table "e2e_features_status" */
export enum E2e_Features_Status_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  FeatureIds = 'feature_ids',
  /** column name */
  InstanceIds = 'instance_ids',
  /** column name */
  Name = 'name',
  /** column name */
  Status = 'status'
}

/** input type for updating data in table "e2e_features_status" */
export type E2e_Features_Status_Set_Input = {
  count?: InputMaybe<Scalars['bigint']>;
  feature_ids?: InputMaybe<Scalars['_text']>;
  instance_ids?: InputMaybe<Scalars['_text']>;
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['_text']>;
};

/** aggregate stddev on columns */
export type E2e_Features_Status_Stddev_Fields = {
  count?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type E2e_Features_Status_Stddev_Pop_Fields = {
  count?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type E2e_Features_Status_Stddev_Samp_Fields = {
  count?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type E2e_Features_Status_Sum_Fields = {
  count?: Maybe<Scalars['bigint']>;
};

/** aggregate var_pop on columns */
export type E2e_Features_Status_Var_Pop_Fields = {
  count?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type E2e_Features_Status_Var_Samp_Fields = {
  count?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type E2e_Features_Status_Variance_Fields = {
  count?: Maybe<Scalars['Float']>;
};

/** aggregate stddev on columns */
export type E2e_Features_Stddev_Fields = {
  duration?: Maybe<Scalars['Float']>;
  worker_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "e2e_features" */
export type E2e_Features_Stddev_Order_By = {
  duration?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type E2e_Features_Stddev_Pop_Fields = {
  duration?: Maybe<Scalars['Float']>;
  worker_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "e2e_features" */
export type E2e_Features_Stddev_Pop_Order_By = {
  duration?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type E2e_Features_Stddev_Samp_Fields = {
  duration?: Maybe<Scalars['Float']>;
  worker_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "e2e_features" */
export type E2e_Features_Stddev_Samp_Order_By = {
  duration?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type E2e_Features_Sum_Fields = {
  duration?: Maybe<Scalars['Int']>;
  worker_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "e2e_features" */
export type E2e_Features_Sum_Order_By = {
  duration?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** update columns of table "e2e_features" */
export enum E2e_Features_Update_Column {
  /** column name */
  Background = 'background',
  /** column name */
  Children = 'children',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Description = 'description',
  /** column name */
  Duration = 'duration',
  /** column name */
  Elements = 'elements',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  FeatureId = 'feature_id',
  /** column name */
  InstanceId = 'instance_id',
  /** column name */
  Keyword = 'keyword',
  /** column name */
  MediaType = 'media_type',
  /** column name */
  Name = 'name',
  /** column name */
  OnTrunk = 'on_trunk',
  /** column name */
  Rules = 'rules',
  /** column name */
  Scenarios = 'scenarios',
  /** column name */
  StartedAt = 'started_at',
  /** column name */
  Status = 'status',
  /** column name */
  Tags = 'tags',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Uri = 'uri',
  /** column name */
  WorkerId = 'worker_id'
}

/** aggregate var_pop on columns */
export type E2e_Features_Var_Pop_Fields = {
  duration?: Maybe<Scalars['Float']>;
  worker_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "e2e_features" */
export type E2e_Features_Var_Pop_Order_By = {
  duration?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type E2e_Features_Var_Samp_Fields = {
  duration?: Maybe<Scalars['Float']>;
  worker_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "e2e_features" */
export type E2e_Features_Var_Samp_Order_By = {
  duration?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type E2e_Features_Variance_Fields = {
  duration?: Maybe<Scalars['Float']>;
  worker_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "e2e_features" */
export type E2e_Features_Variance_Order_By = {
  duration?: InputMaybe<Order_By>;
  worker_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "e2e_instances" */
export type E2e_Instances = {
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  duration?: Maybe<Scalars['Int']>;
  /** An array relationship */
  e2e_features: Array<E2e_Features>;
  /** An aggregate relationship */
  e2e_features_aggregate: E2e_Features_Aggregate;
  ended_at?: Maybe<Scalars['timestamptz']>;
  flavor?: Maybe<Scalars['jsonb']>;
  instance_id: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['jsonb']>;
  name?: Maybe<Scalars['String']>;
  on_trunk?: Maybe<Scalars['Boolean']>;
  squad_tags?: Maybe<Scalars['_text']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  status_statistics?: Maybe<Scalars['jsonb']>;
  tags?: Maybe<Scalars['_text']>;
  total_worker?: Maybe<Scalars['Int']>;
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "e2e_instances" */
export type E2e_InstancesE2e_FeaturesArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Order_By>>;
  where?: InputMaybe<E2e_Features_Bool_Exp>;
};


/** columns and relationships of "e2e_instances" */
export type E2e_InstancesE2e_Features_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Order_By>>;
  where?: InputMaybe<E2e_Features_Bool_Exp>;
};


/** columns and relationships of "e2e_instances" */
export type E2e_InstancesFlavorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "e2e_instances" */
export type E2e_InstancesMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "e2e_instances" */
export type E2e_InstancesStatus_StatisticsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "e2e_instances" */
export type E2e_Instances_Aggregate = {
  aggregate?: Maybe<E2e_Instances_Aggregate_Fields>;
  nodes: Array<E2e_Instances>;
};

/** aggregate fields of "e2e_instances" */
export type E2e_Instances_Aggregate_Fields = {
  avg?: Maybe<E2e_Instances_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<E2e_Instances_Max_Fields>;
  min?: Maybe<E2e_Instances_Min_Fields>;
  stddev?: Maybe<E2e_Instances_Stddev_Fields>;
  stddev_pop?: Maybe<E2e_Instances_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<E2e_Instances_Stddev_Samp_Fields>;
  sum?: Maybe<E2e_Instances_Sum_Fields>;
  var_pop?: Maybe<E2e_Instances_Var_Pop_Fields>;
  var_samp?: Maybe<E2e_Instances_Var_Samp_Fields>;
  variance?: Maybe<E2e_Instances_Variance_Fields>;
};


/** aggregate fields of "e2e_instances" */
export type E2e_Instances_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type E2e_Instances_Append_Input = {
  flavor?: InputMaybe<Scalars['jsonb']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  status_statistics?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type E2e_Instances_Avg_Fields = {
  duration?: Maybe<Scalars['Float']>;
  total_worker?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "e2e_instances". All fields are combined with a logical 'AND'. */
export type E2e_Instances_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Instances_Bool_Exp>>;
  _not?: InputMaybe<E2e_Instances_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Instances_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  duration?: InputMaybe<Int_Comparison_Exp>;
  e2e_features?: InputMaybe<E2e_Features_Bool_Exp>;
  ended_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  flavor?: InputMaybe<Jsonb_Comparison_Exp>;
  instance_id?: InputMaybe<String_Comparison_Exp>;
  message?: InputMaybe<String_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  on_trunk?: InputMaybe<Boolean_Comparison_Exp>;
  squad_tags?: InputMaybe<_Text_Comparison_Exp>;
  started_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  status_statistics?: InputMaybe<Jsonb_Comparison_Exp>;
  tags?: InputMaybe<_Text_Comparison_Exp>;
  total_worker?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "e2e_instances" */
export enum E2e_Instances_Constraint {
  /** unique or primary key constraint on columns "instance_id" */
  E2eInstancesPkey = 'e2e_instances_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type E2e_Instances_Delete_At_Path_Input = {
  flavor?: InputMaybe<Array<Scalars['String']>>;
  metadata?: InputMaybe<Array<Scalars['String']>>;
  status_statistics?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type E2e_Instances_Delete_Elem_Input = {
  flavor?: InputMaybe<Scalars['Int']>;
  metadata?: InputMaybe<Scalars['Int']>;
  status_statistics?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type E2e_Instances_Delete_Key_Input = {
  flavor?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['String']>;
  status_statistics?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "e2e_instances_feature_tags" */
export type E2e_Instances_Feature_Tags = {
  feature_tag?: Maybe<Scalars['String']>;
};

/** aggregated selection of "e2e_instances_feature_tags" */
export type E2e_Instances_Feature_Tags_Aggregate = {
  aggregate?: Maybe<E2e_Instances_Feature_Tags_Aggregate_Fields>;
  nodes: Array<E2e_Instances_Feature_Tags>;
};

/** aggregate fields of "e2e_instances_feature_tags" */
export type E2e_Instances_Feature_Tags_Aggregate_Fields = {
  count: Scalars['Int'];
  max?: Maybe<E2e_Instances_Feature_Tags_Max_Fields>;
  min?: Maybe<E2e_Instances_Feature_Tags_Min_Fields>;
};


/** aggregate fields of "e2e_instances_feature_tags" */
export type E2e_Instances_Feature_Tags_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Instances_Feature_Tags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "e2e_instances_feature_tags". All fields are combined with a logical 'AND'. */
export type E2e_Instances_Feature_Tags_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Instances_Feature_Tags_Bool_Exp>>;
  _not?: InputMaybe<E2e_Instances_Feature_Tags_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Instances_Feature_Tags_Bool_Exp>>;
  feature_tag?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type E2e_Instances_Feature_Tags_Max_Fields = {
  feature_tag?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type E2e_Instances_Feature_Tags_Min_Fields = {
  feature_tag?: Maybe<Scalars['String']>;
};

/** Ordering options when selecting data from "e2e_instances_feature_tags". */
export type E2e_Instances_Feature_Tags_Order_By = {
  feature_tag?: InputMaybe<Order_By>;
};

/** select columns of table "e2e_instances_feature_tags" */
export enum E2e_Instances_Feature_Tags_Select_Column {
  /** column name */
  FeatureTag = 'feature_tag'
}

/** columns and relationships of "e2e_instances_group_by_date" */
export type E2e_Instances_Group_By_Date = {
  created_date?: Maybe<Scalars['String']>;
  instances_count?: Maybe<Scalars['bigint']>;
  status?: Maybe<Scalars['String']>;
};

export type E2e_Instances_Group_By_Date_Aggregate = {
  aggregate?: Maybe<E2e_Instances_Group_By_Date_Aggregate_Fields>;
  nodes: Array<E2e_Instances_Group_By_Date>;
};

/** aggregate fields of "e2e_instances_group_by_date" */
export type E2e_Instances_Group_By_Date_Aggregate_Fields = {
  avg?: Maybe<E2e_Instances_Group_By_Date_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<E2e_Instances_Group_By_Date_Max_Fields>;
  min?: Maybe<E2e_Instances_Group_By_Date_Min_Fields>;
  stddev?: Maybe<E2e_Instances_Group_By_Date_Stddev_Fields>;
  stddev_pop?: Maybe<E2e_Instances_Group_By_Date_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<E2e_Instances_Group_By_Date_Stddev_Samp_Fields>;
  sum?: Maybe<E2e_Instances_Group_By_Date_Sum_Fields>;
  var_pop?: Maybe<E2e_Instances_Group_By_Date_Var_Pop_Fields>;
  var_samp?: Maybe<E2e_Instances_Group_By_Date_Var_Samp_Fields>;
  variance?: Maybe<E2e_Instances_Group_By_Date_Variance_Fields>;
};


/** aggregate fields of "e2e_instances_group_by_date" */
export type E2e_Instances_Group_By_Date_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Instances_Group_By_Date_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type E2e_Instances_Group_By_Date_Avg_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "e2e_instances_group_by_date". All fields are combined with a logical 'AND'. */
export type E2e_Instances_Group_By_Date_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Instances_Group_By_Date_Bool_Exp>>;
  _not?: InputMaybe<E2e_Instances_Group_By_Date_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Instances_Group_By_Date_Bool_Exp>>;
  created_date?: InputMaybe<String_Comparison_Exp>;
  instances_count?: InputMaybe<Bigint_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "e2e_instances_group_by_date" */
export type E2e_Instances_Group_By_Date_Inc_Input = {
  instances_count?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "e2e_instances_group_by_date" */
export type E2e_Instances_Group_By_Date_Insert_Input = {
  created_date?: InputMaybe<Scalars['String']>;
  instances_count?: InputMaybe<Scalars['bigint']>;
  status?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type E2e_Instances_Group_By_Date_Max_Fields = {
  created_date?: Maybe<Scalars['String']>;
  instances_count?: Maybe<Scalars['bigint']>;
  status?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type E2e_Instances_Group_By_Date_Min_Fields = {
  created_date?: Maybe<Scalars['String']>;
  instances_count?: Maybe<Scalars['bigint']>;
  status?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "e2e_instances_group_by_date" */
export type E2e_Instances_Group_By_Date_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<E2e_Instances_Group_By_Date>;
};

/** Ordering options when selecting data from "e2e_instances_group_by_date". */
export type E2e_Instances_Group_By_Date_Order_By = {
  created_date?: InputMaybe<Order_By>;
  instances_count?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** select columns of table "e2e_instances_group_by_date" */
export enum E2e_Instances_Group_By_Date_Select_Column {
  /** column name */
  CreatedDate = 'created_date',
  /** column name */
  InstancesCount = 'instances_count',
  /** column name */
  Status = 'status'
}

/** input type for updating data in table "e2e_instances_group_by_date" */
export type E2e_Instances_Group_By_Date_Set_Input = {
  created_date?: InputMaybe<Scalars['String']>;
  instances_count?: InputMaybe<Scalars['bigint']>;
  status?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type E2e_Instances_Group_By_Date_Stddev_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type E2e_Instances_Group_By_Date_Stddev_Pop_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type E2e_Instances_Group_By_Date_Stddev_Samp_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type E2e_Instances_Group_By_Date_Sum_Fields = {
  instances_count?: Maybe<Scalars['bigint']>;
};

/** aggregate var_pop on columns */
export type E2e_Instances_Group_By_Date_Var_Pop_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type E2e_Instances_Group_By_Date_Var_Samp_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type E2e_Instances_Group_By_Date_Variance_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** input type for incrementing numeric columns in table "e2e_instances" */
export type E2e_Instances_Inc_Input = {
  duration?: InputMaybe<Scalars['Int']>;
  total_worker?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "e2e_instances" */
export type E2e_Instances_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  duration?: InputMaybe<Scalars['Int']>;
  e2e_features?: InputMaybe<E2e_Features_Arr_Rel_Insert_Input>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  flavor?: InputMaybe<Scalars['jsonb']>;
  instance_id?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  name?: InputMaybe<Scalars['String']>;
  on_trunk?: InputMaybe<Scalars['Boolean']>;
  squad_tags?: InputMaybe<Scalars['_text']>;
  started_at?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['String']>;
  status_statistics?: InputMaybe<Scalars['jsonb']>;
  tags?: InputMaybe<Scalars['_text']>;
  total_worker?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type E2e_Instances_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  duration?: Maybe<Scalars['Int']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  instance_id?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  total_worker?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type E2e_Instances_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  duration?: Maybe<Scalars['Int']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  instance_id?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  total_worker?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "e2e_instances" */
export type E2e_Instances_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<E2e_Instances>;
};

/** input type for inserting object relation for remote table "e2e_instances" */
export type E2e_Instances_Obj_Rel_Insert_Input = {
  data: E2e_Instances_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<E2e_Instances_On_Conflict>;
};

/** on_conflict condition type for table "e2e_instances" */
export type E2e_Instances_On_Conflict = {
  constraint: E2e_Instances_Constraint;
  update_columns?: Array<E2e_Instances_Update_Column>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};

/** Ordering options when selecting data from "e2e_instances". */
export type E2e_Instances_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  e2e_features_aggregate?: InputMaybe<E2e_Features_Aggregate_Order_By>;
  ended_at?: InputMaybe<Order_By>;
  flavor?: InputMaybe<Order_By>;
  instance_id?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  on_trunk?: InputMaybe<Order_By>;
  squad_tags?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  status_statistics?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  total_worker?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: e2e_instances */
export type E2e_Instances_Pk_Columns_Input = {
  instance_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type E2e_Instances_Prepend_Input = {
  flavor?: InputMaybe<Scalars['jsonb']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  status_statistics?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "e2e_instances" */
export enum E2e_Instances_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Duration = 'duration',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  Flavor = 'flavor',
  /** column name */
  InstanceId = 'instance_id',
  /** column name */
  Message = 'message',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Name = 'name',
  /** column name */
  OnTrunk = 'on_trunk',
  /** column name */
  SquadTags = 'squad_tags',
  /** column name */
  StartedAt = 'started_at',
  /** column name */
  Status = 'status',
  /** column name */
  StatusStatistics = 'status_statistics',
  /** column name */
  Tags = 'tags',
  /** column name */
  TotalWorker = 'total_worker',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "e2e_instances" */
export type E2e_Instances_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  duration?: InputMaybe<Scalars['Int']>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  flavor?: InputMaybe<Scalars['jsonb']>;
  instance_id?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  name?: InputMaybe<Scalars['String']>;
  on_trunk?: InputMaybe<Scalars['Boolean']>;
  squad_tags?: InputMaybe<Scalars['_text']>;
  started_at?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['String']>;
  status_statistics?: InputMaybe<Scalars['jsonb']>;
  tags?: InputMaybe<Scalars['_text']>;
  total_worker?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** columns and relationships of "e2e_instances_squad_tags" */
export type E2e_Instances_Squad_Tags = {
  squad_tag?: Maybe<Scalars['String']>;
};

/** aggregated selection of "e2e_instances_squad_tags" */
export type E2e_Instances_Squad_Tags_Aggregate = {
  aggregate?: Maybe<E2e_Instances_Squad_Tags_Aggregate_Fields>;
  nodes: Array<E2e_Instances_Squad_Tags>;
};

/** aggregate fields of "e2e_instances_squad_tags" */
export type E2e_Instances_Squad_Tags_Aggregate_Fields = {
  count: Scalars['Int'];
  max?: Maybe<E2e_Instances_Squad_Tags_Max_Fields>;
  min?: Maybe<E2e_Instances_Squad_Tags_Min_Fields>;
};


/** aggregate fields of "e2e_instances_squad_tags" */
export type E2e_Instances_Squad_Tags_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Instances_Squad_Tags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "e2e_instances_squad_tags". All fields are combined with a logical 'AND'. */
export type E2e_Instances_Squad_Tags_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Instances_Squad_Tags_Bool_Exp>>;
  _not?: InputMaybe<E2e_Instances_Squad_Tags_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Instances_Squad_Tags_Bool_Exp>>;
  squad_tag?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type E2e_Instances_Squad_Tags_Max_Fields = {
  squad_tag?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type E2e_Instances_Squad_Tags_Min_Fields = {
  squad_tag?: Maybe<Scalars['String']>;
};

/** Ordering options when selecting data from "e2e_instances_squad_tags". */
export type E2e_Instances_Squad_Tags_Order_By = {
  squad_tag?: InputMaybe<Order_By>;
};

/** select columns of table "e2e_instances_squad_tags" */
export enum E2e_Instances_Squad_Tags_Select_Column {
  /** column name */
  SquadTag = 'squad_tag'
}

/** columns and relationships of "e2e_instances_status_count" */
export type E2e_Instances_Status_Count = {
  instances_count?: Maybe<Scalars['bigint']>;
  status?: Maybe<Scalars['String']>;
};

export type E2e_Instances_Status_Count_Aggregate = {
  aggregate?: Maybe<E2e_Instances_Status_Count_Aggregate_Fields>;
  nodes: Array<E2e_Instances_Status_Count>;
};

/** aggregate fields of "e2e_instances_status_count" */
export type E2e_Instances_Status_Count_Aggregate_Fields = {
  avg?: Maybe<E2e_Instances_Status_Count_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<E2e_Instances_Status_Count_Max_Fields>;
  min?: Maybe<E2e_Instances_Status_Count_Min_Fields>;
  stddev?: Maybe<E2e_Instances_Status_Count_Stddev_Fields>;
  stddev_pop?: Maybe<E2e_Instances_Status_Count_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<E2e_Instances_Status_Count_Stddev_Samp_Fields>;
  sum?: Maybe<E2e_Instances_Status_Count_Sum_Fields>;
  var_pop?: Maybe<E2e_Instances_Status_Count_Var_Pop_Fields>;
  var_samp?: Maybe<E2e_Instances_Status_Count_Var_Samp_Fields>;
  variance?: Maybe<E2e_Instances_Status_Count_Variance_Fields>;
};


/** aggregate fields of "e2e_instances_status_count" */
export type E2e_Instances_Status_Count_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Instances_Status_Count_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type E2e_Instances_Status_Count_Avg_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "e2e_instances_status_count". All fields are combined with a logical 'AND'. */
export type E2e_Instances_Status_Count_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Instances_Status_Count_Bool_Exp>>;
  _not?: InputMaybe<E2e_Instances_Status_Count_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Instances_Status_Count_Bool_Exp>>;
  instances_count?: InputMaybe<Bigint_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "e2e_instances_status_count" */
export type E2e_Instances_Status_Count_Inc_Input = {
  instances_count?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "e2e_instances_status_count" */
export type E2e_Instances_Status_Count_Insert_Input = {
  instances_count?: InputMaybe<Scalars['bigint']>;
  status?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type E2e_Instances_Status_Count_Max_Fields = {
  instances_count?: Maybe<Scalars['bigint']>;
  status?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type E2e_Instances_Status_Count_Min_Fields = {
  instances_count?: Maybe<Scalars['bigint']>;
  status?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "e2e_instances_status_count" */
export type E2e_Instances_Status_Count_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<E2e_Instances_Status_Count>;
};

/** Ordering options when selecting data from "e2e_instances_status_count". */
export type E2e_Instances_Status_Count_Order_By = {
  instances_count?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** select columns of table "e2e_instances_status_count" */
export enum E2e_Instances_Status_Count_Select_Column {
  /** column name */
  InstancesCount = 'instances_count',
  /** column name */
  Status = 'status'
}

/** input type for updating data in table "e2e_instances_status_count" */
export type E2e_Instances_Status_Count_Set_Input = {
  instances_count?: InputMaybe<Scalars['bigint']>;
  status?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type E2e_Instances_Status_Count_Stddev_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type E2e_Instances_Status_Count_Stddev_Pop_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type E2e_Instances_Status_Count_Stddev_Samp_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type E2e_Instances_Status_Count_Sum_Fields = {
  instances_count?: Maybe<Scalars['bigint']>;
};

/** aggregate var_pop on columns */
export type E2e_Instances_Status_Count_Var_Pop_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type E2e_Instances_Status_Count_Var_Samp_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type E2e_Instances_Status_Count_Variance_Fields = {
  instances_count?: Maybe<Scalars['Float']>;
};

/** aggregate stddev on columns */
export type E2e_Instances_Stddev_Fields = {
  duration?: Maybe<Scalars['Float']>;
  total_worker?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type E2e_Instances_Stddev_Pop_Fields = {
  duration?: Maybe<Scalars['Float']>;
  total_worker?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type E2e_Instances_Stddev_Samp_Fields = {
  duration?: Maybe<Scalars['Float']>;
  total_worker?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type E2e_Instances_Sum_Fields = {
  duration?: Maybe<Scalars['Int']>;
  total_worker?: Maybe<Scalars['Int']>;
};

/** update columns of table "e2e_instances" */
export enum E2e_Instances_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Duration = 'duration',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  Flavor = 'flavor',
  /** column name */
  InstanceId = 'instance_id',
  /** column name */
  Message = 'message',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Name = 'name',
  /** column name */
  OnTrunk = 'on_trunk',
  /** column name */
  SquadTags = 'squad_tags',
  /** column name */
  StartedAt = 'started_at',
  /** column name */
  Status = 'status',
  /** column name */
  StatusStatistics = 'status_statistics',
  /** column name */
  Tags = 'tags',
  /** column name */
  TotalWorker = 'total_worker',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type E2e_Instances_Var_Pop_Fields = {
  duration?: Maybe<Scalars['Float']>;
  total_worker?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type E2e_Instances_Var_Samp_Fields = {
  duration?: Maybe<Scalars['Float']>;
  total_worker?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type E2e_Instances_Variance_Fields = {
  duration?: Maybe<Scalars['Float']>;
  total_worker?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "e2e_scenario_severity" */
export type E2e_Scenario_Severity = {
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  e2e_scenarios: Array<E2e_Scenarios>;
  /** An aggregate relationship */
  e2e_scenarios_aggregate: E2e_Scenarios_Aggregate;
  feature_name: Scalars['String'];
  feature_path: Scalars['String'];
  keyword: Scalars['String'];
  scenario_name: Scalars['String'];
  severity_tags: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "e2e_scenario_severity" */
export type E2e_Scenario_SeverityE2e_ScenariosArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenarios_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenarios_Order_By>>;
  where?: InputMaybe<E2e_Scenarios_Bool_Exp>;
};


/** columns and relationships of "e2e_scenario_severity" */
export type E2e_Scenario_SeverityE2e_Scenarios_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenarios_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenarios_Order_By>>;
  where?: InputMaybe<E2e_Scenarios_Bool_Exp>;
};

/** aggregated selection of "e2e_scenario_severity" */
export type E2e_Scenario_Severity_Aggregate = {
  aggregate?: Maybe<E2e_Scenario_Severity_Aggregate_Fields>;
  nodes: Array<E2e_Scenario_Severity>;
};

/** aggregate fields of "e2e_scenario_severity" */
export type E2e_Scenario_Severity_Aggregate_Fields = {
  count: Scalars['Int'];
  max?: Maybe<E2e_Scenario_Severity_Max_Fields>;
  min?: Maybe<E2e_Scenario_Severity_Min_Fields>;
};


/** aggregate fields of "e2e_scenario_severity" */
export type E2e_Scenario_Severity_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Scenario_Severity_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "e2e_scenario_severity". All fields are combined with a logical 'AND'. */
export type E2e_Scenario_Severity_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Scenario_Severity_Bool_Exp>>;
  _not?: InputMaybe<E2e_Scenario_Severity_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Scenario_Severity_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  e2e_scenarios?: InputMaybe<E2e_Scenarios_Bool_Exp>;
  feature_name?: InputMaybe<String_Comparison_Exp>;
  feature_path?: InputMaybe<String_Comparison_Exp>;
  keyword?: InputMaybe<String_Comparison_Exp>;
  scenario_name?: InputMaybe<String_Comparison_Exp>;
  severity_tags?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "e2e_scenario_severity" */
export enum E2e_Scenario_Severity_Constraint {
  /** unique or primary key constraint on columns "feature_path", "scenario_name" */
  E2eScenarioSeverityPkey = 'e2e_scenario_severity_pkey'
}

/** input type for inserting data into table "e2e_scenario_severity" */
export type E2e_Scenario_Severity_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  e2e_scenarios?: InputMaybe<E2e_Scenarios_Arr_Rel_Insert_Input>;
  feature_name?: InputMaybe<Scalars['String']>;
  feature_path?: InputMaybe<Scalars['String']>;
  keyword?: InputMaybe<Scalars['String']>;
  scenario_name?: InputMaybe<Scalars['String']>;
  severity_tags?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type E2e_Scenario_Severity_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  feature_name?: Maybe<Scalars['String']>;
  feature_path?: Maybe<Scalars['String']>;
  keyword?: Maybe<Scalars['String']>;
  scenario_name?: Maybe<Scalars['String']>;
  severity_tags?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type E2e_Scenario_Severity_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  feature_name?: Maybe<Scalars['String']>;
  feature_path?: Maybe<Scalars['String']>;
  keyword?: Maybe<Scalars['String']>;
  scenario_name?: Maybe<Scalars['String']>;
  severity_tags?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "e2e_scenario_severity" */
export type E2e_Scenario_Severity_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<E2e_Scenario_Severity>;
};

/** input type for inserting object relation for remote table "e2e_scenario_severity" */
export type E2e_Scenario_Severity_Obj_Rel_Insert_Input = {
  data: E2e_Scenario_Severity_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<E2e_Scenario_Severity_On_Conflict>;
};

/** on_conflict condition type for table "e2e_scenario_severity" */
export type E2e_Scenario_Severity_On_Conflict = {
  constraint: E2e_Scenario_Severity_Constraint;
  update_columns?: Array<E2e_Scenario_Severity_Update_Column>;
  where?: InputMaybe<E2e_Scenario_Severity_Bool_Exp>;
};

/** Ordering options when selecting data from "e2e_scenario_severity". */
export type E2e_Scenario_Severity_Order_By = {
  created_at?: InputMaybe<Order_By>;
  e2e_scenarios_aggregate?: InputMaybe<E2e_Scenarios_Aggregate_Order_By>;
  feature_name?: InputMaybe<Order_By>;
  feature_path?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  scenario_name?: InputMaybe<Order_By>;
  severity_tags?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: e2e_scenario_severity */
export type E2e_Scenario_Severity_Pk_Columns_Input = {
  feature_path: Scalars['String'];
  scenario_name: Scalars['String'];
};

/** select columns of table "e2e_scenario_severity" */
export enum E2e_Scenario_Severity_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FeatureName = 'feature_name',
  /** column name */
  FeaturePath = 'feature_path',
  /** column name */
  Keyword = 'keyword',
  /** column name */
  ScenarioName = 'scenario_name',
  /** column name */
  SeverityTags = 'severity_tags',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "e2e_scenario_severity" */
export type E2e_Scenario_Severity_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  feature_name?: InputMaybe<Scalars['String']>;
  feature_path?: InputMaybe<Scalars['String']>;
  keyword?: InputMaybe<Scalars['String']>;
  scenario_name?: InputMaybe<Scalars['String']>;
  severity_tags?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "e2e_scenario_severity" */
export enum E2e_Scenario_Severity_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FeatureName = 'feature_name',
  /** column name */
  FeaturePath = 'feature_path',
  /** column name */
  Keyword = 'keyword',
  /** column name */
  ScenarioName = 'scenario_name',
  /** column name */
  SeverityTags = 'severity_tags',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "e2e_scenarios" */
export type E2e_Scenarios = {
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  /** An object relationship */
  e2e_feature?: Maybe<E2e_Features>;
  /** An object relationship */
  e2e_scenario_severity?: Maybe<E2e_Scenario_Severity>;
  /** An array relationship */
  e2e_steps: Array<E2e_Steps>;
  /** An aggregate relationship */
  e2e_steps_aggregate: E2e_Steps_Aggregate;
  ended_at?: Maybe<Scalars['timestamptz']>;
  feature_id: Scalars['String'];
  feature_path?: Maybe<Scalars['String']>;
  keyword?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  on_trunk?: Maybe<Scalars['Boolean']>;
  pickle?: Maybe<Scalars['jsonb']>;
  raw_name?: Maybe<Scalars['String']>;
  scenario_id: Scalars['String'];
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  steps?: Maybe<Scalars['jsonb']>;
  tags?: Maybe<Scalars['_text']>;
  test_case?: Maybe<Scalars['jsonb']>;
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "e2e_scenarios" */
export type E2e_ScenariosE2e_StepsArgs = {
  distinct_on?: InputMaybe<Array<E2e_Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Steps_Order_By>>;
  where?: InputMaybe<E2e_Steps_Bool_Exp>;
};


/** columns and relationships of "e2e_scenarios" */
export type E2e_ScenariosE2e_Steps_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Steps_Order_By>>;
  where?: InputMaybe<E2e_Steps_Bool_Exp>;
};


/** columns and relationships of "e2e_scenarios" */
export type E2e_ScenariosPickleArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "e2e_scenarios" */
export type E2e_ScenariosStepsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "e2e_scenarios" */
export type E2e_ScenariosTest_CaseArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "e2e_scenarios" */
export type E2e_Scenarios_Aggregate = {
  aggregate?: Maybe<E2e_Scenarios_Aggregate_Fields>;
  nodes: Array<E2e_Scenarios>;
};

/** aggregate fields of "e2e_scenarios" */
export type E2e_Scenarios_Aggregate_Fields = {
  count: Scalars['Int'];
  max?: Maybe<E2e_Scenarios_Max_Fields>;
  min?: Maybe<E2e_Scenarios_Min_Fields>;
};


/** aggregate fields of "e2e_scenarios" */
export type E2e_Scenarios_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Scenarios_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "e2e_scenarios" */
export type E2e_Scenarios_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<E2e_Scenarios_Max_Order_By>;
  min?: InputMaybe<E2e_Scenarios_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type E2e_Scenarios_Append_Input = {
  pickle?: InputMaybe<Scalars['jsonb']>;
  steps?: InputMaybe<Scalars['jsonb']>;
  test_case?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "e2e_scenarios" */
export type E2e_Scenarios_Arr_Rel_Insert_Input = {
  data: Array<E2e_Scenarios_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<E2e_Scenarios_On_Conflict>;
};

/** Boolean expression to filter rows from the table "e2e_scenarios". All fields are combined with a logical 'AND'. */
export type E2e_Scenarios_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Scenarios_Bool_Exp>>;
  _not?: InputMaybe<E2e_Scenarios_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Scenarios_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  e2e_feature?: InputMaybe<E2e_Features_Bool_Exp>;
  e2e_scenario_severity?: InputMaybe<E2e_Scenario_Severity_Bool_Exp>;
  e2e_steps?: InputMaybe<E2e_Steps_Bool_Exp>;
  ended_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  feature_id?: InputMaybe<String_Comparison_Exp>;
  feature_path?: InputMaybe<String_Comparison_Exp>;
  keyword?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  on_trunk?: InputMaybe<Boolean_Comparison_Exp>;
  pickle?: InputMaybe<Jsonb_Comparison_Exp>;
  raw_name?: InputMaybe<String_Comparison_Exp>;
  scenario_id?: InputMaybe<String_Comparison_Exp>;
  started_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  steps?: InputMaybe<Jsonb_Comparison_Exp>;
  tags?: InputMaybe<_Text_Comparison_Exp>;
  test_case?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "e2e_scenarios" */
export enum E2e_Scenarios_Constraint {
  /** unique or primary key constraint on columns "scenario_id" */
  E2eScenariosPkey = 'e2e_scenarios_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type E2e_Scenarios_Delete_At_Path_Input = {
  pickle?: InputMaybe<Array<Scalars['String']>>;
  steps?: InputMaybe<Array<Scalars['String']>>;
  test_case?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type E2e_Scenarios_Delete_Elem_Input = {
  pickle?: InputMaybe<Scalars['Int']>;
  steps?: InputMaybe<Scalars['Int']>;
  test_case?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type E2e_Scenarios_Delete_Key_Input = {
  pickle?: InputMaybe<Scalars['String']>;
  steps?: InputMaybe<Scalars['String']>;
  test_case?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "e2e_scenarios" */
export type E2e_Scenarios_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  e2e_feature?: InputMaybe<E2e_Features_Obj_Rel_Insert_Input>;
  e2e_scenario_severity?: InputMaybe<E2e_Scenario_Severity_Obj_Rel_Insert_Input>;
  e2e_steps?: InputMaybe<E2e_Steps_Arr_Rel_Insert_Input>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  feature_id?: InputMaybe<Scalars['String']>;
  feature_path?: InputMaybe<Scalars['String']>;
  keyword?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  on_trunk?: InputMaybe<Scalars['Boolean']>;
  pickle?: InputMaybe<Scalars['jsonb']>;
  raw_name?: InputMaybe<Scalars['String']>;
  scenario_id?: InputMaybe<Scalars['String']>;
  started_at?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['String']>;
  steps?: InputMaybe<Scalars['jsonb']>;
  tags?: InputMaybe<Scalars['_text']>;
  test_case?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type E2e_Scenarios_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  feature_id?: Maybe<Scalars['String']>;
  feature_path?: Maybe<Scalars['String']>;
  keyword?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  raw_name?: Maybe<Scalars['String']>;
  scenario_id?: Maybe<Scalars['String']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "e2e_scenarios" */
export type E2e_Scenarios_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  feature_id?: InputMaybe<Order_By>;
  feature_path?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  raw_name?: InputMaybe<Order_By>;
  scenario_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type E2e_Scenarios_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  feature_id?: Maybe<Scalars['String']>;
  feature_path?: Maybe<Scalars['String']>;
  keyword?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  raw_name?: Maybe<Scalars['String']>;
  scenario_id?: Maybe<Scalars['String']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "e2e_scenarios" */
export type E2e_Scenarios_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  feature_id?: InputMaybe<Order_By>;
  feature_path?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  raw_name?: InputMaybe<Order_By>;
  scenario_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "e2e_scenarios" */
export type E2e_Scenarios_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<E2e_Scenarios>;
};

/** input type for inserting object relation for remote table "e2e_scenarios" */
export type E2e_Scenarios_Obj_Rel_Insert_Input = {
  data: E2e_Scenarios_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<E2e_Scenarios_On_Conflict>;
};

/** on_conflict condition type for table "e2e_scenarios" */
export type E2e_Scenarios_On_Conflict = {
  constraint: E2e_Scenarios_Constraint;
  update_columns?: Array<E2e_Scenarios_Update_Column>;
  where?: InputMaybe<E2e_Scenarios_Bool_Exp>;
};

/** Ordering options when selecting data from "e2e_scenarios". */
export type E2e_Scenarios_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  e2e_feature?: InputMaybe<E2e_Features_Order_By>;
  e2e_scenario_severity?: InputMaybe<E2e_Scenario_Severity_Order_By>;
  e2e_steps_aggregate?: InputMaybe<E2e_Steps_Aggregate_Order_By>;
  ended_at?: InputMaybe<Order_By>;
  feature_id?: InputMaybe<Order_By>;
  feature_path?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  on_trunk?: InputMaybe<Order_By>;
  pickle?: InputMaybe<Order_By>;
  raw_name?: InputMaybe<Order_By>;
  scenario_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  steps?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  test_case?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: e2e_scenarios */
export type E2e_Scenarios_Pk_Columns_Input = {
  scenario_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type E2e_Scenarios_Prepend_Input = {
  pickle?: InputMaybe<Scalars['jsonb']>;
  steps?: InputMaybe<Scalars['jsonb']>;
  test_case?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "e2e_scenarios" */
export enum E2e_Scenarios_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Description = 'description',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  FeatureId = 'feature_id',
  /** column name */
  FeaturePath = 'feature_path',
  /** column name */
  Keyword = 'keyword',
  /** column name */
  Name = 'name',
  /** column name */
  OnTrunk = 'on_trunk',
  /** column name */
  Pickle = 'pickle',
  /** column name */
  RawName = 'raw_name',
  /** column name */
  ScenarioId = 'scenario_id',
  /** column name */
  StartedAt = 'started_at',
  /** column name */
  Status = 'status',
  /** column name */
  Steps = 'steps',
  /** column name */
  Tags = 'tags',
  /** column name */
  TestCase = 'test_case',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "e2e_scenarios" */
export type E2e_Scenarios_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  feature_id?: InputMaybe<Scalars['String']>;
  feature_path?: InputMaybe<Scalars['String']>;
  keyword?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  on_trunk?: InputMaybe<Scalars['Boolean']>;
  pickle?: InputMaybe<Scalars['jsonb']>;
  raw_name?: InputMaybe<Scalars['String']>;
  scenario_id?: InputMaybe<Scalars['String']>;
  started_at?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['String']>;
  steps?: InputMaybe<Scalars['jsonb']>;
  tags?: InputMaybe<Scalars['_text']>;
  test_case?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "e2e_scenarios" */
export enum E2e_Scenarios_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Description = 'description',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  FeatureId = 'feature_id',
  /** column name */
  FeaturePath = 'feature_path',
  /** column name */
  Keyword = 'keyword',
  /** column name */
  Name = 'name',
  /** column name */
  OnTrunk = 'on_trunk',
  /** column name */
  Pickle = 'pickle',
  /** column name */
  RawName = 'raw_name',
  /** column name */
  ScenarioId = 'scenario_id',
  /** column name */
  StartedAt = 'started_at',
  /** column name */
  Status = 'status',
  /** column name */
  Steps = 'steps',
  /** column name */
  Tags = 'tags',
  /** column name */
  TestCase = 'test_case',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "e2e_steps" */
export type E2e_Steps = {
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  duration?: Maybe<Scalars['numeric']>;
  /** An object relationship */
  e2e_scenario?: Maybe<E2e_Scenarios>;
  embeddings?: Maybe<Scalars['jsonb']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  index?: Maybe<Scalars['smallint']>;
  is_hook?: Maybe<Scalars['Boolean']>;
  keyword?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  on_trunk?: Maybe<Scalars['Boolean']>;
  scenario_id: Scalars['String'];
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  step_id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
  uri?: Maybe<Scalars['String']>;
  will_be_retried?: Maybe<Scalars['Boolean']>;
};


/** columns and relationships of "e2e_steps" */
export type E2e_StepsEmbeddingsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "e2e_steps" */
export type E2e_Steps_Aggregate = {
  aggregate?: Maybe<E2e_Steps_Aggregate_Fields>;
  nodes: Array<E2e_Steps>;
};

/** aggregate fields of "e2e_steps" */
export type E2e_Steps_Aggregate_Fields = {
  avg?: Maybe<E2e_Steps_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<E2e_Steps_Max_Fields>;
  min?: Maybe<E2e_Steps_Min_Fields>;
  stddev?: Maybe<E2e_Steps_Stddev_Fields>;
  stddev_pop?: Maybe<E2e_Steps_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<E2e_Steps_Stddev_Samp_Fields>;
  sum?: Maybe<E2e_Steps_Sum_Fields>;
  var_pop?: Maybe<E2e_Steps_Var_Pop_Fields>;
  var_samp?: Maybe<E2e_Steps_Var_Samp_Fields>;
  variance?: Maybe<E2e_Steps_Variance_Fields>;
};


/** aggregate fields of "e2e_steps" */
export type E2e_Steps_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<E2e_Steps_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "e2e_steps" */
export type E2e_Steps_Aggregate_Order_By = {
  avg?: InputMaybe<E2e_Steps_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<E2e_Steps_Max_Order_By>;
  min?: InputMaybe<E2e_Steps_Min_Order_By>;
  stddev?: InputMaybe<E2e_Steps_Stddev_Order_By>;
  stddev_pop?: InputMaybe<E2e_Steps_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<E2e_Steps_Stddev_Samp_Order_By>;
  sum?: InputMaybe<E2e_Steps_Sum_Order_By>;
  var_pop?: InputMaybe<E2e_Steps_Var_Pop_Order_By>;
  var_samp?: InputMaybe<E2e_Steps_Var_Samp_Order_By>;
  variance?: InputMaybe<E2e_Steps_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type E2e_Steps_Append_Input = {
  embeddings?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "e2e_steps" */
export type E2e_Steps_Arr_Rel_Insert_Input = {
  data: Array<E2e_Steps_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<E2e_Steps_On_Conflict>;
};

/** aggregate avg on columns */
export type E2e_Steps_Avg_Fields = {
  duration?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "e2e_steps" */
export type E2e_Steps_Avg_Order_By = {
  duration?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "e2e_steps". All fields are combined with a logical 'AND'. */
export type E2e_Steps_Bool_Exp = {
  _and?: InputMaybe<Array<E2e_Steps_Bool_Exp>>;
  _not?: InputMaybe<E2e_Steps_Bool_Exp>;
  _or?: InputMaybe<Array<E2e_Steps_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  duration?: InputMaybe<Numeric_Comparison_Exp>;
  e2e_scenario?: InputMaybe<E2e_Scenarios_Bool_Exp>;
  embeddings?: InputMaybe<Jsonb_Comparison_Exp>;
  ended_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  index?: InputMaybe<Smallint_Comparison_Exp>;
  is_hook?: InputMaybe<Boolean_Comparison_Exp>;
  keyword?: InputMaybe<String_Comparison_Exp>;
  message?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  on_trunk?: InputMaybe<Boolean_Comparison_Exp>;
  scenario_id?: InputMaybe<String_Comparison_Exp>;
  started_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  step_id?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  uri?: InputMaybe<String_Comparison_Exp>;
  will_be_retried?: InputMaybe<Boolean_Comparison_Exp>;
};

/** unique or primary key constraints on table "e2e_steps" */
export enum E2e_Steps_Constraint {
  /** unique or primary key constraint on columns "step_id" */
  E2eStepsPkey = 'e2e_steps_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type E2e_Steps_Delete_At_Path_Input = {
  embeddings?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type E2e_Steps_Delete_Elem_Input = {
  embeddings?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type E2e_Steps_Delete_Key_Input = {
  embeddings?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "e2e_steps" */
export type E2e_Steps_Inc_Input = {
  duration?: InputMaybe<Scalars['numeric']>;
  index?: InputMaybe<Scalars['smallint']>;
};

/** input type for inserting data into table "e2e_steps" */
export type E2e_Steps_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  duration?: InputMaybe<Scalars['numeric']>;
  e2e_scenario?: InputMaybe<E2e_Scenarios_Obj_Rel_Insert_Input>;
  embeddings?: InputMaybe<Scalars['jsonb']>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  index?: InputMaybe<Scalars['smallint']>;
  is_hook?: InputMaybe<Scalars['Boolean']>;
  keyword?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  on_trunk?: InputMaybe<Scalars['Boolean']>;
  scenario_id?: InputMaybe<Scalars['String']>;
  started_at?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['String']>;
  step_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  uri?: InputMaybe<Scalars['String']>;
  will_be_retried?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate max on columns */
export type E2e_Steps_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  duration?: Maybe<Scalars['numeric']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  index?: Maybe<Scalars['smallint']>;
  keyword?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  scenario_id?: Maybe<Scalars['String']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  step_id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uri?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "e2e_steps" */
export type E2e_Steps_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  scenario_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  uri?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type E2e_Steps_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  duration?: Maybe<Scalars['numeric']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  index?: Maybe<Scalars['smallint']>;
  keyword?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  scenario_id?: Maybe<Scalars['String']>;
  started_at?: Maybe<Scalars['timestamptz']>;
  status?: Maybe<Scalars['String']>;
  step_id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  uri?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "e2e_steps" */
export type E2e_Steps_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  scenario_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  uri?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "e2e_steps" */
export type E2e_Steps_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<E2e_Steps>;
};

/** on_conflict condition type for table "e2e_steps" */
export type E2e_Steps_On_Conflict = {
  constraint: E2e_Steps_Constraint;
  update_columns?: Array<E2e_Steps_Update_Column>;
  where?: InputMaybe<E2e_Steps_Bool_Exp>;
};

/** Ordering options when selecting data from "e2e_steps". */
export type E2e_Steps_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  e2e_scenario?: InputMaybe<E2e_Scenarios_Order_By>;
  embeddings?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  is_hook?: InputMaybe<Order_By>;
  keyword?: InputMaybe<Order_By>;
  message?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  on_trunk?: InputMaybe<Order_By>;
  scenario_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  step_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  uri?: InputMaybe<Order_By>;
  will_be_retried?: InputMaybe<Order_By>;
};

/** primary key columns input for table: e2e_steps */
export type E2e_Steps_Pk_Columns_Input = {
  step_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type E2e_Steps_Prepend_Input = {
  embeddings?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "e2e_steps" */
export enum E2e_Steps_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Duration = 'duration',
  /** column name */
  Embeddings = 'embeddings',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  Index = 'index',
  /** column name */
  IsHook = 'is_hook',
  /** column name */
  Keyword = 'keyword',
  /** column name */
  Message = 'message',
  /** column name */
  Name = 'name',
  /** column name */
  OnTrunk = 'on_trunk',
  /** column name */
  ScenarioId = 'scenario_id',
  /** column name */
  StartedAt = 'started_at',
  /** column name */
  Status = 'status',
  /** column name */
  StepId = 'step_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Uri = 'uri',
  /** column name */
  WillBeRetried = 'will_be_retried'
}

/** input type for updating data in table "e2e_steps" */
export type E2e_Steps_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  duration?: InputMaybe<Scalars['numeric']>;
  embeddings?: InputMaybe<Scalars['jsonb']>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  index?: InputMaybe<Scalars['smallint']>;
  is_hook?: InputMaybe<Scalars['Boolean']>;
  keyword?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  on_trunk?: InputMaybe<Scalars['Boolean']>;
  scenario_id?: InputMaybe<Scalars['String']>;
  started_at?: InputMaybe<Scalars['timestamptz']>;
  status?: InputMaybe<Scalars['String']>;
  step_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  uri?: InputMaybe<Scalars['String']>;
  will_be_retried?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate stddev on columns */
export type E2e_Steps_Stddev_Fields = {
  duration?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "e2e_steps" */
export type E2e_Steps_Stddev_Order_By = {
  duration?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type E2e_Steps_Stddev_Pop_Fields = {
  duration?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "e2e_steps" */
export type E2e_Steps_Stddev_Pop_Order_By = {
  duration?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type E2e_Steps_Stddev_Samp_Fields = {
  duration?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "e2e_steps" */
export type E2e_Steps_Stddev_Samp_Order_By = {
  duration?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type E2e_Steps_Sum_Fields = {
  duration?: Maybe<Scalars['numeric']>;
  index?: Maybe<Scalars['smallint']>;
};

/** order by sum() on columns of table "e2e_steps" */
export type E2e_Steps_Sum_Order_By = {
  duration?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
};

/** update columns of table "e2e_steps" */
export enum E2e_Steps_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Duration = 'duration',
  /** column name */
  Embeddings = 'embeddings',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  Index = 'index',
  /** column name */
  IsHook = 'is_hook',
  /** column name */
  Keyword = 'keyword',
  /** column name */
  Message = 'message',
  /** column name */
  Name = 'name',
  /** column name */
  OnTrunk = 'on_trunk',
  /** column name */
  ScenarioId = 'scenario_id',
  /** column name */
  StartedAt = 'started_at',
  /** column name */
  Status = 'status',
  /** column name */
  StepId = 'step_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Uri = 'uri',
  /** column name */
  WillBeRetried = 'will_be_retried'
}

/** aggregate var_pop on columns */
export type E2e_Steps_Var_Pop_Fields = {
  duration?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "e2e_steps" */
export type E2e_Steps_Var_Pop_Order_By = {
  duration?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type E2e_Steps_Var_Samp_Fields = {
  duration?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "e2e_steps" */
export type E2e_Steps_Var_Samp_Order_By = {
  duration?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type E2e_Steps_Variance_Fields = {
  duration?: Maybe<Scalars['Float']>;
  index?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "e2e_steps" */
export type E2e_Steps_Variance_Order_By = {
  duration?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
};

/** columns and relationships of "fourkeys_commit_data" */
export type Fourkeys_Commit_Data = {
  author_email: Scalars['String'];
  commit_hash: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deployed_at: Scalars['timestamptz'];
  feature: Scalars['String'];
  folder: Scalars['String'];
};

/** aggregated selection of "fourkeys_commit_data" */
export type Fourkeys_Commit_Data_Aggregate = {
  aggregate?: Maybe<Fourkeys_Commit_Data_Aggregate_Fields>;
  nodes: Array<Fourkeys_Commit_Data>;
};

/** aggregate fields of "fourkeys_commit_data" */
export type Fourkeys_Commit_Data_Aggregate_Fields = {
  count: Scalars['Int'];
  max?: Maybe<Fourkeys_Commit_Data_Max_Fields>;
  min?: Maybe<Fourkeys_Commit_Data_Min_Fields>;
};


/** aggregate fields of "fourkeys_commit_data" */
export type Fourkeys_Commit_Data_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fourkeys_Commit_Data_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "fourkeys_commit_data". All fields are combined with a logical 'AND'. */
export type Fourkeys_Commit_Data_Bool_Exp = {
  _and?: InputMaybe<Array<Fourkeys_Commit_Data_Bool_Exp>>;
  _not?: InputMaybe<Fourkeys_Commit_Data_Bool_Exp>;
  _or?: InputMaybe<Array<Fourkeys_Commit_Data_Bool_Exp>>;
  author_email?: InputMaybe<String_Comparison_Exp>;
  commit_hash?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deployed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  feature?: InputMaybe<String_Comparison_Exp>;
  folder?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "fourkeys_commit_data" */
export enum Fourkeys_Commit_Data_Constraint {
  /** unique or primary key constraint on columns "feature", "folder", "commit_hash" */
  FourkeysCommitFeatureFolder = 'fourkeys_commit_feature_folder'
}

/** input type for inserting data into table "fourkeys_commit_data" */
export type Fourkeys_Commit_Data_Insert_Input = {
  author_email?: InputMaybe<Scalars['String']>;
  commit_hash?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deployed_at?: InputMaybe<Scalars['timestamptz']>;
  feature?: InputMaybe<Scalars['String']>;
  folder?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Fourkeys_Commit_Data_Max_Fields = {
  author_email?: Maybe<Scalars['String']>;
  commit_hash?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deployed_at?: Maybe<Scalars['timestamptz']>;
  feature?: Maybe<Scalars['String']>;
  folder?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Fourkeys_Commit_Data_Min_Fields = {
  author_email?: Maybe<Scalars['String']>;
  commit_hash?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deployed_at?: Maybe<Scalars['timestamptz']>;
  feature?: Maybe<Scalars['String']>;
  folder?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "fourkeys_commit_data" */
export type Fourkeys_Commit_Data_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Fourkeys_Commit_Data>;
};

/** on_conflict condition type for table "fourkeys_commit_data" */
export type Fourkeys_Commit_Data_On_Conflict = {
  constraint: Fourkeys_Commit_Data_Constraint;
  update_columns?: Array<Fourkeys_Commit_Data_Update_Column>;
  where?: InputMaybe<Fourkeys_Commit_Data_Bool_Exp>;
};

/** Ordering options when selecting data from "fourkeys_commit_data". */
export type Fourkeys_Commit_Data_Order_By = {
  author_email?: InputMaybe<Order_By>;
  commit_hash?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deployed_at?: InputMaybe<Order_By>;
  feature?: InputMaybe<Order_By>;
  folder?: InputMaybe<Order_By>;
};

/** primary key columns input for table: fourkeys_commit_data */
export type Fourkeys_Commit_Data_Pk_Columns_Input = {
  commit_hash: Scalars['String'];
  feature: Scalars['String'];
  folder: Scalars['String'];
};

/** select columns of table "fourkeys_commit_data" */
export enum Fourkeys_Commit_Data_Select_Column {
  /** column name */
  AuthorEmail = 'author_email',
  /** column name */
  CommitHash = 'commit_hash',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeployedAt = 'deployed_at',
  /** column name */
  Feature = 'feature',
  /** column name */
  Folder = 'folder'
}

/** input type for updating data in table "fourkeys_commit_data" */
export type Fourkeys_Commit_Data_Set_Input = {
  author_email?: InputMaybe<Scalars['String']>;
  commit_hash?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deployed_at?: InputMaybe<Scalars['timestamptz']>;
  feature?: InputMaybe<Scalars['String']>;
  folder?: InputMaybe<Scalars['String']>;
};

/** update columns of table "fourkeys_commit_data" */
export enum Fourkeys_Commit_Data_Update_Column {
  /** column name */
  AuthorEmail = 'author_email',
  /** column name */
  CommitHash = 'commit_hash',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeployedAt = 'deployed_at',
  /** column name */
  Feature = 'feature',
  /** column name */
  Folder = 'folder'
}

/** columns and relationships of "fourkeys_feature_data" */
export type Fourkeys_Feature_Data = {
  feature: Scalars['String'];
  folder: Scalars['String'];
  last_deployed_commit_hash: Scalars['String'];
};

/** aggregated selection of "fourkeys_feature_data" */
export type Fourkeys_Feature_Data_Aggregate = {
  aggregate?: Maybe<Fourkeys_Feature_Data_Aggregate_Fields>;
  nodes: Array<Fourkeys_Feature_Data>;
};

/** aggregate fields of "fourkeys_feature_data" */
export type Fourkeys_Feature_Data_Aggregate_Fields = {
  count: Scalars['Int'];
  max?: Maybe<Fourkeys_Feature_Data_Max_Fields>;
  min?: Maybe<Fourkeys_Feature_Data_Min_Fields>;
};


/** aggregate fields of "fourkeys_feature_data" */
export type Fourkeys_Feature_Data_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Fourkeys_Feature_Data_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "fourkeys_feature_data". All fields are combined with a logical 'AND'. */
export type Fourkeys_Feature_Data_Bool_Exp = {
  _and?: InputMaybe<Array<Fourkeys_Feature_Data_Bool_Exp>>;
  _not?: InputMaybe<Fourkeys_Feature_Data_Bool_Exp>;
  _or?: InputMaybe<Array<Fourkeys_Feature_Data_Bool_Exp>>;
  feature?: InputMaybe<String_Comparison_Exp>;
  folder?: InputMaybe<String_Comparison_Exp>;
  last_deployed_commit_hash?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "fourkeys_feature_data" */
export enum Fourkeys_Feature_Data_Constraint {
  /** unique or primary key constraint on columns "feature", "folder" */
  FourkeysFeatureFolder = 'fourkeys_feature_folder'
}

/** input type for inserting data into table "fourkeys_feature_data" */
export type Fourkeys_Feature_Data_Insert_Input = {
  feature?: InputMaybe<Scalars['String']>;
  folder?: InputMaybe<Scalars['String']>;
  last_deployed_commit_hash?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Fourkeys_Feature_Data_Max_Fields = {
  feature?: Maybe<Scalars['String']>;
  folder?: Maybe<Scalars['String']>;
  last_deployed_commit_hash?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Fourkeys_Feature_Data_Min_Fields = {
  feature?: Maybe<Scalars['String']>;
  folder?: Maybe<Scalars['String']>;
  last_deployed_commit_hash?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "fourkeys_feature_data" */
export type Fourkeys_Feature_Data_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Fourkeys_Feature_Data>;
};

/** on_conflict condition type for table "fourkeys_feature_data" */
export type Fourkeys_Feature_Data_On_Conflict = {
  constraint: Fourkeys_Feature_Data_Constraint;
  update_columns?: Array<Fourkeys_Feature_Data_Update_Column>;
  where?: InputMaybe<Fourkeys_Feature_Data_Bool_Exp>;
};

/** Ordering options when selecting data from "fourkeys_feature_data". */
export type Fourkeys_Feature_Data_Order_By = {
  feature?: InputMaybe<Order_By>;
  folder?: InputMaybe<Order_By>;
  last_deployed_commit_hash?: InputMaybe<Order_By>;
};

/** select columns of table "fourkeys_feature_data" */
export enum Fourkeys_Feature_Data_Select_Column {
  /** column name */
  Feature = 'feature',
  /** column name */
  Folder = 'folder',
  /** column name */
  LastDeployedCommitHash = 'last_deployed_commit_hash'
}

/** input type for updating data in table "fourkeys_feature_data" */
export type Fourkeys_Feature_Data_Set_Input = {
  feature?: InputMaybe<Scalars['String']>;
  folder?: InputMaybe<Scalars['String']>;
  last_deployed_commit_hash?: InputMaybe<Scalars['String']>;
};

/** update columns of table "fourkeys_feature_data" */
export enum Fourkeys_Feature_Data_Update_Column {
  /** column name */
  Feature = 'feature',
  /** column name */
  Folder = 'folder',
  /** column name */
  LastDeployedCommitHash = 'last_deployed_commit_hash'
}

export type Get_E2e_Feature_Status_Count_In_Last_N_Days_Args = {
  _nday?: InputMaybe<Scalars['Int']>;
  _on_trunk?: InputMaybe<Scalars['Boolean']>;
  _tags?: InputMaybe<Scalars['String']>;
};

export type Get_Instance_Filter_By_Tags_Args = {
  _feature_tag?: InputMaybe<Scalars['_text']>;
  _run_id?: InputMaybe<Scalars['String']>;
  _squad_tags?: InputMaybe<Scalars['_text']>;
};

export type Get_Instances_With_Filters_Args = {
  _date_from?: InputMaybe<Scalars['timestamptz']>;
  _date_till?: InputMaybe<Scalars['timestamptz']>;
  _environment?: InputMaybe<Scalars['String']>;
  _feature_tag?: InputMaybe<Scalars['_text']>;
  _on_trunk?: InputMaybe<Scalars['Boolean']>;
  _squad_tags?: InputMaybe<Scalars['_text']>;
  _status?: InputMaybe<Scalars['String']>;
};

export type Json_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _cast?: InputMaybe<Json_Cast_Exp>;
  _eq?: InputMaybe<Scalars['json']>;
  _gt?: InputMaybe<Scalars['json']>;
  _gte?: InputMaybe<Scalars['json']>;
  _in?: InputMaybe<Array<Scalars['json']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['json']>;
  _lte?: InputMaybe<Scalars['json']>;
  _neq?: InputMaybe<Scalars['json']>;
  _nin?: InputMaybe<Array<Scalars['json']>>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** columns and relationships of "mfe_import_map_versions" */
export type Mfe_Import_Map_Versions = {
  deployed_at?: Maybe<Scalars['timestamptz']>;
  environment: Scalars['String'];
  id: Scalars['Int'];
  import_map: Scalars['json'];
  organization: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};


/** columns and relationships of "mfe_import_map_versions" */
export type Mfe_Import_Map_VersionsImport_MapArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "mfe_import_map_versions" */
export type Mfe_Import_Map_Versions_Aggregate = {
  aggregate?: Maybe<Mfe_Import_Map_Versions_Aggregate_Fields>;
  nodes: Array<Mfe_Import_Map_Versions>;
};

/** aggregate fields of "mfe_import_map_versions" */
export type Mfe_Import_Map_Versions_Aggregate_Fields = {
  avg?: Maybe<Mfe_Import_Map_Versions_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Mfe_Import_Map_Versions_Max_Fields>;
  min?: Maybe<Mfe_Import_Map_Versions_Min_Fields>;
  stddev?: Maybe<Mfe_Import_Map_Versions_Stddev_Fields>;
  stddev_pop?: Maybe<Mfe_Import_Map_Versions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Mfe_Import_Map_Versions_Stddev_Samp_Fields>;
  sum?: Maybe<Mfe_Import_Map_Versions_Sum_Fields>;
  var_pop?: Maybe<Mfe_Import_Map_Versions_Var_Pop_Fields>;
  var_samp?: Maybe<Mfe_Import_Map_Versions_Var_Samp_Fields>;
  variance?: Maybe<Mfe_Import_Map_Versions_Variance_Fields>;
};


/** aggregate fields of "mfe_import_map_versions" */
export type Mfe_Import_Map_Versions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Mfe_Import_Map_Versions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Mfe_Import_Map_Versions_Avg_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "mfe_import_map_versions". All fields are combined with a logical 'AND'. */
export type Mfe_Import_Map_Versions_Bool_Exp = {
  _and?: InputMaybe<Array<Mfe_Import_Map_Versions_Bool_Exp>>;
  _not?: InputMaybe<Mfe_Import_Map_Versions_Bool_Exp>;
  _or?: InputMaybe<Array<Mfe_Import_Map_Versions_Bool_Exp>>;
  deployed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  environment?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  import_map?: InputMaybe<Json_Comparison_Exp>;
  organization?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "mfe_import_map_versions" */
export enum Mfe_Import_Map_Versions_Constraint {
  /** unique or primary key constraint on columns "id" */
  MfeImportMapVersionsPkey = 'mfe_import_map_versions_pkey'
}

/** input type for incrementing numeric columns in table "mfe_import_map_versions" */
export type Mfe_Import_Map_Versions_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "mfe_import_map_versions" */
export type Mfe_Import_Map_Versions_Insert_Input = {
  deployed_at?: InputMaybe<Scalars['timestamptz']>;
  environment?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  import_map?: InputMaybe<Scalars['json']>;
  organization?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Mfe_Import_Map_Versions_Max_Fields = {
  deployed_at?: Maybe<Scalars['timestamptz']>;
  environment?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  organization?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Mfe_Import_Map_Versions_Min_Fields = {
  deployed_at?: Maybe<Scalars['timestamptz']>;
  environment?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  organization?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "mfe_import_map_versions" */
export type Mfe_Import_Map_Versions_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Mfe_Import_Map_Versions>;
};

/** on_conflict condition type for table "mfe_import_map_versions" */
export type Mfe_Import_Map_Versions_On_Conflict = {
  constraint: Mfe_Import_Map_Versions_Constraint;
  update_columns?: Array<Mfe_Import_Map_Versions_Update_Column>;
  where?: InputMaybe<Mfe_Import_Map_Versions_Bool_Exp>;
};

/** Ordering options when selecting data from "mfe_import_map_versions". */
export type Mfe_Import_Map_Versions_Order_By = {
  deployed_at?: InputMaybe<Order_By>;
  environment?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  import_map?: InputMaybe<Order_By>;
  organization?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** primary key columns input for table: mfe_import_map_versions */
export type Mfe_Import_Map_Versions_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "mfe_import_map_versions" */
export enum Mfe_Import_Map_Versions_Select_Column {
  /** column name */
  DeployedAt = 'deployed_at',
  /** column name */
  Environment = 'environment',
  /** column name */
  Id = 'id',
  /** column name */
  ImportMap = 'import_map',
  /** column name */
  Organization = 'organization',
  /** column name */
  Type = 'type'
}

/** input type for updating data in table "mfe_import_map_versions" */
export type Mfe_Import_Map_Versions_Set_Input = {
  deployed_at?: InputMaybe<Scalars['timestamptz']>;
  environment?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  import_map?: InputMaybe<Scalars['json']>;
  organization?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Mfe_Import_Map_Versions_Stddev_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Mfe_Import_Map_Versions_Stddev_Pop_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Mfe_Import_Map_Versions_Stddev_Samp_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Mfe_Import_Map_Versions_Sum_Fields = {
  id?: Maybe<Scalars['Int']>;
};

/** update columns of table "mfe_import_map_versions" */
export enum Mfe_Import_Map_Versions_Update_Column {
  /** column name */
  DeployedAt = 'deployed_at',
  /** column name */
  Environment = 'environment',
  /** column name */
  Id = 'id',
  /** column name */
  ImportMap = 'import_map',
  /** column name */
  Organization = 'organization',
  /** column name */
  Type = 'type'
}

/** aggregate var_pop on columns */
export type Mfe_Import_Map_Versions_Var_Pop_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Mfe_Import_Map_Versions_Var_Samp_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Mfe_Import_Map_Versions_Variance_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** columns and relationships of "mfe_services_versions" */
export type Mfe_Services_Versions = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deployed_at?: Maybe<Scalars['timestamptz']>;
  environment: Scalars['String'];
  id: Scalars['Int'];
  link?: Maybe<Scalars['String']>;
  organization: Scalars['String'];
  rollback_at?: Maybe<Scalars['timestamptz']>;
  service_name: Scalars['String'];
  squad_name: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  version: Scalars['String'];
};

/** aggregated selection of "mfe_services_versions" */
export type Mfe_Services_Versions_Aggregate = {
  aggregate?: Maybe<Mfe_Services_Versions_Aggregate_Fields>;
  nodes: Array<Mfe_Services_Versions>;
};

/** aggregate fields of "mfe_services_versions" */
export type Mfe_Services_Versions_Aggregate_Fields = {
  avg?: Maybe<Mfe_Services_Versions_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Mfe_Services_Versions_Max_Fields>;
  min?: Maybe<Mfe_Services_Versions_Min_Fields>;
  stddev?: Maybe<Mfe_Services_Versions_Stddev_Fields>;
  stddev_pop?: Maybe<Mfe_Services_Versions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Mfe_Services_Versions_Stddev_Samp_Fields>;
  sum?: Maybe<Mfe_Services_Versions_Sum_Fields>;
  var_pop?: Maybe<Mfe_Services_Versions_Var_Pop_Fields>;
  var_samp?: Maybe<Mfe_Services_Versions_Var_Samp_Fields>;
  variance?: Maybe<Mfe_Services_Versions_Variance_Fields>;
};


/** aggregate fields of "mfe_services_versions" */
export type Mfe_Services_Versions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Mfe_Services_Versions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Mfe_Services_Versions_Avg_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "mfe_services_versions". All fields are combined with a logical 'AND'. */
export type Mfe_Services_Versions_Bool_Exp = {
  _and?: InputMaybe<Array<Mfe_Services_Versions_Bool_Exp>>;
  _not?: InputMaybe<Mfe_Services_Versions_Bool_Exp>;
  _or?: InputMaybe<Array<Mfe_Services_Versions_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deployed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  environment?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  link?: InputMaybe<String_Comparison_Exp>;
  organization?: InputMaybe<String_Comparison_Exp>;
  rollback_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  service_name?: InputMaybe<String_Comparison_Exp>;
  squad_name?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  version?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "mfe_services_versions" */
export enum Mfe_Services_Versions_Constraint {
  /** unique or primary key constraint on columns "id" */
  MfeServicesVersionsPkey = 'mfe_services_versions_pkey'
}

/** input type for incrementing numeric columns in table "mfe_services_versions" */
export type Mfe_Services_Versions_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "mfe_services_versions" */
export type Mfe_Services_Versions_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deployed_at?: InputMaybe<Scalars['timestamptz']>;
  environment?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  link?: InputMaybe<Scalars['String']>;
  organization?: InputMaybe<Scalars['String']>;
  rollback_at?: InputMaybe<Scalars['timestamptz']>;
  service_name?: InputMaybe<Scalars['String']>;
  squad_name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Mfe_Services_Versions_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deployed_at?: Maybe<Scalars['timestamptz']>;
  environment?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  organization?: Maybe<Scalars['String']>;
  rollback_at?: Maybe<Scalars['timestamptz']>;
  service_name?: Maybe<Scalars['String']>;
  squad_name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Mfe_Services_Versions_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deployed_at?: Maybe<Scalars['timestamptz']>;
  environment?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  organization?: Maybe<Scalars['String']>;
  rollback_at?: Maybe<Scalars['timestamptz']>;
  service_name?: Maybe<Scalars['String']>;
  squad_name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "mfe_services_versions" */
export type Mfe_Services_Versions_Mutation_Response = {
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Mfe_Services_Versions>;
};

/** on_conflict condition type for table "mfe_services_versions" */
export type Mfe_Services_Versions_On_Conflict = {
  constraint: Mfe_Services_Versions_Constraint;
  update_columns?: Array<Mfe_Services_Versions_Update_Column>;
  where?: InputMaybe<Mfe_Services_Versions_Bool_Exp>;
};

/** Ordering options when selecting data from "mfe_services_versions". */
export type Mfe_Services_Versions_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deployed_at?: InputMaybe<Order_By>;
  environment?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  link?: InputMaybe<Order_By>;
  organization?: InputMaybe<Order_By>;
  rollback_at?: InputMaybe<Order_By>;
  service_name?: InputMaybe<Order_By>;
  squad_name?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  version?: InputMaybe<Order_By>;
};

/** primary key columns input for table: mfe_services_versions */
export type Mfe_Services_Versions_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "mfe_services_versions" */
export enum Mfe_Services_Versions_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeployedAt = 'deployed_at',
  /** column name */
  Environment = 'environment',
  /** column name */
  Id = 'id',
  /** column name */
  Link = 'link',
  /** column name */
  Organization = 'organization',
  /** column name */
  RollbackAt = 'rollback_at',
  /** column name */
  ServiceName = 'service_name',
  /** column name */
  SquadName = 'squad_name',
  /** column name */
  Type = 'type',
  /** column name */
  Version = 'version'
}

/** input type for updating data in table "mfe_services_versions" */
export type Mfe_Services_Versions_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deployed_at?: InputMaybe<Scalars['timestamptz']>;
  environment?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  link?: InputMaybe<Scalars['String']>;
  organization?: InputMaybe<Scalars['String']>;
  rollback_at?: InputMaybe<Scalars['timestamptz']>;
  service_name?: InputMaybe<Scalars['String']>;
  squad_name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Mfe_Services_Versions_Stddev_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Mfe_Services_Versions_Stddev_Pop_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Mfe_Services_Versions_Stddev_Samp_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Mfe_Services_Versions_Sum_Fields = {
  id?: Maybe<Scalars['Int']>;
};

/** update columns of table "mfe_services_versions" */
export enum Mfe_Services_Versions_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeployedAt = 'deployed_at',
  /** column name */
  Environment = 'environment',
  /** column name */
  Id = 'id',
  /** column name */
  Link = 'link',
  /** column name */
  Organization = 'organization',
  /** column name */
  RollbackAt = 'rollback_at',
  /** column name */
  ServiceName = 'service_name',
  /** column name */
  SquadName = 'squad_name',
  /** column name */
  Type = 'type',
  /** column name */
  Version = 'version'
}

/** aggregate var_pop on columns */
export type Mfe_Services_Versions_Var_Pop_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Mfe_Services_Versions_Var_Samp_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Mfe_Services_Versions_Variance_Fields = {
  id?: Maybe<Scalars['Float']>;
};

/** mutation root */
export type Mutation_Root = {
  /** delete data from the table: "e2e_features" */
  delete_e2e_features?: Maybe<E2e_Features_Mutation_Response>;
  /** delete single row from the table: "e2e_features" */
  delete_e2e_features_by_pk?: Maybe<E2e_Features>;
  /** delete data from the table: "e2e_features_status" */
  delete_e2e_features_status?: Maybe<E2e_Features_Status_Mutation_Response>;
  /** delete data from the table: "e2e_instances" */
  delete_e2e_instances?: Maybe<E2e_Instances_Mutation_Response>;
  /** delete single row from the table: "e2e_instances" */
  delete_e2e_instances_by_pk?: Maybe<E2e_Instances>;
  /** delete data from the table: "e2e_instances_group_by_date" */
  delete_e2e_instances_group_by_date?: Maybe<E2e_Instances_Group_By_Date_Mutation_Response>;
  /** delete data from the table: "e2e_instances_status_count" */
  delete_e2e_instances_status_count?: Maybe<E2e_Instances_Status_Count_Mutation_Response>;
  /** delete data from the table: "e2e_scenario_severity" */
  delete_e2e_scenario_severity?: Maybe<E2e_Scenario_Severity_Mutation_Response>;
  /** delete single row from the table: "e2e_scenario_severity" */
  delete_e2e_scenario_severity_by_pk?: Maybe<E2e_Scenario_Severity>;
  /** delete data from the table: "e2e_scenarios" */
  delete_e2e_scenarios?: Maybe<E2e_Scenarios_Mutation_Response>;
  /** delete single row from the table: "e2e_scenarios" */
  delete_e2e_scenarios_by_pk?: Maybe<E2e_Scenarios>;
  /** delete data from the table: "e2e_steps" */
  delete_e2e_steps?: Maybe<E2e_Steps_Mutation_Response>;
  /** delete single row from the table: "e2e_steps" */
  delete_e2e_steps_by_pk?: Maybe<E2e_Steps>;
  /** delete data from the table: "fourkeys_commit_data" */
  delete_fourkeys_commit_data?: Maybe<Fourkeys_Commit_Data_Mutation_Response>;
  /** delete single row from the table: "fourkeys_commit_data" */
  delete_fourkeys_commit_data_by_pk?: Maybe<Fourkeys_Commit_Data>;
  /** delete data from the table: "fourkeys_feature_data" */
  delete_fourkeys_feature_data?: Maybe<Fourkeys_Feature_Data_Mutation_Response>;
  /** delete data from the table: "mfe_import_map_versions" */
  delete_mfe_import_map_versions?: Maybe<Mfe_Import_Map_Versions_Mutation_Response>;
  /** delete single row from the table: "mfe_import_map_versions" */
  delete_mfe_import_map_versions_by_pk?: Maybe<Mfe_Import_Map_Versions>;
  /** delete data from the table: "mfe_services_versions" */
  delete_mfe_services_versions?: Maybe<Mfe_Services_Versions_Mutation_Response>;
  /** delete single row from the table: "mfe_services_versions" */
  delete_mfe_services_versions_by_pk?: Maybe<Mfe_Services_Versions>;
  /** insert data into the table: "e2e_features" */
  insert_e2e_features?: Maybe<E2e_Features_Mutation_Response>;
  /** insert a single row into the table: "e2e_features" */
  insert_e2e_features_one?: Maybe<E2e_Features>;
  /** insert data into the table: "e2e_features_status" */
  insert_e2e_features_status?: Maybe<E2e_Features_Status_Mutation_Response>;
  /** insert a single row into the table: "e2e_features_status" */
  insert_e2e_features_status_one?: Maybe<E2e_Features_Status>;
  /** insert data into the table: "e2e_instances" */
  insert_e2e_instances?: Maybe<E2e_Instances_Mutation_Response>;
  /** insert data into the table: "e2e_instances_group_by_date" */
  insert_e2e_instances_group_by_date?: Maybe<E2e_Instances_Group_By_Date_Mutation_Response>;
  /** insert a single row into the table: "e2e_instances_group_by_date" */
  insert_e2e_instances_group_by_date_one?: Maybe<E2e_Instances_Group_By_Date>;
  /** insert a single row into the table: "e2e_instances" */
  insert_e2e_instances_one?: Maybe<E2e_Instances>;
  /** insert data into the table: "e2e_instances_status_count" */
  insert_e2e_instances_status_count?: Maybe<E2e_Instances_Status_Count_Mutation_Response>;
  /** insert a single row into the table: "e2e_instances_status_count" */
  insert_e2e_instances_status_count_one?: Maybe<E2e_Instances_Status_Count>;
  /** insert data into the table: "e2e_scenario_severity" */
  insert_e2e_scenario_severity?: Maybe<E2e_Scenario_Severity_Mutation_Response>;
  /** insert a single row into the table: "e2e_scenario_severity" */
  insert_e2e_scenario_severity_one?: Maybe<E2e_Scenario_Severity>;
  /** insert data into the table: "e2e_scenarios" */
  insert_e2e_scenarios?: Maybe<E2e_Scenarios_Mutation_Response>;
  /** insert a single row into the table: "e2e_scenarios" */
  insert_e2e_scenarios_one?: Maybe<E2e_Scenarios>;
  /** insert data into the table: "e2e_steps" */
  insert_e2e_steps?: Maybe<E2e_Steps_Mutation_Response>;
  /** insert a single row into the table: "e2e_steps" */
  insert_e2e_steps_one?: Maybe<E2e_Steps>;
  /** insert data into the table: "fourkeys_commit_data" */
  insert_fourkeys_commit_data?: Maybe<Fourkeys_Commit_Data_Mutation_Response>;
  /** insert a single row into the table: "fourkeys_commit_data" */
  insert_fourkeys_commit_data_one?: Maybe<Fourkeys_Commit_Data>;
  /** insert data into the table: "fourkeys_feature_data" */
  insert_fourkeys_feature_data?: Maybe<Fourkeys_Feature_Data_Mutation_Response>;
  /** insert a single row into the table: "fourkeys_feature_data" */
  insert_fourkeys_feature_data_one?: Maybe<Fourkeys_Feature_Data>;
  /** insert data into the table: "mfe_import_map_versions" */
  insert_mfe_import_map_versions?: Maybe<Mfe_Import_Map_Versions_Mutation_Response>;
  /** insert a single row into the table: "mfe_import_map_versions" */
  insert_mfe_import_map_versions_one?: Maybe<Mfe_Import_Map_Versions>;
  /** insert data into the table: "mfe_services_versions" */
  insert_mfe_services_versions?: Maybe<Mfe_Services_Versions_Mutation_Response>;
  /** insert a single row into the table: "mfe_services_versions" */
  insert_mfe_services_versions_one?: Maybe<Mfe_Services_Versions>;
  /** update data of the table: "e2e_features" */
  update_e2e_features?: Maybe<E2e_Features_Mutation_Response>;
  /** update single row of the table: "e2e_features" */
  update_e2e_features_by_pk?: Maybe<E2e_Features>;
  /** update data of the table: "e2e_features_status" */
  update_e2e_features_status?: Maybe<E2e_Features_Status_Mutation_Response>;
  /** update data of the table: "e2e_instances" */
  update_e2e_instances?: Maybe<E2e_Instances_Mutation_Response>;
  /** update single row of the table: "e2e_instances" */
  update_e2e_instances_by_pk?: Maybe<E2e_Instances>;
  /** update data of the table: "e2e_instances_group_by_date" */
  update_e2e_instances_group_by_date?: Maybe<E2e_Instances_Group_By_Date_Mutation_Response>;
  /** update data of the table: "e2e_instances_status_count" */
  update_e2e_instances_status_count?: Maybe<E2e_Instances_Status_Count_Mutation_Response>;
  /** update data of the table: "e2e_scenario_severity" */
  update_e2e_scenario_severity?: Maybe<E2e_Scenario_Severity_Mutation_Response>;
  /** update single row of the table: "e2e_scenario_severity" */
  update_e2e_scenario_severity_by_pk?: Maybe<E2e_Scenario_Severity>;
  /** update data of the table: "e2e_scenarios" */
  update_e2e_scenarios?: Maybe<E2e_Scenarios_Mutation_Response>;
  /** update single row of the table: "e2e_scenarios" */
  update_e2e_scenarios_by_pk?: Maybe<E2e_Scenarios>;
  /** update data of the table: "e2e_steps" */
  update_e2e_steps?: Maybe<E2e_Steps_Mutation_Response>;
  /** update single row of the table: "e2e_steps" */
  update_e2e_steps_by_pk?: Maybe<E2e_Steps>;
  /** update data of the table: "fourkeys_commit_data" */
  update_fourkeys_commit_data?: Maybe<Fourkeys_Commit_Data_Mutation_Response>;
  /** update single row of the table: "fourkeys_commit_data" */
  update_fourkeys_commit_data_by_pk?: Maybe<Fourkeys_Commit_Data>;
  /** update data of the table: "fourkeys_feature_data" */
  update_fourkeys_feature_data?: Maybe<Fourkeys_Feature_Data_Mutation_Response>;
  /** update data of the table: "mfe_import_map_versions" */
  update_mfe_import_map_versions?: Maybe<Mfe_Import_Map_Versions_Mutation_Response>;
  /** update single row of the table: "mfe_import_map_versions" */
  update_mfe_import_map_versions_by_pk?: Maybe<Mfe_Import_Map_Versions>;
  /** update data of the table: "mfe_services_versions" */
  update_mfe_services_versions?: Maybe<Mfe_Services_Versions_Mutation_Response>;
  /** update single row of the table: "mfe_services_versions" */
  update_mfe_services_versions_by_pk?: Maybe<Mfe_Services_Versions>;
};


/** mutation root */
export type Mutation_RootDelete_E2e_FeaturesArgs = {
  where: E2e_Features_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_E2e_Features_By_PkArgs = {
  feature_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_E2e_Features_StatusArgs = {
  where: E2e_Features_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_E2e_InstancesArgs = {
  where: E2e_Instances_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_E2e_Instances_By_PkArgs = {
  instance_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_E2e_Instances_Group_By_DateArgs = {
  where: E2e_Instances_Group_By_Date_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_E2e_Instances_Status_CountArgs = {
  where: E2e_Instances_Status_Count_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_E2e_Scenario_SeverityArgs = {
  where: E2e_Scenario_Severity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_E2e_Scenario_Severity_By_PkArgs = {
  feature_path: Scalars['String'];
  scenario_name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_E2e_ScenariosArgs = {
  where: E2e_Scenarios_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_E2e_Scenarios_By_PkArgs = {
  scenario_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_E2e_StepsArgs = {
  where: E2e_Steps_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_E2e_Steps_By_PkArgs = {
  step_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Fourkeys_Commit_DataArgs = {
  where: Fourkeys_Commit_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Fourkeys_Commit_Data_By_PkArgs = {
  commit_hash: Scalars['String'];
  feature: Scalars['String'];
  folder: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Fourkeys_Feature_DataArgs = {
  where: Fourkeys_Feature_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Mfe_Import_Map_VersionsArgs = {
  where: Mfe_Import_Map_Versions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Mfe_Import_Map_Versions_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Mfe_Services_VersionsArgs = {
  where: Mfe_Services_Versions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Mfe_Services_Versions_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootInsert_E2e_FeaturesArgs = {
  objects: Array<E2e_Features_Insert_Input>;
  on_conflict?: InputMaybe<E2e_Features_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Features_OneArgs = {
  object: E2e_Features_Insert_Input;
  on_conflict?: InputMaybe<E2e_Features_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Features_StatusArgs = {
  objects: Array<E2e_Features_Status_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Features_Status_OneArgs = {
  object: E2e_Features_Status_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_E2e_InstancesArgs = {
  objects: Array<E2e_Instances_Insert_Input>;
  on_conflict?: InputMaybe<E2e_Instances_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Instances_Group_By_DateArgs = {
  objects: Array<E2e_Instances_Group_By_Date_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Instances_Group_By_Date_OneArgs = {
  object: E2e_Instances_Group_By_Date_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Instances_OneArgs = {
  object: E2e_Instances_Insert_Input;
  on_conflict?: InputMaybe<E2e_Instances_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Instances_Status_CountArgs = {
  objects: Array<E2e_Instances_Status_Count_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Instances_Status_Count_OneArgs = {
  object: E2e_Instances_Status_Count_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Scenario_SeverityArgs = {
  objects: Array<E2e_Scenario_Severity_Insert_Input>;
  on_conflict?: InputMaybe<E2e_Scenario_Severity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Scenario_Severity_OneArgs = {
  object: E2e_Scenario_Severity_Insert_Input;
  on_conflict?: InputMaybe<E2e_Scenario_Severity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_ScenariosArgs = {
  objects: Array<E2e_Scenarios_Insert_Input>;
  on_conflict?: InputMaybe<E2e_Scenarios_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Scenarios_OneArgs = {
  object: E2e_Scenarios_Insert_Input;
  on_conflict?: InputMaybe<E2e_Scenarios_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_StepsArgs = {
  objects: Array<E2e_Steps_Insert_Input>;
  on_conflict?: InputMaybe<E2e_Steps_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_E2e_Steps_OneArgs = {
  object: E2e_Steps_Insert_Input;
  on_conflict?: InputMaybe<E2e_Steps_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fourkeys_Commit_DataArgs = {
  objects: Array<Fourkeys_Commit_Data_Insert_Input>;
  on_conflict?: InputMaybe<Fourkeys_Commit_Data_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fourkeys_Commit_Data_OneArgs = {
  object: Fourkeys_Commit_Data_Insert_Input;
  on_conflict?: InputMaybe<Fourkeys_Commit_Data_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fourkeys_Feature_DataArgs = {
  objects: Array<Fourkeys_Feature_Data_Insert_Input>;
  on_conflict?: InputMaybe<Fourkeys_Feature_Data_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Fourkeys_Feature_Data_OneArgs = {
  object: Fourkeys_Feature_Data_Insert_Input;
  on_conflict?: InputMaybe<Fourkeys_Feature_Data_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Mfe_Import_Map_VersionsArgs = {
  objects: Array<Mfe_Import_Map_Versions_Insert_Input>;
  on_conflict?: InputMaybe<Mfe_Import_Map_Versions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Mfe_Import_Map_Versions_OneArgs = {
  object: Mfe_Import_Map_Versions_Insert_Input;
  on_conflict?: InputMaybe<Mfe_Import_Map_Versions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Mfe_Services_VersionsArgs = {
  objects: Array<Mfe_Services_Versions_Insert_Input>;
  on_conflict?: InputMaybe<Mfe_Services_Versions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Mfe_Services_Versions_OneArgs = {
  object: Mfe_Services_Versions_Insert_Input;
  on_conflict?: InputMaybe<Mfe_Services_Versions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_FeaturesArgs = {
  _append?: InputMaybe<E2e_Features_Append_Input>;
  _delete_at_path?: InputMaybe<E2e_Features_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<E2e_Features_Delete_Elem_Input>;
  _delete_key?: InputMaybe<E2e_Features_Delete_Key_Input>;
  _inc?: InputMaybe<E2e_Features_Inc_Input>;
  _prepend?: InputMaybe<E2e_Features_Prepend_Input>;
  _set?: InputMaybe<E2e_Features_Set_Input>;
  where: E2e_Features_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_Features_By_PkArgs = {
  _append?: InputMaybe<E2e_Features_Append_Input>;
  _delete_at_path?: InputMaybe<E2e_Features_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<E2e_Features_Delete_Elem_Input>;
  _delete_key?: InputMaybe<E2e_Features_Delete_Key_Input>;
  _inc?: InputMaybe<E2e_Features_Inc_Input>;
  _prepend?: InputMaybe<E2e_Features_Prepend_Input>;
  _set?: InputMaybe<E2e_Features_Set_Input>;
  pk_columns: E2e_Features_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_Features_StatusArgs = {
  _inc?: InputMaybe<E2e_Features_Status_Inc_Input>;
  _set?: InputMaybe<E2e_Features_Status_Set_Input>;
  where: E2e_Features_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_InstancesArgs = {
  _append?: InputMaybe<E2e_Instances_Append_Input>;
  _delete_at_path?: InputMaybe<E2e_Instances_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<E2e_Instances_Delete_Elem_Input>;
  _delete_key?: InputMaybe<E2e_Instances_Delete_Key_Input>;
  _inc?: InputMaybe<E2e_Instances_Inc_Input>;
  _prepend?: InputMaybe<E2e_Instances_Prepend_Input>;
  _set?: InputMaybe<E2e_Instances_Set_Input>;
  where: E2e_Instances_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_Instances_By_PkArgs = {
  _append?: InputMaybe<E2e_Instances_Append_Input>;
  _delete_at_path?: InputMaybe<E2e_Instances_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<E2e_Instances_Delete_Elem_Input>;
  _delete_key?: InputMaybe<E2e_Instances_Delete_Key_Input>;
  _inc?: InputMaybe<E2e_Instances_Inc_Input>;
  _prepend?: InputMaybe<E2e_Instances_Prepend_Input>;
  _set?: InputMaybe<E2e_Instances_Set_Input>;
  pk_columns: E2e_Instances_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_Instances_Group_By_DateArgs = {
  _inc?: InputMaybe<E2e_Instances_Group_By_Date_Inc_Input>;
  _set?: InputMaybe<E2e_Instances_Group_By_Date_Set_Input>;
  where: E2e_Instances_Group_By_Date_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_Instances_Status_CountArgs = {
  _inc?: InputMaybe<E2e_Instances_Status_Count_Inc_Input>;
  _set?: InputMaybe<E2e_Instances_Status_Count_Set_Input>;
  where: E2e_Instances_Status_Count_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_Scenario_SeverityArgs = {
  _set?: InputMaybe<E2e_Scenario_Severity_Set_Input>;
  where: E2e_Scenario_Severity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_Scenario_Severity_By_PkArgs = {
  _set?: InputMaybe<E2e_Scenario_Severity_Set_Input>;
  pk_columns: E2e_Scenario_Severity_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_ScenariosArgs = {
  _append?: InputMaybe<E2e_Scenarios_Append_Input>;
  _delete_at_path?: InputMaybe<E2e_Scenarios_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<E2e_Scenarios_Delete_Elem_Input>;
  _delete_key?: InputMaybe<E2e_Scenarios_Delete_Key_Input>;
  _prepend?: InputMaybe<E2e_Scenarios_Prepend_Input>;
  _set?: InputMaybe<E2e_Scenarios_Set_Input>;
  where: E2e_Scenarios_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_Scenarios_By_PkArgs = {
  _append?: InputMaybe<E2e_Scenarios_Append_Input>;
  _delete_at_path?: InputMaybe<E2e_Scenarios_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<E2e_Scenarios_Delete_Elem_Input>;
  _delete_key?: InputMaybe<E2e_Scenarios_Delete_Key_Input>;
  _prepend?: InputMaybe<E2e_Scenarios_Prepend_Input>;
  _set?: InputMaybe<E2e_Scenarios_Set_Input>;
  pk_columns: E2e_Scenarios_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_StepsArgs = {
  _append?: InputMaybe<E2e_Steps_Append_Input>;
  _delete_at_path?: InputMaybe<E2e_Steps_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<E2e_Steps_Delete_Elem_Input>;
  _delete_key?: InputMaybe<E2e_Steps_Delete_Key_Input>;
  _inc?: InputMaybe<E2e_Steps_Inc_Input>;
  _prepend?: InputMaybe<E2e_Steps_Prepend_Input>;
  _set?: InputMaybe<E2e_Steps_Set_Input>;
  where: E2e_Steps_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_E2e_Steps_By_PkArgs = {
  _append?: InputMaybe<E2e_Steps_Append_Input>;
  _delete_at_path?: InputMaybe<E2e_Steps_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<E2e_Steps_Delete_Elem_Input>;
  _delete_key?: InputMaybe<E2e_Steps_Delete_Key_Input>;
  _inc?: InputMaybe<E2e_Steps_Inc_Input>;
  _prepend?: InputMaybe<E2e_Steps_Prepend_Input>;
  _set?: InputMaybe<E2e_Steps_Set_Input>;
  pk_columns: E2e_Steps_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fourkeys_Commit_DataArgs = {
  _set?: InputMaybe<Fourkeys_Commit_Data_Set_Input>;
  where: Fourkeys_Commit_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Fourkeys_Commit_Data_By_PkArgs = {
  _set?: InputMaybe<Fourkeys_Commit_Data_Set_Input>;
  pk_columns: Fourkeys_Commit_Data_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Fourkeys_Feature_DataArgs = {
  _set?: InputMaybe<Fourkeys_Feature_Data_Set_Input>;
  where: Fourkeys_Feature_Data_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Mfe_Import_Map_VersionsArgs = {
  _inc?: InputMaybe<Mfe_Import_Map_Versions_Inc_Input>;
  _set?: InputMaybe<Mfe_Import_Map_Versions_Set_Input>;
  where: Mfe_Import_Map_Versions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Mfe_Import_Map_Versions_By_PkArgs = {
  _inc?: InputMaybe<Mfe_Import_Map_Versions_Inc_Input>;
  _set?: InputMaybe<Mfe_Import_Map_Versions_Set_Input>;
  pk_columns: Mfe_Import_Map_Versions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Mfe_Services_VersionsArgs = {
  _inc?: InputMaybe<Mfe_Services_Versions_Inc_Input>;
  _set?: InputMaybe<Mfe_Services_Versions_Set_Input>;
  where: Mfe_Services_Versions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Mfe_Services_Versions_By_PkArgs = {
  _inc?: InputMaybe<Mfe_Services_Versions_Inc_Input>;
  _set?: InputMaybe<Mfe_Services_Versions_Set_Input>;
  pk_columns: Mfe_Services_Versions_Pk_Columns_Input;
};

export type Numeric_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _cast?: InputMaybe<Numeric_Cast_Exp>;
  _eq?: InputMaybe<Scalars['numeric']>;
  _gt?: InputMaybe<Scalars['numeric']>;
  _gte?: InputMaybe<Scalars['numeric']>;
  _in?: InputMaybe<Array<Scalars['numeric']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['numeric']>;
  _lte?: InputMaybe<Scalars['numeric']>;
  _neq?: InputMaybe<Scalars['numeric']>;
  _nin?: InputMaybe<Array<Scalars['numeric']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  /** execute function "count_instances_group_by_date" which returns "e2e_instances_group_by_date" */
  count_instances_group_by_date: Array<E2e_Instances_Group_By_Date>;
  /** execute function "count_instances_group_by_date" and query aggregates on result of table type "e2e_instances_group_by_date" */
  count_instances_group_by_date_aggregate: E2e_Instances_Group_By_Date_Aggregate;
  /** execute function "count_instances_group_by_status" which returns "e2e_instances_status_count" */
  count_instances_group_by_status: Array<E2e_Instances_Status_Count>;
  /** execute function "count_instances_group_by_status" and query aggregates on result of table type "e2e_instances_status_count" */
  count_instances_group_by_status_aggregate: E2e_Instances_Status_Count_Aggregate;
  /** An array relationship */
  e2e_features: Array<E2e_Features>;
  /** An aggregate relationship */
  e2e_features_aggregate: E2e_Features_Aggregate;
  /** fetch data from the table: "e2e_features" using primary key columns */
  e2e_features_by_pk?: Maybe<E2e_Features>;
  /** fetch data from the table: "e2e_features_status" */
  e2e_features_status: Array<E2e_Features_Status>;
  /** fetch aggregated fields from the table: "e2e_features_status" */
  e2e_features_status_aggregate: E2e_Features_Status_Aggregate;
  /** fetch data from the table: "e2e_instances" */
  e2e_instances: Array<E2e_Instances>;
  /** fetch aggregated fields from the table: "e2e_instances" */
  e2e_instances_aggregate: E2e_Instances_Aggregate;
  /** fetch data from the table: "e2e_instances" using primary key columns */
  e2e_instances_by_pk?: Maybe<E2e_Instances>;
  /** fetch data from the table: "e2e_instances_feature_tags" */
  e2e_instances_feature_tags: Array<E2e_Instances_Feature_Tags>;
  /** fetch aggregated fields from the table: "e2e_instances_feature_tags" */
  e2e_instances_feature_tags_aggregate: E2e_Instances_Feature_Tags_Aggregate;
  /** fetch data from the table: "e2e_instances_group_by_date" */
  e2e_instances_group_by_date: Array<E2e_Instances_Group_By_Date>;
  /** fetch aggregated fields from the table: "e2e_instances_group_by_date" */
  e2e_instances_group_by_date_aggregate: E2e_Instances_Group_By_Date_Aggregate;
  /** fetch data from the table: "e2e_instances_squad_tags" */
  e2e_instances_squad_tags: Array<E2e_Instances_Squad_Tags>;
  /** fetch aggregated fields from the table: "e2e_instances_squad_tags" */
  e2e_instances_squad_tags_aggregate: E2e_Instances_Squad_Tags_Aggregate;
  /** fetch data from the table: "e2e_instances_status_count" */
  e2e_instances_status_count: Array<E2e_Instances_Status_Count>;
  /** fetch aggregated fields from the table: "e2e_instances_status_count" */
  e2e_instances_status_count_aggregate: E2e_Instances_Status_Count_Aggregate;
  /** fetch data from the table: "e2e_scenario_severity" */
  e2e_scenario_severity: Array<E2e_Scenario_Severity>;
  /** fetch aggregated fields from the table: "e2e_scenario_severity" */
  e2e_scenario_severity_aggregate: E2e_Scenario_Severity_Aggregate;
  /** fetch data from the table: "e2e_scenario_severity" using primary key columns */
  e2e_scenario_severity_by_pk?: Maybe<E2e_Scenario_Severity>;
  /** An array relationship */
  e2e_scenarios: Array<E2e_Scenarios>;
  /** An aggregate relationship */
  e2e_scenarios_aggregate: E2e_Scenarios_Aggregate;
  /** fetch data from the table: "e2e_scenarios" using primary key columns */
  e2e_scenarios_by_pk?: Maybe<E2e_Scenarios>;
  /** An array relationship */
  e2e_steps: Array<E2e_Steps>;
  /** An aggregate relationship */
  e2e_steps_aggregate: E2e_Steps_Aggregate;
  /** fetch data from the table: "e2e_steps" using primary key columns */
  e2e_steps_by_pk?: Maybe<E2e_Steps>;
  /** fetch data from the table: "fourkeys_commit_data" */
  fourkeys_commit_data: Array<Fourkeys_Commit_Data>;
  /** fetch aggregated fields from the table: "fourkeys_commit_data" */
  fourkeys_commit_data_aggregate: Fourkeys_Commit_Data_Aggregate;
  /** fetch data from the table: "fourkeys_commit_data" using primary key columns */
  fourkeys_commit_data_by_pk?: Maybe<Fourkeys_Commit_Data>;
  /** fetch data from the table: "fourkeys_feature_data" */
  fourkeys_feature_data: Array<Fourkeys_Feature_Data>;
  /** fetch aggregated fields from the table: "fourkeys_feature_data" */
  fourkeys_feature_data_aggregate: Fourkeys_Feature_Data_Aggregate;
  /** execute function "get_e2e_feature_status_count_in_last_n_days" which returns "e2e_features_status" */
  get_e2e_feature_status_count_in_last_n_days: Array<E2e_Features_Status>;
  /** execute function "get_e2e_feature_status_count_in_last_n_days" and query aggregates on result of table type "e2e_features_status" */
  get_e2e_feature_status_count_in_last_n_days_aggregate: E2e_Features_Status_Aggregate;
  /** execute function "get_instance_filter_by_tags" which returns "e2e_instances" */
  get_instance_filter_by_tags: Array<E2e_Instances>;
  /** execute function "get_instance_filter_by_tags" and query aggregates on result of table type "e2e_instances" */
  get_instance_filter_by_tags_aggregate: E2e_Instances_Aggregate;
  /** execute function "get_instances_with_filters" which returns "e2e_instances" */
  get_instances_with_filters: Array<E2e_Instances>;
  /** execute function "get_instances_with_filters" and query aggregates on result of table type "e2e_instances" */
  get_instances_with_filters_aggregate: E2e_Instances_Aggregate;
  /** fetch data from the table: "mfe_import_map_versions" */
  mfe_import_map_versions: Array<Mfe_Import_Map_Versions>;
  /** fetch aggregated fields from the table: "mfe_import_map_versions" */
  mfe_import_map_versions_aggregate: Mfe_Import_Map_Versions_Aggregate;
  /** fetch data from the table: "mfe_import_map_versions" using primary key columns */
  mfe_import_map_versions_by_pk?: Maybe<Mfe_Import_Map_Versions>;
  /** fetch data from the table: "mfe_services_versions" */
  mfe_services_versions: Array<Mfe_Services_Versions>;
  /** fetch aggregated fields from the table: "mfe_services_versions" */
  mfe_services_versions_aggregate: Mfe_Services_Versions_Aggregate;
  /** fetch data from the table: "mfe_services_versions" using primary key columns */
  mfe_services_versions_by_pk?: Maybe<Mfe_Services_Versions>;
};


export type Query_RootCount_Instances_Group_By_DateArgs = {
  args: Count_Instances_Group_By_Date_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Group_By_Date_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Group_By_Date_Order_By>>;
  where?: InputMaybe<E2e_Instances_Group_By_Date_Bool_Exp>;
};


export type Query_RootCount_Instances_Group_By_Date_AggregateArgs = {
  args: Count_Instances_Group_By_Date_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Group_By_Date_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Group_By_Date_Order_By>>;
  where?: InputMaybe<E2e_Instances_Group_By_Date_Bool_Exp>;
};


export type Query_RootCount_Instances_Group_By_StatusArgs = {
  args: Count_Instances_Group_By_Status_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Status_Count_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Status_Count_Order_By>>;
  where?: InputMaybe<E2e_Instances_Status_Count_Bool_Exp>;
};


export type Query_RootCount_Instances_Group_By_Status_AggregateArgs = {
  args: Count_Instances_Group_By_Status_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Status_Count_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Status_Count_Order_By>>;
  where?: InputMaybe<E2e_Instances_Status_Count_Bool_Exp>;
};


export type Query_RootE2e_FeaturesArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Order_By>>;
  where?: InputMaybe<E2e_Features_Bool_Exp>;
};


export type Query_RootE2e_Features_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Order_By>>;
  where?: InputMaybe<E2e_Features_Bool_Exp>;
};


export type Query_RootE2e_Features_By_PkArgs = {
  feature_id: Scalars['String'];
};


export type Query_RootE2e_Features_StatusArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Status_Order_By>>;
  where?: InputMaybe<E2e_Features_Status_Bool_Exp>;
};


export type Query_RootE2e_Features_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Status_Order_By>>;
  where?: InputMaybe<E2e_Features_Status_Bool_Exp>;
};


export type Query_RootE2e_InstancesArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Query_RootE2e_Instances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Query_RootE2e_Instances_By_PkArgs = {
  instance_id: Scalars['String'];
};


export type Query_RootE2e_Instances_Feature_TagsArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Feature_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Feature_Tags_Order_By>>;
  where?: InputMaybe<E2e_Instances_Feature_Tags_Bool_Exp>;
};


export type Query_RootE2e_Instances_Feature_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Feature_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Feature_Tags_Order_By>>;
  where?: InputMaybe<E2e_Instances_Feature_Tags_Bool_Exp>;
};


export type Query_RootE2e_Instances_Group_By_DateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Group_By_Date_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Group_By_Date_Order_By>>;
  where?: InputMaybe<E2e_Instances_Group_By_Date_Bool_Exp>;
};


export type Query_RootE2e_Instances_Group_By_Date_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Group_By_Date_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Group_By_Date_Order_By>>;
  where?: InputMaybe<E2e_Instances_Group_By_Date_Bool_Exp>;
};


export type Query_RootE2e_Instances_Squad_TagsArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Squad_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Squad_Tags_Order_By>>;
  where?: InputMaybe<E2e_Instances_Squad_Tags_Bool_Exp>;
};


export type Query_RootE2e_Instances_Squad_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Squad_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Squad_Tags_Order_By>>;
  where?: InputMaybe<E2e_Instances_Squad_Tags_Bool_Exp>;
};


export type Query_RootE2e_Instances_Status_CountArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Status_Count_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Status_Count_Order_By>>;
  where?: InputMaybe<E2e_Instances_Status_Count_Bool_Exp>;
};


export type Query_RootE2e_Instances_Status_Count_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Status_Count_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Status_Count_Order_By>>;
  where?: InputMaybe<E2e_Instances_Status_Count_Bool_Exp>;
};


export type Query_RootE2e_Scenario_SeverityArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenario_Severity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenario_Severity_Order_By>>;
  where?: InputMaybe<E2e_Scenario_Severity_Bool_Exp>;
};


export type Query_RootE2e_Scenario_Severity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenario_Severity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenario_Severity_Order_By>>;
  where?: InputMaybe<E2e_Scenario_Severity_Bool_Exp>;
};


export type Query_RootE2e_Scenario_Severity_By_PkArgs = {
  feature_path: Scalars['String'];
  scenario_name: Scalars['String'];
};


export type Query_RootE2e_ScenariosArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenarios_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenarios_Order_By>>;
  where?: InputMaybe<E2e_Scenarios_Bool_Exp>;
};


export type Query_RootE2e_Scenarios_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenarios_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenarios_Order_By>>;
  where?: InputMaybe<E2e_Scenarios_Bool_Exp>;
};


export type Query_RootE2e_Scenarios_By_PkArgs = {
  scenario_id: Scalars['String'];
};


export type Query_RootE2e_StepsArgs = {
  distinct_on?: InputMaybe<Array<E2e_Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Steps_Order_By>>;
  where?: InputMaybe<E2e_Steps_Bool_Exp>;
};


export type Query_RootE2e_Steps_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Steps_Order_By>>;
  where?: InputMaybe<E2e_Steps_Bool_Exp>;
};


export type Query_RootE2e_Steps_By_PkArgs = {
  step_id: Scalars['String'];
};


export type Query_RootFourkeys_Commit_DataArgs = {
  distinct_on?: InputMaybe<Array<Fourkeys_Commit_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Fourkeys_Commit_Data_Order_By>>;
  where?: InputMaybe<Fourkeys_Commit_Data_Bool_Exp>;
};


export type Query_RootFourkeys_Commit_Data_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fourkeys_Commit_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Fourkeys_Commit_Data_Order_By>>;
  where?: InputMaybe<Fourkeys_Commit_Data_Bool_Exp>;
};


export type Query_RootFourkeys_Commit_Data_By_PkArgs = {
  commit_hash: Scalars['String'];
  feature: Scalars['String'];
  folder: Scalars['String'];
};


export type Query_RootFourkeys_Feature_DataArgs = {
  distinct_on?: InputMaybe<Array<Fourkeys_Feature_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Fourkeys_Feature_Data_Order_By>>;
  where?: InputMaybe<Fourkeys_Feature_Data_Bool_Exp>;
};


export type Query_RootFourkeys_Feature_Data_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fourkeys_Feature_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Fourkeys_Feature_Data_Order_By>>;
  where?: InputMaybe<Fourkeys_Feature_Data_Bool_Exp>;
};


export type Query_RootGet_E2e_Feature_Status_Count_In_Last_N_DaysArgs = {
  args: Get_E2e_Feature_Status_Count_In_Last_N_Days_Args;
  distinct_on?: InputMaybe<Array<E2e_Features_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Status_Order_By>>;
  where?: InputMaybe<E2e_Features_Status_Bool_Exp>;
};


export type Query_RootGet_E2e_Feature_Status_Count_In_Last_N_Days_AggregateArgs = {
  args: Get_E2e_Feature_Status_Count_In_Last_N_Days_Args;
  distinct_on?: InputMaybe<Array<E2e_Features_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Status_Order_By>>;
  where?: InputMaybe<E2e_Features_Status_Bool_Exp>;
};


export type Query_RootGet_Instance_Filter_By_TagsArgs = {
  args: Get_Instance_Filter_By_Tags_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Query_RootGet_Instance_Filter_By_Tags_AggregateArgs = {
  args: Get_Instance_Filter_By_Tags_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Query_RootGet_Instances_With_FiltersArgs = {
  args: Get_Instances_With_Filters_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Query_RootGet_Instances_With_Filters_AggregateArgs = {
  args: Get_Instances_With_Filters_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Query_RootMfe_Import_Map_VersionsArgs = {
  distinct_on?: InputMaybe<Array<Mfe_Import_Map_Versions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Mfe_Import_Map_Versions_Order_By>>;
  where?: InputMaybe<Mfe_Import_Map_Versions_Bool_Exp>;
};


export type Query_RootMfe_Import_Map_Versions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Mfe_Import_Map_Versions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Mfe_Import_Map_Versions_Order_By>>;
  where?: InputMaybe<Mfe_Import_Map_Versions_Bool_Exp>;
};


export type Query_RootMfe_Import_Map_Versions_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootMfe_Services_VersionsArgs = {
  distinct_on?: InputMaybe<Array<Mfe_Services_Versions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Mfe_Services_Versions_Order_By>>;
  where?: InputMaybe<Mfe_Services_Versions_Bool_Exp>;
};


export type Query_RootMfe_Services_Versions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Mfe_Services_Versions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Mfe_Services_Versions_Order_By>>;
  where?: InputMaybe<Mfe_Services_Versions_Bool_Exp>;
};


export type Query_RootMfe_Services_Versions_By_PkArgs = {
  id: Scalars['Int'];
};

export type Smallint_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _cast?: InputMaybe<Smallint_Cast_Exp>;
  _eq?: InputMaybe<Scalars['smallint']>;
  _gt?: InputMaybe<Scalars['smallint']>;
  _gte?: InputMaybe<Scalars['smallint']>;
  _in?: InputMaybe<Array<Scalars['smallint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['smallint']>;
  _lte?: InputMaybe<Scalars['smallint']>;
  _neq?: InputMaybe<Scalars['smallint']>;
  _nin?: InputMaybe<Array<Scalars['smallint']>>;
};

export type Subscription_Root = {
  /** execute function "count_instances_group_by_date" which returns "e2e_instances_group_by_date" */
  count_instances_group_by_date: Array<E2e_Instances_Group_By_Date>;
  /** execute function "count_instances_group_by_date" and query aggregates on result of table type "e2e_instances_group_by_date" */
  count_instances_group_by_date_aggregate: E2e_Instances_Group_By_Date_Aggregate;
  /** execute function "count_instances_group_by_status" which returns "e2e_instances_status_count" */
  count_instances_group_by_status: Array<E2e_Instances_Status_Count>;
  /** execute function "count_instances_group_by_status" and query aggregates on result of table type "e2e_instances_status_count" */
  count_instances_group_by_status_aggregate: E2e_Instances_Status_Count_Aggregate;
  /** An array relationship */
  e2e_features: Array<E2e_Features>;
  /** An aggregate relationship */
  e2e_features_aggregate: E2e_Features_Aggregate;
  /** fetch data from the table: "e2e_features" using primary key columns */
  e2e_features_by_pk?: Maybe<E2e_Features>;
  /** fetch data from the table: "e2e_features_status" */
  e2e_features_status: Array<E2e_Features_Status>;
  /** fetch aggregated fields from the table: "e2e_features_status" */
  e2e_features_status_aggregate: E2e_Features_Status_Aggregate;
  /** fetch data from the table: "e2e_instances" */
  e2e_instances: Array<E2e_Instances>;
  /** fetch aggregated fields from the table: "e2e_instances" */
  e2e_instances_aggregate: E2e_Instances_Aggregate;
  /** fetch data from the table: "e2e_instances" using primary key columns */
  e2e_instances_by_pk?: Maybe<E2e_Instances>;
  /** fetch data from the table: "e2e_instances_feature_tags" */
  e2e_instances_feature_tags: Array<E2e_Instances_Feature_Tags>;
  /** fetch aggregated fields from the table: "e2e_instances_feature_tags" */
  e2e_instances_feature_tags_aggregate: E2e_Instances_Feature_Tags_Aggregate;
  /** fetch data from the table: "e2e_instances_group_by_date" */
  e2e_instances_group_by_date: Array<E2e_Instances_Group_By_Date>;
  /** fetch aggregated fields from the table: "e2e_instances_group_by_date" */
  e2e_instances_group_by_date_aggregate: E2e_Instances_Group_By_Date_Aggregate;
  /** fetch data from the table: "e2e_instances_squad_tags" */
  e2e_instances_squad_tags: Array<E2e_Instances_Squad_Tags>;
  /** fetch aggregated fields from the table: "e2e_instances_squad_tags" */
  e2e_instances_squad_tags_aggregate: E2e_Instances_Squad_Tags_Aggregate;
  /** fetch data from the table: "e2e_instances_status_count" */
  e2e_instances_status_count: Array<E2e_Instances_Status_Count>;
  /** fetch aggregated fields from the table: "e2e_instances_status_count" */
  e2e_instances_status_count_aggregate: E2e_Instances_Status_Count_Aggregate;
  /** fetch data from the table: "e2e_scenario_severity" */
  e2e_scenario_severity: Array<E2e_Scenario_Severity>;
  /** fetch aggregated fields from the table: "e2e_scenario_severity" */
  e2e_scenario_severity_aggregate: E2e_Scenario_Severity_Aggregate;
  /** fetch data from the table: "e2e_scenario_severity" using primary key columns */
  e2e_scenario_severity_by_pk?: Maybe<E2e_Scenario_Severity>;
  /** An array relationship */
  e2e_scenarios: Array<E2e_Scenarios>;
  /** An aggregate relationship */
  e2e_scenarios_aggregate: E2e_Scenarios_Aggregate;
  /** fetch data from the table: "e2e_scenarios" using primary key columns */
  e2e_scenarios_by_pk?: Maybe<E2e_Scenarios>;
  /** An array relationship */
  e2e_steps: Array<E2e_Steps>;
  /** An aggregate relationship */
  e2e_steps_aggregate: E2e_Steps_Aggregate;
  /** fetch data from the table: "e2e_steps" using primary key columns */
  e2e_steps_by_pk?: Maybe<E2e_Steps>;
  /** fetch data from the table: "fourkeys_commit_data" */
  fourkeys_commit_data: Array<Fourkeys_Commit_Data>;
  /** fetch aggregated fields from the table: "fourkeys_commit_data" */
  fourkeys_commit_data_aggregate: Fourkeys_Commit_Data_Aggregate;
  /** fetch data from the table: "fourkeys_commit_data" using primary key columns */
  fourkeys_commit_data_by_pk?: Maybe<Fourkeys_Commit_Data>;
  /** fetch data from the table: "fourkeys_feature_data" */
  fourkeys_feature_data: Array<Fourkeys_Feature_Data>;
  /** fetch aggregated fields from the table: "fourkeys_feature_data" */
  fourkeys_feature_data_aggregate: Fourkeys_Feature_Data_Aggregate;
  /** execute function "get_e2e_feature_status_count_in_last_n_days" which returns "e2e_features_status" */
  get_e2e_feature_status_count_in_last_n_days: Array<E2e_Features_Status>;
  /** execute function "get_e2e_feature_status_count_in_last_n_days" and query aggregates on result of table type "e2e_features_status" */
  get_e2e_feature_status_count_in_last_n_days_aggregate: E2e_Features_Status_Aggregate;
  /** execute function "get_instance_filter_by_tags" which returns "e2e_instances" */
  get_instance_filter_by_tags: Array<E2e_Instances>;
  /** execute function "get_instance_filter_by_tags" and query aggregates on result of table type "e2e_instances" */
  get_instance_filter_by_tags_aggregate: E2e_Instances_Aggregate;
  /** execute function "get_instances_with_filters" which returns "e2e_instances" */
  get_instances_with_filters: Array<E2e_Instances>;
  /** execute function "get_instances_with_filters" and query aggregates on result of table type "e2e_instances" */
  get_instances_with_filters_aggregate: E2e_Instances_Aggregate;
  /** fetch data from the table: "mfe_import_map_versions" */
  mfe_import_map_versions: Array<Mfe_Import_Map_Versions>;
  /** fetch aggregated fields from the table: "mfe_import_map_versions" */
  mfe_import_map_versions_aggregate: Mfe_Import_Map_Versions_Aggregate;
  /** fetch data from the table: "mfe_import_map_versions" using primary key columns */
  mfe_import_map_versions_by_pk?: Maybe<Mfe_Import_Map_Versions>;
  /** fetch data from the table: "mfe_services_versions" */
  mfe_services_versions: Array<Mfe_Services_Versions>;
  /** fetch aggregated fields from the table: "mfe_services_versions" */
  mfe_services_versions_aggregate: Mfe_Services_Versions_Aggregate;
  /** fetch data from the table: "mfe_services_versions" using primary key columns */
  mfe_services_versions_by_pk?: Maybe<Mfe_Services_Versions>;
};


export type Subscription_RootCount_Instances_Group_By_DateArgs = {
  args: Count_Instances_Group_By_Date_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Group_By_Date_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Group_By_Date_Order_By>>;
  where?: InputMaybe<E2e_Instances_Group_By_Date_Bool_Exp>;
};


export type Subscription_RootCount_Instances_Group_By_Date_AggregateArgs = {
  args: Count_Instances_Group_By_Date_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Group_By_Date_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Group_By_Date_Order_By>>;
  where?: InputMaybe<E2e_Instances_Group_By_Date_Bool_Exp>;
};


export type Subscription_RootCount_Instances_Group_By_StatusArgs = {
  args: Count_Instances_Group_By_Status_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Status_Count_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Status_Count_Order_By>>;
  where?: InputMaybe<E2e_Instances_Status_Count_Bool_Exp>;
};


export type Subscription_RootCount_Instances_Group_By_Status_AggregateArgs = {
  args: Count_Instances_Group_By_Status_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Status_Count_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Status_Count_Order_By>>;
  where?: InputMaybe<E2e_Instances_Status_Count_Bool_Exp>;
};


export type Subscription_RootE2e_FeaturesArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Order_By>>;
  where?: InputMaybe<E2e_Features_Bool_Exp>;
};


export type Subscription_RootE2e_Features_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Order_By>>;
  where?: InputMaybe<E2e_Features_Bool_Exp>;
};


export type Subscription_RootE2e_Features_By_PkArgs = {
  feature_id: Scalars['String'];
};


export type Subscription_RootE2e_Features_StatusArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Status_Order_By>>;
  where?: InputMaybe<E2e_Features_Status_Bool_Exp>;
};


export type Subscription_RootE2e_Features_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Features_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Status_Order_By>>;
  where?: InputMaybe<E2e_Features_Status_Bool_Exp>;
};


export type Subscription_RootE2e_InstancesArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Subscription_RootE2e_Instances_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Subscription_RootE2e_Instances_By_PkArgs = {
  instance_id: Scalars['String'];
};


export type Subscription_RootE2e_Instances_Feature_TagsArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Feature_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Feature_Tags_Order_By>>;
  where?: InputMaybe<E2e_Instances_Feature_Tags_Bool_Exp>;
};


export type Subscription_RootE2e_Instances_Feature_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Feature_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Feature_Tags_Order_By>>;
  where?: InputMaybe<E2e_Instances_Feature_Tags_Bool_Exp>;
};


export type Subscription_RootE2e_Instances_Group_By_DateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Group_By_Date_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Group_By_Date_Order_By>>;
  where?: InputMaybe<E2e_Instances_Group_By_Date_Bool_Exp>;
};


export type Subscription_RootE2e_Instances_Group_By_Date_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Group_By_Date_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Group_By_Date_Order_By>>;
  where?: InputMaybe<E2e_Instances_Group_By_Date_Bool_Exp>;
};


export type Subscription_RootE2e_Instances_Squad_TagsArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Squad_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Squad_Tags_Order_By>>;
  where?: InputMaybe<E2e_Instances_Squad_Tags_Bool_Exp>;
};


export type Subscription_RootE2e_Instances_Squad_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Squad_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Squad_Tags_Order_By>>;
  where?: InputMaybe<E2e_Instances_Squad_Tags_Bool_Exp>;
};


export type Subscription_RootE2e_Instances_Status_CountArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Status_Count_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Status_Count_Order_By>>;
  where?: InputMaybe<E2e_Instances_Status_Count_Bool_Exp>;
};


export type Subscription_RootE2e_Instances_Status_Count_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Instances_Status_Count_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Status_Count_Order_By>>;
  where?: InputMaybe<E2e_Instances_Status_Count_Bool_Exp>;
};


export type Subscription_RootE2e_Scenario_SeverityArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenario_Severity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenario_Severity_Order_By>>;
  where?: InputMaybe<E2e_Scenario_Severity_Bool_Exp>;
};


export type Subscription_RootE2e_Scenario_Severity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenario_Severity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenario_Severity_Order_By>>;
  where?: InputMaybe<E2e_Scenario_Severity_Bool_Exp>;
};


export type Subscription_RootE2e_Scenario_Severity_By_PkArgs = {
  feature_path: Scalars['String'];
  scenario_name: Scalars['String'];
};


export type Subscription_RootE2e_ScenariosArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenarios_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenarios_Order_By>>;
  where?: InputMaybe<E2e_Scenarios_Bool_Exp>;
};


export type Subscription_RootE2e_Scenarios_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Scenarios_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Scenarios_Order_By>>;
  where?: InputMaybe<E2e_Scenarios_Bool_Exp>;
};


export type Subscription_RootE2e_Scenarios_By_PkArgs = {
  scenario_id: Scalars['String'];
};


export type Subscription_RootE2e_StepsArgs = {
  distinct_on?: InputMaybe<Array<E2e_Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Steps_Order_By>>;
  where?: InputMaybe<E2e_Steps_Bool_Exp>;
};


export type Subscription_RootE2e_Steps_AggregateArgs = {
  distinct_on?: InputMaybe<Array<E2e_Steps_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Steps_Order_By>>;
  where?: InputMaybe<E2e_Steps_Bool_Exp>;
};


export type Subscription_RootE2e_Steps_By_PkArgs = {
  step_id: Scalars['String'];
};


export type Subscription_RootFourkeys_Commit_DataArgs = {
  distinct_on?: InputMaybe<Array<Fourkeys_Commit_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Fourkeys_Commit_Data_Order_By>>;
  where?: InputMaybe<Fourkeys_Commit_Data_Bool_Exp>;
};


export type Subscription_RootFourkeys_Commit_Data_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fourkeys_Commit_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Fourkeys_Commit_Data_Order_By>>;
  where?: InputMaybe<Fourkeys_Commit_Data_Bool_Exp>;
};


export type Subscription_RootFourkeys_Commit_Data_By_PkArgs = {
  commit_hash: Scalars['String'];
  feature: Scalars['String'];
  folder: Scalars['String'];
};


export type Subscription_RootFourkeys_Feature_DataArgs = {
  distinct_on?: InputMaybe<Array<Fourkeys_Feature_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Fourkeys_Feature_Data_Order_By>>;
  where?: InputMaybe<Fourkeys_Feature_Data_Bool_Exp>;
};


export type Subscription_RootFourkeys_Feature_Data_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Fourkeys_Feature_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Fourkeys_Feature_Data_Order_By>>;
  where?: InputMaybe<Fourkeys_Feature_Data_Bool_Exp>;
};


export type Subscription_RootGet_E2e_Feature_Status_Count_In_Last_N_DaysArgs = {
  args: Get_E2e_Feature_Status_Count_In_Last_N_Days_Args;
  distinct_on?: InputMaybe<Array<E2e_Features_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Status_Order_By>>;
  where?: InputMaybe<E2e_Features_Status_Bool_Exp>;
};


export type Subscription_RootGet_E2e_Feature_Status_Count_In_Last_N_Days_AggregateArgs = {
  args: Get_E2e_Feature_Status_Count_In_Last_N_Days_Args;
  distinct_on?: InputMaybe<Array<E2e_Features_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Features_Status_Order_By>>;
  where?: InputMaybe<E2e_Features_Status_Bool_Exp>;
};


export type Subscription_RootGet_Instance_Filter_By_TagsArgs = {
  args: Get_Instance_Filter_By_Tags_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Subscription_RootGet_Instance_Filter_By_Tags_AggregateArgs = {
  args: Get_Instance_Filter_By_Tags_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Subscription_RootGet_Instances_With_FiltersArgs = {
  args: Get_Instances_With_Filters_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Subscription_RootGet_Instances_With_Filters_AggregateArgs = {
  args: Get_Instances_With_Filters_Args;
  distinct_on?: InputMaybe<Array<E2e_Instances_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<E2e_Instances_Order_By>>;
  where?: InputMaybe<E2e_Instances_Bool_Exp>;
};


export type Subscription_RootMfe_Import_Map_VersionsArgs = {
  distinct_on?: InputMaybe<Array<Mfe_Import_Map_Versions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Mfe_Import_Map_Versions_Order_By>>;
  where?: InputMaybe<Mfe_Import_Map_Versions_Bool_Exp>;
};


export type Subscription_RootMfe_Import_Map_Versions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Mfe_Import_Map_Versions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Mfe_Import_Map_Versions_Order_By>>;
  where?: InputMaybe<Mfe_Import_Map_Versions_Bool_Exp>;
};


export type Subscription_RootMfe_Import_Map_Versions_By_PkArgs = {
  id: Scalars['Int'];
};


export type Subscription_RootMfe_Services_VersionsArgs = {
  distinct_on?: InputMaybe<Array<Mfe_Services_Versions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Mfe_Services_Versions_Order_By>>;
  where?: InputMaybe<Mfe_Services_Versions_Bool_Exp>;
};


export type Subscription_RootMfe_Services_Versions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Mfe_Services_Versions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Mfe_Services_Versions_Order_By>>;
  where?: InputMaybe<Mfe_Services_Versions_Bool_Exp>;
};


export type Subscription_RootMfe_Services_Versions_By_PkArgs = {
  id: Scalars['Int'];
};

export type Timestamptz_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _cast?: InputMaybe<Timestamptz_Cast_Exp>;
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};
