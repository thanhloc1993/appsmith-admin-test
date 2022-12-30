@cms @learner @parent
@communication
@scheduled-notification

Feature: Send and receive scheduled notification

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student S1" logins Learner App
        And "parent P1" of "student S1" logins Learner App
        And school admin has created a scheduled notification which will be sent 1 minute later
        And "school admin" is at "Notification" page on CMS

    Scenario: Send and receive scheduled notification successfully
        When school admin waits for scheduled notification to be sent on time
        And "school admin" searches this notification
        Then "student S1" receives the notification in their device
        And "parent P1" receives the notification in their device

    Scenario Outline: <userAccount> receives scheduled notification when <applicationStatus>
        Given application status is "<applicationStatus>"
        When school admin waits for scheduled notification to be sent on time
        And "school admin" searches this notification
        And "<userAccount>" interacts with notification banner
        Then "<userAccount>" redirects to notification detail screen
        Examples:
            | userAccount | applicationStatus                    |
            | student S1  | user is interacting with Learner App |
            | parent P1   | user is interacting with Learner App |
# | student S1  | user sends app to background         |
# | parent      | user sends app to background         |
# | student S1  | user kills app                       |
# | parent      | user kills app                       |
