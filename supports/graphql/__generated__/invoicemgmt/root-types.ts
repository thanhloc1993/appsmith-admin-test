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
  date: string;
  jsonb: any;
  numeric: number;
  smallint: number;
  timestamptz: any;
};

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
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

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
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

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  _nlike?: InputMaybe<Scalars['String']>;
  _nsimilar?: InputMaybe<Scalars['String']>;
  _similar?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "bank" */
export type Bank = {
  bank_code: Scalars['String'];
  bank_id: Scalars['String'];
  bank_name: Scalars['String'];
  bank_name_phonetic: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  is_archived: Scalars['Boolean'];
  resource_path: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};

/** columns and relationships of "bank_account" */
export type Bank_Account = {
  /** An object relationship */
  bank?: Maybe<Bank>;
  bank_account_holder: Scalars['String'];
  bank_account_id: Scalars['String'];
  bank_account_number: Scalars['String'];
  bank_account_type: Scalars['String'];
  /** An object relationship */
  bank_branch?: Maybe<Bank_Branch>;
  bank_branch_id: Scalars['String'];
  bank_id?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  is_verified?: Maybe<Scalars['Boolean']>;
  resource_path: Scalars['String'];
  student_id: Scalars['String'];
  student_payment_detail_id: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  /** An array relationship */
  user_access_paths: Array<User_Access_Paths>;
  /** An aggregated array relationship */
  user_access_paths_aggregate: User_Access_Paths_Aggregate;
};


/** columns and relationships of "bank_account" */
export type Bank_AccountUser_Access_PathsArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** columns and relationships of "bank_account" */
export type Bank_AccountUser_Access_Paths_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** aggregated selection of "bank_account" */
export type Bank_Account_Aggregate = {
  aggregate?: Maybe<Bank_Account_Aggregate_Fields>;
  nodes: Array<Bank_Account>;
};

/** aggregate fields of "bank_account" */
export type Bank_Account_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Bank_Account_Max_Fields>;
  min?: Maybe<Bank_Account_Min_Fields>;
};


/** aggregate fields of "bank_account" */
export type Bank_Account_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bank_Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bank_account" */
export type Bank_Account_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bank_Account_Max_Order_By>;
  min?: InputMaybe<Bank_Account_Min_Order_By>;
};

/** input type for inserting array relation for remote table "bank_account" */
export type Bank_Account_Arr_Rel_Insert_Input = {
  data: Array<Bank_Account_Insert_Input>;
  on_conflict?: InputMaybe<Bank_Account_On_Conflict>;
};

/** Boolean expression to filter rows from the table "bank_account". All fields are combined with a logical 'AND'. */
export type Bank_Account_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Bank_Account_Bool_Exp>>>;
  _not?: InputMaybe<Bank_Account_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Bank_Account_Bool_Exp>>>;
  bank?: InputMaybe<Bank_Bool_Exp>;
  bank_account_holder?: InputMaybe<String_Comparison_Exp>;
  bank_account_id?: InputMaybe<String_Comparison_Exp>;
  bank_account_number?: InputMaybe<String_Comparison_Exp>;
  bank_account_type?: InputMaybe<String_Comparison_Exp>;
  bank_branch?: InputMaybe<Bank_Branch_Bool_Exp>;
  bank_branch_id?: InputMaybe<String_Comparison_Exp>;
  bank_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  is_verified?: InputMaybe<Boolean_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  student_id?: InputMaybe<String_Comparison_Exp>;
  student_payment_detail_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_access_paths?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** unique or primary key constraints on table "bank_account" */
export enum Bank_Account_Constraint {
  /** unique or primary key constraint */
  BankAccountPk = 'bank_account__pk'
}

