@cms @learner @parent
@communication
@scheduled-notification

Feature: View scheduled notification information on Learner App

    Background:
        Given "school admin" logins CMS
        And school admin has created "student S1" with grade and "parent P1" info
        And "student S1" logins Learner App
        And "parent P1" of "student S1" logins Learner App
        And school admin has created a scheduled notification which will be sent 1 minute later
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: Badge number displays <behavior> if <userAccount> <action>
        When school admin waits for scheduled notification to be sent on time
        And "school admin" searches this notification
        Then "<userAccount>" "<action>" the scheduled notification
        And "<userAccount>" receives notification with badge number of notification bell displays "<behavior>" on Learner App
        Examples:
            | behavior       | userAccount                  | action |
            | 1              | 1 of [student S1, parent P1] | unread |
            | without number | 1 of [student S1, parent P1] | read   |

    Scenario Outline: Unread status <behavior> after <userAccount> <action> on scheduled notification
        When school admin waits for scheduled notification to be sent on time
        And "school admin" searches this notification
        Then "<userAccount>" "<action>" the scheduled notification
        And "<userAccount>" sees unread status "<behavior>" on Learner App
        Examples:
            | behavior         | userAccount                  | action |
            | displays         | 1 of [student S1, parent P1] | unread |
            | does not display | 1 of [student S1, parent P1] | read   |
