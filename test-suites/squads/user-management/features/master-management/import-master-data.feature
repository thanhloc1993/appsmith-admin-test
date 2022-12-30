@cms
@user @user-import-master-data

Feature: Import Master Data

    Background:
        Given "school admin" logins CMS
        And school admin is on the "Master Management" page

    Scenario Outline: Import "<entity>" Master Data successful
        Given school admin has created a valid master "<entity>" file
        When school admin imports the master "<entity>" file
        Then school admin sees a "successful" message contained "The records are imported successfully!" on the snackbar

        Examples:
            | entity             |
            | School Level       |
            | School             |
            | School Course      |
            | School Level Grade |
            | User Tag           |
            | Bank               |
            | Bank Branch        |
            | Timesheet Config   |

    Scenario Outline: Import "<entity>" Master Data failed
        Given school admin has created a invalid master "<entity>" file with "<condition>"
        When school admin imports the master "<entity>" file
        Then school admin sees a "error" message contained "There is something wrong please check your data!" on the snackbar

        Examples:
            | entity             | condition                                                                                                                                                                                          |
            | School Level       | 1 of [missing required field, invalid header, invalid is_archived field, entity_id field does not existed, sequence field is duplicated]                                                           |
            | School             | 1 of [missing required field, invalid header, invalid is_archived field, entity_id field does not existed, entity_partner_id is duplicated]                                                        |
            | School Course      | 1 of [missing required field, invalid header, invalid is_archived field, entity_id field does not existed, entity_partner_id is duplicated, invalid foreign_key]                                   |
            | School Level Grade | 1 of [missing required field, invalid header, invalid foreign_key]                                                                                                                                 |
            | User Tag           | 1 of [missing required field, invalid header, invalid is_archived field, entity_id field does not existed, entity_partner_id is duplicated, invalid user_tag_type field]                           |
            | Bank               | 1 of [missing required field, invalid header, invalid is_archived field, entity_id field does not existed, bank_code is duplicated, invalid bank_phonetic_name]                                    |
            | Bank Branch        | 1 of [missing required field, invalid header, invalid is_archived field, entity_id field does not existed, bank_branch_code is duplicated, invalid bank_branch_phonetic_name, invalid foreign_key] |
            | Timesheet Config   | 1 of [missing required field, invalid header, invalid is_archived field, entity_id field does not existed, invalid config_type field]                                                              |
