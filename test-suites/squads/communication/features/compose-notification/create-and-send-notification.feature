@cms @learner @parent
@communication
@compose-notification

Feature: Create and send notification

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student" logins Learner App
        And "parent P1" of "student" logins Learner App
        And "school admin" is at "Notification" page on CMS

    Scenario: Create and send notification with required fields
        When school admin sends notification with required fields to student and parent
        Then school admin sends notification successfully
        And "student" receives the notification in their device
        And "parent P1" receives the notification in their device

    Scenario: Create and send a draft notification
        Given school admin has saved a draft notification with required fields
        When school admin sends that draft notification for student and parent
        Then school admin sends notification successfully
        And "student" receives the notification in their device
        And "parent P1" receives the notification in their device
