@cms
@communication
@compose-notification

Feature: Paging on notification list

    Background:
        Given "school admin" logins CMS
        And "school admin" is at "Notification" page on CMS

    Scenario Outline: Paging <perOfPage> rows per page created in tab "<tab>"
        Given "school admin" has created more than 25 notifications in tab "<tab>"
        When "school admin" choose <perOfPage> rows per page at "<tab>"
        Then "school admin" sees <perOfPage> rows per page
        And "school admin" sees row 1-<perOfPage> of total row of tab
        Examples:
            | perOfPage | tab                                |
            | 5         | 1 of [All, Sent, Scheduled, Draft] |
            | 10        | 1 of [All, Sent, Scheduled, Draft] |
            | 25        | 1 of [All, Sent, Scheduled, Draft] |

    Scenario: Disable previous page on the first page
        Given "school admin" has created more than 10 notifications in tab "All"
        Then "school admin" sees previous page button disable on the first page

    Scenario: "school admin" go to next page
        Given "school admin" has created more than 10 notifications in tab "All"
        And "school admin" choose 10 rows per page at tab "All"
        When "school admin" go to next page
        Then "school admin" sees 10 rows per page
        And "school admin" sees row 11-20 of total row of tab
        And "school admin" sees previous page button enable

    Scenario: school admin switch tab
        Given "school admin" has created more than 10 "Sent" notifications
        And "school admin" choose 10 rows per page at tab "All"
        And "school admin" go to next page
        When "school admin" switch to tab "Sent"
        Then "school admin" sees tab "Sent" refresh to first page
        And "school admin" sees 10 row per page with numerical 1 to 10 at tab "Sent"
        And "school admin" sees row 1-10 of total row of tab
