@cms
@user
@import-students

Feature: Import students fails invalid value
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Import fails when file has <condition>
        Given school admin has created a "student template csv" file with "<condition>" and "invalid on row <numberRow>"
        When school admin imports the "student template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin "does not see" new imported students on the Student Management

        Examples:
            | condition                       | content                                      | numberRow |
            | invalid email format            | email is invalid at row 2                    | 2         |
            | existing student email          | email is already registered at row 3         | 3         |
            | duplicated student phone number | student_phone_number is duplicated at row  2 | 2         |
            | invalid student phone number    | student_phone_number is invalid at row  3    | 3         |

    Scenario Outline: Import fails when file has invalid field <condition> value
        Given school admin has created a "student template csv" file with "invalid field <condition>" and "invalid on row <numberRow>"
        When school admin imports the "student template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin "does not see" new imported students on the Student Management

        Examples:
            | condition            | content                                  | numberRow |
            | Enrollment Status    | enrollment_status is invalid at row 2    | 2         |
            | Grade                | grade is invalid at row 3                | 3         |
            | Gender               | gender is invalid at row 2               | 2         |
            | Birthday             | birthday is invalid at row 3             | 3         |
            | Prefecture           | prefecture is invalid at row 2           | 2         |
            | Student Phone Number | student_phone_number is invalid at row 3 | 3         |
            | Home Phone Number    | home_phone_number is invalid at row 2    | 2         |
            | Contact Preference   | contact_preference is invalid at row 3   | 3         |
            | Student Tag          | student_tag is invalid at row 2          | 2         |