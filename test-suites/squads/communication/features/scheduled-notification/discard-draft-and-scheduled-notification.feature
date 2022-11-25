@cms
@communication
@scheduled-notification

Feature: Discard draft and scheduled notification on CMS

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And school admin has created 1 "draft", 1 "scheduled" notifications
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: Discard a <type> notification successfully
        Given school admin has opened editor full-screen dialog of "<type>" notification
        When school admin clicks "Discard" button
        And school admin confirms to discard
        Then school admin sees "<type>" notification has been deleted on CMS
        Examples:
            | type      |
            | Draft     |
            | Scheduled |

    Scenario Outline: Cancel discard a <type> notification
        Given school admin has opened editor full-screen dialog of "<type>" notification
        When school admin clicks "Discard" button
        And school admin cancels dialog confirm
        Then school admin still sees "<type>" notification on CMS
        Examples:
            | type      |
            | Draft     |
            | Scheduled |
