@cms @learner @parent
@communication
@scheduled-notification

Feature: Send edit time and receive scheduled notification

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student S1" logins Learner App
        And "parent P1" of "student S1" logins Learner App
        And school admin has created a scheduled notification which will be sent 5 minute later
        And "school admin" is at "Notification" page on CMS

    Scenario: Send and receive scheduled notification successfully after edit sending time
        Given school admin has edited sending time of scheduled notification
        When school admin waits for scheduled notification to be sent on time
        And "school admin" searches this notification
        Then school admin sees new scheduled notification on CMS
        And "student S1" receives the notification in their device
        And "parent P1" receives the notification in their device
