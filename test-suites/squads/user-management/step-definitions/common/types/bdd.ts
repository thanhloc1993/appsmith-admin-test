export type AccessTypes = 'URL' | 'Menu';

export type ConditionStatusTypes = 'sees' | 'does not see';

export type MessageTypes = 'info' | 'successful' | 'error';

export type UserMasterEntity =
    | 'School Level'
    | 'School'
    | 'School Course'
    | 'School Level Grade'
    | 'User Tag'
    | 'Bank'
    | 'Bank Branch'
    | 'Timesheet Config'
    | 'School Level & School & School Course';

export type UserMasterInvalidCondition =
    | 'missing required field'
    | 'invalid header'
    | 'invalid is_archived field'
    | 'entity_id field does not existed'
    | 'invalid foreign_key'
    | 'sequence field is duplicated'
    | 'entity_partner_id is duplicated'
    | 'invalid user_tag_type field'
    | 'bank_code is duplicated'
    | 'bank_branch_code is duplicated'
    | 'invalid bank_phonetic_name'
    | 'invalid bank_branch_phonetic_name'
    | 'invalid config_type field';

export type FieldsConditionTypes =
    | 'without required fields'
    | 'without optional fields'
    | 'with full fields'
    | 'with full fields having current school'
    | 'with full fields no having current school'
    | 'without school history';

export type WithConditionTypes = 'with' | 'without';

export type ResultsConditionTypes = 'unsuccessfully' | 'successfully';

export type PositionsMessagesType = 'snackbar' | 'student form';

export type ExpectedResultTypes = 'sees' | 'does not see';

export type PageTypes = 'first' | 'end';

export type ActionsTypes = 'click' | 'select';
