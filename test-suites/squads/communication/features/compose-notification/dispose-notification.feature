@cms @learner @learner2
@communication
@compose-notification

Feature: Show confirm notification dialog using close button

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: Edit <requiredField> of draft notification and close dialog without saving
        Given "school admin" has created 1 "Draft" notification
        And "school admin" searches this notification
        When "school admin" selects created draft notification
        And school admin sets "<requiredField>" of draft notification blank
        And school admin clicks "Close" button
        And "school admin" confirms to dispose
        Then "school admin" still sees "Draft" notification on CMS
        Examples:
            | requiredField   |
            | Title           |
            | Content         |
            | Title & Content |

    Scenario Outline: Dispose <type> notification successfully
        Given "school admin" has created 1 "<type>" notification
        And "school admin" searches this notification
        And "school admin" has opened editor full-screen dialog of "<type>" notification
        When school admin clicks "Close" button
        And "school admin" confirms to dispose
        Then "school admin" still sees "<type>" notification on CMS
        Examples:
            | type      |
            | Draft     |
            | Scheduled |

    Scenario Outline: Dispose cancel a <type> notification
        Given "school admin" has created 1 "<type>" notification
        And "school admin" searches this notification
        And "school admin" has opened editor full-screen dialog of "<type>" notification
        When school admin clicks "Close" button
        And "school admin" cancels dialog confirm
        Then "school admin" still sees "<type>" notification on CMS
        Examples:
            | type      |
            | Draft     |
            | Scheduled |
