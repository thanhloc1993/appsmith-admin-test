@cms
@user @import-parents

Feature: Import parents fails invalid value
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Import failed with file has <condition>
        Given school admin has created a "parent template csv" file with "<condition>" and "invalid on row <numberRow>"
        When school admin imports the "parent template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin cannot add a new random imported parent into a new student
        Examples:
            | condition                      | content                                     | numberRow |
            | invalid email format           | email is invalid at row 2                   | 2         |
            | existing parent email          | email is already registered at row 2        | 2         |
            | invalid phone format           | phone_number is invalid at row 2            | 2         |
            | existing parent phone          | phone_number is already registered at row 2 | 2         |
            | student email does not existed | student_email is invalid at row 2           | 2         |

    Scenario Outline: Import failed with file has invalid field <condition> value
        Given school admin has created a "parent template csv" file with "invalid field <condition>" and "invalid on row <numberRow>"
        When school admin imports the "parent template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin cannot add a new random imported parent into a new student
        Examples:
            | condition                    | content                                                          | numberRow |
            | Relationship                 | relationship is invalid at row 2                                 | 2         |
            | Student Email                | student_email is invalid at row 2                                | 2         |
            | Student Email & Relationship | No. of Email/s and No. of Relationship/s does not match at row 2 | 2         |
            | Parent Tag                   | parent_tag is invalid at row 2                                   | 2         |