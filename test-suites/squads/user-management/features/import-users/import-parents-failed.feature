@cms
@user @import-parents

Feature: Import parents fails
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Import failed with file has <condition>
        Given school admin has created a "parent template csv" file with "<condition>" and "invalid on row <numberRow>"
        When school admin imports the "parent template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin cannot add a new random imported parent into a new student
        Examples:
            | condition   | content                                                   | numberRow |
            | > 1000 rows | Invalid number of row. The maximum number of rows is 1000 | 0         |
            | duplicated  | email is duplicated at row 3                              | 3         |

    Scenario Outline: Import failed with the value of mandatory items is missing field <condition>
        Given school admin has created a "parent template csv" file with "missing field <condition>" and "invalid on row <numberRow>"
        When school admin imports the "parent template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin cannot add a new random imported parent into a new student
        Examples:
            | condition | content                    | numberRow |
            | Name      | name is required at row 2  | 2         |
            | Email     | email is required at row 3 | 3         |

    Scenario Outline: Scenario: Import fails with multiple error on <numberRow> rows
        Given school admin has created a "parent template csv" file with "multiple error rows" and "invalid on row <numberRow>"
        When school admin imports the "parent template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin cannot add a new random imported parent into a new student
        Examples:
            | content                   | numberRow |
            | name is required at row 2 | [2,3]     |