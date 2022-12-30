@cms
@communication
@tag-notification
@ignore

Feature: Display tag notification in tag column

    Background:
        Given "school admin" logins CMS
        And "school admin" created "student S1"
        And "school admin" is at "Notification" page on CMS
        And "school admin" open compose dialog
        And "school admin" input required fields with individual recipient "student S1"
        And "school admin" created 3 notification tags in tag field

    Scenario Outline: Tag notification display in tag column with <actionNotification>
        When "school admin" set "<deliveryOption>" for Delivery Option
        And "school admin" "<actionNotification>" notification
        Then "school admin" sees "<tagNotification>" display when hover to Tag column
        Examples:
            | deliveryOption | actionNotification | tagNotification     |
            | Now            | Send               | Tag 1, Tag 2, Tag 3 |
            | Now            | Save Draft         | Tag 1, Tag 2, Tag 3 |
            | Schedule       | Save Schedule      | Tag 1, Tag 2, Tag 3 |

    Scenario Outline: Tag remove in tag column when remove tag with <actionNotification> notification
        Given "school admin" set "<deliveryOption>" for Delivery Option
        And "school admin" "<actionNotification>" notification
        When "school admin" accesses to notification created at notification table
        And "school admin" remove tag "Tag 2, Tag 3" notification in tag field
        And "school admin" "<actionNotification>" notification
        Then "school admin" sees "<tagNotification>" display when hover to Tag column
        Examples:
            | deliveryOption | actionNotification | tagNotification |
            | Now            | Save Draft         | Tag 1           |
            | Schedule       | Save Schedule      | Tag 1           |

    Scenario Outline: New tag display in tag column when add new tag with <actionNotification> notification
        Given "school admin" set "<deliveryOption>" for Delivery Option
        And "school admin" "<actionNotification>" notification
        When "school admin" accesses to notification created at notification table
        And "school admin" create 1 notification tag in tag field
        And "school admin" "<actionNotification>" notification
        Then "school admin" sees "<tagNotification>" display when hover to Tag column
        Examples:
            | deliveryOption | actionNotification | tagNotification            |
            | Now            | Save Draft         | Tag 1, Tag 2, Tag 3, Tag 4 |
            | Schedule       | Save Schedule      | Tag 1, Tag 2, Tag 3, Tag 4 |
