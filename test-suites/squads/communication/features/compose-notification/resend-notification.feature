@cms @learner @parent
@communication
@compose-notification
@ignore 
# TODO: @communication will fix later
# When school admin re-sends notification for unread recipients
# Error: Timeout 30000ms exceeded
# waiting for selector "[data-testid='RecipientTable__buttonResend']"

Feature: Resend notification
    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student" with "1 parents", "0 visible courses"
        And "school admin" is at "Notification" page on CMS
        And "student" logins Learner App
        And "parent P1" of "student" logins Learner App

    Scenario Outline: Resend notification for <unreadUser>
        Given school admin has created notification and sent for created student and parent
        And "<unreadUser>" has not read notification
        And "<readUser>" has read the notification
        When school admin re-sends notification for unread recipients
        Then "<unreadUser>" receives notification
        And "<readUser>" does not receive any notification
        Examples:
            | unreadUser | readUser  |
            | student    | parent P1 |
            | parent P1  | student   |

    Scenario: Notify unread button is disabled when all users read notification
        Given school admin has created notification and sent for created student and parent
        When student has read the notification
        And parent has read the notification
        Then school admin sees the Notify unread button is disabled