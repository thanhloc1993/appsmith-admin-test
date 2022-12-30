@cms
@user
@import-students

Feature: Import students fails invalid header
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Import fails when file was <action> a header
        Given school admin has created a "student template csv" file with "<action> a header" and "<=1000 rows"
        When school admin imports the "student template csv" file
        And school admin sees a "<type>" message contained "<content>" on the snackbar
        And school admin "<result>" new imported students on the Student Management
        Examples:
            | action         | type       | content                                         | result       |
            | swap           | successful | You have imported the student list successfully | sees         |
            | deleteRequire  | error      | first_name is required at row 2                 | does not see |
            | deleteOptional | successful | You have imported the student list successfully | sees         |
            | add            | successful | You have imported the student list successfully | sees         |
            | edit           | error      | first_name is required at row 2                 | does not see |