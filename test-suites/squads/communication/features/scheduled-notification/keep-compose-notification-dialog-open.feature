@cms @learner
@communication
@scheduled-notification

Feature: Keep compose notification dialog open

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student S1" logins Learner App
        And "school admin" is at "Notification" page on CMS

    Scenario: Keep compose notification dialog open
        Given school admin has opened compose new notification full-screen dialog
        When school admin fills scheduled notification information
        And school admin has selected sending time in the past
        And school admin clicks "Save schedule" in notification dialog
        Then school admin sees message "You cannot schedule at a time in the past"
