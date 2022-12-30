@cms @learner @parent
@communication
@compose-notification

Feature: Receive notification

    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student" with "1 parents", "0 visible courses"
        And school admin has composed new message on notification page
        And "student" logins Learner App
        And "parent P1" of "student" logins Learner App

    Scenario Outline: <userAccount> receives notification when <applicationStatus>
        Given application status is "<applicationStatus>"
        When school admin sends push notification for student and parent
        And "<userAccount>" interacts with notification banner
        Then "<userAccount>" redirects to notification detail screen
        Examples:
            | userAccount | applicationStatus                    |
            | student     | user is interacting with Learner App |
            | parent P1   | user is interacting with Learner App |
    # | student     | user sends app to background              |
    # | parent      | user sends app to background              |
    # | student     | user kills app                            |
    # | parent      | user kills app                            |

    Scenario Outline: <userAccount> does not receive notification when logout learner App
        Given "<userAccount>" logout Learner App
        And school admin sends push notification for student and parent
        When "<userAccount>" of "student" logins Learner App
        Then "<userAccount>" does not see notification banner in their device
        And "<userAccount>" sees notification on Learner App
        Examples:
            | userAccount |
            | student     |
            | parent P1   |
