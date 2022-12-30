@cms
@user @student-info
@User_StudentManagement_BackOffice_StudentContactPhoneNumber

Feature: Edit Student with Phone Number on CMS

    Background:
        Given "school admin" logins CMS
        And school admin creates a new student with student phone number

    Scenario Outline: Edit student phone number to <valueType>
        When school admin edits phone number to "<valueType>"
        Then school admin sees the edited student phone number data on CMS
        Examples:
            | valueType      |
            | existing in db |
            | blank          |

    Scenario Outline: Edit student with phone number failed
        When school admin edits phone number to "<invalidValueType>"
        Then school admin can not "edit" a student with "<invalidValueType>" phone number
        Examples:
            | invalidValueType   |
            | incorrect length   |
            | letters            |
            | special characters |
            | duplicate          |
