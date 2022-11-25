@cms @learner
@communication
@scheduled-notification

Feature: Update status of scheduled notification on CMS

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student S1" logins Learner App
        And school admin has created a scheduled notification which will be sent 1 minute later
        And "school admin" is at "Notification" page on CMS

    Scenario: Update a scheduled notification to draft notification
        Given school admin has opened a scheduled notification dialog
        When school admin selects "Now"
        And school admin clicks "Save draft" button
        Then school admin sees scheduled notification has been saved to draft notification

    Scenario: Update a scheduled notification to sent notification
        When school admin waits for scheduled notification to be sent on time
        And "school admin" searches this notification
        Then status of scheduled notification is updated to "Sent"
