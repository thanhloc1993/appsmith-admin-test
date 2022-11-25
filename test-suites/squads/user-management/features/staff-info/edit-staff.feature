@cms
@user @staff-info
Feature: Edit staff info

    Background:
        Given "school admin" logins CMS
        And school admin has created a staff
        And school admin selects all locations on location setting

    Scenario Outline: Edit staff info successfully
        When school admin edits staff with "<validCondition>"
        Then school admin sees the edited staff data is updated on CMS
        Examples:
            | validCondition        |
            | only mandatory inputs |
            | all valid inputs      |

    Scenario Outline: Edit staff info failed
        When school admin edits staff with "<invalidCondition>"
        Then school admin sees the "<errorMessage>" message
        And school admin sees the staff with new data is not saved
        Examples:
            | invalidCondition            | errorMessage                 |
            | empty name                  | This field is required       |
            | empty email                 | This field is required       |
            | empty location              | This field is required       |
            | invalid email format        | Email address is not valid   |
            | existed email               | Email address already exists |
            | invalid phone number format | Phone number is not valid    |
            | duplicate phone number      | Duplicate phone number       |

    @teacher
    Scenario: Edit Staff Email
        Given "teacher" logins Teacher App
        When school admin edits staff email with valid data
        And school admin clicks on Save button
        Then school admin sees the staff email is updated on CMS
        And staff logins Teacher App with new email successfully
        And staff logins CMS with new email successfully

    @teacher @learner @parent
    Scenario: Edit staff Name
        Given school admin has created a student with parent info and "visible" course
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And "parent P1" logins Learner App
        When school admin edits staff name
        Then school admin sees the edited staff name on CMS
        And staff sees the edited staff name on Teacher App
        And student sees the edited staff name on Learner App
        And parent sees the edited staff name on Learner App
