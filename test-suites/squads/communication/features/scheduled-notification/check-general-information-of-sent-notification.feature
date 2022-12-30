@cms @learner @parent
@communication
@scheduled-notification

Feature: Check general information of notification in notification detail

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student S1" logins Learner App
        And "parent P1" logins Learner App
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: General information is displayed correctly after school admin creates and sends notification
        Given school admin has created and send notification with "<audienceType>"
        When school admin clicks created notification in notification table
        Then school admin sees general information in notification detail displayed correctly
        Examples:
            | audienceType |
            | All          |
            | Student      |
            | Parent       |

    Scenario Outline: General information is displayed correctly after school admin sends draft notification
        Given school admin has created a draft notification with "<audienceType>"
        And school admin has sent draft notification
        When school admin clicks created notification in notification table
        Then school admin sees general information in notification detail displayed correctly
        Examples:
            | audienceType |
            | All          |
            | Student      |
            | Parent       |

    Scenario Outline: General information is displayed correctly after scheduled notification change status to sent
        Given school admin has created a scheduled notification with "<audienceType>"
        And school admin waits for scheduled notification to be sent on time
        When "school admin" searches this notification
        And school admin clicks created send notification in notification table
        Then school admin sees general information in notification detail displayed correctly
        Examples:
            | audienceType |
            | All          |
            | Student      |
            | Parent       |
