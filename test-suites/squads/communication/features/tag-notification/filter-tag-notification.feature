@cms
@communication
@tag-notification
@ignore

Feature: Search and filter notification

    Background:
        Given "school admin" logins CMS
        And "school admin" created "student S1"
        And "school admin" is at "Notification" page on CMS
        And "school admin" open compose dialog
        And "school admin" input required fields with individual recipient "student S1"
        And "school admin" created 2 notification tags in tag field

    Scenario Outline: Search notification with title and filter of notification
        Given "school admin" set "<deliveryOption>" for Delivery Option
        And "school admin" "<actionNotification>" notification
        When "school admin" filter notification with notification information
        And "school admin" apply filter
        Then "school admin" sees notification display exactly with notification information
        Examples:
            | deliveryOption | actionNotification |
            | Now            | Send               |
            | Now            | Save Draft         |
            | Schedule       | Save Schedule      |
