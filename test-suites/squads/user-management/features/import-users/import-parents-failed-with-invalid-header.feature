@cms
@user @import-parents

Feature: Import parents failed with invalid header
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Import failed with file was <action> a header
        Given school admin has created a "parent template csv" file with "<action> a header" and "<=1000 rows"
        When school admin imports the "parent template csv" file
        And school admin sees a "<type>" message contained "<content>" on the snackbar
        And school admin "<result>" new imported parents into a new student
        Examples:
            | action         | type       | content                                        | result       |
            | swap           | successful | You have imported the parent list successfully | sees         |
            | deleteRequire  | error      | name is required at row 2                      | does not see |
            | deleteOptional | successful | You have imported the parent list successfully | sees         |
            | add            | successful | You have imported the parent list successfully | sees         |
            | edit           | error      | name is required at row 2                      | does not see |