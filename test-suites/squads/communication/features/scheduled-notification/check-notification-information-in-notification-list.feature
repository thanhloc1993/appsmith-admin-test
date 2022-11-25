@cms @learner @parent
@communication
@scheduled-notification
@ignore

Feature: Check notification information in notification list

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student" logins Learner App
        And "parent" logins Learner App

    Scenario Outline: Information of notification with "Sent" status is displayed correctly in notification list
        When school admin has created notification and send to "<audienceType>"
        Then school admin sees information in notification list display correctly
        Examples:
            | audienceType |
            | All          |
            | Student      |
            | Parent       |

    Scenario Outline: Information of notification with "Draft" status is displayed correctly in notification list
        When school admin has created a draft notification with "<audienceType>"
        Then school admin sees information in notification list display correctly
        Examples:
            | audienceType |
            | All          |
            | Student      |
            | Parent       |

    Scenario Outline: Information of notification with "Schedule" status is displayed correctly in notification list
        When school admin has created a scheduled notification with "<audienceType>"
        Then school admin sees information in notification list display correctly
        Examples:
            | audienceType |
            | All          |
            | Student      |
            | Parent       |