/** input type for inserting data into table "bank_account" */
export type Bank_Account_Insert_Input = {
  bank?: InputMaybe<Bank_Obj_Rel_Insert_Input>;
  bank_account_holder?: InputMaybe<Scalars['String']>;
  bank_account_id?: InputMaybe<Scalars['String']>;
  bank_account_number?: InputMaybe<Scalars['String']>;
  bank_account_type?: InputMaybe<Scalars['String']>;
  bank_branch?: InputMaybe<Bank_Branch_Obj_Rel_Insert_Input>;
  bank_branch_id?: InputMaybe<Scalars['String']>;
  bank_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_verified?: InputMaybe<Scalars['Boolean']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  student_payment_detail_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_access_paths?: InputMaybe<User_Access_Paths_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Bank_Account_Max_Fields = {
  bank_account_holder?: Maybe<Scalars['String']>;
  bank_account_id?: Maybe<Scalars['String']>;
  bank_account_number?: Maybe<Scalars['String']>;
  bank_account_type?: Maybe<Scalars['String']>;
  bank_branch_id?: Maybe<Scalars['String']>;
  bank_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  student_payment_detail_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "bank_account" */
export type Bank_Account_Max_Order_By = {
  bank_account_holder?: InputMaybe<Order_By>;
  bank_account_id?: InputMaybe<Order_By>;
  bank_account_number?: InputMaybe<Order_By>;
  bank_account_type?: InputMaybe<Order_By>;
  bank_branch_id?: InputMaybe<Order_By>;
  bank_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  student_payment_detail_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bank_Account_Min_Fields = {
  bank_account_holder?: Maybe<Scalars['String']>;
  bank_account_id?: Maybe<Scalars['String']>;
  bank_account_number?: Maybe<Scalars['String']>;
  bank_account_type?: Maybe<Scalars['String']>;
  bank_branch_id?: Maybe<Scalars['String']>;
  bank_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  student_payment_detail_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "bank_account" */
export type Bank_Account_Min_Order_By = {
  bank_account_holder?: InputMaybe<Order_By>;
  bank_account_id?: InputMaybe<Order_By>;
  bank_account_number?: InputMaybe<Order_By>;
  bank_account_type?: InputMaybe<Order_By>;
  bank_branch_id?: InputMaybe<Order_By>;
  bank_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  student_payment_detail_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bank_account" */
export type Bank_Account_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Bank_Account>;
};

/** input type for inserting object relation for remote table "bank_account" */
export type Bank_Account_Obj_Rel_Insert_Input = {
  data: Bank_Account_Insert_Input;
  on_conflict?: InputMaybe<Bank_Account_On_Conflict>;
};

/** on conflict condition type for table "bank_account" */
export type Bank_Account_On_Conflict = {
  constraint: Bank_Account_Constraint;
  update_columns: Array<Bank_Account_Update_Column>;
  where?: InputMaybe<Bank_Account_Bool_Exp>;
};

/** ordering options when selecting data from "bank_account" */
export type Bank_Account_Order_By = {
  bank?: InputMaybe<Bank_Order_By>;
  bank_account_holder?: InputMaybe<Order_By>;
  bank_account_id?: InputMaybe<Order_By>;
  bank_account_number?: InputMaybe<Order_By>;
  bank_account_type?: InputMaybe<Order_By>;
  bank_branch?: InputMaybe<Bank_Branch_Order_By>;
  bank_branch_id?: InputMaybe<Order_By>;
  bank_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  is_verified?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  student_payment_detail_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_access_paths_aggregate?: InputMaybe<User_Access_Paths_Aggregate_Order_By>;
};

/** primary key columns input for table: "bank_account" */
export type Bank_Account_Pk_Columns_Input = {
  bank_account_id: Scalars['String'];
};

/** select columns of table "bank_account" */
export enum Bank_Account_Select_Column {
  /** column name */
  BankAccountHolder = 'bank_account_holder',
  /** column name */
  BankAccountId = 'bank_account_id',
  /** column name */
  BankAccountNumber = 'bank_account_number',
  /** column name */
  BankAccountType = 'bank_account_type',
  /** column name */
  BankBranchId = 'bank_branch_id',
  /** column name */
  BankId = 'bank_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsVerified = 'is_verified',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  StudentPaymentDetailId = 'student_payment_detail_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "bank_account" */
export type Bank_Account_Set_Input = {
  bank_account_holder?: InputMaybe<Scalars['String']>;
  bank_account_id?: InputMaybe<Scalars['String']>;
  bank_account_number?: InputMaybe<Scalars['String']>;
  bank_account_type?: InputMaybe<Scalars['String']>;
  bank_branch_id?: InputMaybe<Scalars['String']>;
  bank_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_verified?: InputMaybe<Scalars['Boolean']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  student_payment_detail_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "bank_account" */
export enum Bank_Account_Update_Column {
  /** column name */
  BankAccountHolder = 'bank_account_holder',
  /** column name */
  BankAccountId = 'bank_account_id',
  /** column name */
  BankAccountNumber = 'bank_account_number',
  /** column name */
  BankAccountType = 'bank_account_type',
  /** column name */
  BankBranchId = 'bank_branch_id',
  /** column name */
  BankId = 'bank_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsVerified = 'is_verified',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  StudentPaymentDetailId = 'student_payment_detail_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregated selection of "bank" */
export type Bank_Aggregate = {
  aggregate?: Maybe<Bank_Aggregate_Fields>;
  nodes: Array<Bank>;
};

/** aggregate fields of "bank" */
export type Bank_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Bank_Max_Fields>;
  min?: Maybe<Bank_Min_Fields>;
};


/** aggregate fields of "bank" */
export type Bank_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bank_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bank" */
export type Bank_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bank_Max_Order_By>;
  min?: InputMaybe<Bank_Min_Order_By>;
};

/** input type for inserting array relation for remote table "bank" */
export type Bank_Arr_Rel_Insert_Input = {
  data: Array<Bank_Insert_Input>;
  on_conflict?: InputMaybe<Bank_On_Conflict>;
};

/** Boolean expression to filter rows from the table "bank". All fields are combined with a logical 'AND'. */
export type Bank_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Bank_Bool_Exp>>>;
  _not?: InputMaybe<Bank_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Bank_Bool_Exp>>>;
  bank_code?: InputMaybe<String_Comparison_Exp>;
  bank_id?: InputMaybe<String_Comparison_Exp>;
  bank_name?: InputMaybe<String_Comparison_Exp>;
  bank_name_phonetic?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  is_archived?: InputMaybe<Boolean_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** columns and relationships of "bank_branch" */
export type Bank_Branch = {
  bank_branch_code: Scalars['String'];
  bank_branch_id: Scalars['String'];
  bank_branch_name: Scalars['String'];
  bank_branch_phonetic_name: Scalars['String'];
  bank_id: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  is_archived: Scalars['Boolean'];
  resource_path: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "bank_branch" */
export type Bank_Branch_Aggregate = {
  aggregate?: Maybe<Bank_Branch_Aggregate_Fields>;
  nodes: Array<Bank_Branch>;
};

/** aggregate fields of "bank_branch" */
export type Bank_Branch_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Bank_Branch_Max_Fields>;
  min?: Maybe<Bank_Branch_Min_Fields>;
};


/** aggregate fields of "bank_branch" */
export type Bank_Branch_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bank_Branch_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bank_branch" */
export type Bank_Branch_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bank_Branch_Max_Order_By>;
  min?: InputMaybe<Bank_Branch_Min_Order_By>;
};

/** input type for inserting array relation for remote table "bank_branch" */
export type Bank_Branch_Arr_Rel_Insert_Input = {
  data: Array<Bank_Branch_Insert_Input>;
  on_conflict?: InputMaybe<Bank_Branch_On_Conflict>;
};

/** Boolean expression to filter rows from the table "bank_branch". All fields are combined with a logical 'AND'. */
export type Bank_Branch_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Bank_Branch_Bool_Exp>>>;
  _not?: InputMaybe<Bank_Branch_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Bank_Branch_Bool_Exp>>>;
  bank_branch_code?: InputMaybe<String_Comparison_Exp>;
  bank_branch_id?: InputMaybe<String_Comparison_Exp>;
  bank_branch_name?: InputMaybe<String_Comparison_Exp>;
  bank_branch_phonetic_name?: InputMaybe<String_Comparison_Exp>;
  bank_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  is_archived?: InputMaybe<Boolean_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "bank_branch" */
export enum Bank_Branch_Constraint {
  /** unique or primary key constraint */
  BankBranchPk = 'bank_branch__pk'
}

/** input type for inserting data into table "bank_branch" */
export type Bank_Branch_Insert_Input = {
  bank_branch_code?: InputMaybe<Scalars['String']>;
  bank_branch_id?: InputMaybe<Scalars['String']>;
  bank_branch_name?: InputMaybe<Scalars['String']>;
  bank_branch_phonetic_name?: InputMaybe<Scalars['String']>;
  bank_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Bank_Branch_Max_Fields = {
  bank_branch_code?: Maybe<Scalars['String']>;
  bank_branch_id?: Maybe<Scalars['String']>;
  bank_branch_name?: Maybe<Scalars['String']>;
  bank_branch_phonetic_name?: Maybe<Scalars['String']>;
  bank_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "bank_branch" */
export type Bank_Branch_Max_Order_By = {
  bank_branch_code?: InputMaybe<Order_By>;
  bank_branch_id?: InputMaybe<Order_By>;
  bank_branch_name?: InputMaybe<Order_By>;
  bank_branch_phonetic_name?: InputMaybe<Order_By>;
  bank_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bank_Branch_Min_Fields = {
  bank_branch_code?: Maybe<Scalars['String']>;
  bank_branch_id?: Maybe<Scalars['String']>;
  bank_branch_name?: Maybe<Scalars['String']>;
  bank_branch_phonetic_name?: Maybe<Scalars['String']>;
  bank_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "bank_branch" */
export type Bank_Branch_Min_Order_By = {
  bank_branch_code?: InputMaybe<Order_By>;
  bank_branch_id?: InputMaybe<Order_By>;
  bank_branch_name?: InputMaybe<Order_By>;
  bank_branch_phonetic_name?: InputMaybe<Order_By>;
  bank_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bank_branch" */
export type Bank_Branch_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Bank_Branch>;
};

/** input type for inserting object relation for remote table "bank_branch" */
export type Bank_Branch_Obj_Rel_Insert_Input = {
  data: Bank_Branch_Insert_Input;
  on_conflict?: InputMaybe<Bank_Branch_On_Conflict>;
};

/** on conflict condition type for table "bank_branch" */
export type Bank_Branch_On_Conflict = {
  constraint: Bank_Branch_Constraint;
  update_columns: Array<Bank_Branch_Update_Column>;
  where?: InputMaybe<Bank_Branch_Bool_Exp>;
};

/** ordering options when selecting data from "bank_branch" */
export type Bank_Branch_Order_By = {
  bank_branch_code?: InputMaybe<Order_By>;
  bank_branch_id?: InputMaybe<Order_By>;
  bank_branch_name?: InputMaybe<Order_By>;
  bank_branch_phonetic_name?: InputMaybe<Order_By>;
  bank_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  is_archived?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "bank_branch" */
export type Bank_Branch_Pk_Columns_Input = {
  bank_branch_id: Scalars['String'];
};

/** select columns of table "bank_branch" */
export enum Bank_Branch_Select_Column {
  /** column name */
  BankBranchCode = 'bank_branch_code',
  /** column name */
  BankBranchId = 'bank_branch_id',
  /** column name */
  BankBranchName = 'bank_branch_name',
  /** column name */
  BankBranchPhoneticName = 'bank_branch_phonetic_name',
  /** column name */
  BankId = 'bank_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "bank_branch" */
export type Bank_Branch_Set_Input = {
  bank_branch_code?: InputMaybe<Scalars['String']>;
  bank_branch_id?: InputMaybe<Scalars['String']>;
  bank_branch_name?: InputMaybe<Scalars['String']>;
  bank_branch_phonetic_name?: InputMaybe<Scalars['String']>;
  bank_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "bank_branch" */
export enum Bank_Branch_Update_Column {
  /** column name */
  BankBranchCode = 'bank_branch_code',
  /** column name */
  BankBranchId = 'bank_branch_id',
  /** column name */
  BankBranchName = 'bank_branch_name',
  /** column name */
  BankBranchPhoneticName = 'bank_branch_phonetic_name',
  /** column name */
  BankId = 'bank_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** unique or primary key constraints on table "bank" */
export enum Bank_Constraint {
  /** unique or primary key constraint */
  BankPk = 'bank__pk'
}

/** input type for inserting data into table "bank" */
export type Bank_Insert_Input = {
  bank_code?: InputMaybe<Scalars['String']>;
  bank_id?: InputMaybe<Scalars['String']>;
  bank_name?: InputMaybe<Scalars['String']>;
  bank_name_phonetic?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** columns and relationships of "bank_mapping" */
export type Bank_Mapping = {
  bank_id: Scalars['String'];
  bank_mapping_id: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  is_archived?: Maybe<Scalars['Boolean']>;
  partner_bank_id: Scalars['String'];
  remarks?: Maybe<Scalars['String']>;
  resource_path: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "bank_mapping" */
export type Bank_Mapping_Aggregate = {
  aggregate?: Maybe<Bank_Mapping_Aggregate_Fields>;
  nodes: Array<Bank_Mapping>;
};

/** aggregate fields of "bank_mapping" */
export type Bank_Mapping_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Bank_Mapping_Max_Fields>;
  min?: Maybe<Bank_Mapping_Min_Fields>;
};


/** aggregate fields of "bank_mapping" */
export type Bank_Mapping_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bank_Mapping_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bank_mapping" */
export type Bank_Mapping_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bank_Mapping_Max_Order_By>;
  min?: InputMaybe<Bank_Mapping_Min_Order_By>;
};

/** input type for inserting array relation for remote table "bank_mapping" */
export type Bank_Mapping_Arr_Rel_Insert_Input = {
  data: Array<Bank_Mapping_Insert_Input>;
  on_conflict?: InputMaybe<Bank_Mapping_On_Conflict>;
};

/** Boolean expression to filter rows from the table "bank_mapping". All fields are combined with a logical 'AND'. */
export type Bank_Mapping_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Bank_Mapping_Bool_Exp>>>;
  _not?: InputMaybe<Bank_Mapping_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Bank_Mapping_Bool_Exp>>>;
  bank_id?: InputMaybe<String_Comparison_Exp>;
  bank_mapping_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  is_archived?: InputMaybe<Boolean_Comparison_Exp>;
  partner_bank_id?: InputMaybe<String_Comparison_Exp>;
  remarks?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "bank_mapping" */
export enum Bank_Mapping_Constraint {
  /** unique or primary key constraint */
  BankMappingPk = 'bank_mapping__pk'
}

/** input type for inserting data into table "bank_mapping" */
export type Bank_Mapping_Insert_Input = {
  bank_id?: InputMaybe<Scalars['String']>;
  bank_mapping_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  partner_bank_id?: InputMaybe<Scalars['String']>;
  remarks?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Bank_Mapping_Max_Fields = {
  bank_id?: Maybe<Scalars['String']>;
  bank_mapping_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  partner_bank_id?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "bank_mapping" */
export type Bank_Mapping_Max_Order_By = {
  bank_id?: InputMaybe<Order_By>;
  bank_mapping_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  partner_bank_id?: InputMaybe<Order_By>;
  remarks?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bank_Mapping_Min_Fields = {
  bank_id?: Maybe<Scalars['String']>;
  bank_mapping_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  partner_bank_id?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "bank_mapping" */
export type Bank_Mapping_Min_Order_By = {
  bank_id?: InputMaybe<Order_By>;
  bank_mapping_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  partner_bank_id?: InputMaybe<Order_By>;
  remarks?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bank_mapping" */
export type Bank_Mapping_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Bank_Mapping>;
};

/** input type for inserting object relation for remote table "bank_mapping" */
export type Bank_Mapping_Obj_Rel_Insert_Input = {
  data: Bank_Mapping_Insert_Input;
  on_conflict?: InputMaybe<Bank_Mapping_On_Conflict>;
};

/** on conflict condition type for table "bank_mapping" */
export type Bank_Mapping_On_Conflict = {
  constraint: Bank_Mapping_Constraint;
  update_columns: Array<Bank_Mapping_Update_Column>;
  where?: InputMaybe<Bank_Mapping_Bool_Exp>;
};

/** ordering options when selecting data from "bank_mapping" */
export type Bank_Mapping_Order_By = {
  bank_id?: InputMaybe<Order_By>;
  bank_mapping_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  is_archived?: InputMaybe<Order_By>;
  partner_bank_id?: InputMaybe<Order_By>;
  remarks?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "bank_mapping" */
export type Bank_Mapping_Pk_Columns_Input = {
  bank_mapping_id: Scalars['String'];
};

/** select columns of table "bank_mapping" */
export enum Bank_Mapping_Select_Column {
  /** column name */
  BankId = 'bank_id',
  /** column name */
  BankMappingId = 'bank_mapping_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  PartnerBankId = 'partner_bank_id',
  /** column name */
  Remarks = 'remarks',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "bank_mapping" */
export type Bank_Mapping_Set_Input = {
  bank_id?: InputMaybe<Scalars['String']>;
  bank_mapping_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  partner_bank_id?: InputMaybe<Scalars['String']>;
  remarks?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "bank_mapping" */
export enum Bank_Mapping_Update_Column {
  /** column name */
  BankId = 'bank_id',
  /** column name */
  BankMappingId = 'bank_mapping_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  PartnerBankId = 'partner_bank_id',
  /** column name */
  Remarks = 'remarks',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate max on columns */
export type Bank_Max_Fields = {
  bank_code?: Maybe<Scalars['String']>;
  bank_id?: Maybe<Scalars['String']>;
  bank_name?: Maybe<Scalars['String']>;
  bank_name_phonetic?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "bank" */
export type Bank_Max_Order_By = {
  bank_code?: InputMaybe<Order_By>;
  bank_id?: InputMaybe<Order_By>;
  bank_name?: InputMaybe<Order_By>;
  bank_name_phonetic?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bank_Min_Fields = {
  bank_code?: Maybe<Scalars['String']>;
  bank_id?: Maybe<Scalars['String']>;
  bank_name?: Maybe<Scalars['String']>;
  bank_name_phonetic?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "bank" */
export type Bank_Min_Order_By = {
  bank_code?: InputMaybe<Order_By>;
  bank_id?: InputMaybe<Order_By>;
  bank_name?: InputMaybe<Order_By>;
  bank_name_phonetic?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bank" */
export type Bank_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Bank>;
};

/** input type for inserting object relation for remote table "bank" */
export type Bank_Obj_Rel_Insert_Input = {
  data: Bank_Insert_Input;
  on_conflict?: InputMaybe<Bank_On_Conflict>;
};

/** on conflict condition type for table "bank" */
export type Bank_On_Conflict = {
  constraint: Bank_Constraint;
  update_columns: Array<Bank_Update_Column>;
  where?: InputMaybe<Bank_Bool_Exp>;
};

/** ordering options when selecting data from "bank" */
export type Bank_Order_By = {
  bank_code?: InputMaybe<Order_By>;
  bank_id?: InputMaybe<Order_By>;
  bank_name?: InputMaybe<Order_By>;
  bank_name_phonetic?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  is_archived?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "bank" */
export type Bank_Pk_Columns_Input = {
  bank_id: Scalars['String'];
};

/** select columns of table "bank" */
export enum Bank_Select_Column {
  /** column name */
  BankCode = 'bank_code',
  /** column name */
  BankId = 'bank_id',
  /** column name */
  BankName = 'bank_name',
  /** column name */
  BankNamePhonetic = 'bank_name_phonetic',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "bank" */
export type Bank_Set_Input = {
  bank_code?: InputMaybe<Scalars['String']>;
  bank_id?: InputMaybe<Scalars['String']>;
  bank_name?: InputMaybe<Scalars['String']>;
  bank_name_phonetic?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "bank" */
export enum Bank_Update_Column {
  /** column name */
  BankCode = 'bank_code',
  /** column name */
  BankId = 'bank_id',
  /** column name */
  BankName = 'bank_name',
  /** column name */
  BankNamePhonetic = 'bank_name_phonetic',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "bill_item" */
export type Bill_Item = {
  adjustment_price?: Maybe<Scalars['numeric']>;
  /** An object relationship */
  bill_item_location_permission?: Maybe<Granted_Permissions>;
  bill_item_sequence_number: Scalars['Int'];
  bill_type: Scalars['String'];
  billing_approval_status?: Maybe<Scalars['String']>;
  billing_date?: Maybe<Scalars['timestamptz']>;
  billing_from?: Maybe<Scalars['timestamptz']>;
  billing_item_description?: Maybe<Scalars['jsonb']>;
  billing_ratio_denominator?: Maybe<Scalars['Int']>;
  billing_ratio_numerator?: Maybe<Scalars['Int']>;
  billing_schedule_period_id?: Maybe<Scalars['String']>;
  billing_status: Scalars['String'];
  billing_to?: Maybe<Scalars['timestamptz']>;
  created_at: Scalars['timestamptz'];
  discount_amount?: Maybe<Scalars['numeric']>;
  discount_amount_type?: Maybe<Scalars['String']>;
  discount_amount_value?: Maybe<Scalars['numeric']>;
  discount_id?: Maybe<Scalars['String']>;
  final_price: Scalars['numeric'];
  is_latest_bill_item?: Maybe<Scalars['Boolean']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
  location_id: Scalars['String'];
  location_name?: Maybe<Scalars['String']>;
  old_price?: Maybe<Scalars['numeric']>;
  order_id: Scalars['String'];
  previous_bill_item_sequence_number?: Maybe<Scalars['Int']>;
  previous_bill_item_status?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['numeric']>;
  product_description: Scalars['String'];
  product_id?: Maybe<Scalars['String']>;
  product_pricing?: Maybe<Scalars['Int']>;
  raw_discount_amount?: Maybe<Scalars['numeric']>;
  resource_path: Scalars['String'];
  student_id: Scalars['String'];
  student_product_id?: Maybe<Scalars['String']>;
  tax_amount?: Maybe<Scalars['numeric']>;
  tax_category?: Maybe<Scalars['String']>;
  tax_id?: Maybe<Scalars['String']>;
  tax_percentage?: Maybe<Scalars['Int']>;
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "bill_item" */
export type Bill_ItemBilling_Item_DescriptionArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "bill_item" */
export type Bill_Item_Aggregate = {
  aggregate?: Maybe<Bill_Item_Aggregate_Fields>;
  nodes: Array<Bill_Item>;
};

/** aggregate fields of "bill_item" */
export type Bill_Item_Aggregate_Fields = {
  avg?: Maybe<Bill_Item_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Bill_Item_Max_Fields>;
  min?: Maybe<Bill_Item_Min_Fields>;
  stddev?: Maybe<Bill_Item_Stddev_Fields>;
  stddev_pop?: Maybe<Bill_Item_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Bill_Item_Stddev_Samp_Fields>;
  sum?: Maybe<Bill_Item_Sum_Fields>;
  var_pop?: Maybe<Bill_Item_Var_Pop_Fields>;
  var_samp?: Maybe<Bill_Item_Var_Samp_Fields>;
  variance?: Maybe<Bill_Item_Variance_Fields>;
};


/** aggregate fields of "bill_item" */
export type Bill_Item_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bill_Item_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bill_item" */
export type Bill_Item_Aggregate_Order_By = {
  avg?: InputMaybe<Bill_Item_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bill_Item_Max_Order_By>;
  min?: InputMaybe<Bill_Item_Min_Order_By>;
  stddev?: InputMaybe<Bill_Item_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Bill_Item_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Bill_Item_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Bill_Item_Sum_Order_By>;
  var_pop?: InputMaybe<Bill_Item_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Bill_Item_Var_Samp_Order_By>;
  variance?: InputMaybe<Bill_Item_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Bill_Item_Append_Input = {
  billing_item_description?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "bill_item" */
export type Bill_Item_Arr_Rel_Insert_Input = {
  data: Array<Bill_Item_Insert_Input>;
  on_conflict?: InputMaybe<Bill_Item_On_Conflict>;
};

/** aggregate avg on columns */
export type Bill_Item_Avg_Fields = {
  adjustment_price?: Maybe<Scalars['Float']>;
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
  billing_ratio_denominator?: Maybe<Scalars['Float']>;
  billing_ratio_numerator?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_amount_value?: Maybe<Scalars['Float']>;
  final_price?: Maybe<Scalars['Float']>;
  old_price?: Maybe<Scalars['Float']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  product_pricing?: Maybe<Scalars['Float']>;
  raw_discount_amount?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  tax_percentage?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "bill_item" */
export type Bill_Item_Avg_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "bill_item". All fields are combined with a logical 'AND'. */
export type Bill_Item_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Bill_Item_Bool_Exp>>>;
  _not?: InputMaybe<Bill_Item_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Bill_Item_Bool_Exp>>>;
  adjustment_price?: InputMaybe<Numeric_Comparison_Exp>;
  bill_item_location_permission?: InputMaybe<Granted_Permissions_Bool_Exp>;
  bill_item_sequence_number?: InputMaybe<Int_Comparison_Exp>;
  bill_type?: InputMaybe<String_Comparison_Exp>;
  billing_approval_status?: InputMaybe<String_Comparison_Exp>;
  billing_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  billing_from?: InputMaybe<Timestamptz_Comparison_Exp>;
  billing_item_description?: InputMaybe<Jsonb_Comparison_Exp>;
  billing_ratio_denominator?: InputMaybe<Int_Comparison_Exp>;
  billing_ratio_numerator?: InputMaybe<Int_Comparison_Exp>;
  billing_schedule_period_id?: InputMaybe<String_Comparison_Exp>;
  billing_status?: InputMaybe<String_Comparison_Exp>;
  billing_to?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  discount_amount?: InputMaybe<Numeric_Comparison_Exp>;
  discount_amount_type?: InputMaybe<String_Comparison_Exp>;
  discount_amount_value?: InputMaybe<Numeric_Comparison_Exp>;
  discount_id?: InputMaybe<String_Comparison_Exp>;
  final_price?: InputMaybe<Numeric_Comparison_Exp>;
  is_latest_bill_item?: InputMaybe<Boolean_Comparison_Exp>;
  is_reviewed?: InputMaybe<Boolean_Comparison_Exp>;
  location_id?: InputMaybe<String_Comparison_Exp>;
  location_name?: InputMaybe<String_Comparison_Exp>;
  old_price?: InputMaybe<Numeric_Comparison_Exp>;
  order_id?: InputMaybe<String_Comparison_Exp>;
  previous_bill_item_sequence_number?: InputMaybe<Int_Comparison_Exp>;
  previous_bill_item_status?: InputMaybe<String_Comparison_Exp>;
  price?: InputMaybe<Numeric_Comparison_Exp>;
  product_description?: InputMaybe<String_Comparison_Exp>;
  product_id?: InputMaybe<String_Comparison_Exp>;
  product_pricing?: InputMaybe<Int_Comparison_Exp>;
  raw_discount_amount?: InputMaybe<Numeric_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  student_id?: InputMaybe<String_Comparison_Exp>;
  student_product_id?: InputMaybe<String_Comparison_Exp>;
  tax_amount?: InputMaybe<Numeric_Comparison_Exp>;
  tax_category?: InputMaybe<String_Comparison_Exp>;
  tax_id?: InputMaybe<String_Comparison_Exp>;
  tax_percentage?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "bill_item" */
export enum Bill_Item_Constraint {
  /** unique or primary key constraint */
  BillItemProductPk = 'bill_item_product_pk',
  /** unique or primary key constraint */
  BillItemSequenceNumberResourcePathUnique = 'bill_item_sequence_number_resource_path_unique'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Bill_Item_Delete_At_Path_Input = {
  billing_item_description?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Bill_Item_Delete_Elem_Input = {
  billing_item_description?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Bill_Item_Delete_Key_Input = {
  billing_item_description?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing integer column in table "bill_item" */
export type Bill_Item_Inc_Input = {
  adjustment_price?: InputMaybe<Scalars['numeric']>;
  bill_item_sequence_number?: InputMaybe<Scalars['Int']>;
  billing_ratio_denominator?: InputMaybe<Scalars['Int']>;
  billing_ratio_numerator?: InputMaybe<Scalars['Int']>;
  discount_amount?: InputMaybe<Scalars['numeric']>;
  discount_amount_value?: InputMaybe<Scalars['numeric']>;
  final_price?: InputMaybe<Scalars['numeric']>;
  old_price?: InputMaybe<Scalars['numeric']>;
  previous_bill_item_sequence_number?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['numeric']>;
  product_pricing?: InputMaybe<Scalars['Int']>;
  raw_discount_amount?: InputMaybe<Scalars['numeric']>;
  tax_amount?: InputMaybe<Scalars['numeric']>;
  tax_percentage?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "bill_item" */
export type Bill_Item_Insert_Input = {
  adjustment_price?: InputMaybe<Scalars['numeric']>;
  bill_item_sequence_number?: InputMaybe<Scalars['Int']>;
  bill_type?: InputMaybe<Scalars['String']>;
  billing_approval_status?: InputMaybe<Scalars['String']>;
  billing_date?: InputMaybe<Scalars['timestamptz']>;
  billing_from?: InputMaybe<Scalars['timestamptz']>;
  billing_item_description?: InputMaybe<Scalars['jsonb']>;
  billing_ratio_denominator?: InputMaybe<Scalars['Int']>;
  billing_ratio_numerator?: InputMaybe<Scalars['Int']>;
  billing_schedule_period_id?: InputMaybe<Scalars['String']>;
  billing_status?: InputMaybe<Scalars['String']>;
  billing_to?: InputMaybe<Scalars['timestamptz']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  discount_amount?: InputMaybe<Scalars['numeric']>;
  discount_amount_type?: InputMaybe<Scalars['String']>;
  discount_amount_value?: InputMaybe<Scalars['numeric']>;
  discount_id?: InputMaybe<Scalars['String']>;
  final_price?: InputMaybe<Scalars['numeric']>;
  is_latest_bill_item?: InputMaybe<Scalars['Boolean']>;
  is_reviewed?: InputMaybe<Scalars['Boolean']>;
  location_id?: InputMaybe<Scalars['String']>;
  location_name?: InputMaybe<Scalars['String']>;
  old_price?: InputMaybe<Scalars['numeric']>;
  order_id?: InputMaybe<Scalars['String']>;
  previous_bill_item_sequence_number?: InputMaybe<Scalars['Int']>;
  previous_bill_item_status?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['numeric']>;
  product_description?: InputMaybe<Scalars['String']>;
  product_id?: InputMaybe<Scalars['String']>;
  product_pricing?: InputMaybe<Scalars['Int']>;
  raw_discount_amount?: InputMaybe<Scalars['numeric']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  student_product_id?: InputMaybe<Scalars['String']>;
  tax_amount?: InputMaybe<Scalars['numeric']>;
  tax_category?: InputMaybe<Scalars['String']>;
  tax_id?: InputMaybe<Scalars['String']>;
  tax_percentage?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Bill_Item_Max_Fields = {
  adjustment_price?: Maybe<Scalars['numeric']>;
  bill_item_sequence_number?: Maybe<Scalars['Int']>;
  bill_type?: Maybe<Scalars['String']>;
  billing_approval_status?: Maybe<Scalars['String']>;
  billing_date?: Maybe<Scalars['timestamptz']>;
  billing_from?: Maybe<Scalars['timestamptz']>;
  billing_ratio_denominator?: Maybe<Scalars['Int']>;
  billing_ratio_numerator?: Maybe<Scalars['Int']>;
  billing_schedule_period_id?: Maybe<Scalars['String']>;
  billing_status?: Maybe<Scalars['String']>;
  billing_to?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  discount_amount?: Maybe<Scalars['numeric']>;
  discount_amount_type?: Maybe<Scalars['String']>;
  discount_amount_value?: Maybe<Scalars['numeric']>;
  discount_id?: Maybe<Scalars['String']>;
  final_price?: Maybe<Scalars['numeric']>;
  location_id?: Maybe<Scalars['String']>;
  location_name?: Maybe<Scalars['String']>;
  old_price?: Maybe<Scalars['numeric']>;
  order_id?: Maybe<Scalars['String']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Int']>;
  previous_bill_item_status?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['numeric']>;
  product_description?: Maybe<Scalars['String']>;
  product_id?: Maybe<Scalars['String']>;
  product_pricing?: Maybe<Scalars['Int']>;
  raw_discount_amount?: Maybe<Scalars['numeric']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  student_product_id?: Maybe<Scalars['String']>;
  tax_amount?: Maybe<Scalars['numeric']>;
  tax_category?: Maybe<Scalars['String']>;
  tax_id?: Maybe<Scalars['String']>;
  tax_percentage?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "bill_item" */
export type Bill_Item_Max_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  bill_type?: InputMaybe<Order_By>;
  billing_approval_status?: InputMaybe<Order_By>;
  billing_date?: InputMaybe<Order_By>;
  billing_from?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  billing_schedule_period_id?: InputMaybe<Order_By>;
  billing_status?: InputMaybe<Order_By>;
  billing_to?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_type?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  discount_id?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  location_id?: InputMaybe<Order_By>;
  location_name?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  previous_bill_item_status?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_description?: InputMaybe<Order_By>;
  product_id?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  student_product_id?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_category?: InputMaybe<Order_By>;
  tax_id?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bill_Item_Min_Fields = {
  adjustment_price?: Maybe<Scalars['numeric']>;
  bill_item_sequence_number?: Maybe<Scalars['Int']>;
  bill_type?: Maybe<Scalars['String']>;
  billing_approval_status?: Maybe<Scalars['String']>;
  billing_date?: Maybe<Scalars['timestamptz']>;
  billing_from?: Maybe<Scalars['timestamptz']>;
  billing_ratio_denominator?: Maybe<Scalars['Int']>;
  billing_ratio_numerator?: Maybe<Scalars['Int']>;
  billing_schedule_period_id?: Maybe<Scalars['String']>;
  billing_status?: Maybe<Scalars['String']>;
  billing_to?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  discount_amount?: Maybe<Scalars['numeric']>;
  discount_amount_type?: Maybe<Scalars['String']>;
  discount_amount_value?: Maybe<Scalars['numeric']>;
  discount_id?: Maybe<Scalars['String']>;
  final_price?: Maybe<Scalars['numeric']>;
  location_id?: Maybe<Scalars['String']>;
  location_name?: Maybe<Scalars['String']>;
  old_price?: Maybe<Scalars['numeric']>;
  order_id?: Maybe<Scalars['String']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Int']>;
  previous_bill_item_status?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['numeric']>;
  product_description?: Maybe<Scalars['String']>;
  product_id?: Maybe<Scalars['String']>;
  product_pricing?: Maybe<Scalars['Int']>;
  raw_discount_amount?: Maybe<Scalars['numeric']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  student_product_id?: Maybe<Scalars['String']>;
  tax_amount?: Maybe<Scalars['numeric']>;
  tax_category?: Maybe<Scalars['String']>;
  tax_id?: Maybe<Scalars['String']>;
  tax_percentage?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "bill_item" */
export type Bill_Item_Min_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  bill_type?: InputMaybe<Order_By>;
  billing_approval_status?: InputMaybe<Order_By>;
  billing_date?: InputMaybe<Order_By>;
  billing_from?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  billing_schedule_period_id?: InputMaybe<Order_By>;
  billing_status?: InputMaybe<Order_By>;
  billing_to?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_type?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  discount_id?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  location_id?: InputMaybe<Order_By>;
  location_name?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  previous_bill_item_status?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_description?: InputMaybe<Order_By>;
  product_id?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  student_product_id?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_category?: InputMaybe<Order_By>;
  tax_id?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bill_item" */
export type Bill_Item_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Bill_Item>;
};

/** input type for inserting object relation for remote table "bill_item" */
export type Bill_Item_Obj_Rel_Insert_Input = {
  data: Bill_Item_Insert_Input;
  on_conflict?: InputMaybe<Bill_Item_On_Conflict>;
};

/** on conflict condition type for table "bill_item" */
export type Bill_Item_On_Conflict = {
  constraint: Bill_Item_Constraint;
  update_columns: Array<Bill_Item_Update_Column>;
  where?: InputMaybe<Bill_Item_Bool_Exp>;
};

/** ordering options when selecting data from "bill_item" */
export type Bill_Item_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_location_permission?: InputMaybe<Granted_Permissions_Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  bill_type?: InputMaybe<Order_By>;
  billing_approval_status?: InputMaybe<Order_By>;
  billing_date?: InputMaybe<Order_By>;
  billing_from?: InputMaybe<Order_By>;
  billing_item_description?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  billing_schedule_period_id?: InputMaybe<Order_By>;
  billing_status?: InputMaybe<Order_By>;
  billing_to?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_type?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  discount_id?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  is_latest_bill_item?: InputMaybe<Order_By>;
  is_reviewed?: InputMaybe<Order_By>;
  location_id?: InputMaybe<Order_By>;
  location_name?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  order_id?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  previous_bill_item_status?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_description?: InputMaybe<Order_By>;
  product_id?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  student_product_id?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_category?: InputMaybe<Order_By>;
  tax_id?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "bill_item" */
export type Bill_Item_Pk_Columns_Input = {
  bill_item_sequence_number: Scalars['Int'];
  order_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Bill_Item_Prepend_Input = {
  billing_item_description?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "bill_item" */
export enum Bill_Item_Select_Column {
  /** column name */
  AdjustmentPrice = 'adjustment_price',
  /** column name */
  BillItemSequenceNumber = 'bill_item_sequence_number',
  /** column name */
  BillType = 'bill_type',
  /** column name */
  BillingApprovalStatus = 'billing_approval_status',
  /** column name */
  BillingDate = 'billing_date',
  /** column name */
  BillingFrom = 'billing_from',
  /** column name */
  BillingItemDescription = 'billing_item_description',
  /** column name */
  BillingRatioDenominator = 'billing_ratio_denominator',
  /** column name */
  BillingRatioNumerator = 'billing_ratio_numerator',
  /** column name */
  BillingSchedulePeriodId = 'billing_schedule_period_id',
  /** column name */
  BillingStatus = 'billing_status',
  /** column name */
  BillingTo = 'billing_to',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DiscountAmount = 'discount_amount',
  /** column name */
  DiscountAmountType = 'discount_amount_type',
  /** column name */
  DiscountAmountValue = 'discount_amount_value',
  /** column name */
  DiscountId = 'discount_id',
  /** column name */
  FinalPrice = 'final_price',
  /** column name */
  IsLatestBillItem = 'is_latest_bill_item',
  /** column name */
  IsReviewed = 'is_reviewed',
  /** column name */
  LocationId = 'location_id',
  /** column name */
  LocationName = 'location_name',
  /** column name */
  OldPrice = 'old_price',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  PreviousBillItemSequenceNumber = 'previous_bill_item_sequence_number',
  /** column name */
  PreviousBillItemStatus = 'previous_bill_item_status',
  /** column name */
  Price = 'price',
  /** column name */
  ProductDescription = 'product_description',
  /** column name */
  ProductId = 'product_id',
  /** column name */
  ProductPricing = 'product_pricing',
  /** column name */
  RawDiscountAmount = 'raw_discount_amount',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  StudentProductId = 'student_product_id',
  /** column name */
  TaxAmount = 'tax_amount',
  /** column name */
  TaxCategory = 'tax_category',
  /** column name */
  TaxId = 'tax_id',
  /** column name */
  TaxPercentage = 'tax_percentage',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "bill_item" */
export type Bill_Item_Set_Input = {
  adjustment_price?: InputMaybe<Scalars['numeric']>;
  bill_item_sequence_number?: InputMaybe<Scalars['Int']>;
  bill_type?: InputMaybe<Scalars['String']>;
  billing_approval_status?: InputMaybe<Scalars['String']>;
  billing_date?: InputMaybe<Scalars['timestamptz']>;
  billing_from?: InputMaybe<Scalars['timestamptz']>;
  billing_item_description?: InputMaybe<Scalars['jsonb']>;
  billing_ratio_denominator?: InputMaybe<Scalars['Int']>;
  billing_ratio_numerator?: InputMaybe<Scalars['Int']>;
  billing_schedule_period_id?: InputMaybe<Scalars['String']>;
  billing_status?: InputMaybe<Scalars['String']>;
  billing_to?: InputMaybe<Scalars['timestamptz']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  discount_amount?: InputMaybe<Scalars['numeric']>;
  discount_amount_type?: InputMaybe<Scalars['String']>;
  discount_amount_value?: InputMaybe<Scalars['numeric']>;
  discount_id?: InputMaybe<Scalars['String']>;
  final_price?: InputMaybe<Scalars['numeric']>;
  is_latest_bill_item?: InputMaybe<Scalars['Boolean']>;
  is_reviewed?: InputMaybe<Scalars['Boolean']>;
  location_id?: InputMaybe<Scalars['String']>;
  location_name?: InputMaybe<Scalars['String']>;
  old_price?: InputMaybe<Scalars['numeric']>;
  order_id?: InputMaybe<Scalars['String']>;
  previous_bill_item_sequence_number?: InputMaybe<Scalars['Int']>;
  previous_bill_item_status?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['numeric']>;
  product_description?: InputMaybe<Scalars['String']>;
  product_id?: InputMaybe<Scalars['String']>;
  product_pricing?: InputMaybe<Scalars['Int']>;
  raw_discount_amount?: InputMaybe<Scalars['numeric']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  student_product_id?: InputMaybe<Scalars['String']>;
  tax_amount?: InputMaybe<Scalars['numeric']>;
  tax_category?: InputMaybe<Scalars['String']>;
  tax_id?: InputMaybe<Scalars['String']>;
  tax_percentage?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Bill_Item_Stddev_Fields = {
  adjustment_price?: Maybe<Scalars['Float']>;
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
  billing_ratio_denominator?: Maybe<Scalars['Float']>;
  billing_ratio_numerator?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_amount_value?: Maybe<Scalars['Float']>;
  final_price?: Maybe<Scalars['Float']>;
  old_price?: Maybe<Scalars['Float']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  product_pricing?: Maybe<Scalars['Float']>;
  raw_discount_amount?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  tax_percentage?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "bill_item" */
export type Bill_Item_Stddev_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Bill_Item_Stddev_Pop_Fields = {
  adjustment_price?: Maybe<Scalars['Float']>;
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
  billing_ratio_denominator?: Maybe<Scalars['Float']>;
  billing_ratio_numerator?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_amount_value?: Maybe<Scalars['Float']>;
  final_price?: Maybe<Scalars['Float']>;
  old_price?: Maybe<Scalars['Float']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  product_pricing?: Maybe<Scalars['Float']>;
  raw_discount_amount?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  tax_percentage?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "bill_item" */
export type Bill_Item_Stddev_Pop_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Bill_Item_Stddev_Samp_Fields = {
  adjustment_price?: Maybe<Scalars['Float']>;
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
  billing_ratio_denominator?: Maybe<Scalars['Float']>;
  billing_ratio_numerator?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_amount_value?: Maybe<Scalars['Float']>;
  final_price?: Maybe<Scalars['Float']>;
  old_price?: Maybe<Scalars['Float']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  product_pricing?: Maybe<Scalars['Float']>;
  raw_discount_amount?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  tax_percentage?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "bill_item" */
export type Bill_Item_Stddev_Samp_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Bill_Item_Sum_Fields = {
  adjustment_price?: Maybe<Scalars['numeric']>;
  bill_item_sequence_number?: Maybe<Scalars['Int']>;
  billing_ratio_denominator?: Maybe<Scalars['Int']>;
  billing_ratio_numerator?: Maybe<Scalars['Int']>;
  discount_amount?: Maybe<Scalars['numeric']>;
  discount_amount_value?: Maybe<Scalars['numeric']>;
  final_price?: Maybe<Scalars['numeric']>;
  old_price?: Maybe<Scalars['numeric']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['numeric']>;
  product_pricing?: Maybe<Scalars['Int']>;
  raw_discount_amount?: Maybe<Scalars['numeric']>;
  tax_amount?: Maybe<Scalars['numeric']>;
  tax_percentage?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "bill_item" */
export type Bill_Item_Sum_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
};

/** update columns of table "bill_item" */
export enum Bill_Item_Update_Column {
  /** column name */
  AdjustmentPrice = 'adjustment_price',
  /** column name */
  BillItemSequenceNumber = 'bill_item_sequence_number',
  /** column name */
  BillType = 'bill_type',
  /** column name */
  BillingApprovalStatus = 'billing_approval_status',
  /** column name */
  BillingDate = 'billing_date',
  /** column name */
  BillingFrom = 'billing_from',
  /** column name */
  BillingItemDescription = 'billing_item_description',
  /** column name */
  BillingRatioDenominator = 'billing_ratio_denominator',
  /** column name */
  BillingRatioNumerator = 'billing_ratio_numerator',
  /** column name */
  BillingSchedulePeriodId = 'billing_schedule_period_id',
  /** column name */
  BillingStatus = 'billing_status',
  /** column name */
  BillingTo = 'billing_to',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DiscountAmount = 'discount_amount',
  /** column name */
  DiscountAmountType = 'discount_amount_type',
  /** column name */
  DiscountAmountValue = 'discount_amount_value',
  /** column name */
  DiscountId = 'discount_id',
  /** column name */
  FinalPrice = 'final_price',
  /** column name */
  IsLatestBillItem = 'is_latest_bill_item',
  /** column name */
  IsReviewed = 'is_reviewed',
  /** column name */
  LocationId = 'location_id',
  /** column name */
  LocationName = 'location_name',
  /** column name */
  OldPrice = 'old_price',
  /** column name */
  OrderId = 'order_id',
  /** column name */
  PreviousBillItemSequenceNumber = 'previous_bill_item_sequence_number',
  /** column name */
  PreviousBillItemStatus = 'previous_bill_item_status',
  /** column name */
  Price = 'price',
  /** column name */
  ProductDescription = 'product_description',
  /** column name */
  ProductId = 'product_id',
  /** column name */
  ProductPricing = 'product_pricing',
  /** column name */
  RawDiscountAmount = 'raw_discount_amount',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  StudentProductId = 'student_product_id',
  /** column name */
  TaxAmount = 'tax_amount',
  /** column name */
  TaxCategory = 'tax_category',
  /** column name */
  TaxId = 'tax_id',
  /** column name */
  TaxPercentage = 'tax_percentage',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Bill_Item_Var_Pop_Fields = {
  adjustment_price?: Maybe<Scalars['Float']>;
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
  billing_ratio_denominator?: Maybe<Scalars['Float']>;
  billing_ratio_numerator?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_amount_value?: Maybe<Scalars['Float']>;
  final_price?: Maybe<Scalars['Float']>;
  old_price?: Maybe<Scalars['Float']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  product_pricing?: Maybe<Scalars['Float']>;
  raw_discount_amount?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  tax_percentage?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "bill_item" */
export type Bill_Item_Var_Pop_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Bill_Item_Var_Samp_Fields = {
  adjustment_price?: Maybe<Scalars['Float']>;
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
  billing_ratio_denominator?: Maybe<Scalars['Float']>;
  billing_ratio_numerator?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_amount_value?: Maybe<Scalars['Float']>;
  final_price?: Maybe<Scalars['Float']>;
  old_price?: Maybe<Scalars['Float']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  product_pricing?: Maybe<Scalars['Float']>;
  raw_discount_amount?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  tax_percentage?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "bill_item" */
export type Bill_Item_Var_Samp_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Bill_Item_Variance_Fields = {
  adjustment_price?: Maybe<Scalars['Float']>;
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
  billing_ratio_denominator?: Maybe<Scalars['Float']>;
  billing_ratio_numerator?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_amount_value?: Maybe<Scalars['Float']>;
  final_price?: Maybe<Scalars['Float']>;
  old_price?: Maybe<Scalars['Float']>;
  previous_bill_item_sequence_number?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  product_pricing?: Maybe<Scalars['Float']>;
  raw_discount_amount?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  tax_percentage?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "bill_item" */
export type Bill_Item_Variance_Order_By = {
  adjustment_price?: InputMaybe<Order_By>;
  bill_item_sequence_number?: InputMaybe<Order_By>;
  billing_ratio_denominator?: InputMaybe<Order_By>;
  billing_ratio_numerator?: InputMaybe<Order_By>;
  discount_amount?: InputMaybe<Order_By>;
  discount_amount_value?: InputMaybe<Order_By>;
  final_price?: InputMaybe<Order_By>;
  old_price?: InputMaybe<Order_By>;
  previous_bill_item_sequence_number?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  product_pricing?: InputMaybe<Order_By>;
  raw_discount_amount?: InputMaybe<Order_By>;
  tax_amount?: InputMaybe<Order_By>;
  tax_percentage?: InputMaybe<Order_By>;
};

/** columns and relationships of "billing_address" */
export type Billing_Address = {
  billing_address_id: Scalars['String'];
  city: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  postal_code: Scalars['String'];
  /** An object relationship */
  prefecture?: Maybe<Prefecture>;
  prefecture_id?: Maybe<Scalars['String']>;
  prefecture_name: Scalars['String'];
  resource_path: Scalars['String'];
  street1: Scalars['String'];
  street2?: Maybe<Scalars['String']>;
  student_payment_detail_id: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  /** An array relationship */
  user_access_paths: Array<User_Access_Paths>;
  /** An aggregated array relationship */
  user_access_paths_aggregate: User_Access_Paths_Aggregate;
  user_id: Scalars['String'];
};


/** columns and relationships of "billing_address" */
export type Billing_AddressUser_Access_PathsArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** columns and relationships of "billing_address" */
export type Billing_AddressUser_Access_Paths_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** aggregated selection of "billing_address" */
export type Billing_Address_Aggregate = {
  aggregate?: Maybe<Billing_Address_Aggregate_Fields>;
  nodes: Array<Billing_Address>;
};

/** aggregate fields of "billing_address" */
export type Billing_Address_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Billing_Address_Max_Fields>;
  min?: Maybe<Billing_Address_Min_Fields>;
};


/** aggregate fields of "billing_address" */
export type Billing_Address_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Billing_Address_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "billing_address" */
export type Billing_Address_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Billing_Address_Max_Order_By>;
  min?: InputMaybe<Billing_Address_Min_Order_By>;
};

/** input type for inserting array relation for remote table "billing_address" */
export type Billing_Address_Arr_Rel_Insert_Input = {
  data: Array<Billing_Address_Insert_Input>;
  on_conflict?: InputMaybe<Billing_Address_On_Conflict>;
};

/** Boolean expression to filter rows from the table "billing_address". All fields are combined with a logical 'AND'. */
export type Billing_Address_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Billing_Address_Bool_Exp>>>;
  _not?: InputMaybe<Billing_Address_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Billing_Address_Bool_Exp>>>;
  billing_address_id?: InputMaybe<String_Comparison_Exp>;
  city?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  postal_code?: InputMaybe<String_Comparison_Exp>;
  prefecture?: InputMaybe<Prefecture_Bool_Exp>;
  prefecture_id?: InputMaybe<String_Comparison_Exp>;
  prefecture_name?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  street1?: InputMaybe<String_Comparison_Exp>;
  street2?: InputMaybe<String_Comparison_Exp>;
  student_payment_detail_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_access_paths?: InputMaybe<User_Access_Paths_Bool_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "billing_address" */
export enum Billing_Address_Constraint {
  /** unique or primary key constraint */
  BillingAddressPk = 'billing_address__pk'
}

/** input type for inserting data into table "billing_address" */
export type Billing_Address_Insert_Input = {
  billing_address_id?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  postal_code?: InputMaybe<Scalars['String']>;
  prefecture?: InputMaybe<Prefecture_Obj_Rel_Insert_Input>;
  prefecture_id?: InputMaybe<Scalars['String']>;
  prefecture_name?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  street1?: InputMaybe<Scalars['String']>;
  street2?: InputMaybe<Scalars['String']>;
  student_payment_detail_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_access_paths?: InputMaybe<User_Access_Paths_Arr_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Billing_Address_Max_Fields = {
  billing_address_id?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  postal_code?: Maybe<Scalars['String']>;
  prefecture_id?: Maybe<Scalars['String']>;
  prefecture_name?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  street1?: Maybe<Scalars['String']>;
  street2?: Maybe<Scalars['String']>;
  student_payment_detail_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "billing_address" */
export type Billing_Address_Max_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  postal_code?: InputMaybe<Order_By>;
  prefecture_id?: InputMaybe<Order_By>;
  prefecture_name?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  street1?: InputMaybe<Order_By>;
  street2?: InputMaybe<Order_By>;
  student_payment_detail_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Billing_Address_Min_Fields = {
  billing_address_id?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  postal_code?: Maybe<Scalars['String']>;
  prefecture_id?: Maybe<Scalars['String']>;
  prefecture_name?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  street1?: Maybe<Scalars['String']>;
  street2?: Maybe<Scalars['String']>;
  student_payment_detail_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "billing_address" */
export type Billing_Address_Min_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  postal_code?: InputMaybe<Order_By>;
  prefecture_id?: InputMaybe<Order_By>;
  prefecture_name?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  street1?: InputMaybe<Order_By>;
  street2?: InputMaybe<Order_By>;
  student_payment_detail_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "billing_address" */
export type Billing_Address_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Billing_Address>;
};

/** input type for inserting object relation for remote table "billing_address" */
export type Billing_Address_Obj_Rel_Insert_Input = {
  data: Billing_Address_Insert_Input;
  on_conflict?: InputMaybe<Billing_Address_On_Conflict>;
};

/** on conflict condition type for table "billing_address" */
export type Billing_Address_On_Conflict = {
  constraint: Billing_Address_Constraint;
  update_columns: Array<Billing_Address_Update_Column>;
  where?: InputMaybe<Billing_Address_Bool_Exp>;
};

/** ordering options when selecting data from "billing_address" */
export type Billing_Address_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  postal_code?: InputMaybe<Order_By>;
  prefecture?: InputMaybe<Prefecture_Order_By>;
  prefecture_id?: InputMaybe<Order_By>;
  prefecture_name?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  street1?: InputMaybe<Order_By>;
  street2?: InputMaybe<Order_By>;
  student_payment_detail_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_access_paths_aggregate?: InputMaybe<User_Access_Paths_Aggregate_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "billing_address" */
export type Billing_Address_Pk_Columns_Input = {
  billing_address_id: Scalars['String'];
};

/** select columns of table "billing_address" */
export enum Billing_Address_Select_Column {
  /** column name */
  BillingAddressId = 'billing_address_id',
  /** column name */
  City = 'city',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  PostalCode = 'postal_code',
  /** column name */
  PrefectureId = 'prefecture_id',
  /** column name */
  PrefectureName = 'prefecture_name',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  Street1 = 'street1',
  /** column name */
  Street2 = 'street2',
  /** column name */
  StudentPaymentDetailId = 'student_payment_detail_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "billing_address" */
export type Billing_Address_Set_Input = {
  billing_address_id?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  postal_code?: InputMaybe<Scalars['String']>;
  prefecture_id?: InputMaybe<Scalars['String']>;
  prefecture_name?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  street1?: InputMaybe<Scalars['String']>;
  street2?: InputMaybe<Scalars['String']>;
  student_payment_detail_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** update columns of table "billing_address" */
export enum Billing_Address_Update_Column {
  /** column name */
  BillingAddressId = 'billing_address_id',
  /** column name */
  City = 'city',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  PostalCode = 'postal_code',
  /** column name */
  PrefectureId = 'prefecture_id',
  /** column name */
  PrefectureName = 'prefecture_name',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  Street1 = 'street1',
  /** column name */
  Street2 = 'street2',
  /** column name */
  StudentPaymentDetailId = 'student_payment_detail_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** columns and relationships of "bulk_payment_request" */
export type Bulk_Payment_Request = {
  /** An array relationship */
  bulk_payment_request_files: Array<Bulk_Payment_Request_File>;
  /** An aggregated array relationship */
  bulk_payment_request_files_aggregate: Bulk_Payment_Request_File_Aggregate;
  bulk_payment_request_id: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  error_details?: Maybe<Scalars['String']>;
  payment_due_date_from?: Maybe<Scalars['timestamptz']>;
  payment_due_date_to?: Maybe<Scalars['timestamptz']>;
  payment_method: Scalars['String'];
  resource_path: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "bulk_payment_request" */
export type Bulk_Payment_RequestBulk_Payment_Request_FilesArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_File_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_File_Bool_Exp>;
};


/** columns and relationships of "bulk_payment_request" */
export type Bulk_Payment_RequestBulk_Payment_Request_Files_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_File_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_File_Bool_Exp>;
};

/** aggregated selection of "bulk_payment_request" */
export type Bulk_Payment_Request_Aggregate = {
  aggregate?: Maybe<Bulk_Payment_Request_Aggregate_Fields>;
  nodes: Array<Bulk_Payment_Request>;
};

/** aggregate fields of "bulk_payment_request" */
export type Bulk_Payment_Request_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Bulk_Payment_Request_Max_Fields>;
  min?: Maybe<Bulk_Payment_Request_Min_Fields>;
};


/** aggregate fields of "bulk_payment_request" */
export type Bulk_Payment_Request_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bulk_Payment_Request_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bulk_payment_request" */
export type Bulk_Payment_Request_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bulk_Payment_Request_Max_Order_By>;
  min?: InputMaybe<Bulk_Payment_Request_Min_Order_By>;
};

/** input type for inserting array relation for remote table "bulk_payment_request" */
export type Bulk_Payment_Request_Arr_Rel_Insert_Input = {
  data: Array<Bulk_Payment_Request_Insert_Input>;
  on_conflict?: InputMaybe<Bulk_Payment_Request_On_Conflict>;
};

/** Boolean expression to filter rows from the table "bulk_payment_request". All fields are combined with a logical 'AND'. */
export type Bulk_Payment_Request_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Bulk_Payment_Request_Bool_Exp>>>;
  _not?: InputMaybe<Bulk_Payment_Request_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Bulk_Payment_Request_Bool_Exp>>>;
  bulk_payment_request_files?: InputMaybe<Bulk_Payment_Request_File_Bool_Exp>;
  bulk_payment_request_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  error_details?: InputMaybe<String_Comparison_Exp>;
  payment_due_date_from?: InputMaybe<Timestamptz_Comparison_Exp>;
  payment_due_date_to?: InputMaybe<Timestamptz_Comparison_Exp>;
  payment_method?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "bulk_payment_request" */
export enum Bulk_Payment_Request_Constraint {
  /** unique or primary key constraint */
  BulkPaymentRequestPk = 'bulk_payment_request_pk'
}

/** columns and relationships of "bulk_payment_request_file" */
export type Bulk_Payment_Request_File = {
  bulk_payment_request_file_id: Scalars['String'];
  bulk_payment_request_id: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  file_name: Scalars['String'];
  file_sequence_number: Scalars['Int'];
  file_url?: Maybe<Scalars['String']>;
  is_downloaded: Scalars['Boolean'];
  parent_payment_request_file_id?: Maybe<Scalars['String']>;
  resource_path: Scalars['String'];
  total_file_count?: Maybe<Scalars['Int']>;
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Aggregate = {
  aggregate?: Maybe<Bulk_Payment_Request_File_Aggregate_Fields>;
  nodes: Array<Bulk_Payment_Request_File>;
};

/** aggregate fields of "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Aggregate_Fields = {
  avg?: Maybe<Bulk_Payment_Request_File_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Bulk_Payment_Request_File_Max_Fields>;
  min?: Maybe<Bulk_Payment_Request_File_Min_Fields>;
  stddev?: Maybe<Bulk_Payment_Request_File_Stddev_Fields>;
  stddev_pop?: Maybe<Bulk_Payment_Request_File_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Bulk_Payment_Request_File_Stddev_Samp_Fields>;
  sum?: Maybe<Bulk_Payment_Request_File_Sum_Fields>;
  var_pop?: Maybe<Bulk_Payment_Request_File_Var_Pop_Fields>;
  var_samp?: Maybe<Bulk_Payment_Request_File_Var_Samp_Fields>;
  variance?: Maybe<Bulk_Payment_Request_File_Variance_Fields>;
};


/** aggregate fields of "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bulk_Payment_Request_File_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Aggregate_Order_By = {
  avg?: InputMaybe<Bulk_Payment_Request_File_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bulk_Payment_Request_File_Max_Order_By>;
  min?: InputMaybe<Bulk_Payment_Request_File_Min_Order_By>;
  stddev?: InputMaybe<Bulk_Payment_Request_File_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Bulk_Payment_Request_File_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Bulk_Payment_Request_File_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Bulk_Payment_Request_File_Sum_Order_By>;
  var_pop?: InputMaybe<Bulk_Payment_Request_File_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Bulk_Payment_Request_File_Var_Samp_Order_By>;
  variance?: InputMaybe<Bulk_Payment_Request_File_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Arr_Rel_Insert_Input = {
  data: Array<Bulk_Payment_Request_File_Insert_Input>;
  on_conflict?: InputMaybe<Bulk_Payment_Request_File_On_Conflict>;
};

/** aggregate avg on columns */
export type Bulk_Payment_Request_File_Avg_Fields = {
  file_sequence_number?: Maybe<Scalars['Float']>;
  total_file_count?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Avg_Order_By = {
  file_sequence_number?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "bulk_payment_request_file". All fields are combined with a logical 'AND'. */
export type Bulk_Payment_Request_File_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Bulk_Payment_Request_File_Bool_Exp>>>;
  _not?: InputMaybe<Bulk_Payment_Request_File_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Bulk_Payment_Request_File_Bool_Exp>>>;
  bulk_payment_request_file_id?: InputMaybe<String_Comparison_Exp>;
  bulk_payment_request_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  file_name?: InputMaybe<String_Comparison_Exp>;
  file_sequence_number?: InputMaybe<Int_Comparison_Exp>;
  file_url?: InputMaybe<String_Comparison_Exp>;
  is_downloaded?: InputMaybe<Boolean_Comparison_Exp>;
  parent_payment_request_file_id?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  total_file_count?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "bulk_payment_request_file" */
export enum Bulk_Payment_Request_File_Constraint {
  /** unique or primary key constraint */
  BulkPaymentRequestFilePk = 'bulk_payment_request_file_pk'
}

/** input type for incrementing integer column in table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Inc_Input = {
  file_sequence_number?: InputMaybe<Scalars['Int']>;
  total_file_count?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Insert_Input = {
  bulk_payment_request_file_id?: InputMaybe<Scalars['String']>;
  bulk_payment_request_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  file_name?: InputMaybe<Scalars['String']>;
  file_sequence_number?: InputMaybe<Scalars['Int']>;
  file_url?: InputMaybe<Scalars['String']>;
  is_downloaded?: InputMaybe<Scalars['Boolean']>;
  parent_payment_request_file_id?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  total_file_count?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Bulk_Payment_Request_File_Max_Fields = {
  bulk_payment_request_file_id?: Maybe<Scalars['String']>;
  bulk_payment_request_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  file_name?: Maybe<Scalars['String']>;
  file_sequence_number?: Maybe<Scalars['Int']>;
  file_url?: Maybe<Scalars['String']>;
  parent_payment_request_file_id?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  total_file_count?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Max_Order_By = {
  bulk_payment_request_file_id?: InputMaybe<Order_By>;
  bulk_payment_request_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  file_name?: InputMaybe<Order_By>;
  file_sequence_number?: InputMaybe<Order_By>;
  file_url?: InputMaybe<Order_By>;
  parent_payment_request_file_id?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bulk_Payment_Request_File_Min_Fields = {
  bulk_payment_request_file_id?: Maybe<Scalars['String']>;
  bulk_payment_request_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  file_name?: Maybe<Scalars['String']>;
  file_sequence_number?: Maybe<Scalars['Int']>;
  file_url?: Maybe<Scalars['String']>;
  parent_payment_request_file_id?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  total_file_count?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Min_Order_By = {
  bulk_payment_request_file_id?: InputMaybe<Order_By>;
  bulk_payment_request_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  file_name?: InputMaybe<Order_By>;
  file_sequence_number?: InputMaybe<Order_By>;
  file_url?: InputMaybe<Order_By>;
  parent_payment_request_file_id?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Bulk_Payment_Request_File>;
};

/** input type for inserting object relation for remote table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Obj_Rel_Insert_Input = {
  data: Bulk_Payment_Request_File_Insert_Input;
  on_conflict?: InputMaybe<Bulk_Payment_Request_File_On_Conflict>;
};

/** on conflict condition type for table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_On_Conflict = {
  constraint: Bulk_Payment_Request_File_Constraint;
  update_columns: Array<Bulk_Payment_Request_File_Update_Column>;
  where?: InputMaybe<Bulk_Payment_Request_File_Bool_Exp>;
};

/** ordering options when selecting data from "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Order_By = {
  bulk_payment_request_file_id?: InputMaybe<Order_By>;
  bulk_payment_request_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  file_name?: InputMaybe<Order_By>;
  file_sequence_number?: InputMaybe<Order_By>;
  file_url?: InputMaybe<Order_By>;
  is_downloaded?: InputMaybe<Order_By>;
  parent_payment_request_file_id?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Pk_Columns_Input = {
  bulk_payment_request_file_id: Scalars['String'];
};

/** select columns of table "bulk_payment_request_file" */
export enum Bulk_Payment_Request_File_Select_Column {
  /** column name */
  BulkPaymentRequestFileId = 'bulk_payment_request_file_id',
  /** column name */
  BulkPaymentRequestId = 'bulk_payment_request_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  FileName = 'file_name',
  /** column name */
  FileSequenceNumber = 'file_sequence_number',
  /** column name */
  FileUrl = 'file_url',
  /** column name */
  IsDownloaded = 'is_downloaded',
  /** column name */
  ParentPaymentRequestFileId = 'parent_payment_request_file_id',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  TotalFileCount = 'total_file_count',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Set_Input = {
  bulk_payment_request_file_id?: InputMaybe<Scalars['String']>;
  bulk_payment_request_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  file_name?: InputMaybe<Scalars['String']>;
  file_sequence_number?: InputMaybe<Scalars['Int']>;
  file_url?: InputMaybe<Scalars['String']>;
  is_downloaded?: InputMaybe<Scalars['Boolean']>;
  parent_payment_request_file_id?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  total_file_count?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Bulk_Payment_Request_File_Stddev_Fields = {
  file_sequence_number?: Maybe<Scalars['Float']>;
  total_file_count?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Stddev_Order_By = {
  file_sequence_number?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Bulk_Payment_Request_File_Stddev_Pop_Fields = {
  file_sequence_number?: Maybe<Scalars['Float']>;
  total_file_count?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Stddev_Pop_Order_By = {
  file_sequence_number?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Bulk_Payment_Request_File_Stddev_Samp_Fields = {
  file_sequence_number?: Maybe<Scalars['Float']>;
  total_file_count?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Stddev_Samp_Order_By = {
  file_sequence_number?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Bulk_Payment_Request_File_Sum_Fields = {
  file_sequence_number?: Maybe<Scalars['Int']>;
  total_file_count?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Sum_Order_By = {
  file_sequence_number?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
};

/** update columns of table "bulk_payment_request_file" */
export enum Bulk_Payment_Request_File_Update_Column {
  /** column name */
  BulkPaymentRequestFileId = 'bulk_payment_request_file_id',
  /** column name */
  BulkPaymentRequestId = 'bulk_payment_request_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  FileName = 'file_name',
  /** column name */
  FileSequenceNumber = 'file_sequence_number',
  /** column name */
  FileUrl = 'file_url',
  /** column name */
  IsDownloaded = 'is_downloaded',
  /** column name */
  ParentPaymentRequestFileId = 'parent_payment_request_file_id',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  TotalFileCount = 'total_file_count',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Bulk_Payment_Request_File_Var_Pop_Fields = {
  file_sequence_number?: Maybe<Scalars['Float']>;
  total_file_count?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Var_Pop_Order_By = {
  file_sequence_number?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Bulk_Payment_Request_File_Var_Samp_Fields = {
  file_sequence_number?: Maybe<Scalars['Float']>;
  total_file_count?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Var_Samp_Order_By = {
  file_sequence_number?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Bulk_Payment_Request_File_Variance_Fields = {
  file_sequence_number?: Maybe<Scalars['Float']>;
  total_file_count?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "bulk_payment_request_file" */
export type Bulk_Payment_Request_File_Variance_Order_By = {
  file_sequence_number?: InputMaybe<Order_By>;
  total_file_count?: InputMaybe<Order_By>;
};

/** input type for inserting data into table "bulk_payment_request" */
export type Bulk_Payment_Request_Insert_Input = {
  bulk_payment_request_files?: InputMaybe<Bulk_Payment_Request_File_Arr_Rel_Insert_Input>;
  bulk_payment_request_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  error_details?: InputMaybe<Scalars['String']>;
  payment_due_date_from?: InputMaybe<Scalars['timestamptz']>;
  payment_due_date_to?: InputMaybe<Scalars['timestamptz']>;
  payment_method?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Bulk_Payment_Request_Max_Fields = {
  bulk_payment_request_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  error_details?: Maybe<Scalars['String']>;
  payment_due_date_from?: Maybe<Scalars['timestamptz']>;
  payment_due_date_to?: Maybe<Scalars['timestamptz']>;
  payment_method?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "bulk_payment_request" */
export type Bulk_Payment_Request_Max_Order_By = {
  bulk_payment_request_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  error_details?: InputMaybe<Order_By>;
  payment_due_date_from?: InputMaybe<Order_By>;
  payment_due_date_to?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bulk_Payment_Request_Min_Fields = {
  bulk_payment_request_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  error_details?: Maybe<Scalars['String']>;
  payment_due_date_from?: Maybe<Scalars['timestamptz']>;
  payment_due_date_to?: Maybe<Scalars['timestamptz']>;
  payment_method?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "bulk_payment_request" */
export type Bulk_Payment_Request_Min_Order_By = {
  bulk_payment_request_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  error_details?: InputMaybe<Order_By>;
  payment_due_date_from?: InputMaybe<Order_By>;
  payment_due_date_to?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bulk_payment_request" */
export type Bulk_Payment_Request_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Bulk_Payment_Request>;
};

/** input type for inserting object relation for remote table "bulk_payment_request" */
export type Bulk_Payment_Request_Obj_Rel_Insert_Input = {
  data: Bulk_Payment_Request_Insert_Input;
  on_conflict?: InputMaybe<Bulk_Payment_Request_On_Conflict>;
};

/** on conflict condition type for table "bulk_payment_request" */
export type Bulk_Payment_Request_On_Conflict = {
  constraint: Bulk_Payment_Request_Constraint;
  update_columns: Array<Bulk_Payment_Request_Update_Column>;
  where?: InputMaybe<Bulk_Payment_Request_Bool_Exp>;
};

/** ordering options when selecting data from "bulk_payment_request" */
export type Bulk_Payment_Request_Order_By = {
  bulk_payment_request_files_aggregate?: InputMaybe<Bulk_Payment_Request_File_Aggregate_Order_By>;
  bulk_payment_request_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  error_details?: InputMaybe<Order_By>;
  payment_due_date_from?: InputMaybe<Order_By>;
  payment_due_date_to?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "bulk_payment_request" */
export type Bulk_Payment_Request_Pk_Columns_Input = {
  bulk_payment_request_id: Scalars['String'];
};

/** select columns of table "bulk_payment_request" */
export enum Bulk_Payment_Request_Select_Column {
  /** column name */
  BulkPaymentRequestId = 'bulk_payment_request_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  ErrorDetails = 'error_details',
  /** column name */
  PaymentDueDateFrom = 'payment_due_date_from',
  /** column name */
  PaymentDueDateTo = 'payment_due_date_to',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "bulk_payment_request" */
export type Bulk_Payment_Request_Set_Input = {
  bulk_payment_request_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  error_details?: InputMaybe<Scalars['String']>;
  payment_due_date_from?: InputMaybe<Scalars['timestamptz']>;
  payment_due_date_to?: InputMaybe<Scalars['timestamptz']>;
  payment_method?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "bulk_payment_request" */
export enum Bulk_Payment_Request_Update_Column {
  /** column name */
  BulkPaymentRequestId = 'bulk_payment_request_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  ErrorDetails = 'error_details',
  /** column name */
  PaymentDueDateFrom = 'payment_due_date_from',
  /** column name */
  PaymentDueDateTo = 'payment_due_date_to',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "bulk_payment_validations" */
export type Bulk_Payment_Validations = {
  bulk_payment_validations_id: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  failed_payments: Scalars['Int'];
  payment_method: Scalars['String'];
  pending_payments: Scalars['Int'];
  resource_path?: Maybe<Scalars['String']>;
  successful_payments: Scalars['Int'];
  updated_at: Scalars['timestamptz'];
  validation_date: Scalars['timestamptz'];
};

/** aggregated selection of "bulk_payment_validations" */
export type Bulk_Payment_Validations_Aggregate = {
  aggregate?: Maybe<Bulk_Payment_Validations_Aggregate_Fields>;
  nodes: Array<Bulk_Payment_Validations>;
};

/** aggregate fields of "bulk_payment_validations" */
export type Bulk_Payment_Validations_Aggregate_Fields = {
  avg?: Maybe<Bulk_Payment_Validations_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Bulk_Payment_Validations_Max_Fields>;
  min?: Maybe<Bulk_Payment_Validations_Min_Fields>;
  stddev?: Maybe<Bulk_Payment_Validations_Stddev_Fields>;
  stddev_pop?: Maybe<Bulk_Payment_Validations_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Bulk_Payment_Validations_Stddev_Samp_Fields>;
  sum?: Maybe<Bulk_Payment_Validations_Sum_Fields>;
  var_pop?: Maybe<Bulk_Payment_Validations_Var_Pop_Fields>;
  var_samp?: Maybe<Bulk_Payment_Validations_Var_Samp_Fields>;
  variance?: Maybe<Bulk_Payment_Validations_Variance_Fields>;
};


/** aggregate fields of "bulk_payment_validations" */
export type Bulk_Payment_Validations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bulk_Payment_Validations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Aggregate_Order_By = {
  avg?: InputMaybe<Bulk_Payment_Validations_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bulk_Payment_Validations_Max_Order_By>;
  min?: InputMaybe<Bulk_Payment_Validations_Min_Order_By>;
  stddev?: InputMaybe<Bulk_Payment_Validations_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Bulk_Payment_Validations_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Bulk_Payment_Validations_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Bulk_Payment_Validations_Sum_Order_By>;
  var_pop?: InputMaybe<Bulk_Payment_Validations_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Bulk_Payment_Validations_Var_Samp_Order_By>;
  variance?: InputMaybe<Bulk_Payment_Validations_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Arr_Rel_Insert_Input = {
  data: Array<Bulk_Payment_Validations_Insert_Input>;
  on_conflict?: InputMaybe<Bulk_Payment_Validations_On_Conflict>;
};

/** aggregate avg on columns */
export type Bulk_Payment_Validations_Avg_Fields = {
  failed_payments?: Maybe<Scalars['Float']>;
  pending_payments?: Maybe<Scalars['Float']>;
  successful_payments?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Avg_Order_By = {
  failed_payments?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "bulk_payment_validations". All fields are combined with a logical 'AND'. */
export type Bulk_Payment_Validations_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Bulk_Payment_Validations_Bool_Exp>>>;
  _not?: InputMaybe<Bulk_Payment_Validations_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Bulk_Payment_Validations_Bool_Exp>>>;
  bulk_payment_validations_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  failed_payments?: InputMaybe<Int_Comparison_Exp>;
  payment_method?: InputMaybe<String_Comparison_Exp>;
  pending_payments?: InputMaybe<Int_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  successful_payments?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  validation_date?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "bulk_payment_validations" */
export enum Bulk_Payment_Validations_Constraint {
  /** unique or primary key constraint */
  BulkPaymentValidationsPk = 'bulk_payment_validations_pk'
}

/** input type for incrementing integer column in table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Inc_Input = {
  failed_payments?: InputMaybe<Scalars['Int']>;
  pending_payments?: InputMaybe<Scalars['Int']>;
  successful_payments?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Insert_Input = {
  bulk_payment_validations_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  failed_payments?: InputMaybe<Scalars['Int']>;
  payment_method?: InputMaybe<Scalars['String']>;
  pending_payments?: InputMaybe<Scalars['Int']>;
  resource_path?: InputMaybe<Scalars['String']>;
  successful_payments?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  validation_date?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Bulk_Payment_Validations_Max_Fields = {
  bulk_payment_validations_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  failed_payments?: Maybe<Scalars['Int']>;
  payment_method?: Maybe<Scalars['String']>;
  pending_payments?: Maybe<Scalars['Int']>;
  resource_path?: Maybe<Scalars['String']>;
  successful_payments?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  validation_date?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Max_Order_By = {
  bulk_payment_validations_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  failed_payments?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  validation_date?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bulk_Payment_Validations_Min_Fields = {
  bulk_payment_validations_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  failed_payments?: Maybe<Scalars['Int']>;
  payment_method?: Maybe<Scalars['String']>;
  pending_payments?: Maybe<Scalars['Int']>;
  resource_path?: Maybe<Scalars['String']>;
  successful_payments?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  validation_date?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Min_Order_By = {
  bulk_payment_validations_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  failed_payments?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  validation_date?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Bulk_Payment_Validations>;
};

/** input type for inserting object relation for remote table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Obj_Rel_Insert_Input = {
  data: Bulk_Payment_Validations_Insert_Input;
  on_conflict?: InputMaybe<Bulk_Payment_Validations_On_Conflict>;
};

/** on conflict condition type for table "bulk_payment_validations" */
export type Bulk_Payment_Validations_On_Conflict = {
  constraint: Bulk_Payment_Validations_Constraint;
  update_columns: Array<Bulk_Payment_Validations_Update_Column>;
  where?: InputMaybe<Bulk_Payment_Validations_Bool_Exp>;
};

/** ordering options when selecting data from "bulk_payment_validations" */
export type Bulk_Payment_Validations_Order_By = {
  bulk_payment_validations_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  failed_payments?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  validation_date?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "bulk_payment_validations" */
export type Bulk_Payment_Validations_Pk_Columns_Input = {
  bulk_payment_validations_id: Scalars['String'];
};

/** select columns of table "bulk_payment_validations" */
export enum Bulk_Payment_Validations_Select_Column {
  /** column name */
  BulkPaymentValidationsId = 'bulk_payment_validations_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  FailedPayments = 'failed_payments',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  PendingPayments = 'pending_payments',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  SuccessfulPayments = 'successful_payments',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  ValidationDate = 'validation_date'
}

/** input type for updating data in table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Set_Input = {
  bulk_payment_validations_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  failed_payments?: InputMaybe<Scalars['Int']>;
  payment_method?: InputMaybe<Scalars['String']>;
  pending_payments?: InputMaybe<Scalars['Int']>;
  resource_path?: InputMaybe<Scalars['String']>;
  successful_payments?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  validation_date?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Bulk_Payment_Validations_Stddev_Fields = {
  failed_payments?: Maybe<Scalars['Float']>;
  pending_payments?: Maybe<Scalars['Float']>;
  successful_payments?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Stddev_Order_By = {
  failed_payments?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Bulk_Payment_Validations_Stddev_Pop_Fields = {
  failed_payments?: Maybe<Scalars['Float']>;
  pending_payments?: Maybe<Scalars['Float']>;
  successful_payments?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Stddev_Pop_Order_By = {
  failed_payments?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Bulk_Payment_Validations_Stddev_Samp_Fields = {
  failed_payments?: Maybe<Scalars['Float']>;
  pending_payments?: Maybe<Scalars['Float']>;
  successful_payments?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Stddev_Samp_Order_By = {
  failed_payments?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Bulk_Payment_Validations_Sum_Fields = {
  failed_payments?: Maybe<Scalars['Int']>;
  pending_payments?: Maybe<Scalars['Int']>;
  successful_payments?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Sum_Order_By = {
  failed_payments?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
};

/** update columns of table "bulk_payment_validations" */
export enum Bulk_Payment_Validations_Update_Column {
  /** column name */
  BulkPaymentValidationsId = 'bulk_payment_validations_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  FailedPayments = 'failed_payments',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  PendingPayments = 'pending_payments',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  SuccessfulPayments = 'successful_payments',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  ValidationDate = 'validation_date'
}

/** aggregate var_pop on columns */
export type Bulk_Payment_Validations_Var_Pop_Fields = {
  failed_payments?: Maybe<Scalars['Float']>;
  pending_payments?: Maybe<Scalars['Float']>;
  successful_payments?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Var_Pop_Order_By = {
  failed_payments?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Bulk_Payment_Validations_Var_Samp_Fields = {
  failed_payments?: Maybe<Scalars['Float']>;
  pending_payments?: Maybe<Scalars['Float']>;
  successful_payments?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Var_Samp_Order_By = {
  failed_payments?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Bulk_Payment_Validations_Variance_Fields = {
  failed_payments?: Maybe<Scalars['Float']>;
  pending_payments?: Maybe<Scalars['Float']>;
  successful_payments?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "bulk_payment_validations" */
export type Bulk_Payment_Validations_Variance_Order_By = {
  failed_payments?: InputMaybe<Order_By>;
  pending_payments?: InputMaybe<Order_By>;
  successful_payments?: InputMaybe<Order_By>;
};

/** expression to compare columns of type date. All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']>;
  _gt?: InputMaybe<Scalars['date']>;
  _gte?: InputMaybe<Scalars['date']>;
  _in?: InputMaybe<Array<Scalars['date']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['date']>;
  _lte?: InputMaybe<Scalars['date']>;
  _neq?: InputMaybe<Scalars['date']>;
  _nin?: InputMaybe<Array<Scalars['date']>>;
};

/** columns and relationships of "granted_permissions" */
export type Granted_Permissions = {
  /** An object relationship */
  bank_account_location_permission?: Maybe<User_Access_Paths>;
  /** An object relationship */
  bill_item_location_permission?: Maybe<Bill_Item>;
  /** An object relationship */
  billing_address_location_permission?: Maybe<User_Access_Paths>;
  /** An object relationship */
  invoice_location_permission?: Maybe<User_Access_Paths>;
  location_id?: Maybe<Scalars['String']>;
  /** An object relationship */
  payment_location_permission?: Maybe<User_Access_Paths>;
  permission_id?: Maybe<Scalars['String']>;
  permission_name?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  /** An object relationship */
  student_payment_detail_location_permission?: Maybe<User_Access_Paths>;
  /** An object relationship */
  students_location_permission?: Maybe<User_Access_Paths>;
  /** An object relationship */
  user_access_paths_location_permission?: Maybe<User_Access_Paths>;
  user_id?: Maybe<Scalars['String']>;
  /** An object relationship */
  users_location_permission?: Maybe<User_Access_Paths>;
};

/** aggregated selection of "granted_permissions" */
export type Granted_Permissions_Aggregate = {
  aggregate?: Maybe<Granted_Permissions_Aggregate_Fields>;
  nodes: Array<Granted_Permissions>;
};

/** aggregate fields of "granted_permissions" */
export type Granted_Permissions_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Granted_Permissions_Max_Fields>;
  min?: Maybe<Granted_Permissions_Min_Fields>;
};


/** aggregate fields of "granted_permissions" */
export type Granted_Permissions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Granted_Permissions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "granted_permissions" */
export type Granted_Permissions_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Granted_Permissions_Max_Order_By>;
  min?: InputMaybe<Granted_Permissions_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "granted_permissions". All fields are combined with a logical 'AND'. */
export type Granted_Permissions_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Granted_Permissions_Bool_Exp>>>;
  _not?: InputMaybe<Granted_Permissions_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Granted_Permissions_Bool_Exp>>>;
  bank_account_location_permission?: InputMaybe<User_Access_Paths_Bool_Exp>;
  bill_item_location_permission?: InputMaybe<Bill_Item_Bool_Exp>;
  billing_address_location_permission?: InputMaybe<User_Access_Paths_Bool_Exp>;
  invoice_location_permission?: InputMaybe<User_Access_Paths_Bool_Exp>;
  location_id?: InputMaybe<String_Comparison_Exp>;
  payment_location_permission?: InputMaybe<User_Access_Paths_Bool_Exp>;
  permission_id?: InputMaybe<String_Comparison_Exp>;
  permission_name?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  student_payment_detail_location_permission?: InputMaybe<User_Access_Paths_Bool_Exp>;
  students_location_permission?: InputMaybe<User_Access_Paths_Bool_Exp>;
  user_access_paths_location_permission?: InputMaybe<User_Access_Paths_Bool_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
  users_location_permission?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** aggregate max on columns */
export type Granted_Permissions_Max_Fields = {
  location_id?: Maybe<Scalars['String']>;
  permission_id?: Maybe<Scalars['String']>;
  permission_name?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "granted_permissions" */
export type Granted_Permissions_Max_Order_By = {
  location_id?: InputMaybe<Order_By>;
  permission_id?: InputMaybe<Order_By>;
  permission_name?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Granted_Permissions_Min_Fields = {
  location_id?: Maybe<Scalars['String']>;
  permission_id?: Maybe<Scalars['String']>;
  permission_name?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "granted_permissions" */
export type Granted_Permissions_Min_Order_By = {
  location_id?: InputMaybe<Order_By>;
  permission_id?: InputMaybe<Order_By>;
  permission_name?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** ordering options when selecting data from "granted_permissions" */
export type Granted_Permissions_Order_By = {
  bank_account_location_permission?: InputMaybe<User_Access_Paths_Order_By>;
  bill_item_location_permission?: InputMaybe<Bill_Item_Order_By>;
  billing_address_location_permission?: InputMaybe<User_Access_Paths_Order_By>;
  invoice_location_permission?: InputMaybe<User_Access_Paths_Order_By>;
  location_id?: InputMaybe<Order_By>;
  payment_location_permission?: InputMaybe<User_Access_Paths_Order_By>;
  permission_id?: InputMaybe<Order_By>;
  permission_name?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_payment_detail_location_permission?: InputMaybe<User_Access_Paths_Order_By>;
  students_location_permission?: InputMaybe<User_Access_Paths_Order_By>;
  user_access_paths_location_permission?: InputMaybe<User_Access_Paths_Order_By>;
  user_id?: InputMaybe<Order_By>;
  users_location_permission?: InputMaybe<User_Access_Paths_Order_By>;
};

/** select columns of table "granted_permissions" */
export enum Granted_Permissions_Select_Column {
  /** column name */
  LocationId = 'location_id',
  /** column name */
  PermissionId = 'permission_id',
  /** column name */
  PermissionName = 'permission_name',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UserId = 'user_id'
}

/** columns and relationships of "invoice" */
export type Invoice = {
  created_at: Scalars['timestamptz'];
  invoice_id: Scalars['String'];
  invoice_sequence_number?: Maybe<Scalars['Int']>;
  is_exported?: Maybe<Scalars['Boolean']>;
  /** An array relationship */
  payments: Array<Payment>;
  /** An aggregated array relationship */
  payments_aggregate: Payment_Aggregate;
  resource_path?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  /** An object relationship */
  student: Students;
  student_id: Scalars['String'];
  sub_total: Scalars['numeric'];
  total: Scalars['numeric'];
  type: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  /** An array relationship */
  user_access_paths: Array<User_Access_Paths>;
  /** An aggregated array relationship */
  user_access_paths_aggregate: User_Access_Paths_Aggregate;
};


/** columns and relationships of "invoice" */
export type InvoicePaymentsArgs = {
  distinct_on?: InputMaybe<Array<Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Order_By>>;
  where?: InputMaybe<Payment_Bool_Exp>;
};


/** columns and relationships of "invoice" */
export type InvoicePayments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Order_By>>;
  where?: InputMaybe<Payment_Bool_Exp>;
};


/** columns and relationships of "invoice" */
export type InvoiceUser_Access_PathsArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** columns and relationships of "invoice" */
export type InvoiceUser_Access_Paths_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** columns and relationships of "invoice_action_log" */
export type Invoice_Action_Log = {
  action: Scalars['String'];
  action_comment: Scalars['String'];
  action_detail: Scalars['String'];
  created_at: Scalars['timestamptz'];
  invoice_action_id: Scalars['String'];
  invoice_id: Scalars['String'];
  payment_sequence_number?: Maybe<Scalars['Int']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
  user_id: Scalars['String'];
};

/** aggregated selection of "invoice_action_log" */
export type Invoice_Action_Log_Aggregate = {
  aggregate?: Maybe<Invoice_Action_Log_Aggregate_Fields>;
  nodes: Array<Invoice_Action_Log>;
};

/** aggregate fields of "invoice_action_log" */
export type Invoice_Action_Log_Aggregate_Fields = {
  avg?: Maybe<Invoice_Action_Log_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Invoice_Action_Log_Max_Fields>;
  min?: Maybe<Invoice_Action_Log_Min_Fields>;
  stddev?: Maybe<Invoice_Action_Log_Stddev_Fields>;
  stddev_pop?: Maybe<Invoice_Action_Log_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Invoice_Action_Log_Stddev_Samp_Fields>;
  sum?: Maybe<Invoice_Action_Log_Sum_Fields>;
  var_pop?: Maybe<Invoice_Action_Log_Var_Pop_Fields>;
  var_samp?: Maybe<Invoice_Action_Log_Var_Samp_Fields>;
  variance?: Maybe<Invoice_Action_Log_Variance_Fields>;
};


/** aggregate fields of "invoice_action_log" */
export type Invoice_Action_Log_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invoice_Action_Log_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "invoice_action_log" */
export type Invoice_Action_Log_Aggregate_Order_By = {
  avg?: InputMaybe<Invoice_Action_Log_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Invoice_Action_Log_Max_Order_By>;
  min?: InputMaybe<Invoice_Action_Log_Min_Order_By>;
  stddev?: InputMaybe<Invoice_Action_Log_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Invoice_Action_Log_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Invoice_Action_Log_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Invoice_Action_Log_Sum_Order_By>;
  var_pop?: InputMaybe<Invoice_Action_Log_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Invoice_Action_Log_Var_Samp_Order_By>;
  variance?: InputMaybe<Invoice_Action_Log_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "invoice_action_log" */
export type Invoice_Action_Log_Arr_Rel_Insert_Input = {
  data: Array<Invoice_Action_Log_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Action_Log_On_Conflict>;
};

/** aggregate avg on columns */
export type Invoice_Action_Log_Avg_Fields = {
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Avg_Order_By = {
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "invoice_action_log". All fields are combined with a logical 'AND'. */
export type Invoice_Action_Log_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Invoice_Action_Log_Bool_Exp>>>;
  _not?: InputMaybe<Invoice_Action_Log_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Invoice_Action_Log_Bool_Exp>>>;
  action?: InputMaybe<String_Comparison_Exp>;
  action_comment?: InputMaybe<String_Comparison_Exp>;
  action_detail?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  invoice_action_id?: InputMaybe<String_Comparison_Exp>;
  invoice_id?: InputMaybe<String_Comparison_Exp>;
  payment_sequence_number?: InputMaybe<Int_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "invoice_action_log" */
export enum Invoice_Action_Log_Constraint {
  /** unique or primary key constraint */
  InvoiceActionLogPk = 'invoice_action_log_pk'
}

/** input type for incrementing integer column in table "invoice_action_log" */
export type Invoice_Action_Log_Inc_Input = {
  payment_sequence_number?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "invoice_action_log" */
export type Invoice_Action_Log_Insert_Input = {
  action?: InputMaybe<Scalars['String']>;
  action_comment?: InputMaybe<Scalars['String']>;
  action_detail?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_action_id?: InputMaybe<Scalars['String']>;
  invoice_id?: InputMaybe<Scalars['String']>;
  payment_sequence_number?: InputMaybe<Scalars['Int']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Invoice_Action_Log_Max_Fields = {
  action?: Maybe<Scalars['String']>;
  action_comment?: Maybe<Scalars['String']>;
  action_detail?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_action_id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  payment_sequence_number?: Maybe<Scalars['Int']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Max_Order_By = {
  action?: InputMaybe<Order_By>;
  action_comment?: InputMaybe<Order_By>;
  action_detail?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  invoice_action_id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Invoice_Action_Log_Min_Fields = {
  action?: Maybe<Scalars['String']>;
  action_comment?: Maybe<Scalars['String']>;
  action_detail?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_action_id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  payment_sequence_number?: Maybe<Scalars['Int']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Min_Order_By = {
  action?: InputMaybe<Order_By>;
  action_comment?: InputMaybe<Order_By>;
  action_detail?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  invoice_action_id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "invoice_action_log" */
export type Invoice_Action_Log_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Invoice_Action_Log>;
};

/** input type for inserting object relation for remote table "invoice_action_log" */
export type Invoice_Action_Log_Obj_Rel_Insert_Input = {
  data: Invoice_Action_Log_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Action_Log_On_Conflict>;
};

/** on conflict condition type for table "invoice_action_log" */
export type Invoice_Action_Log_On_Conflict = {
  constraint: Invoice_Action_Log_Constraint;
  update_columns: Array<Invoice_Action_Log_Update_Column>;
  where?: InputMaybe<Invoice_Action_Log_Bool_Exp>;
};

/** ordering options when selecting data from "invoice_action_log" */
export type Invoice_Action_Log_Order_By = {
  action?: InputMaybe<Order_By>;
  action_comment?: InputMaybe<Order_By>;
  action_detail?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  invoice_action_id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "invoice_action_log" */
export type Invoice_Action_Log_Pk_Columns_Input = {
  invoice_action_id: Scalars['String'];
};

/** select columns of table "invoice_action_log" */
export enum Invoice_Action_Log_Select_Column {
  /** column name */
  Action = 'action',
  /** column name */
  ActionComment = 'action_comment',
  /** column name */
  ActionDetail = 'action_detail',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceActionId = 'invoice_action_id',
  /** column name */
  InvoiceId = 'invoice_id',
  /** column name */
  PaymentSequenceNumber = 'payment_sequence_number',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "invoice_action_log" */
export type Invoice_Action_Log_Set_Input = {
  action?: InputMaybe<Scalars['String']>;
  action_comment?: InputMaybe<Scalars['String']>;
  action_detail?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_action_id?: InputMaybe<Scalars['String']>;
  invoice_id?: InputMaybe<Scalars['String']>;
  payment_sequence_number?: InputMaybe<Scalars['Int']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Invoice_Action_Log_Stddev_Fields = {
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Stddev_Order_By = {
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Invoice_Action_Log_Stddev_Pop_Fields = {
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Stddev_Pop_Order_By = {
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Invoice_Action_Log_Stddev_Samp_Fields = {
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Stddev_Samp_Order_By = {
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Invoice_Action_Log_Sum_Fields = {
  payment_sequence_number?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Sum_Order_By = {
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** update columns of table "invoice_action_log" */
export enum Invoice_Action_Log_Update_Column {
  /** column name */
  Action = 'action',
  /** column name */
  ActionComment = 'action_comment',
  /** column name */
  ActionDetail = 'action_detail',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceActionId = 'invoice_action_id',
  /** column name */
  InvoiceId = 'invoice_id',
  /** column name */
  PaymentSequenceNumber = 'payment_sequence_number',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** aggregate var_pop on columns */
export type Invoice_Action_Log_Var_Pop_Fields = {
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Var_Pop_Order_By = {
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Invoice_Action_Log_Var_Samp_Fields = {
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Var_Samp_Order_By = {
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Invoice_Action_Log_Variance_Fields = {
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "invoice_action_log" */
export type Invoice_Action_Log_Variance_Order_By = {
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregated selection of "invoice" */
export type Invoice_Aggregate = {
  aggregate?: Maybe<Invoice_Aggregate_Fields>;
  nodes: Array<Invoice>;
};

/** aggregate fields of "invoice" */
export type Invoice_Aggregate_Fields = {
  avg?: Maybe<Invoice_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Invoice_Max_Fields>;
  min?: Maybe<Invoice_Min_Fields>;
  stddev?: Maybe<Invoice_Stddev_Fields>;
  stddev_pop?: Maybe<Invoice_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Invoice_Stddev_Samp_Fields>;
  sum?: Maybe<Invoice_Sum_Fields>;
  var_pop?: Maybe<Invoice_Var_Pop_Fields>;
  var_samp?: Maybe<Invoice_Var_Samp_Fields>;
  variance?: Maybe<Invoice_Variance_Fields>;
};


/** aggregate fields of "invoice" */
export type Invoice_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invoice_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "invoice" */
export type Invoice_Aggregate_Order_By = {
  avg?: InputMaybe<Invoice_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Invoice_Max_Order_By>;
  min?: InputMaybe<Invoice_Min_Order_By>;
  stddev?: InputMaybe<Invoice_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Invoice_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Invoice_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Invoice_Sum_Order_By>;
  var_pop?: InputMaybe<Invoice_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Invoice_Var_Samp_Order_By>;
  variance?: InputMaybe<Invoice_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "invoice" */
export type Invoice_Arr_Rel_Insert_Input = {
  data: Array<Invoice_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_On_Conflict>;
};

/** aggregate avg on columns */
export type Invoice_Avg_Fields = {
  invoice_sequence_number?: Maybe<Scalars['Float']>;
  sub_total?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "invoice" */
export type Invoice_Avg_Order_By = {
  invoice_sequence_number?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
};

/** columns and relationships of "invoice_bill_item" */
export type Invoice_Bill_Item = {
  bill_item_sequence_number: Scalars['Int'];
  created_at: Scalars['timestamptz'];
  invoice_bill_item_id: Scalars['String'];
  invoice_id: Scalars['String'];
  past_billing_status: Scalars['String'];
  resource_path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "invoice_bill_item" */
export type Invoice_Bill_Item_Aggregate = {
  aggregate?: Maybe<Invoice_Bill_Item_Aggregate_Fields>;
  nodes: Array<Invoice_Bill_Item>;
};

/** aggregate fields of "invoice_bill_item" */
export type Invoice_Bill_Item_Aggregate_Fields = {
  avg?: Maybe<Invoice_Bill_Item_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Invoice_Bill_Item_Max_Fields>;
  min?: Maybe<Invoice_Bill_Item_Min_Fields>;
  stddev?: Maybe<Invoice_Bill_Item_Stddev_Fields>;
  stddev_pop?: Maybe<Invoice_Bill_Item_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Invoice_Bill_Item_Stddev_Samp_Fields>;
  sum?: Maybe<Invoice_Bill_Item_Sum_Fields>;
  var_pop?: Maybe<Invoice_Bill_Item_Var_Pop_Fields>;
  var_samp?: Maybe<Invoice_Bill_Item_Var_Samp_Fields>;
  variance?: Maybe<Invoice_Bill_Item_Variance_Fields>;
};


/** aggregate fields of "invoice_bill_item" */
export type Invoice_Bill_Item_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invoice_Bill_Item_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "invoice_bill_item" */
export type Invoice_Bill_Item_Aggregate_Order_By = {
  avg?: InputMaybe<Invoice_Bill_Item_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Invoice_Bill_Item_Max_Order_By>;
  min?: InputMaybe<Invoice_Bill_Item_Min_Order_By>;
  stddev?: InputMaybe<Invoice_Bill_Item_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Invoice_Bill_Item_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Invoice_Bill_Item_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Invoice_Bill_Item_Sum_Order_By>;
  var_pop?: InputMaybe<Invoice_Bill_Item_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Invoice_Bill_Item_Var_Samp_Order_By>;
  variance?: InputMaybe<Invoice_Bill_Item_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "invoice_bill_item" */
export type Invoice_Bill_Item_Arr_Rel_Insert_Input = {
  data: Array<Invoice_Bill_Item_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Bill_Item_On_Conflict>;
};

/** aggregate avg on columns */
export type Invoice_Bill_Item_Avg_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Avg_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "invoice_bill_item". All fields are combined with a logical 'AND'. */
export type Invoice_Bill_Item_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Invoice_Bill_Item_Bool_Exp>>>;
  _not?: InputMaybe<Invoice_Bill_Item_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Invoice_Bill_Item_Bool_Exp>>>;
  bill_item_sequence_number?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  invoice_bill_item_id?: InputMaybe<String_Comparison_Exp>;
  invoice_id?: InputMaybe<String_Comparison_Exp>;
  past_billing_status?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "invoice_bill_item" */
export enum Invoice_Bill_Item_Constraint {
  /** unique or primary key constraint */
  InvoiceBillItemPk = 'invoice_bill_item_pk'
}

/** input type for incrementing integer column in table "invoice_bill_item" */
export type Invoice_Bill_Item_Inc_Input = {
  bill_item_sequence_number?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "invoice_bill_item" */
export type Invoice_Bill_Item_Insert_Input = {
  bill_item_sequence_number?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_bill_item_id?: InputMaybe<Scalars['String']>;
  invoice_id?: InputMaybe<Scalars['String']>;
  past_billing_status?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Invoice_Bill_Item_Max_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_bill_item_id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  past_billing_status?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Max_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  invoice_bill_item_id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  past_billing_status?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Invoice_Bill_Item_Min_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_bill_item_id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  past_billing_status?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Min_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  invoice_bill_item_id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  past_billing_status?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "invoice_bill_item" */
export type Invoice_Bill_Item_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Invoice_Bill_Item>;
};

/** input type for inserting object relation for remote table "invoice_bill_item" */
export type Invoice_Bill_Item_Obj_Rel_Insert_Input = {
  data: Invoice_Bill_Item_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Bill_Item_On_Conflict>;
};

/** on conflict condition type for table "invoice_bill_item" */
export type Invoice_Bill_Item_On_Conflict = {
  constraint: Invoice_Bill_Item_Constraint;
  update_columns: Array<Invoice_Bill_Item_Update_Column>;
  where?: InputMaybe<Invoice_Bill_Item_Bool_Exp>;
};

/** ordering options when selecting data from "invoice_bill_item" */
export type Invoice_Bill_Item_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  invoice_bill_item_id?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  past_billing_status?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "invoice_bill_item" */
export type Invoice_Bill_Item_Pk_Columns_Input = {
  invoice_bill_item_id: Scalars['String'];
};

/** select columns of table "invoice_bill_item" */
export enum Invoice_Bill_Item_Select_Column {
  /** column name */
  BillItemSequenceNumber = 'bill_item_sequence_number',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceBillItemId = 'invoice_bill_item_id',
  /** column name */
  InvoiceId = 'invoice_id',
  /** column name */
  PastBillingStatus = 'past_billing_status',
  /** column name */
  ResourcePath = 'resource_path'
}

/** input type for updating data in table "invoice_bill_item" */
export type Invoice_Bill_Item_Set_Input = {
  bill_item_sequence_number?: InputMaybe<Scalars['Int']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_bill_item_id?: InputMaybe<Scalars['String']>;
  invoice_id?: InputMaybe<Scalars['String']>;
  past_billing_status?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
};

/** aggregate stddev on columns */
export type Invoice_Bill_Item_Stddev_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Stddev_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Invoice_Bill_Item_Stddev_Pop_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Stddev_Pop_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Invoice_Bill_Item_Stddev_Samp_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Stddev_Samp_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Invoice_Bill_Item_Sum_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Sum_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
};

/** update columns of table "invoice_bill_item" */
export enum Invoice_Bill_Item_Update_Column {
  /** column name */
  BillItemSequenceNumber = 'bill_item_sequence_number',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceBillItemId = 'invoice_bill_item_id',
  /** column name */
  InvoiceId = 'invoice_id',
  /** column name */
  PastBillingStatus = 'past_billing_status',
  /** column name */
  ResourcePath = 'resource_path'
}

/** aggregate var_pop on columns */
export type Invoice_Bill_Item_Var_Pop_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Var_Pop_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Invoice_Bill_Item_Var_Samp_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Var_Samp_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Invoice_Bill_Item_Variance_Fields = {
  bill_item_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "invoice_bill_item" */
export type Invoice_Bill_Item_Variance_Order_By = {
  bill_item_sequence_number?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "invoice". All fields are combined with a logical 'AND'. */
export type Invoice_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Invoice_Bool_Exp>>>;
  _not?: InputMaybe<Invoice_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Invoice_Bool_Exp>>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  invoice_id?: InputMaybe<String_Comparison_Exp>;
  invoice_sequence_number?: InputMaybe<Int_Comparison_Exp>;
  is_exported?: InputMaybe<Boolean_Comparison_Exp>;
  payments?: InputMaybe<Payment_Bool_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  student?: InputMaybe<Students_Bool_Exp>;
  student_id?: InputMaybe<String_Comparison_Exp>;
  sub_total?: InputMaybe<Numeric_Comparison_Exp>;
  total?: InputMaybe<Numeric_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_access_paths?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** unique or primary key constraints on table "invoice" */
export enum Invoice_Constraint {
  /** unique or primary key constraint */
  InvoicePk = 'invoice_pk',
  /** unique or primary key constraint */
  InvoiceSequenceNumberResourcePathUnique = 'invoice_sequence_number_resource_path_unique'
}

/** input type for incrementing integer column in table "invoice" */
export type Invoice_Inc_Input = {
  invoice_sequence_number?: InputMaybe<Scalars['Int']>;
  sub_total?: InputMaybe<Scalars['numeric']>;
  total?: InputMaybe<Scalars['numeric']>;
};

/** input type for inserting data into table "invoice" */
export type Invoice_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_id?: InputMaybe<Scalars['String']>;
  invoice_sequence_number?: InputMaybe<Scalars['Int']>;
  is_exported?: InputMaybe<Scalars['Boolean']>;
  payments?: InputMaybe<Payment_Arr_Rel_Insert_Input>;
  resource_path?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  student?: InputMaybe<Students_Obj_Rel_Insert_Input>;
  student_id?: InputMaybe<Scalars['String']>;
  sub_total?: InputMaybe<Scalars['numeric']>;
  total?: InputMaybe<Scalars['numeric']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_access_paths?: InputMaybe<User_Access_Paths_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Invoice_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_id?: Maybe<Scalars['String']>;
  invoice_sequence_number?: Maybe<Scalars['Int']>;
  resource_path?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  sub_total?: Maybe<Scalars['numeric']>;
  total?: Maybe<Scalars['numeric']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "invoice" */
export type Invoice_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  invoice_sequence_number?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Invoice_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_id?: Maybe<Scalars['String']>;
  invoice_sequence_number?: Maybe<Scalars['Int']>;
  resource_path?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  sub_total?: Maybe<Scalars['numeric']>;
  total?: Maybe<Scalars['numeric']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "invoice" */
export type Invoice_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  invoice_sequence_number?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "invoice" */
export type Invoice_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Invoice>;
};

/** input type for inserting object relation for remote table "invoice" */
export type Invoice_Obj_Rel_Insert_Input = {
  data: Invoice_Insert_Input;
  on_conflict?: InputMaybe<Invoice_On_Conflict>;
};

/** on conflict condition type for table "invoice" */
export type Invoice_On_Conflict = {
  constraint: Invoice_Constraint;
  update_columns: Array<Invoice_Update_Column>;
  where?: InputMaybe<Invoice_Bool_Exp>;
};

/** ordering options when selecting data from "invoice" */
export type Invoice_Order_By = {
  created_at?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  invoice_sequence_number?: InputMaybe<Order_By>;
  is_exported?: InputMaybe<Order_By>;
  payments_aggregate?: InputMaybe<Payment_Aggregate_Order_By>;
  resource_path?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  student?: InputMaybe<Students_Order_By>;
  student_id?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_access_paths_aggregate?: InputMaybe<User_Access_Paths_Aggregate_Order_By>;
};

/** primary key columns input for table: "invoice" */
export type Invoice_Pk_Columns_Input = {
  invoice_id: Scalars['String'];
};

/** columns and relationships of "invoice_schedule" */
export type Invoice_Schedule = {
  created_at: Scalars['timestamptz'];
  invoice_date: Scalars['timestamptz'];
  /** An object relationship */
  invoice_schedule_history?: Maybe<Invoice_Schedule_History>;
  invoice_schedule_id: Scalars['String'];
  is_archived?: Maybe<Scalars['Boolean']>;
  remarks?: Maybe<Scalars['String']>;
  resource_path: Scalars['String'];
  status: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  user_id: Scalars['String'];
};

/** aggregated selection of "invoice_schedule" */
export type Invoice_Schedule_Aggregate = {
  aggregate?: Maybe<Invoice_Schedule_Aggregate_Fields>;
  nodes: Array<Invoice_Schedule>;
};

/** aggregate fields of "invoice_schedule" */
export type Invoice_Schedule_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Invoice_Schedule_Max_Fields>;
  min?: Maybe<Invoice_Schedule_Min_Fields>;
};


/** aggregate fields of "invoice_schedule" */
export type Invoice_Schedule_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invoice_Schedule_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "invoice_schedule" */
export type Invoice_Schedule_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Invoice_Schedule_Max_Order_By>;
  min?: InputMaybe<Invoice_Schedule_Min_Order_By>;
};

/** input type for inserting array relation for remote table "invoice_schedule" */
export type Invoice_Schedule_Arr_Rel_Insert_Input = {
  data: Array<Invoice_Schedule_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Schedule_On_Conflict>;
};

/** Boolean expression to filter rows from the table "invoice_schedule". All fields are combined with a logical 'AND'. */
export type Invoice_Schedule_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Invoice_Schedule_Bool_Exp>>>;
  _not?: InputMaybe<Invoice_Schedule_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Invoice_Schedule_Bool_Exp>>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  invoice_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  invoice_schedule_history?: InputMaybe<Invoice_Schedule_History_Bool_Exp>;
  invoice_schedule_id?: InputMaybe<String_Comparison_Exp>;
  is_archived?: InputMaybe<Boolean_Comparison_Exp>;
  remarks?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "invoice_schedule" */
export enum Invoice_Schedule_Constraint {
  /** unique or primary key constraint */
  InvoiceSchedulePk = 'invoice_schedule_pk'
}

/** columns and relationships of "invoice_schedule_history" */
export type Invoice_Schedule_History = {
  created_at: Scalars['timestamptz'];
  execution_end_date: Scalars['timestamptz'];
  execution_start_date: Scalars['timestamptz'];
  invoice_schedule_history_id: Scalars['String'];
  invoice_schedule_id: Scalars['String'];
  number_of_failed_invoices: Scalars['Int'];
  resource_path?: Maybe<Scalars['String']>;
  total_students: Scalars['Int'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "invoice_schedule_history" */
export type Invoice_Schedule_History_Aggregate = {
  aggregate?: Maybe<Invoice_Schedule_History_Aggregate_Fields>;
  nodes: Array<Invoice_Schedule_History>;
};

/** aggregate fields of "invoice_schedule_history" */
export type Invoice_Schedule_History_Aggregate_Fields = {
  avg?: Maybe<Invoice_Schedule_History_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Invoice_Schedule_History_Max_Fields>;
  min?: Maybe<Invoice_Schedule_History_Min_Fields>;
  stddev?: Maybe<Invoice_Schedule_History_Stddev_Fields>;
  stddev_pop?: Maybe<Invoice_Schedule_History_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Invoice_Schedule_History_Stddev_Samp_Fields>;
  sum?: Maybe<Invoice_Schedule_History_Sum_Fields>;
  var_pop?: Maybe<Invoice_Schedule_History_Var_Pop_Fields>;
  var_samp?: Maybe<Invoice_Schedule_History_Var_Samp_Fields>;
  variance?: Maybe<Invoice_Schedule_History_Variance_Fields>;
};


/** aggregate fields of "invoice_schedule_history" */
export type Invoice_Schedule_History_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invoice_Schedule_History_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Aggregate_Order_By = {
  avg?: InputMaybe<Invoice_Schedule_History_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Invoice_Schedule_History_Max_Order_By>;
  min?: InputMaybe<Invoice_Schedule_History_Min_Order_By>;
  stddev?: InputMaybe<Invoice_Schedule_History_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Invoice_Schedule_History_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Invoice_Schedule_History_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Invoice_Schedule_History_Sum_Order_By>;
  var_pop?: InputMaybe<Invoice_Schedule_History_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Invoice_Schedule_History_Var_Samp_Order_By>;
  variance?: InputMaybe<Invoice_Schedule_History_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "invoice_schedule_history" */
export type Invoice_Schedule_History_Arr_Rel_Insert_Input = {
  data: Array<Invoice_Schedule_History_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Schedule_History_On_Conflict>;
};

/** aggregate avg on columns */
export type Invoice_Schedule_History_Avg_Fields = {
  number_of_failed_invoices?: Maybe<Scalars['Float']>;
  total_students?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Avg_Order_By = {
  number_of_failed_invoices?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "invoice_schedule_history". All fields are combined with a logical 'AND'. */
export type Invoice_Schedule_History_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Invoice_Schedule_History_Bool_Exp>>>;
  _not?: InputMaybe<Invoice_Schedule_History_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Invoice_Schedule_History_Bool_Exp>>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  execution_end_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  execution_start_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  invoice_schedule_history_id?: InputMaybe<String_Comparison_Exp>;
  invoice_schedule_id?: InputMaybe<String_Comparison_Exp>;
  number_of_failed_invoices?: InputMaybe<Int_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  total_students?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "invoice_schedule_history" */
export enum Invoice_Schedule_History_Constraint {
  /** unique or primary key constraint */
  InvoiceScheduleHistoryInvoiceScheduleIdKey = 'invoice_schedule_history_invoice_schedule_id_key',
  /** unique or primary key constraint */
  InvoiceScheduleHistoryPk = 'invoice_schedule_history_pk'
}

/** input type for incrementing integer column in table "invoice_schedule_history" */
export type Invoice_Schedule_History_Inc_Input = {
  number_of_failed_invoices?: InputMaybe<Scalars['Int']>;
  total_students?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "invoice_schedule_history" */
export type Invoice_Schedule_History_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  execution_end_date?: InputMaybe<Scalars['timestamptz']>;
  execution_start_date?: InputMaybe<Scalars['timestamptz']>;
  invoice_schedule_history_id?: InputMaybe<Scalars['String']>;
  invoice_schedule_id?: InputMaybe<Scalars['String']>;
  number_of_failed_invoices?: InputMaybe<Scalars['Int']>;
  resource_path?: InputMaybe<Scalars['String']>;
  total_students?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Invoice_Schedule_History_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  execution_end_date?: Maybe<Scalars['timestamptz']>;
  execution_start_date?: Maybe<Scalars['timestamptz']>;
  invoice_schedule_history_id?: Maybe<Scalars['String']>;
  invoice_schedule_id?: Maybe<Scalars['String']>;
  number_of_failed_invoices?: Maybe<Scalars['Int']>;
  resource_path?: Maybe<Scalars['String']>;
  total_students?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  execution_end_date?: InputMaybe<Order_By>;
  execution_start_date?: InputMaybe<Order_By>;
  invoice_schedule_history_id?: InputMaybe<Order_By>;
  invoice_schedule_id?: InputMaybe<Order_By>;
  number_of_failed_invoices?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Invoice_Schedule_History_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  execution_end_date?: Maybe<Scalars['timestamptz']>;
  execution_start_date?: Maybe<Scalars['timestamptz']>;
  invoice_schedule_history_id?: Maybe<Scalars['String']>;
  invoice_schedule_id?: Maybe<Scalars['String']>;
  number_of_failed_invoices?: Maybe<Scalars['Int']>;
  resource_path?: Maybe<Scalars['String']>;
  total_students?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  execution_end_date?: InputMaybe<Order_By>;
  execution_start_date?: InputMaybe<Order_By>;
  invoice_schedule_history_id?: InputMaybe<Order_By>;
  invoice_schedule_id?: InputMaybe<Order_By>;
  number_of_failed_invoices?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "invoice_schedule_history" */
export type Invoice_Schedule_History_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Invoice_Schedule_History>;
};

/** input type for inserting object relation for remote table "invoice_schedule_history" */
export type Invoice_Schedule_History_Obj_Rel_Insert_Input = {
  data: Invoice_Schedule_History_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Schedule_History_On_Conflict>;
};

/** on conflict condition type for table "invoice_schedule_history" */
export type Invoice_Schedule_History_On_Conflict = {
  constraint: Invoice_Schedule_History_Constraint;
  update_columns: Array<Invoice_Schedule_History_Update_Column>;
  where?: InputMaybe<Invoice_Schedule_History_Bool_Exp>;
};

/** ordering options when selecting data from "invoice_schedule_history" */
export type Invoice_Schedule_History_Order_By = {
  created_at?: InputMaybe<Order_By>;
  execution_end_date?: InputMaybe<Order_By>;
  execution_start_date?: InputMaybe<Order_By>;
  invoice_schedule_history_id?: InputMaybe<Order_By>;
  invoice_schedule_id?: InputMaybe<Order_By>;
  number_of_failed_invoices?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "invoice_schedule_history" */
export type Invoice_Schedule_History_Pk_Columns_Input = {
  invoice_schedule_history_id: Scalars['String'];
};

/** select columns of table "invoice_schedule_history" */
export enum Invoice_Schedule_History_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExecutionEndDate = 'execution_end_date',
  /** column name */
  ExecutionStartDate = 'execution_start_date',
  /** column name */
  InvoiceScheduleHistoryId = 'invoice_schedule_history_id',
  /** column name */
  InvoiceScheduleId = 'invoice_schedule_id',
  /** column name */
  NumberOfFailedInvoices = 'number_of_failed_invoices',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  TotalStudents = 'total_students',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "invoice_schedule_history" */
export type Invoice_Schedule_History_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  execution_end_date?: InputMaybe<Scalars['timestamptz']>;
  execution_start_date?: InputMaybe<Scalars['timestamptz']>;
  invoice_schedule_history_id?: InputMaybe<Scalars['String']>;
  invoice_schedule_id?: InputMaybe<Scalars['String']>;
  number_of_failed_invoices?: InputMaybe<Scalars['Int']>;
  resource_path?: InputMaybe<Scalars['String']>;
  total_students?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Invoice_Schedule_History_Stddev_Fields = {
  number_of_failed_invoices?: Maybe<Scalars['Float']>;
  total_students?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Stddev_Order_By = {
  number_of_failed_invoices?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Invoice_Schedule_History_Stddev_Pop_Fields = {
  number_of_failed_invoices?: Maybe<Scalars['Float']>;
  total_students?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Stddev_Pop_Order_By = {
  number_of_failed_invoices?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Invoice_Schedule_History_Stddev_Samp_Fields = {
  number_of_failed_invoices?: Maybe<Scalars['Float']>;
  total_students?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Stddev_Samp_Order_By = {
  number_of_failed_invoices?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Invoice_Schedule_History_Sum_Fields = {
  number_of_failed_invoices?: Maybe<Scalars['Int']>;
  total_students?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Sum_Order_By = {
  number_of_failed_invoices?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
};

/** update columns of table "invoice_schedule_history" */
export enum Invoice_Schedule_History_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ExecutionEndDate = 'execution_end_date',
  /** column name */
  ExecutionStartDate = 'execution_start_date',
  /** column name */
  InvoiceScheduleHistoryId = 'invoice_schedule_history_id',
  /** column name */
  InvoiceScheduleId = 'invoice_schedule_id',
  /** column name */
  NumberOfFailedInvoices = 'number_of_failed_invoices',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  TotalStudents = 'total_students',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Invoice_Schedule_History_Var_Pop_Fields = {
  number_of_failed_invoices?: Maybe<Scalars['Float']>;
  total_students?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Var_Pop_Order_By = {
  number_of_failed_invoices?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Invoice_Schedule_History_Var_Samp_Fields = {
  number_of_failed_invoices?: Maybe<Scalars['Float']>;
  total_students?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Var_Samp_Order_By = {
  number_of_failed_invoices?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Invoice_Schedule_History_Variance_Fields = {
  number_of_failed_invoices?: Maybe<Scalars['Float']>;
  total_students?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "invoice_schedule_history" */
export type Invoice_Schedule_History_Variance_Order_By = {
  number_of_failed_invoices?: InputMaybe<Order_By>;
  total_students?: InputMaybe<Order_By>;
};

/** input type for inserting data into table "invoice_schedule" */
export type Invoice_Schedule_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_date?: InputMaybe<Scalars['timestamptz']>;
  invoice_schedule_history?: InputMaybe<Invoice_Schedule_History_Obj_Rel_Insert_Input>;
  invoice_schedule_id?: InputMaybe<Scalars['String']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  remarks?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Invoice_Schedule_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_date?: Maybe<Scalars['timestamptz']>;
  invoice_schedule_id?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "invoice_schedule" */
export type Invoice_Schedule_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  invoice_date?: InputMaybe<Order_By>;
  invoice_schedule_id?: InputMaybe<Order_By>;
  remarks?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Invoice_Schedule_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_date?: Maybe<Scalars['timestamptz']>;
  invoice_schedule_id?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "invoice_schedule" */
export type Invoice_Schedule_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  invoice_date?: InputMaybe<Order_By>;
  invoice_schedule_id?: InputMaybe<Order_By>;
  remarks?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "invoice_schedule" */
export type Invoice_Schedule_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Invoice_Schedule>;
};

/** input type for inserting object relation for remote table "invoice_schedule" */
export type Invoice_Schedule_Obj_Rel_Insert_Input = {
  data: Invoice_Schedule_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Schedule_On_Conflict>;
};

/** on conflict condition type for table "invoice_schedule" */
export type Invoice_Schedule_On_Conflict = {
  constraint: Invoice_Schedule_Constraint;
  update_columns: Array<Invoice_Schedule_Update_Column>;
  where?: InputMaybe<Invoice_Schedule_Bool_Exp>;
};

/** ordering options when selecting data from "invoice_schedule" */
export type Invoice_Schedule_Order_By = {
  created_at?: InputMaybe<Order_By>;
  invoice_date?: InputMaybe<Order_By>;
  invoice_schedule_history?: InputMaybe<Invoice_Schedule_History_Order_By>;
  invoice_schedule_id?: InputMaybe<Order_By>;
  is_archived?: InputMaybe<Order_By>;
  remarks?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "invoice_schedule" */
export type Invoice_Schedule_Pk_Columns_Input = {
  invoice_schedule_id: Scalars['String'];
};

/** select columns of table "invoice_schedule" */
export enum Invoice_Schedule_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceDate = 'invoice_date',
  /** column name */
  InvoiceScheduleId = 'invoice_schedule_id',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  Remarks = 'remarks',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "invoice_schedule" */
export type Invoice_Schedule_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_date?: InputMaybe<Scalars['timestamptz']>;
  invoice_schedule_id?: InputMaybe<Scalars['String']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  remarks?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "invoice_schedule_student" */
export type Invoice_Schedule_Student = {
  actual_error_details?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  error_details: Scalars['String'];
  invoice_schedule_history_id: Scalars['String'];
  invoice_schedule_student_id: Scalars['String'];
  resource_path: Scalars['String'];
  student_id: Scalars['String'];
};

/** aggregated selection of "invoice_schedule_student" */
export type Invoice_Schedule_Student_Aggregate = {
  aggregate?: Maybe<Invoice_Schedule_Student_Aggregate_Fields>;
  nodes: Array<Invoice_Schedule_Student>;
};

/** aggregate fields of "invoice_schedule_student" */
export type Invoice_Schedule_Student_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Invoice_Schedule_Student_Max_Fields>;
  min?: Maybe<Invoice_Schedule_Student_Min_Fields>;
};


/** aggregate fields of "invoice_schedule_student" */
export type Invoice_Schedule_Student_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invoice_Schedule_Student_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "invoice_schedule_student" */
export type Invoice_Schedule_Student_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Invoice_Schedule_Student_Max_Order_By>;
  min?: InputMaybe<Invoice_Schedule_Student_Min_Order_By>;
};

/** input type for inserting array relation for remote table "invoice_schedule_student" */
export type Invoice_Schedule_Student_Arr_Rel_Insert_Input = {
  data: Array<Invoice_Schedule_Student_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Schedule_Student_On_Conflict>;
};

/** Boolean expression to filter rows from the table "invoice_schedule_student". All fields are combined with a logical 'AND'. */
export type Invoice_Schedule_Student_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Invoice_Schedule_Student_Bool_Exp>>>;
  _not?: InputMaybe<Invoice_Schedule_Student_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Invoice_Schedule_Student_Bool_Exp>>>;
  actual_error_details?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  error_details?: InputMaybe<String_Comparison_Exp>;
  invoice_schedule_history_id?: InputMaybe<String_Comparison_Exp>;
  invoice_schedule_student_id?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  student_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "invoice_schedule_student" */
export enum Invoice_Schedule_Student_Constraint {
  /** unique or primary key constraint */
  InvoiceScheduleStudentPk = 'invoice_schedule_student_pk'
}

/** input type for inserting data into table "invoice_schedule_student" */
export type Invoice_Schedule_Student_Insert_Input = {
  actual_error_details?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  error_details?: InputMaybe<Scalars['String']>;
  invoice_schedule_history_id?: InputMaybe<Scalars['String']>;
  invoice_schedule_student_id?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Invoice_Schedule_Student_Max_Fields = {
  actual_error_details?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  error_details?: Maybe<Scalars['String']>;
  invoice_schedule_history_id?: Maybe<Scalars['String']>;
  invoice_schedule_student_id?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "invoice_schedule_student" */
export type Invoice_Schedule_Student_Max_Order_By = {
  actual_error_details?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  error_details?: InputMaybe<Order_By>;
  invoice_schedule_history_id?: InputMaybe<Order_By>;
  invoice_schedule_student_id?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Invoice_Schedule_Student_Min_Fields = {
  actual_error_details?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  error_details?: Maybe<Scalars['String']>;
  invoice_schedule_history_id?: Maybe<Scalars['String']>;
  invoice_schedule_student_id?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "invoice_schedule_student" */
export type Invoice_Schedule_Student_Min_Order_By = {
  actual_error_details?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  error_details?: InputMaybe<Order_By>;
  invoice_schedule_history_id?: InputMaybe<Order_By>;
  invoice_schedule_student_id?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "invoice_schedule_student" */
export type Invoice_Schedule_Student_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Invoice_Schedule_Student>;
};

/** input type for inserting object relation for remote table "invoice_schedule_student" */
export type Invoice_Schedule_Student_Obj_Rel_Insert_Input = {
  data: Invoice_Schedule_Student_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Schedule_Student_On_Conflict>;
};

/** on conflict condition type for table "invoice_schedule_student" */
export type Invoice_Schedule_Student_On_Conflict = {
  constraint: Invoice_Schedule_Student_Constraint;
  update_columns: Array<Invoice_Schedule_Student_Update_Column>;
  where?: InputMaybe<Invoice_Schedule_Student_Bool_Exp>;
};

/** ordering options when selecting data from "invoice_schedule_student" */
export type Invoice_Schedule_Student_Order_By = {
  actual_error_details?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  error_details?: InputMaybe<Order_By>;
  invoice_schedule_history_id?: InputMaybe<Order_By>;
  invoice_schedule_student_id?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "invoice_schedule_student" */
export type Invoice_Schedule_Student_Pk_Columns_Input = {
  invoice_schedule_student_id: Scalars['String'];
};

/** select columns of table "invoice_schedule_student" */
export enum Invoice_Schedule_Student_Select_Column {
  /** column name */
  ActualErrorDetails = 'actual_error_details',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ErrorDetails = 'error_details',
  /** column name */
  InvoiceScheduleHistoryId = 'invoice_schedule_history_id',
  /** column name */
  InvoiceScheduleStudentId = 'invoice_schedule_student_id',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id'
}

/** input type for updating data in table "invoice_schedule_student" */
export type Invoice_Schedule_Student_Set_Input = {
  actual_error_details?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  error_details?: InputMaybe<Scalars['String']>;
  invoice_schedule_history_id?: InputMaybe<Scalars['String']>;
  invoice_schedule_student_id?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
};

/** update columns of table "invoice_schedule_student" */
export enum Invoice_Schedule_Student_Update_Column {
  /** column name */
  ActualErrorDetails = 'actual_error_details',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ErrorDetails = 'error_details',
  /** column name */
  InvoiceScheduleHistoryId = 'invoice_schedule_history_id',
  /** column name */
  InvoiceScheduleStudentId = 'invoice_schedule_student_id',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id'
}

/** update columns of table "invoice_schedule" */
export enum Invoice_Schedule_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceDate = 'invoice_date',
  /** column name */
  InvoiceScheduleId = 'invoice_schedule_id',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  Remarks = 'remarks',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** select columns of table "invoice" */
export enum Invoice_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceId = 'invoice_id',
  /** column name */
  InvoiceSequenceNumber = 'invoice_sequence_number',
  /** column name */
  IsExported = 'is_exported',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  Status = 'status',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  SubTotal = 'sub_total',
  /** column name */
  Total = 'total',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "invoice" */
export type Invoice_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_id?: InputMaybe<Scalars['String']>;
  invoice_sequence_number?: InputMaybe<Scalars['Int']>;
  is_exported?: InputMaybe<Scalars['Boolean']>;
  resource_path?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  sub_total?: InputMaybe<Scalars['numeric']>;
  total?: InputMaybe<Scalars['numeric']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Invoice_Stddev_Fields = {
  invoice_sequence_number?: Maybe<Scalars['Float']>;
  sub_total?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "invoice" */
export type Invoice_Stddev_Order_By = {
  invoice_sequence_number?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Invoice_Stddev_Pop_Fields = {
  invoice_sequence_number?: Maybe<Scalars['Float']>;
  sub_total?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "invoice" */
export type Invoice_Stddev_Pop_Order_By = {
  invoice_sequence_number?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Invoice_Stddev_Samp_Fields = {
  invoice_sequence_number?: Maybe<Scalars['Float']>;
  sub_total?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "invoice" */
export type Invoice_Stddev_Samp_Order_By = {
  invoice_sequence_number?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Invoice_Sum_Fields = {
  invoice_sequence_number?: Maybe<Scalars['Int']>;
  sub_total?: Maybe<Scalars['numeric']>;
  total?: Maybe<Scalars['numeric']>;
};

/** order by sum() on columns of table "invoice" */
export type Invoice_Sum_Order_By = {
  invoice_sequence_number?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
};

/** update columns of table "invoice" */
export enum Invoice_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceId = 'invoice_id',
  /** column name */
  InvoiceSequenceNumber = 'invoice_sequence_number',
  /** column name */
  IsExported = 'is_exported',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  Status = 'status',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  SubTotal = 'sub_total',
  /** column name */
  Total = 'total',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Invoice_Var_Pop_Fields = {
  invoice_sequence_number?: Maybe<Scalars['Float']>;
  sub_total?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "invoice" */
export type Invoice_Var_Pop_Order_By = {
  invoice_sequence_number?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Invoice_Var_Samp_Fields = {
  invoice_sequence_number?: Maybe<Scalars['Float']>;
  sub_total?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "invoice" */
export type Invoice_Var_Samp_Order_By = {
  invoice_sequence_number?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Invoice_Variance_Fields = {
  invoice_sequence_number?: Maybe<Scalars['Float']>;
  sub_total?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "invoice" */
export type Invoice_Variance_Order_By = {
  invoice_sequence_number?: InputMaybe<Order_By>;
  sub_total?: InputMaybe<Order_By>;
  total?: InputMaybe<Order_By>;
};

/** expression to compare columns of type jsonb. All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
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

/** mutation root */
export type Mutation_Root = {
  /** delete data from the table: "bank" */
  delete_bank?: Maybe<Bank_Mutation_Response>;
  /** delete data from the table: "bank_account" */
  delete_bank_account?: Maybe<Bank_Account_Mutation_Response>;
  /** delete single row from the table: "bank_account" */
  delete_bank_account_by_pk?: Maybe<Bank_Account>;
  /** delete data from the table: "bank_branch" */
  delete_bank_branch?: Maybe<Bank_Branch_Mutation_Response>;
  /** delete single row from the table: "bank_branch" */
  delete_bank_branch_by_pk?: Maybe<Bank_Branch>;
  /** delete single row from the table: "bank" */
  delete_bank_by_pk?: Maybe<Bank>;
  /** delete data from the table: "bank_mapping" */
  delete_bank_mapping?: Maybe<Bank_Mapping_Mutation_Response>;
  /** delete single row from the table: "bank_mapping" */
  delete_bank_mapping_by_pk?: Maybe<Bank_Mapping>;
  /** delete data from the table: "bill_item" */
  delete_bill_item?: Maybe<Bill_Item_Mutation_Response>;
  /** delete single row from the table: "bill_item" */
  delete_bill_item_by_pk?: Maybe<Bill_Item>;
  /** delete data from the table: "billing_address" */
  delete_billing_address?: Maybe<Billing_Address_Mutation_Response>;
  /** delete single row from the table: "billing_address" */
  delete_billing_address_by_pk?: Maybe<Billing_Address>;
  /** delete data from the table: "bulk_payment_request" */
  delete_bulk_payment_request?: Maybe<Bulk_Payment_Request_Mutation_Response>;
  /** delete single row from the table: "bulk_payment_request" */
  delete_bulk_payment_request_by_pk?: Maybe<Bulk_Payment_Request>;
  /** delete data from the table: "bulk_payment_request_file" */
  delete_bulk_payment_request_file?: Maybe<Bulk_Payment_Request_File_Mutation_Response>;
  /** delete single row from the table: "bulk_payment_request_file" */
  delete_bulk_payment_request_file_by_pk?: Maybe<Bulk_Payment_Request_File>;
  /** delete data from the table: "bulk_payment_validations" */
  delete_bulk_payment_validations?: Maybe<Bulk_Payment_Validations_Mutation_Response>;
  /** delete single row from the table: "bulk_payment_validations" */
  delete_bulk_payment_validations_by_pk?: Maybe<Bulk_Payment_Validations>;
  /** delete data from the table: "invoice" */
  delete_invoice?: Maybe<Invoice_Mutation_Response>;
  /** delete data from the table: "invoice_action_log" */
  delete_invoice_action_log?: Maybe<Invoice_Action_Log_Mutation_Response>;
  /** delete single row from the table: "invoice_action_log" */
  delete_invoice_action_log_by_pk?: Maybe<Invoice_Action_Log>;
  /** delete data from the table: "invoice_bill_item" */
  delete_invoice_bill_item?: Maybe<Invoice_Bill_Item_Mutation_Response>;
  /** delete single row from the table: "invoice_bill_item" */
  delete_invoice_bill_item_by_pk?: Maybe<Invoice_Bill_Item>;
  /** delete single row from the table: "invoice" */
  delete_invoice_by_pk?: Maybe<Invoice>;
  /** delete data from the table: "invoice_schedule" */
  delete_invoice_schedule?: Maybe<Invoice_Schedule_Mutation_Response>;
  /** delete single row from the table: "invoice_schedule" */
  delete_invoice_schedule_by_pk?: Maybe<Invoice_Schedule>;
  /** delete data from the table: "invoice_schedule_history" */
  delete_invoice_schedule_history?: Maybe<Invoice_Schedule_History_Mutation_Response>;
  /** delete single row from the table: "invoice_schedule_history" */
  delete_invoice_schedule_history_by_pk?: Maybe<Invoice_Schedule_History>;
  /** delete data from the table: "invoice_schedule_student" */
  delete_invoice_schedule_student?: Maybe<Invoice_Schedule_Student_Mutation_Response>;
  /** delete single row from the table: "invoice_schedule_student" */
  delete_invoice_schedule_student_by_pk?: Maybe<Invoice_Schedule_Student>;
  /** delete data from the table: "partner_convenience_store" */
  delete_partner_convenience_store?: Maybe<Partner_Convenience_Store_Mutation_Response>;
  /** delete single row from the table: "partner_convenience_store" */
  delete_partner_convenience_store_by_pk?: Maybe<Partner_Convenience_Store>;
  /** delete data from the table: "payment" */
  delete_payment?: Maybe<Payment_Mutation_Response>;
  /** delete single row from the table: "payment" */
  delete_payment_by_pk?: Maybe<Payment>;
  /** delete data from the table: "prefecture" */
  delete_prefecture?: Maybe<Prefecture_Mutation_Response>;
  /** delete single row from the table: "prefecture" */
  delete_prefecture_by_pk?: Maybe<Prefecture>;
  /** delete data from the table: "student_payment_detail" */
  delete_student_payment_detail?: Maybe<Student_Payment_Detail_Mutation_Response>;
  /** delete single row from the table: "student_payment_detail" */
  delete_student_payment_detail_by_pk?: Maybe<Student_Payment_Detail>;
  /** delete data from the table: "students" */
  delete_students?: Maybe<Students_Mutation_Response>;
  /** delete single row from the table: "students" */
  delete_students_by_pk?: Maybe<Students>;
  /** delete data from the table: "user_access_paths" */
  delete_user_access_paths?: Maybe<User_Access_Paths_Mutation_Response>;
  /** delete single row from the table: "user_access_paths" */
  delete_user_access_paths_by_pk?: Maybe<User_Access_Paths>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "bank" */
  insert_bank?: Maybe<Bank_Mutation_Response>;
  /** insert data into the table: "bank_account" */
  insert_bank_account?: Maybe<Bank_Account_Mutation_Response>;
  /** insert a single row into the table: "bank_account" */
  insert_bank_account_one?: Maybe<Bank_Account>;
  /** insert data into the table: "bank_branch" */
  insert_bank_branch?: Maybe<Bank_Branch_Mutation_Response>;
  /** insert a single row into the table: "bank_branch" */
  insert_bank_branch_one?: Maybe<Bank_Branch>;
  /** insert data into the table: "bank_mapping" */
  insert_bank_mapping?: Maybe<Bank_Mapping_Mutation_Response>;
  /** insert a single row into the table: "bank_mapping" */
  insert_bank_mapping_one?: Maybe<Bank_Mapping>;
  /** insert a single row into the table: "bank" */
  insert_bank_one?: Maybe<Bank>;
  /** insert data into the table: "bill_item" */
  insert_bill_item?: Maybe<Bill_Item_Mutation_Response>;
  /** insert a single row into the table: "bill_item" */
  insert_bill_item_one?: Maybe<Bill_Item>;
  /** insert data into the table: "billing_address" */
  insert_billing_address?: Maybe<Billing_Address_Mutation_Response>;
  /** insert a single row into the table: "billing_address" */
  insert_billing_address_one?: Maybe<Billing_Address>;
  /** insert data into the table: "bulk_payment_request" */
  insert_bulk_payment_request?: Maybe<Bulk_Payment_Request_Mutation_Response>;
  /** insert data into the table: "bulk_payment_request_file" */
  insert_bulk_payment_request_file?: Maybe<Bulk_Payment_Request_File_Mutation_Response>;
  /** insert a single row into the table: "bulk_payment_request_file" */
  insert_bulk_payment_request_file_one?: Maybe<Bulk_Payment_Request_File>;
  /** insert a single row into the table: "bulk_payment_request" */
  insert_bulk_payment_request_one?: Maybe<Bulk_Payment_Request>;
  /** insert data into the table: "bulk_payment_validations" */
  insert_bulk_payment_validations?: Maybe<Bulk_Payment_Validations_Mutation_Response>;
  /** insert a single row into the table: "bulk_payment_validations" */
  insert_bulk_payment_validations_one?: Maybe<Bulk_Payment_Validations>;
  /** insert data into the table: "invoice" */
  insert_invoice?: Maybe<Invoice_Mutation_Response>;
  /** insert data into the table: "invoice_action_log" */
  insert_invoice_action_log?: Maybe<Invoice_Action_Log_Mutation_Response>;
  /** insert a single row into the table: "invoice_action_log" */
  insert_invoice_action_log_one?: Maybe<Invoice_Action_Log>;
  /** insert data into the table: "invoice_bill_item" */
  insert_invoice_bill_item?: Maybe<Invoice_Bill_Item_Mutation_Response>;
  /** insert a single row into the table: "invoice_bill_item" */
  insert_invoice_bill_item_one?: Maybe<Invoice_Bill_Item>;
  /** insert a single row into the table: "invoice" */
  insert_invoice_one?: Maybe<Invoice>;
  /** insert data into the table: "invoice_schedule" */
  insert_invoice_schedule?: Maybe<Invoice_Schedule_Mutation_Response>;
  /** insert data into the table: "invoice_schedule_history" */
  insert_invoice_schedule_history?: Maybe<Invoice_Schedule_History_Mutation_Response>;
  /** insert a single row into the table: "invoice_schedule_history" */
  insert_invoice_schedule_history_one?: Maybe<Invoice_Schedule_History>;
  /** insert a single row into the table: "invoice_schedule" */
  insert_invoice_schedule_one?: Maybe<Invoice_Schedule>;
  /** insert data into the table: "invoice_schedule_student" */
  insert_invoice_schedule_student?: Maybe<Invoice_Schedule_Student_Mutation_Response>;
  /** insert a single row into the table: "invoice_schedule_student" */
  insert_invoice_schedule_student_one?: Maybe<Invoice_Schedule_Student>;
  /** insert data into the table: "partner_convenience_store" */
  insert_partner_convenience_store?: Maybe<Partner_Convenience_Store_Mutation_Response>;
  /** insert a single row into the table: "partner_convenience_store" */
  insert_partner_convenience_store_one?: Maybe<Partner_Convenience_Store>;
  /** insert data into the table: "payment" */
  insert_payment?: Maybe<Payment_Mutation_Response>;
  /** insert a single row into the table: "payment" */
  insert_payment_one?: Maybe<Payment>;
  /** insert data into the table: "prefecture" */
  insert_prefecture?: Maybe<Prefecture_Mutation_Response>;
  /** insert a single row into the table: "prefecture" */
  insert_prefecture_one?: Maybe<Prefecture>;
  /** insert data into the table: "student_payment_detail" */
  insert_student_payment_detail?: Maybe<Student_Payment_Detail_Mutation_Response>;
  /** insert a single row into the table: "student_payment_detail" */
  insert_student_payment_detail_one?: Maybe<Student_Payment_Detail>;
  /** insert data into the table: "students" */
  insert_students?: Maybe<Students_Mutation_Response>;
  /** insert a single row into the table: "students" */
  insert_students_one?: Maybe<Students>;
  /** insert data into the table: "user_access_paths" */
  insert_user_access_paths?: Maybe<User_Access_Paths_Mutation_Response>;
  /** insert a single row into the table: "user_access_paths" */
  insert_user_access_paths_one?: Maybe<User_Access_Paths>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** update data of the table: "bank" */
  update_bank?: Maybe<Bank_Mutation_Response>;
  /** update data of the table: "bank_account" */
  update_bank_account?: Maybe<Bank_Account_Mutation_Response>;
  /** update single row of the table: "bank_account" */
  update_bank_account_by_pk?: Maybe<Bank_Account>;
  /** update data of the table: "bank_branch" */
  update_bank_branch?: Maybe<Bank_Branch_Mutation_Response>;
  /** update single row of the table: "bank_branch" */
  update_bank_branch_by_pk?: Maybe<Bank_Branch>;
  /** update single row of the table: "bank" */
  update_bank_by_pk?: Maybe<Bank>;
  /** update data of the table: "bank_mapping" */
  update_bank_mapping?: Maybe<Bank_Mapping_Mutation_Response>;
  /** update single row of the table: "bank_mapping" */
  update_bank_mapping_by_pk?: Maybe<Bank_Mapping>;
  /** update data of the table: "bill_item" */
  update_bill_item?: Maybe<Bill_Item_Mutation_Response>;
  /** update single row of the table: "bill_item" */
  update_bill_item_by_pk?: Maybe<Bill_Item>;
  /** update data of the table: "billing_address" */
  update_billing_address?: Maybe<Billing_Address_Mutation_Response>;
  /** update single row of the table: "billing_address" */
  update_billing_address_by_pk?: Maybe<Billing_Address>;
  /** update data of the table: "bulk_payment_request" */
  update_bulk_payment_request?: Maybe<Bulk_Payment_Request_Mutation_Response>;
  /** update single row of the table: "bulk_payment_request" */
  update_bulk_payment_request_by_pk?: Maybe<Bulk_Payment_Request>;
  /** update data of the table: "bulk_payment_request_file" */
  update_bulk_payment_request_file?: Maybe<Bulk_Payment_Request_File_Mutation_Response>;
  /** update single row of the table: "bulk_payment_request_file" */
  update_bulk_payment_request_file_by_pk?: Maybe<Bulk_Payment_Request_File>;
  /** update data of the table: "bulk_payment_validations" */
  update_bulk_payment_validations?: Maybe<Bulk_Payment_Validations_Mutation_Response>;
  /** update single row of the table: "bulk_payment_validations" */
  update_bulk_payment_validations_by_pk?: Maybe<Bulk_Payment_Validations>;
  /** update data of the table: "invoice" */
  update_invoice?: Maybe<Invoice_Mutation_Response>;
  /** update data of the table: "invoice_action_log" */
  update_invoice_action_log?: Maybe<Invoice_Action_Log_Mutation_Response>;
  /** update single row of the table: "invoice_action_log" */
  update_invoice_action_log_by_pk?: Maybe<Invoice_Action_Log>;
  /** update data of the table: "invoice_bill_item" */
  update_invoice_bill_item?: Maybe<Invoice_Bill_Item_Mutation_Response>;
  /** update single row of the table: "invoice_bill_item" */
  update_invoice_bill_item_by_pk?: Maybe<Invoice_Bill_Item>;
  /** update single row of the table: "invoice" */
  update_invoice_by_pk?: Maybe<Invoice>;
  /** update data of the table: "invoice_schedule" */
  update_invoice_schedule?: Maybe<Invoice_Schedule_Mutation_Response>;
  /** update single row of the table: "invoice_schedule" */
  update_invoice_schedule_by_pk?: Maybe<Invoice_Schedule>;
  /** update data of the table: "invoice_schedule_history" */
  update_invoice_schedule_history?: Maybe<Invoice_Schedule_History_Mutation_Response>;
  /** update single row of the table: "invoice_schedule_history" */
  update_invoice_schedule_history_by_pk?: Maybe<Invoice_Schedule_History>;
  /** update data of the table: "invoice_schedule_student" */
  update_invoice_schedule_student?: Maybe<Invoice_Schedule_Student_Mutation_Response>;
  /** update single row of the table: "invoice_schedule_student" */
  update_invoice_schedule_student_by_pk?: Maybe<Invoice_Schedule_Student>;
  /** update data of the table: "partner_convenience_store" */
  update_partner_convenience_store?: Maybe<Partner_Convenience_Store_Mutation_Response>;
  /** update single row of the table: "partner_convenience_store" */
  update_partner_convenience_store_by_pk?: Maybe<Partner_Convenience_Store>;
  /** update data of the table: "payment" */
  update_payment?: Maybe<Payment_Mutation_Response>;
  /** update single row of the table: "payment" */
  update_payment_by_pk?: Maybe<Payment>;
  /** update data of the table: "prefecture" */
  update_prefecture?: Maybe<Prefecture_Mutation_Response>;
  /** update single row of the table: "prefecture" */
  update_prefecture_by_pk?: Maybe<Prefecture>;
  /** update data of the table: "student_payment_detail" */
  update_student_payment_detail?: Maybe<Student_Payment_Detail_Mutation_Response>;
  /** update single row of the table: "student_payment_detail" */
  update_student_payment_detail_by_pk?: Maybe<Student_Payment_Detail>;
  /** update data of the table: "students" */
  update_students?: Maybe<Students_Mutation_Response>;
  /** update single row of the table: "students" */
  update_students_by_pk?: Maybe<Students>;
  /** update data of the table: "user_access_paths" */
  update_user_access_paths?: Maybe<User_Access_Paths_Mutation_Response>;
  /** update single row of the table: "user_access_paths" */
  update_user_access_paths_by_pk?: Maybe<User_Access_Paths>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
};


/** mutation root */
export type Mutation_RootDelete_BankArgs = {
  where: Bank_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bank_AccountArgs = {
  where: Bank_Account_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bank_Account_By_PkArgs = {
  bank_account_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Bank_BranchArgs = {
  where: Bank_Branch_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bank_Branch_By_PkArgs = {
  bank_branch_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Bank_By_PkArgs = {
  bank_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Bank_MappingArgs = {
  where: Bank_Mapping_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bank_Mapping_By_PkArgs = {
  bank_mapping_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Bill_ItemArgs = {
  where: Bill_Item_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bill_Item_By_PkArgs = {
  bill_item_sequence_number: Scalars['Int'];
  order_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Billing_AddressArgs = {
  where: Billing_Address_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Billing_Address_By_PkArgs = {
  billing_address_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Bulk_Payment_RequestArgs = {
  where: Bulk_Payment_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bulk_Payment_Request_By_PkArgs = {
  bulk_payment_request_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Bulk_Payment_Request_FileArgs = {
  where: Bulk_Payment_Request_File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bulk_Payment_Request_File_By_PkArgs = {
  bulk_payment_request_file_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Bulk_Payment_ValidationsArgs = {
  where: Bulk_Payment_Validations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bulk_Payment_Validations_By_PkArgs = {
  bulk_payment_validations_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_InvoiceArgs = {
  where: Invoice_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invoice_Action_LogArgs = {
  where: Invoice_Action_Log_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invoice_Action_Log_By_PkArgs = {
  invoice_action_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Invoice_Bill_ItemArgs = {
  where: Invoice_Bill_Item_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invoice_Bill_Item_By_PkArgs = {
  invoice_bill_item_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Invoice_By_PkArgs = {
  invoice_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Invoice_ScheduleArgs = {
  where: Invoice_Schedule_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invoice_Schedule_By_PkArgs = {
  invoice_schedule_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Invoice_Schedule_HistoryArgs = {
  where: Invoice_Schedule_History_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invoice_Schedule_History_By_PkArgs = {
  invoice_schedule_history_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Invoice_Schedule_StudentArgs = {
  where: Invoice_Schedule_Student_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Invoice_Schedule_Student_By_PkArgs = {
  invoice_schedule_student_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Partner_Convenience_StoreArgs = {
  where: Partner_Convenience_Store_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Partner_Convenience_Store_By_PkArgs = {
  partner_convenience_store_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_PaymentArgs = {
  where: Payment_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Payment_By_PkArgs = {
  payment_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_PrefectureArgs = {
  where: Prefecture_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Prefecture_By_PkArgs = {
  prefecture_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Student_Payment_DetailArgs = {
  where: Student_Payment_Detail_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Student_Payment_Detail_By_PkArgs = {
  student_payment_detail_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_StudentsArgs = {
  where: Students_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Students_By_PkArgs = {
  student_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_User_Access_PathsArgs = {
  where: User_Access_Paths_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Access_Paths_By_PkArgs = {
  location_id: Scalars['String'];
  user_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  user_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootInsert_BankArgs = {
  objects: Array<Bank_Insert_Input>;
  on_conflict?: InputMaybe<Bank_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bank_AccountArgs = {
  objects: Array<Bank_Account_Insert_Input>;
  on_conflict?: InputMaybe<Bank_Account_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bank_Account_OneArgs = {
  object: Bank_Account_Insert_Input;
  on_conflict?: InputMaybe<Bank_Account_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bank_BranchArgs = {
  objects: Array<Bank_Branch_Insert_Input>;
  on_conflict?: InputMaybe<Bank_Branch_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bank_Branch_OneArgs = {
  object: Bank_Branch_Insert_Input;
  on_conflict?: InputMaybe<Bank_Branch_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bank_MappingArgs = {
  objects: Array<Bank_Mapping_Insert_Input>;
  on_conflict?: InputMaybe<Bank_Mapping_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bank_Mapping_OneArgs = {
  object: Bank_Mapping_Insert_Input;
  on_conflict?: InputMaybe<Bank_Mapping_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bank_OneArgs = {
  object: Bank_Insert_Input;
  on_conflict?: InputMaybe<Bank_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bill_ItemArgs = {
  objects: Array<Bill_Item_Insert_Input>;
  on_conflict?: InputMaybe<Bill_Item_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bill_Item_OneArgs = {
  object: Bill_Item_Insert_Input;
  on_conflict?: InputMaybe<Bill_Item_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Billing_AddressArgs = {
  objects: Array<Billing_Address_Insert_Input>;
  on_conflict?: InputMaybe<Billing_Address_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Billing_Address_OneArgs = {
  object: Billing_Address_Insert_Input;
  on_conflict?: InputMaybe<Billing_Address_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bulk_Payment_RequestArgs = {
  objects: Array<Bulk_Payment_Request_Insert_Input>;
  on_conflict?: InputMaybe<Bulk_Payment_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bulk_Payment_Request_FileArgs = {
  objects: Array<Bulk_Payment_Request_File_Insert_Input>;
  on_conflict?: InputMaybe<Bulk_Payment_Request_File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bulk_Payment_Request_File_OneArgs = {
  object: Bulk_Payment_Request_File_Insert_Input;
  on_conflict?: InputMaybe<Bulk_Payment_Request_File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bulk_Payment_Request_OneArgs = {
  object: Bulk_Payment_Request_Insert_Input;
  on_conflict?: InputMaybe<Bulk_Payment_Request_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bulk_Payment_ValidationsArgs = {
  objects: Array<Bulk_Payment_Validations_Insert_Input>;
  on_conflict?: InputMaybe<Bulk_Payment_Validations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bulk_Payment_Validations_OneArgs = {
  object: Bulk_Payment_Validations_Insert_Input;
  on_conflict?: InputMaybe<Bulk_Payment_Validations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_InvoiceArgs = {
  objects: Array<Invoice_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_Action_LogArgs = {
  objects: Array<Invoice_Action_Log_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Action_Log_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_Action_Log_OneArgs = {
  object: Invoice_Action_Log_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Action_Log_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_Bill_ItemArgs = {
  objects: Array<Invoice_Bill_Item_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Bill_Item_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_Bill_Item_OneArgs = {
  object: Invoice_Bill_Item_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Bill_Item_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_OneArgs = {
  object: Invoice_Insert_Input;
  on_conflict?: InputMaybe<Invoice_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_ScheduleArgs = {
  objects: Array<Invoice_Schedule_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Schedule_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_Schedule_HistoryArgs = {
  objects: Array<Invoice_Schedule_History_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Schedule_History_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_Schedule_History_OneArgs = {
  object: Invoice_Schedule_History_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Schedule_History_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_Schedule_OneArgs = {
  object: Invoice_Schedule_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Schedule_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_Schedule_StudentArgs = {
  objects: Array<Invoice_Schedule_Student_Insert_Input>;
  on_conflict?: InputMaybe<Invoice_Schedule_Student_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Invoice_Schedule_Student_OneArgs = {
  object: Invoice_Schedule_Student_Insert_Input;
  on_conflict?: InputMaybe<Invoice_Schedule_Student_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Partner_Convenience_StoreArgs = {
  objects: Array<Partner_Convenience_Store_Insert_Input>;
  on_conflict?: InputMaybe<Partner_Convenience_Store_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Partner_Convenience_Store_OneArgs = {
  object: Partner_Convenience_Store_Insert_Input;
  on_conflict?: InputMaybe<Partner_Convenience_Store_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PaymentArgs = {
  objects: Array<Payment_Insert_Input>;
  on_conflict?: InputMaybe<Payment_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Payment_OneArgs = {
  object: Payment_Insert_Input;
  on_conflict?: InputMaybe<Payment_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PrefectureArgs = {
  objects: Array<Prefecture_Insert_Input>;
  on_conflict?: InputMaybe<Prefecture_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Prefecture_OneArgs = {
  object: Prefecture_Insert_Input;
  on_conflict?: InputMaybe<Prefecture_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Student_Payment_DetailArgs = {
  objects: Array<Student_Payment_Detail_Insert_Input>;
  on_conflict?: InputMaybe<Student_Payment_Detail_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Student_Payment_Detail_OneArgs = {
  object: Student_Payment_Detail_Insert_Input;
  on_conflict?: InputMaybe<Student_Payment_Detail_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_StudentsArgs = {
  objects: Array<Students_Insert_Input>;
  on_conflict?: InputMaybe<Students_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Students_OneArgs = {
  object: Students_Insert_Input;
  on_conflict?: InputMaybe<Students_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Access_PathsArgs = {
  objects: Array<User_Access_Paths_Insert_Input>;
  on_conflict?: InputMaybe<User_Access_Paths_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Access_Paths_OneArgs = {
  object: User_Access_Paths_Insert_Input;
  on_conflict?: InputMaybe<User_Access_Paths_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_BankArgs = {
  _set?: InputMaybe<Bank_Set_Input>;
  where: Bank_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bank_AccountArgs = {
  _set?: InputMaybe<Bank_Account_Set_Input>;
  where: Bank_Account_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bank_Account_By_PkArgs = {
  _set?: InputMaybe<Bank_Account_Set_Input>;
  pk_columns: Bank_Account_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bank_BranchArgs = {
  _set?: InputMaybe<Bank_Branch_Set_Input>;
  where: Bank_Branch_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bank_Branch_By_PkArgs = {
  _set?: InputMaybe<Bank_Branch_Set_Input>;
  pk_columns: Bank_Branch_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bank_By_PkArgs = {
  _set?: InputMaybe<Bank_Set_Input>;
  pk_columns: Bank_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bank_MappingArgs = {
  _set?: InputMaybe<Bank_Mapping_Set_Input>;
  where: Bank_Mapping_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bank_Mapping_By_PkArgs = {
  _set?: InputMaybe<Bank_Mapping_Set_Input>;
  pk_columns: Bank_Mapping_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bill_ItemArgs = {
  _append?: InputMaybe<Bill_Item_Append_Input>;
  _delete_at_path?: InputMaybe<Bill_Item_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Bill_Item_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Bill_Item_Delete_Key_Input>;
  _inc?: InputMaybe<Bill_Item_Inc_Input>;
  _prepend?: InputMaybe<Bill_Item_Prepend_Input>;
  _set?: InputMaybe<Bill_Item_Set_Input>;
  where: Bill_Item_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bill_Item_By_PkArgs = {
  _append?: InputMaybe<Bill_Item_Append_Input>;
  _delete_at_path?: InputMaybe<Bill_Item_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Bill_Item_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Bill_Item_Delete_Key_Input>;
  _inc?: InputMaybe<Bill_Item_Inc_Input>;
  _prepend?: InputMaybe<Bill_Item_Prepend_Input>;
  _set?: InputMaybe<Bill_Item_Set_Input>;
  pk_columns: Bill_Item_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Billing_AddressArgs = {
  _set?: InputMaybe<Billing_Address_Set_Input>;
  where: Billing_Address_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Billing_Address_By_PkArgs = {
  _set?: InputMaybe<Billing_Address_Set_Input>;
  pk_columns: Billing_Address_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bulk_Payment_RequestArgs = {
  _set?: InputMaybe<Bulk_Payment_Request_Set_Input>;
  where: Bulk_Payment_Request_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bulk_Payment_Request_By_PkArgs = {
  _set?: InputMaybe<Bulk_Payment_Request_Set_Input>;
  pk_columns: Bulk_Payment_Request_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bulk_Payment_Request_FileArgs = {
  _inc?: InputMaybe<Bulk_Payment_Request_File_Inc_Input>;
  _set?: InputMaybe<Bulk_Payment_Request_File_Set_Input>;
  where: Bulk_Payment_Request_File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bulk_Payment_Request_File_By_PkArgs = {
  _inc?: InputMaybe<Bulk_Payment_Request_File_Inc_Input>;
  _set?: InputMaybe<Bulk_Payment_Request_File_Set_Input>;
  pk_columns: Bulk_Payment_Request_File_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bulk_Payment_ValidationsArgs = {
  _inc?: InputMaybe<Bulk_Payment_Validations_Inc_Input>;
  _set?: InputMaybe<Bulk_Payment_Validations_Set_Input>;
  where: Bulk_Payment_Validations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bulk_Payment_Validations_By_PkArgs = {
  _inc?: InputMaybe<Bulk_Payment_Validations_Inc_Input>;
  _set?: InputMaybe<Bulk_Payment_Validations_Set_Input>;
  pk_columns: Bulk_Payment_Validations_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_InvoiceArgs = {
  _inc?: InputMaybe<Invoice_Inc_Input>;
  _set?: InputMaybe<Invoice_Set_Input>;
  where: Invoice_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_Action_LogArgs = {
  _inc?: InputMaybe<Invoice_Action_Log_Inc_Input>;
  _set?: InputMaybe<Invoice_Action_Log_Set_Input>;
  where: Invoice_Action_Log_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_Action_Log_By_PkArgs = {
  _inc?: InputMaybe<Invoice_Action_Log_Inc_Input>;
  _set?: InputMaybe<Invoice_Action_Log_Set_Input>;
  pk_columns: Invoice_Action_Log_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_Bill_ItemArgs = {
  _inc?: InputMaybe<Invoice_Bill_Item_Inc_Input>;
  _set?: InputMaybe<Invoice_Bill_Item_Set_Input>;
  where: Invoice_Bill_Item_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_Bill_Item_By_PkArgs = {
  _inc?: InputMaybe<Invoice_Bill_Item_Inc_Input>;
  _set?: InputMaybe<Invoice_Bill_Item_Set_Input>;
  pk_columns: Invoice_Bill_Item_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_By_PkArgs = {
  _inc?: InputMaybe<Invoice_Inc_Input>;
  _set?: InputMaybe<Invoice_Set_Input>;
  pk_columns: Invoice_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_ScheduleArgs = {
  _set?: InputMaybe<Invoice_Schedule_Set_Input>;
  where: Invoice_Schedule_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_Schedule_By_PkArgs = {
  _set?: InputMaybe<Invoice_Schedule_Set_Input>;
  pk_columns: Invoice_Schedule_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_Schedule_HistoryArgs = {
  _inc?: InputMaybe<Invoice_Schedule_History_Inc_Input>;
  _set?: InputMaybe<Invoice_Schedule_History_Set_Input>;
  where: Invoice_Schedule_History_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_Schedule_History_By_PkArgs = {
  _inc?: InputMaybe<Invoice_Schedule_History_Inc_Input>;
  _set?: InputMaybe<Invoice_Schedule_History_Set_Input>;
  pk_columns: Invoice_Schedule_History_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_Schedule_StudentArgs = {
  _set?: InputMaybe<Invoice_Schedule_Student_Set_Input>;
  where: Invoice_Schedule_Student_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Invoice_Schedule_Student_By_PkArgs = {
  _set?: InputMaybe<Invoice_Schedule_Student_Set_Input>;
  pk_columns: Invoice_Schedule_Student_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Partner_Convenience_StoreArgs = {
  _inc?: InputMaybe<Partner_Convenience_Store_Inc_Input>;
  _set?: InputMaybe<Partner_Convenience_Store_Set_Input>;
  where: Partner_Convenience_Store_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Partner_Convenience_Store_By_PkArgs = {
  _inc?: InputMaybe<Partner_Convenience_Store_Inc_Input>;
  _set?: InputMaybe<Partner_Convenience_Store_Set_Input>;
  pk_columns: Partner_Convenience_Store_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_PaymentArgs = {
  _inc?: InputMaybe<Payment_Inc_Input>;
  _set?: InputMaybe<Payment_Set_Input>;
  where: Payment_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Payment_By_PkArgs = {
  _inc?: InputMaybe<Payment_Inc_Input>;
  _set?: InputMaybe<Payment_Set_Input>;
  pk_columns: Payment_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_PrefectureArgs = {
  _set?: InputMaybe<Prefecture_Set_Input>;
  where: Prefecture_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Prefecture_By_PkArgs = {
  _set?: InputMaybe<Prefecture_Set_Input>;
  pk_columns: Prefecture_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Student_Payment_DetailArgs = {
  _set?: InputMaybe<Student_Payment_Detail_Set_Input>;
  where: Student_Payment_Detail_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Student_Payment_Detail_By_PkArgs = {
  _set?: InputMaybe<Student_Payment_Detail_Set_Input>;
  pk_columns: Student_Payment_Detail_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_StudentsArgs = {
  _inc?: InputMaybe<Students_Inc_Input>;
  _set?: InputMaybe<Students_Set_Input>;
  where: Students_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Students_By_PkArgs = {
  _inc?: InputMaybe<Students_Inc_Input>;
  _set?: InputMaybe<Students_Set_Input>;
  pk_columns: Students_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Access_PathsArgs = {
  _set?: InputMaybe<User_Access_Paths_Set_Input>;
  where: User_Access_Paths_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Access_Paths_By_PkArgs = {
  _set?: InputMaybe<User_Access_Paths_Set_Input>;
  pk_columns: User_Access_Paths_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};

/** expression to compare columns of type numeric. All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
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
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "partner_convenience_store" */
export type Partner_Convenience_Store = {
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  company_code: Scalars['Int'];
  company_name: Scalars['String'];
  company_tel_number?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  is_archived?: Maybe<Scalars['Boolean']>;
  manufacturer_code: Scalars['Int'];
  message1?: Maybe<Scalars['String']>;
  message2?: Maybe<Scalars['String']>;
  message3?: Maybe<Scalars['String']>;
  message4?: Maybe<Scalars['String']>;
  message5?: Maybe<Scalars['String']>;
  message6?: Maybe<Scalars['String']>;
  message7?: Maybe<Scalars['String']>;
  message8?: Maybe<Scalars['String']>;
  message9?: Maybe<Scalars['String']>;
  message10?: Maybe<Scalars['String']>;
  message11?: Maybe<Scalars['String']>;
  message12?: Maybe<Scalars['String']>;
  message13?: Maybe<Scalars['String']>;
  message14?: Maybe<Scalars['String']>;
  message15?: Maybe<Scalars['String']>;
  message16?: Maybe<Scalars['String']>;
  message17?: Maybe<Scalars['String']>;
  message18?: Maybe<Scalars['String']>;
  message19?: Maybe<Scalars['String']>;
  message20?: Maybe<Scalars['String']>;
  message21?: Maybe<Scalars['String']>;
  message22?: Maybe<Scalars['String']>;
  message23?: Maybe<Scalars['String']>;
  message24?: Maybe<Scalars['String']>;
  partner_convenience_store_id: Scalars['String'];
  postal_code?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  resource_path: Scalars['String'];
  shop_code?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "partner_convenience_store" */
export type Partner_Convenience_Store_Aggregate = {
  aggregate?: Maybe<Partner_Convenience_Store_Aggregate_Fields>;
  nodes: Array<Partner_Convenience_Store>;
};

/** aggregate fields of "partner_convenience_store" */
export type Partner_Convenience_Store_Aggregate_Fields = {
  avg?: Maybe<Partner_Convenience_Store_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Partner_Convenience_Store_Max_Fields>;
  min?: Maybe<Partner_Convenience_Store_Min_Fields>;
  stddev?: Maybe<Partner_Convenience_Store_Stddev_Fields>;
  stddev_pop?: Maybe<Partner_Convenience_Store_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Partner_Convenience_Store_Stddev_Samp_Fields>;
  sum?: Maybe<Partner_Convenience_Store_Sum_Fields>;
  var_pop?: Maybe<Partner_Convenience_Store_Var_Pop_Fields>;
  var_samp?: Maybe<Partner_Convenience_Store_Var_Samp_Fields>;
  variance?: Maybe<Partner_Convenience_Store_Variance_Fields>;
};


/** aggregate fields of "partner_convenience_store" */
export type Partner_Convenience_Store_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Partner_Convenience_Store_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "partner_convenience_store" */
export type Partner_Convenience_Store_Aggregate_Order_By = {
  avg?: InputMaybe<Partner_Convenience_Store_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Partner_Convenience_Store_Max_Order_By>;
  min?: InputMaybe<Partner_Convenience_Store_Min_Order_By>;
  stddev?: InputMaybe<Partner_Convenience_Store_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Partner_Convenience_Store_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Partner_Convenience_Store_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Partner_Convenience_Store_Sum_Order_By>;
  var_pop?: InputMaybe<Partner_Convenience_Store_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Partner_Convenience_Store_Var_Samp_Order_By>;
  variance?: InputMaybe<Partner_Convenience_Store_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "partner_convenience_store" */
export type Partner_Convenience_Store_Arr_Rel_Insert_Input = {
  data: Array<Partner_Convenience_Store_Insert_Input>;
  on_conflict?: InputMaybe<Partner_Convenience_Store_On_Conflict>;
};

/** aggregate avg on columns */
export type Partner_Convenience_Store_Avg_Fields = {
  company_code?: Maybe<Scalars['Float']>;
  manufacturer_code?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Avg_Order_By = {
  company_code?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "partner_convenience_store". All fields are combined with a logical 'AND'. */
export type Partner_Convenience_Store_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Partner_Convenience_Store_Bool_Exp>>>;
  _not?: InputMaybe<Partner_Convenience_Store_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Partner_Convenience_Store_Bool_Exp>>>;
  address1?: InputMaybe<String_Comparison_Exp>;
  address2?: InputMaybe<String_Comparison_Exp>;
  company_code?: InputMaybe<Int_Comparison_Exp>;
  company_name?: InputMaybe<String_Comparison_Exp>;
  company_tel_number?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  is_archived?: InputMaybe<Boolean_Comparison_Exp>;
  manufacturer_code?: InputMaybe<Int_Comparison_Exp>;
  message1?: InputMaybe<String_Comparison_Exp>;
  message2?: InputMaybe<String_Comparison_Exp>;
  message3?: InputMaybe<String_Comparison_Exp>;
  message4?: InputMaybe<String_Comparison_Exp>;
  message5?: InputMaybe<String_Comparison_Exp>;
  message6?: InputMaybe<String_Comparison_Exp>;
  message7?: InputMaybe<String_Comparison_Exp>;
  message8?: InputMaybe<String_Comparison_Exp>;
  message9?: InputMaybe<String_Comparison_Exp>;
  message10?: InputMaybe<String_Comparison_Exp>;
  message11?: InputMaybe<String_Comparison_Exp>;
  message12?: InputMaybe<String_Comparison_Exp>;
  message13?: InputMaybe<String_Comparison_Exp>;
  message14?: InputMaybe<String_Comparison_Exp>;
  message15?: InputMaybe<String_Comparison_Exp>;
  message16?: InputMaybe<String_Comparison_Exp>;
  message17?: InputMaybe<String_Comparison_Exp>;
  message18?: InputMaybe<String_Comparison_Exp>;
  message19?: InputMaybe<String_Comparison_Exp>;
  message20?: InputMaybe<String_Comparison_Exp>;
  message21?: InputMaybe<String_Comparison_Exp>;
  message22?: InputMaybe<String_Comparison_Exp>;
  message23?: InputMaybe<String_Comparison_Exp>;
  message24?: InputMaybe<String_Comparison_Exp>;
  partner_convenience_store_id?: InputMaybe<String_Comparison_Exp>;
  postal_code?: InputMaybe<String_Comparison_Exp>;
  remarks?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  shop_code?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "partner_convenience_store" */
export enum Partner_Convenience_Store_Constraint {
  /** unique or primary key constraint */
  PartnerConvenienceStorePk = 'partner_convenience_store___pk'
}

/** input type for incrementing integer column in table "partner_convenience_store" */
export type Partner_Convenience_Store_Inc_Input = {
  company_code?: InputMaybe<Scalars['Int']>;
  manufacturer_code?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "partner_convenience_store" */
export type Partner_Convenience_Store_Insert_Input = {
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  company_code?: InputMaybe<Scalars['Int']>;
  company_name?: InputMaybe<Scalars['String']>;
  company_tel_number?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  manufacturer_code?: InputMaybe<Scalars['Int']>;
  message1?: InputMaybe<Scalars['String']>;
  message2?: InputMaybe<Scalars['String']>;
  message3?: InputMaybe<Scalars['String']>;
  message4?: InputMaybe<Scalars['String']>;
  message5?: InputMaybe<Scalars['String']>;
  message6?: InputMaybe<Scalars['String']>;
  message7?: InputMaybe<Scalars['String']>;
  message8?: InputMaybe<Scalars['String']>;
  message9?: InputMaybe<Scalars['String']>;
  message10?: InputMaybe<Scalars['String']>;
  message11?: InputMaybe<Scalars['String']>;
  message12?: InputMaybe<Scalars['String']>;
  message13?: InputMaybe<Scalars['String']>;
  message14?: InputMaybe<Scalars['String']>;
  message15?: InputMaybe<Scalars['String']>;
  message16?: InputMaybe<Scalars['String']>;
  message17?: InputMaybe<Scalars['String']>;
  message18?: InputMaybe<Scalars['String']>;
  message19?: InputMaybe<Scalars['String']>;
  message20?: InputMaybe<Scalars['String']>;
  message21?: InputMaybe<Scalars['String']>;
  message22?: InputMaybe<Scalars['String']>;
  message23?: InputMaybe<Scalars['String']>;
  message24?: InputMaybe<Scalars['String']>;
  partner_convenience_store_id?: InputMaybe<Scalars['String']>;
  postal_code?: InputMaybe<Scalars['String']>;
  remarks?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  shop_code?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Partner_Convenience_Store_Max_Fields = {
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  company_code?: Maybe<Scalars['Int']>;
  company_name?: Maybe<Scalars['String']>;
  company_tel_number?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  manufacturer_code?: Maybe<Scalars['Int']>;
  message1?: Maybe<Scalars['String']>;
  message2?: Maybe<Scalars['String']>;
  message3?: Maybe<Scalars['String']>;
  message4?: Maybe<Scalars['String']>;
  message5?: Maybe<Scalars['String']>;
  message6?: Maybe<Scalars['String']>;
  message7?: Maybe<Scalars['String']>;
  message8?: Maybe<Scalars['String']>;
  message9?: Maybe<Scalars['String']>;
  message10?: Maybe<Scalars['String']>;
  message11?: Maybe<Scalars['String']>;
  message12?: Maybe<Scalars['String']>;
  message13?: Maybe<Scalars['String']>;
  message14?: Maybe<Scalars['String']>;
  message15?: Maybe<Scalars['String']>;
  message16?: Maybe<Scalars['String']>;
  message17?: Maybe<Scalars['String']>;
  message18?: Maybe<Scalars['String']>;
  message19?: Maybe<Scalars['String']>;
  message20?: Maybe<Scalars['String']>;
  message21?: Maybe<Scalars['String']>;
  message22?: Maybe<Scalars['String']>;
  message23?: Maybe<Scalars['String']>;
  message24?: Maybe<Scalars['String']>;
  partner_convenience_store_id?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  shop_code?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Max_Order_By = {
  address1?: InputMaybe<Order_By>;
  address2?: InputMaybe<Order_By>;
  company_code?: InputMaybe<Order_By>;
  company_name?: InputMaybe<Order_By>;
  company_tel_number?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
  message1?: InputMaybe<Order_By>;
  message2?: InputMaybe<Order_By>;
  message3?: InputMaybe<Order_By>;
  message4?: InputMaybe<Order_By>;
  message5?: InputMaybe<Order_By>;
  message6?: InputMaybe<Order_By>;
  message7?: InputMaybe<Order_By>;
  message8?: InputMaybe<Order_By>;
  message9?: InputMaybe<Order_By>;
  message10?: InputMaybe<Order_By>;
  message11?: InputMaybe<Order_By>;
  message12?: InputMaybe<Order_By>;
  message13?: InputMaybe<Order_By>;
  message14?: InputMaybe<Order_By>;
  message15?: InputMaybe<Order_By>;
  message16?: InputMaybe<Order_By>;
  message17?: InputMaybe<Order_By>;
  message18?: InputMaybe<Order_By>;
  message19?: InputMaybe<Order_By>;
  message20?: InputMaybe<Order_By>;
  message21?: InputMaybe<Order_By>;
  message22?: InputMaybe<Order_By>;
  message23?: InputMaybe<Order_By>;
  message24?: InputMaybe<Order_By>;
  partner_convenience_store_id?: InputMaybe<Order_By>;
  postal_code?: InputMaybe<Order_By>;
  remarks?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  shop_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Partner_Convenience_Store_Min_Fields = {
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  company_code?: Maybe<Scalars['Int']>;
  company_name?: Maybe<Scalars['String']>;
  company_tel_number?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  manufacturer_code?: Maybe<Scalars['Int']>;
  message1?: Maybe<Scalars['String']>;
  message2?: Maybe<Scalars['String']>;
  message3?: Maybe<Scalars['String']>;
  message4?: Maybe<Scalars['String']>;
  message5?: Maybe<Scalars['String']>;
  message6?: Maybe<Scalars['String']>;
  message7?: Maybe<Scalars['String']>;
  message8?: Maybe<Scalars['String']>;
  message9?: Maybe<Scalars['String']>;
  message10?: Maybe<Scalars['String']>;
  message11?: Maybe<Scalars['String']>;
  message12?: Maybe<Scalars['String']>;
  message13?: Maybe<Scalars['String']>;
  message14?: Maybe<Scalars['String']>;
  message15?: Maybe<Scalars['String']>;
  message16?: Maybe<Scalars['String']>;
  message17?: Maybe<Scalars['String']>;
  message18?: Maybe<Scalars['String']>;
  message19?: Maybe<Scalars['String']>;
  message20?: Maybe<Scalars['String']>;
  message21?: Maybe<Scalars['String']>;
  message22?: Maybe<Scalars['String']>;
  message23?: Maybe<Scalars['String']>;
  message24?: Maybe<Scalars['String']>;
  partner_convenience_store_id?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  shop_code?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Min_Order_By = {
  address1?: InputMaybe<Order_By>;
  address2?: InputMaybe<Order_By>;
  company_code?: InputMaybe<Order_By>;
  company_name?: InputMaybe<Order_By>;
  company_tel_number?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
  message1?: InputMaybe<Order_By>;
  message2?: InputMaybe<Order_By>;
  message3?: InputMaybe<Order_By>;
  message4?: InputMaybe<Order_By>;
  message5?: InputMaybe<Order_By>;
  message6?: InputMaybe<Order_By>;
  message7?: InputMaybe<Order_By>;
  message8?: InputMaybe<Order_By>;
  message9?: InputMaybe<Order_By>;
  message10?: InputMaybe<Order_By>;
  message11?: InputMaybe<Order_By>;
  message12?: InputMaybe<Order_By>;
  message13?: InputMaybe<Order_By>;
  message14?: InputMaybe<Order_By>;
  message15?: InputMaybe<Order_By>;
  message16?: InputMaybe<Order_By>;
  message17?: InputMaybe<Order_By>;
  message18?: InputMaybe<Order_By>;
  message19?: InputMaybe<Order_By>;
  message20?: InputMaybe<Order_By>;
  message21?: InputMaybe<Order_By>;
  message22?: InputMaybe<Order_By>;
  message23?: InputMaybe<Order_By>;
  message24?: InputMaybe<Order_By>;
  partner_convenience_store_id?: InputMaybe<Order_By>;
  postal_code?: InputMaybe<Order_By>;
  remarks?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  shop_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "partner_convenience_store" */
export type Partner_Convenience_Store_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Partner_Convenience_Store>;
};

/** input type for inserting object relation for remote table "partner_convenience_store" */
export type Partner_Convenience_Store_Obj_Rel_Insert_Input = {
  data: Partner_Convenience_Store_Insert_Input;
  on_conflict?: InputMaybe<Partner_Convenience_Store_On_Conflict>;
};

/** on conflict condition type for table "partner_convenience_store" */
export type Partner_Convenience_Store_On_Conflict = {
  constraint: Partner_Convenience_Store_Constraint;
  update_columns: Array<Partner_Convenience_Store_Update_Column>;
  where?: InputMaybe<Partner_Convenience_Store_Bool_Exp>;
};

/** ordering options when selecting data from "partner_convenience_store" */
export type Partner_Convenience_Store_Order_By = {
  address1?: InputMaybe<Order_By>;
  address2?: InputMaybe<Order_By>;
  company_code?: InputMaybe<Order_By>;
  company_name?: InputMaybe<Order_By>;
  company_tel_number?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  is_archived?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
  message1?: InputMaybe<Order_By>;
  message2?: InputMaybe<Order_By>;
  message3?: InputMaybe<Order_By>;
  message4?: InputMaybe<Order_By>;
  message5?: InputMaybe<Order_By>;
  message6?: InputMaybe<Order_By>;
  message7?: InputMaybe<Order_By>;
  message8?: InputMaybe<Order_By>;
  message9?: InputMaybe<Order_By>;
  message10?: InputMaybe<Order_By>;
  message11?: InputMaybe<Order_By>;
  message12?: InputMaybe<Order_By>;
  message13?: InputMaybe<Order_By>;
  message14?: InputMaybe<Order_By>;
  message15?: InputMaybe<Order_By>;
  message16?: InputMaybe<Order_By>;
  message17?: InputMaybe<Order_By>;
  message18?: InputMaybe<Order_By>;
  message19?: InputMaybe<Order_By>;
  message20?: InputMaybe<Order_By>;
  message21?: InputMaybe<Order_By>;
  message22?: InputMaybe<Order_By>;
  message23?: InputMaybe<Order_By>;
  message24?: InputMaybe<Order_By>;
  partner_convenience_store_id?: InputMaybe<Order_By>;
  postal_code?: InputMaybe<Order_By>;
  remarks?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  shop_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "partner_convenience_store" */
export type Partner_Convenience_Store_Pk_Columns_Input = {
  partner_convenience_store_id: Scalars['String'];
};

/** select columns of table "partner_convenience_store" */
export enum Partner_Convenience_Store_Select_Column {
  /** column name */
  Address1 = 'address1',
  /** column name */
  Address2 = 'address2',
  /** column name */
  CompanyCode = 'company_code',
  /** column name */
  CompanyName = 'company_name',
  /** column name */
  CompanyTelNumber = 'company_tel_number',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  ManufacturerCode = 'manufacturer_code',
  /** column name */
  Message1 = 'message1',
  /** column name */
  Message2 = 'message2',
  /** column name */
  Message3 = 'message3',
  /** column name */
  Message4 = 'message4',
  /** column name */
  Message5 = 'message5',
  /** column name */
  Message6 = 'message6',
  /** column name */
  Message7 = 'message7',
  /** column name */
  Message8 = 'message8',
  /** column name */
  Message9 = 'message9',
  /** column name */
  Message10 = 'message10',
  /** column name */
  Message11 = 'message11',
  /** column name */
  Message12 = 'message12',
  /** column name */
  Message13 = 'message13',
  /** column name */
  Message14 = 'message14',
  /** column name */
  Message15 = 'message15',
  /** column name */
  Message16 = 'message16',
  /** column name */
  Message17 = 'message17',
  /** column name */
  Message18 = 'message18',
  /** column name */
  Message19 = 'message19',
  /** column name */
  Message20 = 'message20',
  /** column name */
  Message21 = 'message21',
  /** column name */
  Message22 = 'message22',
  /** column name */
  Message23 = 'message23',
  /** column name */
  Message24 = 'message24',
  /** column name */
  PartnerConvenienceStoreId = 'partner_convenience_store_id',
  /** column name */
  PostalCode = 'postal_code',
  /** column name */
  Remarks = 'remarks',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  ShopCode = 'shop_code',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "partner_convenience_store" */
export type Partner_Convenience_Store_Set_Input = {
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  company_code?: InputMaybe<Scalars['Int']>;
  company_name?: InputMaybe<Scalars['String']>;
  company_tel_number?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  is_archived?: InputMaybe<Scalars['Boolean']>;
  manufacturer_code?: InputMaybe<Scalars['Int']>;
  message1?: InputMaybe<Scalars['String']>;
  message2?: InputMaybe<Scalars['String']>;
  message3?: InputMaybe<Scalars['String']>;
  message4?: InputMaybe<Scalars['String']>;
  message5?: InputMaybe<Scalars['String']>;
  message6?: InputMaybe<Scalars['String']>;
  message7?: InputMaybe<Scalars['String']>;
  message8?: InputMaybe<Scalars['String']>;
  message9?: InputMaybe<Scalars['String']>;
  message10?: InputMaybe<Scalars['String']>;
  message11?: InputMaybe<Scalars['String']>;
  message12?: InputMaybe<Scalars['String']>;
  message13?: InputMaybe<Scalars['String']>;
  message14?: InputMaybe<Scalars['String']>;
  message15?: InputMaybe<Scalars['String']>;
  message16?: InputMaybe<Scalars['String']>;
  message17?: InputMaybe<Scalars['String']>;
  message18?: InputMaybe<Scalars['String']>;
  message19?: InputMaybe<Scalars['String']>;
  message20?: InputMaybe<Scalars['String']>;
  message21?: InputMaybe<Scalars['String']>;
  message22?: InputMaybe<Scalars['String']>;
  message23?: InputMaybe<Scalars['String']>;
  message24?: InputMaybe<Scalars['String']>;
  partner_convenience_store_id?: InputMaybe<Scalars['String']>;
  postal_code?: InputMaybe<Scalars['String']>;
  remarks?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  shop_code?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Partner_Convenience_Store_Stddev_Fields = {
  company_code?: Maybe<Scalars['Float']>;
  manufacturer_code?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Stddev_Order_By = {
  company_code?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Partner_Convenience_Store_Stddev_Pop_Fields = {
  company_code?: Maybe<Scalars['Float']>;
  manufacturer_code?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Stddev_Pop_Order_By = {
  company_code?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Partner_Convenience_Store_Stddev_Samp_Fields = {
  company_code?: Maybe<Scalars['Float']>;
  manufacturer_code?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Stddev_Samp_Order_By = {
  company_code?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Partner_Convenience_Store_Sum_Fields = {
  company_code?: Maybe<Scalars['Int']>;
  manufacturer_code?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Sum_Order_By = {
  company_code?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
};

/** update columns of table "partner_convenience_store" */
export enum Partner_Convenience_Store_Update_Column {
  /** column name */
  Address1 = 'address1',
  /** column name */
  Address2 = 'address2',
  /** column name */
  CompanyCode = 'company_code',
  /** column name */
  CompanyName = 'company_name',
  /** column name */
  CompanyTelNumber = 'company_tel_number',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  ManufacturerCode = 'manufacturer_code',
  /** column name */
  Message1 = 'message1',
  /** column name */
  Message2 = 'message2',
  /** column name */
  Message3 = 'message3',
  /** column name */
  Message4 = 'message4',
  /** column name */
  Message5 = 'message5',
  /** column name */
  Message6 = 'message6',
  /** column name */
  Message7 = 'message7',
  /** column name */
  Message8 = 'message8',
  /** column name */
  Message9 = 'message9',
  /** column name */
  Message10 = 'message10',
  /** column name */
  Message11 = 'message11',
  /** column name */
  Message12 = 'message12',
  /** column name */
  Message13 = 'message13',
  /** column name */
  Message14 = 'message14',
  /** column name */
  Message15 = 'message15',
  /** column name */
  Message16 = 'message16',
  /** column name */
  Message17 = 'message17',
  /** column name */
  Message18 = 'message18',
  /** column name */
  Message19 = 'message19',
  /** column name */
  Message20 = 'message20',
  /** column name */
  Message21 = 'message21',
  /** column name */
  Message22 = 'message22',
  /** column name */
  Message23 = 'message23',
  /** column name */
  Message24 = 'message24',
  /** column name */
  PartnerConvenienceStoreId = 'partner_convenience_store_id',
  /** column name */
  PostalCode = 'postal_code',
  /** column name */
  Remarks = 'remarks',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  ShopCode = 'shop_code',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Partner_Convenience_Store_Var_Pop_Fields = {
  company_code?: Maybe<Scalars['Float']>;
  manufacturer_code?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Var_Pop_Order_By = {
  company_code?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Partner_Convenience_Store_Var_Samp_Fields = {
  company_code?: Maybe<Scalars['Float']>;
  manufacturer_code?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Var_Samp_Order_By = {
  company_code?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Partner_Convenience_Store_Variance_Fields = {
  company_code?: Maybe<Scalars['Float']>;
  manufacturer_code?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "partner_convenience_store" */
export type Partner_Convenience_Store_Variance_Order_By = {
  company_code?: InputMaybe<Order_By>;
  manufacturer_code?: InputMaybe<Order_By>;
};

/** columns and relationships of "payment" */
export type Payment = {
  amount?: Maybe<Scalars['numeric']>;
  created_at: Scalars['timestamptz'];
  invoice_id: Scalars['String'];
  is_exported?: Maybe<Scalars['Boolean']>;
  payment_date?: Maybe<Scalars['timestamptz']>;
  payment_due_date: Scalars['timestamptz'];
  payment_expiry_date: Scalars['timestamptz'];
  payment_id: Scalars['String'];
  payment_method: Scalars['String'];
  payment_sequence_number?: Maybe<Scalars['Int']>;
  payment_status: Scalars['String'];
  resource_path?: Maybe<Scalars['String']>;
  result?: Maybe<Scalars['String']>;
  result_code?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
  /** An array relationship */
  user_access_paths: Array<User_Access_Paths>;
  /** An aggregated array relationship */
  user_access_paths_aggregate: User_Access_Paths_Aggregate;
};


/** columns and relationships of "payment" */
export type PaymentUser_Access_PathsArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** columns and relationships of "payment" */
export type PaymentUser_Access_Paths_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** aggregated selection of "payment" */
export type Payment_Aggregate = {
  aggregate?: Maybe<Payment_Aggregate_Fields>;
  nodes: Array<Payment>;
};

/** aggregate fields of "payment" */
export type Payment_Aggregate_Fields = {
  avg?: Maybe<Payment_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Payment_Max_Fields>;
  min?: Maybe<Payment_Min_Fields>;
  stddev?: Maybe<Payment_Stddev_Fields>;
  stddev_pop?: Maybe<Payment_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payment_Stddev_Samp_Fields>;
  sum?: Maybe<Payment_Sum_Fields>;
  var_pop?: Maybe<Payment_Var_Pop_Fields>;
  var_samp?: Maybe<Payment_Var_Samp_Fields>;
  variance?: Maybe<Payment_Variance_Fields>;
};


/** aggregate fields of "payment" */
export type Payment_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payment_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "payment" */
export type Payment_Aggregate_Order_By = {
  avg?: InputMaybe<Payment_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payment_Max_Order_By>;
  min?: InputMaybe<Payment_Min_Order_By>;
  stddev?: InputMaybe<Payment_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payment_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payment_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payment_Sum_Order_By>;
  var_pop?: InputMaybe<Payment_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payment_Var_Samp_Order_By>;
  variance?: InputMaybe<Payment_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "payment" */
export type Payment_Arr_Rel_Insert_Input = {
  data: Array<Payment_Insert_Input>;
  on_conflict?: InputMaybe<Payment_On_Conflict>;
};

/** aggregate avg on columns */
export type Payment_Avg_Fields = {
  amount?: Maybe<Scalars['Float']>;
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "payment" */
export type Payment_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payment". All fields are combined with a logical 'AND'. */
export type Payment_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Payment_Bool_Exp>>>;
  _not?: InputMaybe<Payment_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Payment_Bool_Exp>>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  invoice_id?: InputMaybe<String_Comparison_Exp>;
  is_exported?: InputMaybe<Boolean_Comparison_Exp>;
  payment_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  payment_due_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  payment_expiry_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  payment_id?: InputMaybe<String_Comparison_Exp>;
  payment_method?: InputMaybe<String_Comparison_Exp>;
  payment_sequence_number?: InputMaybe<Int_Comparison_Exp>;
  payment_status?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  result?: InputMaybe<String_Comparison_Exp>;
  result_code?: InputMaybe<String_Comparison_Exp>;
  student_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_access_paths?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** unique or primary key constraints on table "payment" */
export enum Payment_Constraint {
  /** unique or primary key constraint */
  PaymentPk = 'payment_pk',
  /** unique or primary key constraint */
  PaymentSequenceNumberResourcePathUnique = 'payment_sequence_number_resource_path_unique'
}

/** input type for incrementing integer column in table "payment" */
export type Payment_Inc_Input = {
  amount?: InputMaybe<Scalars['numeric']>;
  payment_sequence_number?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "payment" */
export type Payment_Insert_Input = {
  amount?: InputMaybe<Scalars['numeric']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_id?: InputMaybe<Scalars['String']>;
  is_exported?: InputMaybe<Scalars['Boolean']>;
  payment_date?: InputMaybe<Scalars['timestamptz']>;
  payment_due_date?: InputMaybe<Scalars['timestamptz']>;
  payment_expiry_date?: InputMaybe<Scalars['timestamptz']>;
  payment_id?: InputMaybe<Scalars['String']>;
  payment_method?: InputMaybe<Scalars['String']>;
  payment_sequence_number?: InputMaybe<Scalars['Int']>;
  payment_status?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  result?: InputMaybe<Scalars['String']>;
  result_code?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_access_paths?: InputMaybe<User_Access_Paths_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Payment_Max_Fields = {
  amount?: Maybe<Scalars['numeric']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_id?: Maybe<Scalars['String']>;
  payment_date?: Maybe<Scalars['timestamptz']>;
  payment_due_date?: Maybe<Scalars['timestamptz']>;
  payment_expiry_date?: Maybe<Scalars['timestamptz']>;
  payment_id?: Maybe<Scalars['String']>;
  payment_method?: Maybe<Scalars['String']>;
  payment_sequence_number?: Maybe<Scalars['Int']>;
  payment_status?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  result?: Maybe<Scalars['String']>;
  result_code?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "payment" */
export type Payment_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  payment_date?: InputMaybe<Order_By>;
  payment_due_date?: InputMaybe<Order_By>;
  payment_expiry_date?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
  payment_status?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  result?: InputMaybe<Order_By>;
  result_code?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payment_Min_Fields = {
  amount?: Maybe<Scalars['numeric']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  invoice_id?: Maybe<Scalars['String']>;
  payment_date?: Maybe<Scalars['timestamptz']>;
  payment_due_date?: Maybe<Scalars['timestamptz']>;
  payment_expiry_date?: Maybe<Scalars['timestamptz']>;
  payment_id?: Maybe<Scalars['String']>;
  payment_method?: Maybe<Scalars['String']>;
  payment_sequence_number?: Maybe<Scalars['Int']>;
  payment_status?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  result?: Maybe<Scalars['String']>;
  result_code?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "payment" */
export type Payment_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  payment_date?: InputMaybe<Order_By>;
  payment_due_date?: InputMaybe<Order_By>;
  payment_expiry_date?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
  payment_status?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  result?: InputMaybe<Order_By>;
  result_code?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payment" */
export type Payment_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Payment>;
};

/** input type for inserting object relation for remote table "payment" */
export type Payment_Obj_Rel_Insert_Input = {
  data: Payment_Insert_Input;
  on_conflict?: InputMaybe<Payment_On_Conflict>;
};

/** on conflict condition type for table "payment" */
export type Payment_On_Conflict = {
  constraint: Payment_Constraint;
  update_columns: Array<Payment_Update_Column>;
  where?: InputMaybe<Payment_Bool_Exp>;
};

/** ordering options when selecting data from "payment" */
export type Payment_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  invoice_id?: InputMaybe<Order_By>;
  is_exported?: InputMaybe<Order_By>;
  payment_date?: InputMaybe<Order_By>;
  payment_due_date?: InputMaybe<Order_By>;
  payment_expiry_date?: InputMaybe<Order_By>;
  payment_id?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
  payment_status?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  result?: InputMaybe<Order_By>;
  result_code?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_access_paths_aggregate?: InputMaybe<User_Access_Paths_Aggregate_Order_By>;
};

/** primary key columns input for table: "payment" */
export type Payment_Pk_Columns_Input = {
  payment_id: Scalars['String'];
};

/** select columns of table "payment" */
export enum Payment_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceId = 'invoice_id',
  /** column name */
  IsExported = 'is_exported',
  /** column name */
  PaymentDate = 'payment_date',
  /** column name */
  PaymentDueDate = 'payment_due_date',
  /** column name */
  PaymentExpiryDate = 'payment_expiry_date',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  PaymentSequenceNumber = 'payment_sequence_number',
  /** column name */
  PaymentStatus = 'payment_status',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  Result = 'result',
  /** column name */
  ResultCode = 'result_code',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "payment" */
export type Payment_Set_Input = {
  amount?: InputMaybe<Scalars['numeric']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  invoice_id?: InputMaybe<Scalars['String']>;
  is_exported?: InputMaybe<Scalars['Boolean']>;
  payment_date?: InputMaybe<Scalars['timestamptz']>;
  payment_due_date?: InputMaybe<Scalars['timestamptz']>;
  payment_expiry_date?: InputMaybe<Scalars['timestamptz']>;
  payment_id?: InputMaybe<Scalars['String']>;
  payment_method?: InputMaybe<Scalars['String']>;
  payment_sequence_number?: InputMaybe<Scalars['Int']>;
  payment_status?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  result?: InputMaybe<Scalars['String']>;
  result_code?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Payment_Stddev_Fields = {
  amount?: Maybe<Scalars['Float']>;
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "payment" */
export type Payment_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payment_Stddev_Pop_Fields = {
  amount?: Maybe<Scalars['Float']>;
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "payment" */
export type Payment_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payment_Stddev_Samp_Fields = {
  amount?: Maybe<Scalars['Float']>;
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "payment" */
export type Payment_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Payment_Sum_Fields = {
  amount?: Maybe<Scalars['numeric']>;
  payment_sequence_number?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "payment" */
export type Payment_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** update columns of table "payment" */
export enum Payment_Update_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InvoiceId = 'invoice_id',
  /** column name */
  IsExported = 'is_exported',
  /** column name */
  PaymentDate = 'payment_date',
  /** column name */
  PaymentDueDate = 'payment_due_date',
  /** column name */
  PaymentExpiryDate = 'payment_expiry_date',
  /** column name */
  PaymentId = 'payment_id',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  PaymentSequenceNumber = 'payment_sequence_number',
  /** column name */
  PaymentStatus = 'payment_status',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  Result = 'result',
  /** column name */
  ResultCode = 'result_code',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Payment_Var_Pop_Fields = {
  amount?: Maybe<Scalars['Float']>;
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "payment" */
export type Payment_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payment_Var_Samp_Fields = {
  amount?: Maybe<Scalars['Float']>;
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "payment" */
export type Payment_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payment_Variance_Fields = {
  amount?: Maybe<Scalars['Float']>;
  payment_sequence_number?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "payment" */
export type Payment_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  payment_sequence_number?: InputMaybe<Order_By>;
};

/** columns and relationships of "prefecture" */
export type Prefecture = {
  country: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  name: Scalars['String'];
  prefecture_code: Scalars['String'];
  prefecture_id: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "prefecture" */
export type Prefecture_Aggregate = {
  aggregate?: Maybe<Prefecture_Aggregate_Fields>;
  nodes: Array<Prefecture>;
};

/** aggregate fields of "prefecture" */
export type Prefecture_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Prefecture_Max_Fields>;
  min?: Maybe<Prefecture_Min_Fields>;
};


/** aggregate fields of "prefecture" */
export type Prefecture_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Prefecture_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "prefecture" */
export type Prefecture_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Prefecture_Max_Order_By>;
  min?: InputMaybe<Prefecture_Min_Order_By>;
};

/** input type for inserting array relation for remote table "prefecture" */
export type Prefecture_Arr_Rel_Insert_Input = {
  data: Array<Prefecture_Insert_Input>;
  on_conflict?: InputMaybe<Prefecture_On_Conflict>;
};

/** Boolean expression to filter rows from the table "prefecture". All fields are combined with a logical 'AND'. */
export type Prefecture_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Prefecture_Bool_Exp>>>;
  _not?: InputMaybe<Prefecture_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Prefecture_Bool_Exp>>>;
  country?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  prefecture_code?: InputMaybe<String_Comparison_Exp>;
  prefecture_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "prefecture" */
export enum Prefecture_Constraint {
  /** unique or primary key constraint */
  PrefecturePk = 'prefecture__pk'
}

/** input type for inserting data into table "prefecture" */
export type Prefecture_Insert_Input = {
  country?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  name?: InputMaybe<Scalars['String']>;
  prefecture_code?: InputMaybe<Scalars['String']>;
  prefecture_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Prefecture_Max_Fields = {
  country?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  prefecture_code?: Maybe<Scalars['String']>;
  prefecture_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "prefecture" */
export type Prefecture_Max_Order_By = {
  country?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
  prefecture_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Prefecture_Min_Fields = {
  country?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  prefecture_code?: Maybe<Scalars['String']>;
  prefecture_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "prefecture" */
export type Prefecture_Min_Order_By = {
  country?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
  prefecture_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "prefecture" */
export type Prefecture_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Prefecture>;
};

/** input type for inserting object relation for remote table "prefecture" */
export type Prefecture_Obj_Rel_Insert_Input = {
  data: Prefecture_Insert_Input;
  on_conflict?: InputMaybe<Prefecture_On_Conflict>;
};

/** on conflict condition type for table "prefecture" */
export type Prefecture_On_Conflict = {
  constraint: Prefecture_Constraint;
  update_columns: Array<Prefecture_Update_Column>;
  where?: InputMaybe<Prefecture_Bool_Exp>;
};

/** ordering options when selecting data from "prefecture" */
export type Prefecture_Order_By = {
  country?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  prefecture_code?: InputMaybe<Order_By>;
  prefecture_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "prefecture" */
export type Prefecture_Pk_Columns_Input = {
  prefecture_id: Scalars['String'];
};

/** select columns of table "prefecture" */
export enum Prefecture_Select_Column {
  /** column name */
  Country = 'country',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Name = 'name',
  /** column name */
  PrefectureCode = 'prefecture_code',
  /** column name */
  PrefectureId = 'prefecture_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "prefecture" */
export type Prefecture_Set_Input = {
  country?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  name?: InputMaybe<Scalars['String']>;
  prefecture_code?: InputMaybe<Scalars['String']>;
  prefecture_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "prefecture" */
export enum Prefecture_Update_Column {
  /** column name */
  Country = 'country',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  Name = 'name',
  /** column name */
  PrefectureCode = 'prefecture_code',
  /** column name */
  PrefectureId = 'prefecture_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** query root */
export type Query_Root = {
  /** fetch data from the table: "bank" */
  bank: Array<Bank>;
  /** fetch data from the table: "bank_account" */
  bank_account: Array<Bank_Account>;
  /** fetch aggregated fields from the table: "bank_account" */
  bank_account_aggregate: Bank_Account_Aggregate;
  /** fetch data from the table: "bank_account" using primary key columns */
  bank_account_by_pk?: Maybe<Bank_Account>;
  /** fetch aggregated fields from the table: "bank" */
  bank_aggregate: Bank_Aggregate;
  /** fetch data from the table: "bank_branch" */
  bank_branch: Array<Bank_Branch>;
  /** fetch aggregated fields from the table: "bank_branch" */
  bank_branch_aggregate: Bank_Branch_Aggregate;
  /** fetch data from the table: "bank_branch" using primary key columns */
  bank_branch_by_pk?: Maybe<Bank_Branch>;
  /** fetch data from the table: "bank" using primary key columns */
  bank_by_pk?: Maybe<Bank>;
  /** fetch data from the table: "bank_mapping" */
  bank_mapping: Array<Bank_Mapping>;
  /** fetch aggregated fields from the table: "bank_mapping" */
  bank_mapping_aggregate: Bank_Mapping_Aggregate;
  /** fetch data from the table: "bank_mapping" using primary key columns */
  bank_mapping_by_pk?: Maybe<Bank_Mapping>;
  /** fetch data from the table: "bill_item" */
  bill_item: Array<Bill_Item>;
  /** fetch aggregated fields from the table: "bill_item" */
  bill_item_aggregate: Bill_Item_Aggregate;
  /** fetch data from the table: "bill_item" using primary key columns */
  bill_item_by_pk?: Maybe<Bill_Item>;
  /** fetch data from the table: "billing_address" */
  billing_address: Array<Billing_Address>;
  /** fetch aggregated fields from the table: "billing_address" */
  billing_address_aggregate: Billing_Address_Aggregate;
  /** fetch data from the table: "billing_address" using primary key columns */
  billing_address_by_pk?: Maybe<Billing_Address>;
  /** fetch data from the table: "bulk_payment_request" */
  bulk_payment_request: Array<Bulk_Payment_Request>;
  /** fetch aggregated fields from the table: "bulk_payment_request" */
  bulk_payment_request_aggregate: Bulk_Payment_Request_Aggregate;
  /** fetch data from the table: "bulk_payment_request" using primary key columns */
  bulk_payment_request_by_pk?: Maybe<Bulk_Payment_Request>;
  /** fetch data from the table: "bulk_payment_request_file" */
  bulk_payment_request_file: Array<Bulk_Payment_Request_File>;
  /** fetch aggregated fields from the table: "bulk_payment_request_file" */
  bulk_payment_request_file_aggregate: Bulk_Payment_Request_File_Aggregate;
  /** fetch data from the table: "bulk_payment_request_file" using primary key columns */
  bulk_payment_request_file_by_pk?: Maybe<Bulk_Payment_Request_File>;
  /** fetch data from the table: "bulk_payment_validations" */
  bulk_payment_validations: Array<Bulk_Payment_Validations>;
  /** fetch aggregated fields from the table: "bulk_payment_validations" */
  bulk_payment_validations_aggregate: Bulk_Payment_Validations_Aggregate;
  /** fetch data from the table: "bulk_payment_validations" using primary key columns */
  bulk_payment_validations_by_pk?: Maybe<Bulk_Payment_Validations>;
  /** fetch data from the table: "granted_permissions" */
  granted_permissions: Array<Granted_Permissions>;
  /** fetch aggregated fields from the table: "granted_permissions" */
  granted_permissions_aggregate: Granted_Permissions_Aggregate;
  /** fetch data from the table: "invoice" */
  invoice: Array<Invoice>;
  /** fetch data from the table: "invoice_action_log" */
  invoice_action_log: Array<Invoice_Action_Log>;
  /** fetch aggregated fields from the table: "invoice_action_log" */
  invoice_action_log_aggregate: Invoice_Action_Log_Aggregate;
  /** fetch data from the table: "invoice_action_log" using primary key columns */
  invoice_action_log_by_pk?: Maybe<Invoice_Action_Log>;
  /** fetch aggregated fields from the table: "invoice" */
  invoice_aggregate: Invoice_Aggregate;
  /** fetch data from the table: "invoice_bill_item" */
  invoice_bill_item: Array<Invoice_Bill_Item>;
  /** fetch aggregated fields from the table: "invoice_bill_item" */
  invoice_bill_item_aggregate: Invoice_Bill_Item_Aggregate;
  /** fetch data from the table: "invoice_bill_item" using primary key columns */
  invoice_bill_item_by_pk?: Maybe<Invoice_Bill_Item>;
  /** fetch data from the table: "invoice" using primary key columns */
  invoice_by_pk?: Maybe<Invoice>;
  /** fetch data from the table: "invoice_schedule" */
  invoice_schedule: Array<Invoice_Schedule>;
  /** fetch aggregated fields from the table: "invoice_schedule" */
  invoice_schedule_aggregate: Invoice_Schedule_Aggregate;
  /** fetch data from the table: "invoice_schedule" using primary key columns */
  invoice_schedule_by_pk?: Maybe<Invoice_Schedule>;
  /** fetch data from the table: "invoice_schedule_history" */
  invoice_schedule_history: Array<Invoice_Schedule_History>;
  /** fetch aggregated fields from the table: "invoice_schedule_history" */
  invoice_schedule_history_aggregate: Invoice_Schedule_History_Aggregate;
  /** fetch data from the table: "invoice_schedule_history" using primary key columns */
  invoice_schedule_history_by_pk?: Maybe<Invoice_Schedule_History>;
  /** fetch data from the table: "invoice_schedule_student" */
  invoice_schedule_student: Array<Invoice_Schedule_Student>;
  /** fetch aggregated fields from the table: "invoice_schedule_student" */
  invoice_schedule_student_aggregate: Invoice_Schedule_Student_Aggregate;
  /** fetch data from the table: "invoice_schedule_student" using primary key columns */
  invoice_schedule_student_by_pk?: Maybe<Invoice_Schedule_Student>;
  /** fetch data from the table: "partner_convenience_store" */
  partner_convenience_store: Array<Partner_Convenience_Store>;
  /** fetch aggregated fields from the table: "partner_convenience_store" */
  partner_convenience_store_aggregate: Partner_Convenience_Store_Aggregate;
  /** fetch data from the table: "partner_convenience_store" using primary key columns */
  partner_convenience_store_by_pk?: Maybe<Partner_Convenience_Store>;
  /** fetch data from the table: "payment" */
  payment: Array<Payment>;
  /** fetch aggregated fields from the table: "payment" */
  payment_aggregate: Payment_Aggregate;
  /** fetch data from the table: "payment" using primary key columns */
  payment_by_pk?: Maybe<Payment>;
  /** fetch data from the table: "prefecture" */
  prefecture: Array<Prefecture>;
  /** fetch aggregated fields from the table: "prefecture" */
  prefecture_aggregate: Prefecture_Aggregate;
  /** fetch data from the table: "prefecture" using primary key columns */
  prefecture_by_pk?: Maybe<Prefecture>;
  /** fetch data from the table: "student_payment_detail" */
  student_payment_detail: Array<Student_Payment_Detail>;
  /** fetch aggregated fields from the table: "student_payment_detail" */
  student_payment_detail_aggregate: Student_Payment_Detail_Aggregate;
  /** fetch data from the table: "student_payment_detail" using primary key columns */
  student_payment_detail_by_pk?: Maybe<Student_Payment_Detail>;
  /** fetch data from the table: "students" */
  students: Array<Students>;
  /** fetch aggregated fields from the table: "students" */
  students_aggregate: Students_Aggregate;
  /** fetch data from the table: "students" using primary key columns */
  students_by_pk?: Maybe<Students>;
  /** fetch data from the table: "user_access_paths" */
  user_access_paths: Array<User_Access_Paths>;
  /** fetch aggregated fields from the table: "user_access_paths" */
  user_access_paths_aggregate: User_Access_Paths_Aggregate;
  /** fetch data from the table: "user_access_paths" using primary key columns */
  user_access_paths_by_pk?: Maybe<User_Access_Paths>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


/** query root */
export type Query_RootBankArgs = {
  distinct_on?: InputMaybe<Array<Bank_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Order_By>>;
  where?: InputMaybe<Bank_Bool_Exp>;
};


/** query root */
export type Query_RootBank_AccountArgs = {
  distinct_on?: InputMaybe<Array<Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Account_Order_By>>;
  where?: InputMaybe<Bank_Account_Bool_Exp>;
};


/** query root */
export type Query_RootBank_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Account_Order_By>>;
  where?: InputMaybe<Bank_Account_Bool_Exp>;
};


/** query root */
export type Query_RootBank_Account_By_PkArgs = {
  bank_account_id: Scalars['String'];
};


/** query root */
export type Query_RootBank_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bank_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Order_By>>;
  where?: InputMaybe<Bank_Bool_Exp>;
};


/** query root */
export type Query_RootBank_BranchArgs = {
  distinct_on?: InputMaybe<Array<Bank_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Branch_Order_By>>;
  where?: InputMaybe<Bank_Branch_Bool_Exp>;
};


/** query root */
export type Query_RootBank_Branch_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bank_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Branch_Order_By>>;
  where?: InputMaybe<Bank_Branch_Bool_Exp>;
};


/** query root */
export type Query_RootBank_Branch_By_PkArgs = {
  bank_branch_id: Scalars['String'];
};


/** query root */
export type Query_RootBank_By_PkArgs = {
  bank_id: Scalars['String'];
};


/** query root */
export type Query_RootBank_MappingArgs = {
  distinct_on?: InputMaybe<Array<Bank_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Mapping_Order_By>>;
  where?: InputMaybe<Bank_Mapping_Bool_Exp>;
};


/** query root */
export type Query_RootBank_Mapping_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bank_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Mapping_Order_By>>;
  where?: InputMaybe<Bank_Mapping_Bool_Exp>;
};


/** query root */
export type Query_RootBank_Mapping_By_PkArgs = {
  bank_mapping_id: Scalars['String'];
};


/** query root */
export type Query_RootBill_ItemArgs = {
  distinct_on?: InputMaybe<Array<Bill_Item_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bill_Item_Order_By>>;
  where?: InputMaybe<Bill_Item_Bool_Exp>;
};


/** query root */
export type Query_RootBill_Item_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bill_Item_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bill_Item_Order_By>>;
  where?: InputMaybe<Bill_Item_Bool_Exp>;
};


/** query root */
export type Query_RootBill_Item_By_PkArgs = {
  bill_item_sequence_number: Scalars['Int'];
  order_id: Scalars['String'];
};


/** query root */
export type Query_RootBilling_AddressArgs = {
  distinct_on?: InputMaybe<Array<Billing_Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Billing_Address_Order_By>>;
  where?: InputMaybe<Billing_Address_Bool_Exp>;
};


/** query root */
export type Query_RootBilling_Address_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Billing_Address_Order_By>>;
  where?: InputMaybe<Billing_Address_Bool_Exp>;
};


/** query root */
export type Query_RootBilling_Address_By_PkArgs = {
  billing_address_id: Scalars['String'];
};


/** query root */
export type Query_RootBulk_Payment_RequestArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_Bool_Exp>;
};


/** query root */
export type Query_RootBulk_Payment_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_Bool_Exp>;
};


/** query root */
export type Query_RootBulk_Payment_Request_By_PkArgs = {
  bulk_payment_request_id: Scalars['String'];
};


/** query root */
export type Query_RootBulk_Payment_Request_FileArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_File_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_File_Bool_Exp>;
};


/** query root */
export type Query_RootBulk_Payment_Request_File_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_File_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_File_Bool_Exp>;
};


/** query root */
export type Query_RootBulk_Payment_Request_File_By_PkArgs = {
  bulk_payment_request_file_id: Scalars['String'];
};


/** query root */
export type Query_RootBulk_Payment_ValidationsArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Validations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Validations_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Validations_Bool_Exp>;
};


/** query root */
export type Query_RootBulk_Payment_Validations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Validations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Validations_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Validations_Bool_Exp>;
};


/** query root */
export type Query_RootBulk_Payment_Validations_By_PkArgs = {
  bulk_payment_validations_id: Scalars['String'];
};


/** query root */
export type Query_RootGranted_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Granted_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Granted_Permissions_Order_By>>;
  where?: InputMaybe<Granted_Permissions_Bool_Exp>;
};


/** query root */
export type Query_RootGranted_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Granted_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Granted_Permissions_Order_By>>;
  where?: InputMaybe<Granted_Permissions_Bool_Exp>;
};


/** query root */
export type Query_RootInvoiceArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Order_By>>;
  where?: InputMaybe<Invoice_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Action_LogArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Action_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Action_Log_Order_By>>;
  where?: InputMaybe<Invoice_Action_Log_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Action_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Action_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Action_Log_Order_By>>;
  where?: InputMaybe<Invoice_Action_Log_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Action_Log_By_PkArgs = {
  invoice_action_id: Scalars['String'];
};


/** query root */
export type Query_RootInvoice_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Order_By>>;
  where?: InputMaybe<Invoice_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Bill_ItemArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Bill_Item_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Bill_Item_Order_By>>;
  where?: InputMaybe<Invoice_Bill_Item_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Bill_Item_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Bill_Item_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Bill_Item_Order_By>>;
  where?: InputMaybe<Invoice_Bill_Item_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Bill_Item_By_PkArgs = {
  invoice_bill_item_id: Scalars['String'];
};


/** query root */
export type Query_RootInvoice_By_PkArgs = {
  invoice_id: Scalars['String'];
};


/** query root */
export type Query_RootInvoice_ScheduleArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Schedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Schedule_By_PkArgs = {
  invoice_schedule_id: Scalars['String'];
};


/** query root */
export type Query_RootInvoice_Schedule_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_History_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_History_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Schedule_History_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_History_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_History_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Schedule_History_By_PkArgs = {
  invoice_schedule_history_id: Scalars['String'];
};


/** query root */
export type Query_RootInvoice_Schedule_StudentArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_Student_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_Student_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_Student_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Schedule_Student_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_Student_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_Student_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_Student_Bool_Exp>;
};


/** query root */
export type Query_RootInvoice_Schedule_Student_By_PkArgs = {
  invoice_schedule_student_id: Scalars['String'];
};


/** query root */
export type Query_RootPartner_Convenience_StoreArgs = {
  distinct_on?: InputMaybe<Array<Partner_Convenience_Store_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Partner_Convenience_Store_Order_By>>;
  where?: InputMaybe<Partner_Convenience_Store_Bool_Exp>;
};


/** query root */
export type Query_RootPartner_Convenience_Store_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Convenience_Store_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Partner_Convenience_Store_Order_By>>;
  where?: InputMaybe<Partner_Convenience_Store_Bool_Exp>;
};


/** query root */
export type Query_RootPartner_Convenience_Store_By_PkArgs = {
  partner_convenience_store_id: Scalars['String'];
};


/** query root */
export type Query_RootPaymentArgs = {
  distinct_on?: InputMaybe<Array<Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Order_By>>;
  where?: InputMaybe<Payment_Bool_Exp>;
};


/** query root */
export type Query_RootPayment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Order_By>>;
  where?: InputMaybe<Payment_Bool_Exp>;
};


/** query root */
export type Query_RootPayment_By_PkArgs = {
  payment_id: Scalars['String'];
};


/** query root */
export type Query_RootPrefectureArgs = {
  distinct_on?: InputMaybe<Array<Prefecture_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Prefecture_Order_By>>;
  where?: InputMaybe<Prefecture_Bool_Exp>;
};


/** query root */
export type Query_RootPrefecture_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prefecture_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Prefecture_Order_By>>;
  where?: InputMaybe<Prefecture_Bool_Exp>;
};


/** query root */
export type Query_RootPrefecture_By_PkArgs = {
  prefecture_id: Scalars['String'];
};


/** query root */
export type Query_RootStudent_Payment_DetailArgs = {
  distinct_on?: InputMaybe<Array<Student_Payment_Detail_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Student_Payment_Detail_Order_By>>;
  where?: InputMaybe<Student_Payment_Detail_Bool_Exp>;
};


/** query root */
export type Query_RootStudent_Payment_Detail_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Student_Payment_Detail_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Student_Payment_Detail_Order_By>>;
  where?: InputMaybe<Student_Payment_Detail_Bool_Exp>;
};


/** query root */
export type Query_RootStudent_Payment_Detail_By_PkArgs = {
  student_payment_detail_id: Scalars['String'];
};


/** query root */
export type Query_RootStudentsArgs = {
  distinct_on?: InputMaybe<Array<Students_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Students_Order_By>>;
  where?: InputMaybe<Students_Bool_Exp>;
};


/** query root */
export type Query_RootStudents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Students_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Students_Order_By>>;
  where?: InputMaybe<Students_Bool_Exp>;
};


/** query root */
export type Query_RootStudents_By_PkArgs = {
  student_id: Scalars['String'];
};


/** query root */
export type Query_RootUser_Access_PathsArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** query root */
export type Query_RootUser_Access_Paths_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** query root */
export type Query_RootUser_Access_Paths_By_PkArgs = {
  location_id: Scalars['String'];
  user_id: Scalars['String'];
};


/** query root */
export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


/** query root */
export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


/** query root */
export type Query_RootUsers_By_PkArgs = {
  user_id: Scalars['String'];
};

/** expression to compare columns of type smallint. All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
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

/** columns and relationships of "student_payment_detail" */
export type Student_Payment_Detail = {
  /** An array relationship */
  bank_accounts: Array<Bank_Account>;
  /** An aggregated array relationship */
  bank_accounts_aggregate: Bank_Account_Aggregate;
  /** An array relationship */
  billing_addresses: Array<Billing_Address>;
  /** An aggregated array relationship */
  billing_addresses_aggregate: Billing_Address_Aggregate;
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  payer_name: Scalars['String'];
  payer_phone_number?: Maybe<Scalars['String']>;
  payment_method: Scalars['String'];
  resource_path: Scalars['String'];
  student_id: Scalars['String'];
  student_payment_detail_id: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  /** An array relationship */
  user_access_paths: Array<User_Access_Paths>;
  /** An aggregated array relationship */
  user_access_paths_aggregate: User_Access_Paths_Aggregate;
};


/** columns and relationships of "student_payment_detail" */
export type Student_Payment_DetailBank_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Account_Order_By>>;
  where?: InputMaybe<Bank_Account_Bool_Exp>;
};


/** columns and relationships of "student_payment_detail" */
export type Student_Payment_DetailBank_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Account_Order_By>>;
  where?: InputMaybe<Bank_Account_Bool_Exp>;
};


/** columns and relationships of "student_payment_detail" */
export type Student_Payment_DetailBilling_AddressesArgs = {
  distinct_on?: InputMaybe<Array<Billing_Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Billing_Address_Order_By>>;
  where?: InputMaybe<Billing_Address_Bool_Exp>;
};


/** columns and relationships of "student_payment_detail" */
export type Student_Payment_DetailBilling_Addresses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Billing_Address_Order_By>>;
  where?: InputMaybe<Billing_Address_Bool_Exp>;
};


/** columns and relationships of "student_payment_detail" */
export type Student_Payment_DetailUser_Access_PathsArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** columns and relationships of "student_payment_detail" */
export type Student_Payment_DetailUser_Access_Paths_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** aggregated selection of "student_payment_detail" */
export type Student_Payment_Detail_Aggregate = {
  aggregate?: Maybe<Student_Payment_Detail_Aggregate_Fields>;
  nodes: Array<Student_Payment_Detail>;
};

/** aggregate fields of "student_payment_detail" */
export type Student_Payment_Detail_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Student_Payment_Detail_Max_Fields>;
  min?: Maybe<Student_Payment_Detail_Min_Fields>;
};


/** aggregate fields of "student_payment_detail" */
export type Student_Payment_Detail_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Student_Payment_Detail_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "student_payment_detail" */
export type Student_Payment_Detail_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Student_Payment_Detail_Max_Order_By>;
  min?: InputMaybe<Student_Payment_Detail_Min_Order_By>;
};

/** input type for inserting array relation for remote table "student_payment_detail" */
export type Student_Payment_Detail_Arr_Rel_Insert_Input = {
  data: Array<Student_Payment_Detail_Insert_Input>;
  on_conflict?: InputMaybe<Student_Payment_Detail_On_Conflict>;
};

/** Boolean expression to filter rows from the table "student_payment_detail". All fields are combined with a logical 'AND'. */
export type Student_Payment_Detail_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Student_Payment_Detail_Bool_Exp>>>;
  _not?: InputMaybe<Student_Payment_Detail_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Student_Payment_Detail_Bool_Exp>>>;
  bank_accounts?: InputMaybe<Bank_Account_Bool_Exp>;
  billing_addresses?: InputMaybe<Billing_Address_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  payer_name?: InputMaybe<String_Comparison_Exp>;
  payer_phone_number?: InputMaybe<String_Comparison_Exp>;
  payment_method?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  student_id?: InputMaybe<String_Comparison_Exp>;
  student_payment_detail_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_access_paths?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** unique or primary key constraints on table "student_payment_detail" */
export enum Student_Payment_Detail_Constraint {
  /** unique or primary key constraint */
  StudentPaymentDetailPk = 'student_payment_detail__pk'
}

/** input type for inserting data into table "student_payment_detail" */
export type Student_Payment_Detail_Insert_Input = {
  bank_accounts?: InputMaybe<Bank_Account_Arr_Rel_Insert_Input>;
  billing_addresses?: InputMaybe<Billing_Address_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  payer_name?: InputMaybe<Scalars['String']>;
  payer_phone_number?: InputMaybe<Scalars['String']>;
  payment_method?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  student_payment_detail_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_access_paths?: InputMaybe<User_Access_Paths_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Student_Payment_Detail_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  payer_name?: Maybe<Scalars['String']>;
  payer_phone_number?: Maybe<Scalars['String']>;
  payment_method?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  student_payment_detail_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "student_payment_detail" */
export type Student_Payment_Detail_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  payer_name?: InputMaybe<Order_By>;
  payer_phone_number?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  student_payment_detail_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Student_Payment_Detail_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  payer_name?: Maybe<Scalars['String']>;
  payer_phone_number?: Maybe<Scalars['String']>;
  payment_method?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  student_payment_detail_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "student_payment_detail" */
export type Student_Payment_Detail_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  payer_name?: InputMaybe<Order_By>;
  payer_phone_number?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  student_payment_detail_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "student_payment_detail" */
export type Student_Payment_Detail_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Student_Payment_Detail>;
};

/** input type for inserting object relation for remote table "student_payment_detail" */
export type Student_Payment_Detail_Obj_Rel_Insert_Input = {
  data: Student_Payment_Detail_Insert_Input;
  on_conflict?: InputMaybe<Student_Payment_Detail_On_Conflict>;
};

/** on conflict condition type for table "student_payment_detail" */
export type Student_Payment_Detail_On_Conflict = {
  constraint: Student_Payment_Detail_Constraint;
  update_columns: Array<Student_Payment_Detail_Update_Column>;
  where?: InputMaybe<Student_Payment_Detail_Bool_Exp>;
};

/** ordering options when selecting data from "student_payment_detail" */
export type Student_Payment_Detail_Order_By = {
  bank_accounts_aggregate?: InputMaybe<Bank_Account_Aggregate_Order_By>;
  billing_addresses_aggregate?: InputMaybe<Billing_Address_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  payer_name?: InputMaybe<Order_By>;
  payer_phone_number?: InputMaybe<Order_By>;
  payment_method?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  student_payment_detail_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_access_paths_aggregate?: InputMaybe<User_Access_Paths_Aggregate_Order_By>;
};

/** primary key columns input for table: "student_payment_detail" */
export type Student_Payment_Detail_Pk_Columns_Input = {
  student_payment_detail_id: Scalars['String'];
};

/** select columns of table "student_payment_detail" */
export enum Student_Payment_Detail_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  PayerName = 'payer_name',
  /** column name */
  PayerPhoneNumber = 'payer_phone_number',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  StudentPaymentDetailId = 'student_payment_detail_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "student_payment_detail" */
export type Student_Payment_Detail_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  payer_name?: InputMaybe<Scalars['String']>;
  payer_phone_number?: InputMaybe<Scalars['String']>;
  payment_method?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  student_payment_detail_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "student_payment_detail" */
export enum Student_Payment_Detail_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  PayerName = 'payer_name',
  /** column name */
  PayerPhoneNumber = 'payer_phone_number',
  /** column name */
  PaymentMethod = 'payment_method',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  StudentPaymentDetailId = 'student_payment_detail_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "students" */
export type Students = {
  created_at: Scalars['timestamptz'];
  current_grade?: Maybe<Scalars['smallint']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  resource_path: Scalars['String'];
  student_id: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  /** An object relationship */
  user?: Maybe<Users>;
  /** An array relationship */
  user_access_paths: Array<User_Access_Paths>;
  /** An aggregated array relationship */
  user_access_paths_aggregate: User_Access_Paths_Aggregate;
};


/** columns and relationships of "students" */
export type StudentsUser_Access_PathsArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** columns and relationships of "students" */
export type StudentsUser_Access_Paths_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** aggregated selection of "students" */
export type Students_Aggregate = {
  aggregate?: Maybe<Students_Aggregate_Fields>;
  nodes: Array<Students>;
};

/** aggregate fields of "students" */
export type Students_Aggregate_Fields = {
  avg?: Maybe<Students_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Students_Max_Fields>;
  min?: Maybe<Students_Min_Fields>;
  stddev?: Maybe<Students_Stddev_Fields>;
  stddev_pop?: Maybe<Students_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Students_Stddev_Samp_Fields>;
  sum?: Maybe<Students_Sum_Fields>;
  var_pop?: Maybe<Students_Var_Pop_Fields>;
  var_samp?: Maybe<Students_Var_Samp_Fields>;
  variance?: Maybe<Students_Variance_Fields>;
};


/** aggregate fields of "students" */
export type Students_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Students_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "students" */
export type Students_Aggregate_Order_By = {
  avg?: InputMaybe<Students_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Students_Max_Order_By>;
  min?: InputMaybe<Students_Min_Order_By>;
  stddev?: InputMaybe<Students_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Students_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Students_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Students_Sum_Order_By>;
  var_pop?: InputMaybe<Students_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Students_Var_Samp_Order_By>;
  variance?: InputMaybe<Students_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "students" */
export type Students_Arr_Rel_Insert_Input = {
  data: Array<Students_Insert_Input>;
  on_conflict?: InputMaybe<Students_On_Conflict>;
};

/** aggregate avg on columns */
export type Students_Avg_Fields = {
  current_grade?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "students" */
export type Students_Avg_Order_By = {
  current_grade?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "students". All fields are combined with a logical 'AND'. */
export type Students_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Students_Bool_Exp>>>;
  _not?: InputMaybe<Students_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Students_Bool_Exp>>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  current_grade?: InputMaybe<Smallint_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  student_id?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_access_paths?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** unique or primary key constraints on table "students" */
export enum Students_Constraint {
  /** unique or primary key constraint */
  StudentPk = 'student_pk'
}

/** input type for incrementing integer column in table "students" */
export type Students_Inc_Input = {
  current_grade?: InputMaybe<Scalars['smallint']>;
};

/** input type for inserting data into table "students" */
export type Students_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  current_grade?: InputMaybe<Scalars['smallint']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_access_paths?: InputMaybe<User_Access_Paths_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Students_Max_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  current_grade?: Maybe<Scalars['smallint']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "students" */
export type Students_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  current_grade?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Students_Min_Fields = {
  created_at?: Maybe<Scalars['timestamptz']>;
  current_grade?: Maybe<Scalars['smallint']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  resource_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "students" */
export type Students_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  current_grade?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "students" */
export type Students_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Students>;
};

/** input type for inserting object relation for remote table "students" */
export type Students_Obj_Rel_Insert_Input = {
  data: Students_Insert_Input;
  on_conflict?: InputMaybe<Students_On_Conflict>;
};

/** on conflict condition type for table "students" */
export type Students_On_Conflict = {
  constraint: Students_Constraint;
  update_columns: Array<Students_Update_Column>;
  where?: InputMaybe<Students_Bool_Exp>;
};

/** ordering options when selecting data from "students" */
export type Students_Order_By = {
  created_at?: InputMaybe<Order_By>;
  current_grade?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_access_paths_aggregate?: InputMaybe<User_Access_Paths_Aggregate_Order_By>;
};

/** primary key columns input for table: "students" */
export type Students_Pk_Columns_Input = {
  student_id: Scalars['String'];
};

/** select columns of table "students" */
export enum Students_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrentGrade = 'current_grade',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "students" */
export type Students_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  current_grade?: InputMaybe<Scalars['smallint']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Students_Stddev_Fields = {
  current_grade?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "students" */
export type Students_Stddev_Order_By = {
  current_grade?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Students_Stddev_Pop_Fields = {
  current_grade?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "students" */
export type Students_Stddev_Pop_Order_By = {
  current_grade?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Students_Stddev_Samp_Fields = {
  current_grade?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "students" */
export type Students_Stddev_Samp_Order_By = {
  current_grade?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Students_Sum_Fields = {
  current_grade?: Maybe<Scalars['smallint']>;
};

/** order by sum() on columns of table "students" */
export type Students_Sum_Order_By = {
  current_grade?: InputMaybe<Order_By>;
};

/** update columns of table "students" */
export enum Students_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrentGrade = 'current_grade',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  StudentId = 'student_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Students_Var_Pop_Fields = {
  current_grade?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "students" */
export type Students_Var_Pop_Order_By = {
  current_grade?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Students_Var_Samp_Fields = {
  current_grade?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "students" */
export type Students_Var_Samp_Order_By = {
  current_grade?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Students_Variance_Fields = {
  current_grade?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "students" */
export type Students_Variance_Order_By = {
  current_grade?: InputMaybe<Order_By>;
};

/** subscription root */
export type Subscription_Root = {
  /** fetch data from the table: "bank" */
  bank: Array<Bank>;
  /** fetch data from the table: "bank_account" */
  bank_account: Array<Bank_Account>;
  /** fetch aggregated fields from the table: "bank_account" */
  bank_account_aggregate: Bank_Account_Aggregate;
  /** fetch data from the table: "bank_account" using primary key columns */
  bank_account_by_pk?: Maybe<Bank_Account>;
  /** fetch aggregated fields from the table: "bank" */
  bank_aggregate: Bank_Aggregate;
  /** fetch data from the table: "bank_branch" */
  bank_branch: Array<Bank_Branch>;
  /** fetch aggregated fields from the table: "bank_branch" */
  bank_branch_aggregate: Bank_Branch_Aggregate;
  /** fetch data from the table: "bank_branch" using primary key columns */
  bank_branch_by_pk?: Maybe<Bank_Branch>;
  /** fetch data from the table: "bank" using primary key columns */
  bank_by_pk?: Maybe<Bank>;
  /** fetch data from the table: "bank_mapping" */
  bank_mapping: Array<Bank_Mapping>;
  /** fetch aggregated fields from the table: "bank_mapping" */
  bank_mapping_aggregate: Bank_Mapping_Aggregate;
  /** fetch data from the table: "bank_mapping" using primary key columns */
  bank_mapping_by_pk?: Maybe<Bank_Mapping>;
  /** fetch data from the table: "bill_item" */
  bill_item: Array<Bill_Item>;
  /** fetch aggregated fields from the table: "bill_item" */
  bill_item_aggregate: Bill_Item_Aggregate;
  /** fetch data from the table: "bill_item" using primary key columns */
  bill_item_by_pk?: Maybe<Bill_Item>;
  /** fetch data from the table: "billing_address" */
  billing_address: Array<Billing_Address>;
  /** fetch aggregated fields from the table: "billing_address" */
  billing_address_aggregate: Billing_Address_Aggregate;
  /** fetch data from the table: "billing_address" using primary key columns */
  billing_address_by_pk?: Maybe<Billing_Address>;
  /** fetch data from the table: "bulk_payment_request" */
  bulk_payment_request: Array<Bulk_Payment_Request>;
  /** fetch aggregated fields from the table: "bulk_payment_request" */
  bulk_payment_request_aggregate: Bulk_Payment_Request_Aggregate;
  /** fetch data from the table: "bulk_payment_request" using primary key columns */
  bulk_payment_request_by_pk?: Maybe<Bulk_Payment_Request>;
  /** fetch data from the table: "bulk_payment_request_file" */
  bulk_payment_request_file: Array<Bulk_Payment_Request_File>;
  /** fetch aggregated fields from the table: "bulk_payment_request_file" */
  bulk_payment_request_file_aggregate: Bulk_Payment_Request_File_Aggregate;
  /** fetch data from the table: "bulk_payment_request_file" using primary key columns */
  bulk_payment_request_file_by_pk?: Maybe<Bulk_Payment_Request_File>;
  /** fetch data from the table: "bulk_payment_validations" */
  bulk_payment_validations: Array<Bulk_Payment_Validations>;
  /** fetch aggregated fields from the table: "bulk_payment_validations" */
  bulk_payment_validations_aggregate: Bulk_Payment_Validations_Aggregate;
  /** fetch data from the table: "bulk_payment_validations" using primary key columns */
  bulk_payment_validations_by_pk?: Maybe<Bulk_Payment_Validations>;
  /** fetch data from the table: "granted_permissions" */
  granted_permissions: Array<Granted_Permissions>;
  /** fetch aggregated fields from the table: "granted_permissions" */
  granted_permissions_aggregate: Granted_Permissions_Aggregate;
  /** fetch data from the table: "invoice" */
  invoice: Array<Invoice>;
  /** fetch data from the table: "invoice_action_log" */
  invoice_action_log: Array<Invoice_Action_Log>;
  /** fetch aggregated fields from the table: "invoice_action_log" */
  invoice_action_log_aggregate: Invoice_Action_Log_Aggregate;
  /** fetch data from the table: "invoice_action_log" using primary key columns */
  invoice_action_log_by_pk?: Maybe<Invoice_Action_Log>;
  /** fetch aggregated fields from the table: "invoice" */
  invoice_aggregate: Invoice_Aggregate;
  /** fetch data from the table: "invoice_bill_item" */
  invoice_bill_item: Array<Invoice_Bill_Item>;
  /** fetch aggregated fields from the table: "invoice_bill_item" */
  invoice_bill_item_aggregate: Invoice_Bill_Item_Aggregate;
  /** fetch data from the table: "invoice_bill_item" using primary key columns */
  invoice_bill_item_by_pk?: Maybe<Invoice_Bill_Item>;
  /** fetch data from the table: "invoice" using primary key columns */
  invoice_by_pk?: Maybe<Invoice>;
  /** fetch data from the table: "invoice_schedule" */
  invoice_schedule: Array<Invoice_Schedule>;
  /** fetch aggregated fields from the table: "invoice_schedule" */
  invoice_schedule_aggregate: Invoice_Schedule_Aggregate;
  /** fetch data from the table: "invoice_schedule" using primary key columns */
  invoice_schedule_by_pk?: Maybe<Invoice_Schedule>;
  /** fetch data from the table: "invoice_schedule_history" */
  invoice_schedule_history: Array<Invoice_Schedule_History>;
  /** fetch aggregated fields from the table: "invoice_schedule_history" */
  invoice_schedule_history_aggregate: Invoice_Schedule_History_Aggregate;
  /** fetch data from the table: "invoice_schedule_history" using primary key columns */
  invoice_schedule_history_by_pk?: Maybe<Invoice_Schedule_History>;
  /** fetch data from the table: "invoice_schedule_student" */
  invoice_schedule_student: Array<Invoice_Schedule_Student>;
  /** fetch aggregated fields from the table: "invoice_schedule_student" */
  invoice_schedule_student_aggregate: Invoice_Schedule_Student_Aggregate;
  /** fetch data from the table: "invoice_schedule_student" using primary key columns */
  invoice_schedule_student_by_pk?: Maybe<Invoice_Schedule_Student>;
  /** fetch data from the table: "partner_convenience_store" */
  partner_convenience_store: Array<Partner_Convenience_Store>;
  /** fetch aggregated fields from the table: "partner_convenience_store" */
  partner_convenience_store_aggregate: Partner_Convenience_Store_Aggregate;
  /** fetch data from the table: "partner_convenience_store" using primary key columns */
  partner_convenience_store_by_pk?: Maybe<Partner_Convenience_Store>;
  /** fetch data from the table: "payment" */
  payment: Array<Payment>;
  /** fetch aggregated fields from the table: "payment" */
  payment_aggregate: Payment_Aggregate;
  /** fetch data from the table: "payment" using primary key columns */
  payment_by_pk?: Maybe<Payment>;
  /** fetch data from the table: "prefecture" */
  prefecture: Array<Prefecture>;
  /** fetch aggregated fields from the table: "prefecture" */
  prefecture_aggregate: Prefecture_Aggregate;
  /** fetch data from the table: "prefecture" using primary key columns */
  prefecture_by_pk?: Maybe<Prefecture>;
  /** fetch data from the table: "student_payment_detail" */
  student_payment_detail: Array<Student_Payment_Detail>;
  /** fetch aggregated fields from the table: "student_payment_detail" */
  student_payment_detail_aggregate: Student_Payment_Detail_Aggregate;
  /** fetch data from the table: "student_payment_detail" using primary key columns */
  student_payment_detail_by_pk?: Maybe<Student_Payment_Detail>;
  /** fetch data from the table: "students" */
  students: Array<Students>;
  /** fetch aggregated fields from the table: "students" */
  students_aggregate: Students_Aggregate;
  /** fetch data from the table: "students" using primary key columns */
  students_by_pk?: Maybe<Students>;
  /** fetch data from the table: "user_access_paths" */
  user_access_paths: Array<User_Access_Paths>;
  /** fetch aggregated fields from the table: "user_access_paths" */
  user_access_paths_aggregate: User_Access_Paths_Aggregate;
  /** fetch data from the table: "user_access_paths" using primary key columns */
  user_access_paths_by_pk?: Maybe<User_Access_Paths>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


/** subscription root */
export type Subscription_RootBankArgs = {
  distinct_on?: InputMaybe<Array<Bank_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Order_By>>;
  where?: InputMaybe<Bank_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBank_AccountArgs = {
  distinct_on?: InputMaybe<Array<Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Account_Order_By>>;
  where?: InputMaybe<Bank_Account_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBank_Account_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bank_Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Account_Order_By>>;
  where?: InputMaybe<Bank_Account_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBank_Account_By_PkArgs = {
  bank_account_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootBank_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bank_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Order_By>>;
  where?: InputMaybe<Bank_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBank_BranchArgs = {
  distinct_on?: InputMaybe<Array<Bank_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Branch_Order_By>>;
  where?: InputMaybe<Bank_Branch_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBank_Branch_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bank_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Branch_Order_By>>;
  where?: InputMaybe<Bank_Branch_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBank_Branch_By_PkArgs = {
  bank_branch_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootBank_By_PkArgs = {
  bank_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootBank_MappingArgs = {
  distinct_on?: InputMaybe<Array<Bank_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Mapping_Order_By>>;
  where?: InputMaybe<Bank_Mapping_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBank_Mapping_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bank_Mapping_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bank_Mapping_Order_By>>;
  where?: InputMaybe<Bank_Mapping_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBank_Mapping_By_PkArgs = {
  bank_mapping_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootBill_ItemArgs = {
  distinct_on?: InputMaybe<Array<Bill_Item_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bill_Item_Order_By>>;
  where?: InputMaybe<Bill_Item_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBill_Item_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bill_Item_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bill_Item_Order_By>>;
  where?: InputMaybe<Bill_Item_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBill_Item_By_PkArgs = {
  bill_item_sequence_number: Scalars['Int'];
  order_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootBilling_AddressArgs = {
  distinct_on?: InputMaybe<Array<Billing_Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Billing_Address_Order_By>>;
  where?: InputMaybe<Billing_Address_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBilling_Address_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Billing_Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Billing_Address_Order_By>>;
  where?: InputMaybe<Billing_Address_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBilling_Address_By_PkArgs = {
  billing_address_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootBulk_Payment_RequestArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBulk_Payment_Request_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBulk_Payment_Request_By_PkArgs = {
  bulk_payment_request_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootBulk_Payment_Request_FileArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_File_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_File_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBulk_Payment_Request_File_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Request_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Request_File_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Request_File_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBulk_Payment_Request_File_By_PkArgs = {
  bulk_payment_request_file_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootBulk_Payment_ValidationsArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Validations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Validations_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Validations_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBulk_Payment_Validations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bulk_Payment_Validations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bulk_Payment_Validations_Order_By>>;
  where?: InputMaybe<Bulk_Payment_Validations_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootBulk_Payment_Validations_By_PkArgs = {
  bulk_payment_validations_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootGranted_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Granted_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Granted_Permissions_Order_By>>;
  where?: InputMaybe<Granted_Permissions_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootGranted_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Granted_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Granted_Permissions_Order_By>>;
  where?: InputMaybe<Granted_Permissions_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoiceArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Order_By>>;
  where?: InputMaybe<Invoice_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Action_LogArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Action_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Action_Log_Order_By>>;
  where?: InputMaybe<Invoice_Action_Log_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Action_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Action_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Action_Log_Order_By>>;
  where?: InputMaybe<Invoice_Action_Log_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Action_Log_By_PkArgs = {
  invoice_action_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootInvoice_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Order_By>>;
  where?: InputMaybe<Invoice_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Bill_ItemArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Bill_Item_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Bill_Item_Order_By>>;
  where?: InputMaybe<Invoice_Bill_Item_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Bill_Item_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Bill_Item_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Bill_Item_Order_By>>;
  where?: InputMaybe<Invoice_Bill_Item_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Bill_Item_By_PkArgs = {
  invoice_bill_item_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootInvoice_By_PkArgs = {
  invoice_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootInvoice_ScheduleArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Schedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Schedule_By_PkArgs = {
  invoice_schedule_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootInvoice_Schedule_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_History_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_History_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Schedule_History_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_History_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_History_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_History_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Schedule_History_By_PkArgs = {
  invoice_schedule_history_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootInvoice_Schedule_StudentArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_Student_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_Student_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_Student_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Schedule_Student_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Schedule_Student_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Schedule_Student_Order_By>>;
  where?: InputMaybe<Invoice_Schedule_Student_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInvoice_Schedule_Student_By_PkArgs = {
  invoice_schedule_student_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootPartner_Convenience_StoreArgs = {
  distinct_on?: InputMaybe<Array<Partner_Convenience_Store_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Partner_Convenience_Store_Order_By>>;
  where?: InputMaybe<Partner_Convenience_Store_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPartner_Convenience_Store_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Partner_Convenience_Store_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Partner_Convenience_Store_Order_By>>;
  where?: InputMaybe<Partner_Convenience_Store_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPartner_Convenience_Store_By_PkArgs = {
  partner_convenience_store_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootPaymentArgs = {
  distinct_on?: InputMaybe<Array<Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Order_By>>;
  where?: InputMaybe<Payment_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPayment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Payment_Order_By>>;
  where?: InputMaybe<Payment_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPayment_By_PkArgs = {
  payment_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootPrefectureArgs = {
  distinct_on?: InputMaybe<Array<Prefecture_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Prefecture_Order_By>>;
  where?: InputMaybe<Prefecture_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPrefecture_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Prefecture_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Prefecture_Order_By>>;
  where?: InputMaybe<Prefecture_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPrefecture_By_PkArgs = {
  prefecture_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootStudent_Payment_DetailArgs = {
  distinct_on?: InputMaybe<Array<Student_Payment_Detail_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Student_Payment_Detail_Order_By>>;
  where?: InputMaybe<Student_Payment_Detail_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootStudent_Payment_Detail_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Student_Payment_Detail_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Student_Payment_Detail_Order_By>>;
  where?: InputMaybe<Student_Payment_Detail_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootStudent_Payment_Detail_By_PkArgs = {
  student_payment_detail_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootStudentsArgs = {
  distinct_on?: InputMaybe<Array<Students_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Students_Order_By>>;
  where?: InputMaybe<Students_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootStudents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Students_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Students_Order_By>>;
  where?: InputMaybe<Students_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootStudents_By_PkArgs = {
  student_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootUser_Access_PathsArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_Access_Paths_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_Access_Paths_By_PkArgs = {
  location_id: Scalars['String'];
  user_id: Scalars['String'];
};


/** subscription root */
export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUsers_By_PkArgs = {
  user_id: Scalars['String'];
};

/** expression to compare columns of type timestamptz. All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
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

/** columns and relationships of "user_access_paths" */
export type User_Access_Paths = {
  access_path?: Maybe<Scalars['String']>;
  /** An object relationship */
  bank_account?: Maybe<Bank_Account>;
  /** An object relationship */
  bank_account_location_permission?: Maybe<Granted_Permissions>;
  /** An object relationship */
  billing_address?: Maybe<Billing_Address>;
  /** An object relationship */
  billing_address_location_permission?: Maybe<Granted_Permissions>;
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  invoice?: Maybe<Invoice>;
  /** An object relationship */
  invoice_location_permission?: Maybe<Granted_Permissions>;
  location_id: Scalars['String'];
  /** An object relationship */
  payment?: Maybe<Payment>;
  /** An object relationship */
  payment_location_permission?: Maybe<Granted_Permissions>;
  resource_path: Scalars['String'];
  /** An object relationship */
  student_payment_detail?: Maybe<Student_Payment_Detail>;
  /** An object relationship */
  student_payment_detail_location_permission?: Maybe<Granted_Permissions>;
  /** An object relationship */
  students?: Maybe<Students>;
  /** An object relationship */
  students_location_permission?: Maybe<Granted_Permissions>;
  updated_at: Scalars['timestamptz'];
  /** An object relationship */
  user_access_paths_location_permission?: Maybe<Granted_Permissions>;
  user_id: Scalars['String'];
  /** An object relationship */
  users?: Maybe<Users>;
  /** An object relationship */
  users_location_permission?: Maybe<Granted_Permissions>;
};

/** aggregated selection of "user_access_paths" */
export type User_Access_Paths_Aggregate = {
  aggregate?: Maybe<User_Access_Paths_Aggregate_Fields>;
  nodes: Array<User_Access_Paths>;
};

/** aggregate fields of "user_access_paths" */
export type User_Access_Paths_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<User_Access_Paths_Max_Fields>;
  min?: Maybe<User_Access_Paths_Min_Fields>;
};


/** aggregate fields of "user_access_paths" */
export type User_Access_Paths_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user_access_paths" */
export type User_Access_Paths_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<User_Access_Paths_Max_Order_By>;
  min?: InputMaybe<User_Access_Paths_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user_access_paths" */
export type User_Access_Paths_Arr_Rel_Insert_Input = {
  data: Array<User_Access_Paths_Insert_Input>;
  on_conflict?: InputMaybe<User_Access_Paths_On_Conflict>;
};

/** Boolean expression to filter rows from the table "user_access_paths". All fields are combined with a logical 'AND'. */
export type User_Access_Paths_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<User_Access_Paths_Bool_Exp>>>;
  _not?: InputMaybe<User_Access_Paths_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<User_Access_Paths_Bool_Exp>>>;
  access_path?: InputMaybe<String_Comparison_Exp>;
  bank_account?: InputMaybe<Bank_Account_Bool_Exp>;
  bank_account_location_permission?: InputMaybe<Granted_Permissions_Bool_Exp>;
  billing_address?: InputMaybe<Billing_Address_Bool_Exp>;
  billing_address_location_permission?: InputMaybe<Granted_Permissions_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  invoice?: InputMaybe<Invoice_Bool_Exp>;
  invoice_location_permission?: InputMaybe<Granted_Permissions_Bool_Exp>;
  location_id?: InputMaybe<String_Comparison_Exp>;
  payment?: InputMaybe<Payment_Bool_Exp>;
  payment_location_permission?: InputMaybe<Granted_Permissions_Bool_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  student_payment_detail?: InputMaybe<Student_Payment_Detail_Bool_Exp>;
  student_payment_detail_location_permission?: InputMaybe<Granted_Permissions_Bool_Exp>;
  students?: InputMaybe<Students_Bool_Exp>;
  students_location_permission?: InputMaybe<Granted_Permissions_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_access_paths_location_permission?: InputMaybe<Granted_Permissions_Bool_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
  users?: InputMaybe<Users_Bool_Exp>;
  users_location_permission?: InputMaybe<Granted_Permissions_Bool_Exp>;
};

/** unique or primary key constraints on table "user_access_paths" */
export enum User_Access_Paths_Constraint {
  /** unique or primary key constraint */
  UserAccessPathsPk = 'user_access_paths_pk'
}

/** input type for inserting data into table "user_access_paths" */
export type User_Access_Paths_Insert_Input = {
  access_path?: InputMaybe<Scalars['String']>;
  bank_account?: InputMaybe<Bank_Account_Obj_Rel_Insert_Input>;
  billing_address?: InputMaybe<Billing_Address_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  invoice?: InputMaybe<Invoice_Obj_Rel_Insert_Input>;
  location_id?: InputMaybe<Scalars['String']>;
  payment?: InputMaybe<Payment_Obj_Rel_Insert_Input>;
  resource_path?: InputMaybe<Scalars['String']>;
  student_payment_detail?: InputMaybe<Student_Payment_Detail_Obj_Rel_Insert_Input>;
  students?: InputMaybe<Students_Obj_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['String']>;
  users?: InputMaybe<Users_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type User_Access_Paths_Max_Fields = {
  access_path?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  location_id?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user_access_paths" */
export type User_Access_Paths_Max_Order_By = {
  access_path?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  location_id?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type User_Access_Paths_Min_Fields = {
  access_path?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  location_id?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user_access_paths" */
export type User_Access_Paths_Min_Order_By = {
  access_path?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  location_id?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "user_access_paths" */
export type User_Access_Paths_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<User_Access_Paths>;
};

/** input type for inserting object relation for remote table "user_access_paths" */
export type User_Access_Paths_Obj_Rel_Insert_Input = {
  data: User_Access_Paths_Insert_Input;
  on_conflict?: InputMaybe<User_Access_Paths_On_Conflict>;
};

/** on conflict condition type for table "user_access_paths" */
export type User_Access_Paths_On_Conflict = {
  constraint: User_Access_Paths_Constraint;
  update_columns: Array<User_Access_Paths_Update_Column>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** ordering options when selecting data from "user_access_paths" */
export type User_Access_Paths_Order_By = {
  access_path?: InputMaybe<Order_By>;
  bank_account?: InputMaybe<Bank_Account_Order_By>;
  bank_account_location_permission?: InputMaybe<Granted_Permissions_Order_By>;
  billing_address?: InputMaybe<Billing_Address_Order_By>;
  billing_address_location_permission?: InputMaybe<Granted_Permissions_Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  invoice?: InputMaybe<Invoice_Order_By>;
  invoice_location_permission?: InputMaybe<Granted_Permissions_Order_By>;
  location_id?: InputMaybe<Order_By>;
  payment?: InputMaybe<Payment_Order_By>;
  payment_location_permission?: InputMaybe<Granted_Permissions_Order_By>;
  resource_path?: InputMaybe<Order_By>;
  student_payment_detail?: InputMaybe<Student_Payment_Detail_Order_By>;
  student_payment_detail_location_permission?: InputMaybe<Granted_Permissions_Order_By>;
  students?: InputMaybe<Students_Order_By>;
  students_location_permission?: InputMaybe<Granted_Permissions_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_access_paths_location_permission?: InputMaybe<Granted_Permissions_Order_By>;
  user_id?: InputMaybe<Order_By>;
  users?: InputMaybe<Users_Order_By>;
  users_location_permission?: InputMaybe<Granted_Permissions_Order_By>;
};

/** primary key columns input for table: "user_access_paths" */
export type User_Access_Paths_Pk_Columns_Input = {
  location_id: Scalars['String'];
  user_id: Scalars['String'];
};

/** select columns of table "user_access_paths" */
export enum User_Access_Paths_Select_Column {
  /** column name */
  AccessPath = 'access_path',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  LocationId = 'location_id',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "user_access_paths" */
export type User_Access_Paths_Set_Input = {
  access_path?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  location_id?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** update columns of table "user_access_paths" */
export enum User_Access_Paths_Update_Column {
  /** column name */
  AccessPath = 'access_path',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  LocationId = 'location_id',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** columns and relationships of "users" */
export type Users = {
  allow_notification?: Maybe<Scalars['Boolean']>;
  avatar?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['date']>;
  country: Scalars['String'];
  created_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
  device_token?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['Boolean']>;
  facebook_id?: Maybe<Scalars['String']>;
  first_name: Scalars['String'];
  first_name_phonetic?: Maybe<Scalars['String']>;
  full_name_phonetic?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  given_name?: Maybe<Scalars['String']>;
  /** An array relationship */
  invoice: Array<Invoice>;
  /** An aggregated array relationship */
  invoice_aggregate: Invoice_Aggregate;
  is_tester?: Maybe<Scalars['Boolean']>;
  last_login_date?: Maybe<Scalars['timestamptz']>;
  last_name: Scalars['String'];
  last_name_phonetic?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  phone_number?: Maybe<Scalars['String']>;
  phone_verified?: Maybe<Scalars['Boolean']>;
  platform?: Maybe<Scalars['String']>;
  resource_path: Scalars['String'];
  updated_at: Scalars['timestamptz'];
  /** An array relationship */
  user_access_paths: Array<User_Access_Paths>;
  /** An aggregated array relationship */
  user_access_paths_aggregate: User_Access_Paths_Aggregate;
  user_group: Scalars['String'];
  user_id: Scalars['String'];
};


/** columns and relationships of "users" */
export type UsersInvoiceArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Order_By>>;
  where?: InputMaybe<Invoice_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersInvoice_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invoice_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Invoice_Order_By>>;
  where?: InputMaybe<Invoice_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersUser_Access_PathsArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};


/** columns and relationships of "users" */
export type UsersUser_Access_Paths_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Access_Paths_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Access_Paths_Order_By>>;
  where?: InputMaybe<User_Access_Paths_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users" */
export type Users_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Max_Order_By>;
  min?: InputMaybe<Users_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users" */
export type Users_Arr_Rel_Insert_Input = {
  data: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<InputMaybe<Users_Bool_Exp>>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<InputMaybe<Users_Bool_Exp>>>;
  allow_notification?: InputMaybe<Boolean_Comparison_Exp>;
  avatar?: InputMaybe<String_Comparison_Exp>;
  birthday?: InputMaybe<Date_Comparison_Exp>;
  country?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deleted_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  device_token?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  email_verified?: InputMaybe<Boolean_Comparison_Exp>;
  facebook_id?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  first_name_phonetic?: InputMaybe<String_Comparison_Exp>;
  full_name_phonetic?: InputMaybe<String_Comparison_Exp>;
  gender?: InputMaybe<String_Comparison_Exp>;
  given_name?: InputMaybe<String_Comparison_Exp>;
  invoice?: InputMaybe<Invoice_Bool_Exp>;
  is_tester?: InputMaybe<Boolean_Comparison_Exp>;
  last_login_date?: InputMaybe<Timestamptz_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  last_name_phonetic?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  phone_number?: InputMaybe<String_Comparison_Exp>;
  phone_verified?: InputMaybe<Boolean_Comparison_Exp>;
  platform?: InputMaybe<String_Comparison_Exp>;
  resource_path?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_access_paths?: InputMaybe<User_Access_Paths_Bool_Exp>;
  user_group?: InputMaybe<String_Comparison_Exp>;
  user_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint */
  UsersPk = 'users_pk'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  allow_notification?: InputMaybe<Scalars['Boolean']>;
  avatar?: InputMaybe<Scalars['String']>;
  birthday?: InputMaybe<Scalars['date']>;
  country?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  device_token?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  email_verified?: InputMaybe<Scalars['Boolean']>;
  facebook_id?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  first_name_phonetic?: InputMaybe<Scalars['String']>;
  full_name_phonetic?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  given_name?: InputMaybe<Scalars['String']>;
  invoice?: InputMaybe<Invoice_Arr_Rel_Insert_Input>;
  is_tester?: InputMaybe<Scalars['Boolean']>;
  last_login_date?: InputMaybe<Scalars['timestamptz']>;
  last_name?: InputMaybe<Scalars['String']>;
  last_name_phonetic?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phone_number?: InputMaybe<Scalars['String']>;
  phone_verified?: InputMaybe<Scalars['Boolean']>;
  platform?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_access_paths?: InputMaybe<User_Access_Paths_Arr_Rel_Insert_Input>;
  user_group?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  avatar?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['date']>;
  country?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  device_token?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  facebook_id?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  first_name_phonetic?: Maybe<Scalars['String']>;
  full_name_phonetic?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  given_name?: Maybe<Scalars['String']>;
  last_login_date?: Maybe<Scalars['timestamptz']>;
  last_name?: Maybe<Scalars['String']>;
  last_name_phonetic?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone_number?: Maybe<Scalars['String']>;
  platform?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_group?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "users" */
export type Users_Max_Order_By = {
  avatar?: InputMaybe<Order_By>;
  birthday?: InputMaybe<Order_By>;
  country?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  device_token?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  facebook_id?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  first_name_phonetic?: InputMaybe<Order_By>;
  full_name_phonetic?: InputMaybe<Order_By>;
  gender?: InputMaybe<Order_By>;
  given_name?: InputMaybe<Order_By>;
  last_login_date?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  last_name_phonetic?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  phone_number?: InputMaybe<Order_By>;
  platform?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_group?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  avatar?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['date']>;
  country?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  deleted_at?: Maybe<Scalars['timestamptz']>;
  device_token?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  facebook_id?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  first_name_phonetic?: Maybe<Scalars['String']>;
  full_name_phonetic?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  given_name?: Maybe<Scalars['String']>;
  last_login_date?: Maybe<Scalars['timestamptz']>;
  last_name?: Maybe<Scalars['String']>;
  last_name_phonetic?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone_number?: Maybe<Scalars['String']>;
  platform?: Maybe<Scalars['String']>;
  resource_path?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_group?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "users" */
export type Users_Min_Order_By = {
  avatar?: InputMaybe<Order_By>;
  birthday?: InputMaybe<Order_By>;
  country?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  device_token?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  facebook_id?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  first_name_phonetic?: InputMaybe<Order_By>;
  full_name_phonetic?: InputMaybe<Order_By>;
  gender?: InputMaybe<Order_By>;
  given_name?: InputMaybe<Order_By>;
  last_login_date?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  last_name_phonetic?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  phone_number?: InputMaybe<Order_By>;
  platform?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_group?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** ordering options when selecting data from "users" */
export type Users_Order_By = {
  allow_notification?: InputMaybe<Order_By>;
  avatar?: InputMaybe<Order_By>;
  birthday?: InputMaybe<Order_By>;
  country?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deleted_at?: InputMaybe<Order_By>;
  device_token?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  email_verified?: InputMaybe<Order_By>;
  facebook_id?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  first_name_phonetic?: InputMaybe<Order_By>;
  full_name_phonetic?: InputMaybe<Order_By>;
  gender?: InputMaybe<Order_By>;
  given_name?: InputMaybe<Order_By>;
  invoice_aggregate?: InputMaybe<Invoice_Aggregate_Order_By>;
  is_tester?: InputMaybe<Order_By>;
  last_login_date?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  last_name_phonetic?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  phone_number?: InputMaybe<Order_By>;
  phone_verified?: InputMaybe<Order_By>;
  platform?: InputMaybe<Order_By>;
  resource_path?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_access_paths_aggregate?: InputMaybe<User_Access_Paths_Aggregate_Order_By>;
  user_group?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: "users" */
export type Users_Pk_Columns_Input = {
  user_id: Scalars['String'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  AllowNotification = 'allow_notification',
  /** column name */
  Avatar = 'avatar',
  /** column name */
  Birthday = 'birthday',
  /** column name */
  Country = 'country',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  DeviceToken = 'device_token',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'email_verified',
  /** column name */
  FacebookId = 'facebook_id',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  FirstNamePhonetic = 'first_name_phonetic',
  /** column name */
  FullNamePhonetic = 'full_name_phonetic',
  /** column name */
  Gender = 'gender',
  /** column name */
  GivenName = 'given_name',
  /** column name */
  IsTester = 'is_tester',
  /** column name */
  LastLoginDate = 'last_login_date',
  /** column name */
  LastName = 'last_name',
  /** column name */
  LastNamePhonetic = 'last_name_phonetic',
  /** column name */
  Name = 'name',
  /** column name */
  PhoneNumber = 'phone_number',
  /** column name */
  PhoneVerified = 'phone_verified',
  /** column name */
  Platform = 'platform',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserGroup = 'user_group',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  allow_notification?: InputMaybe<Scalars['Boolean']>;
  avatar?: InputMaybe<Scalars['String']>;
  birthday?: InputMaybe<Scalars['date']>;
  country?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  deleted_at?: InputMaybe<Scalars['timestamptz']>;
  device_token?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  email_verified?: InputMaybe<Scalars['Boolean']>;
  facebook_id?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  first_name_phonetic?: InputMaybe<Scalars['String']>;
  full_name_phonetic?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  given_name?: InputMaybe<Scalars['String']>;
  is_tester?: InputMaybe<Scalars['Boolean']>;
  last_login_date?: InputMaybe<Scalars['timestamptz']>;
  last_name?: InputMaybe<Scalars['String']>;
  last_name_phonetic?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phone_number?: InputMaybe<Scalars['String']>;
  phone_verified?: InputMaybe<Scalars['Boolean']>;
  platform?: InputMaybe<Scalars['String']>;
  resource_path?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_group?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['String']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  AllowNotification = 'allow_notification',
  /** column name */
  Avatar = 'avatar',
  /** column name */
  Birthday = 'birthday',
  /** column name */
  Country = 'country',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeletedAt = 'deleted_at',
  /** column name */
  DeviceToken = 'device_token',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'email_verified',
  /** column name */
  FacebookId = 'facebook_id',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  FirstNamePhonetic = 'first_name_phonetic',
  /** column name */
  FullNamePhonetic = 'full_name_phonetic',
  /** column name */
  Gender = 'gender',
  /** column name */
  GivenName = 'given_name',
  /** column name */
  IsTester = 'is_tester',
  /** column name */
  LastLoginDate = 'last_login_date',
  /** column name */
  LastName = 'last_name',
  /** column name */
  LastNamePhonetic = 'last_name_phonetic',
  /** column name */
  Name = 'name',
  /** column name */
  PhoneNumber = 'phone_number',
  /** column name */
  PhoneVerified = 'phone_verified',
  /** column name */
  Platform = 'platform',
  /** column name */
  ResourcePath = 'resource_path',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserGroup = 'user_group',
  /** column name */
  UserId = 'user_id'
}
