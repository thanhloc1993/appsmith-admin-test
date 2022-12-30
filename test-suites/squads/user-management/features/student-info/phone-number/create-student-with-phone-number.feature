@cms
@user @student-info
@User_StudentManagement_BackOffice_StudentContactPhoneNumber

Feature: Create Student with Phone Number on CMS

    Background:
        Given "school admin" logins CMS

    @learner
    Scenario Outline: Create student with <phoneNumberField> and preferred to <contactPreference>
        When school admin creates a new student with "<phoneNumberField>" and preferred to "<contactPreference>"
        Then school admin sees newly created student with phone number on CMS
        And student logins Learner App successfully with credentials which school admin gives

        Examples:
            | phoneNumberField         | contactPreference    |
            | student phone number     | student phone number |
            | home phone number        | student phone number |
            | all student phone number | student phone number |
            | all student phone number | home phone number    |
            | all fields empty         | student phone number |
            | all fields empty         | home phone number    |

    Scenario Outline: Create student with phone number failed
        When school admin creates a new student with "<invalid>" phone number
        Then school admin can not "create" a student with "<invalid>" phone number
        Examples:
            | invalid            |
            | incorrect length   |
            | letters            |
            | special characters |
            | duplicate          |