@cms @parent
@user @student-info @parent-info

Feature: Edit student email on CMS

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with parent info

    Scenario Outline: School admin edits student email with invalid data
        When school admin edits student email to "<newValues>"
        Then school admin sees an error message
        Examples:
            | newValues                       |
            | blank                           |
            | invalid email format            |
            | existing student email          |
            | existing parent email in system |

    Scenario: School admin cancels edit student email
        Given school admin is on Edit student screen
        And school admin changes student email
        When school admin cancels to edit student
        Then school admin sees nothing changed

    Scenario: School admin edits student email with valid data
        When school admin edits student email with valid data
        Then school admin sees student email is updated
        And student cannot log in Learner App with old email
        And student logins Learner App with new email successfully