@cms
@payment
@order-list
@ignore

Feature: Check paging of order list

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: The number of order is display exactly with <amount> row per page selection
        Given "shool admin" has created "<amount>" orders for created student
        When "school admin" selects row per page is "<amount>"
        And "school admin" sees "<amount>" orders displayed in All category
        Examples:
            | amount |
            | 5      |
            | 10     |
            | 25     |
            | 50     |
            | 100    |

    Scenario: The numerical order is display exactly for each page
        Given "shool admin" has more than "5" "submitted" orders
        When "school admin" selects row per page is "5"
        Then "school admin" sees the numerical order is displayed from 1 to 5 in page 1
        And "school admin" sees the numerical order is displayed 6 in page 2
