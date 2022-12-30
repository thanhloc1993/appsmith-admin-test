@cms @learner @parent
@communication
@scheduled-notification
@ignore

Feature: Check draft and scheduled notifications information in notification list

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student" logins Learner App
        And "parent" logins Learner App

    Scenario Outline: Information of notification with "Draft" status is displayed correctly in notification list after edit
        When school admin has created a draft notification with "<audienceType>"
        And school admin has edited a draft notification
        Then school admin sees information in notification list display correctly
        Examples:
            | audienceType |
            | All          |
            | Student      |
            | Parent       |

    Scenario Outline: Information of notification with "Schedule" status is displayed correctly in notification list after edit
        When school admin has created a scheduled notification with "<audienceType>"
        And school admin has edited a scheduled notification
        Then school admin sees information in notification display correctly
        Examples:
            | audienceType |
            | All          |
            | Student      |
            | Parent       |
