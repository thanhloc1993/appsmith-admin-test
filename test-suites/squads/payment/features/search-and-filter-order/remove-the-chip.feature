@cms
@payment
@search-and-filter-order
@ignore

Feature: Remove the chip

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Update the result list when user remove <chip> chip
        Given school admin has created an order for created student
        And "school admin" has set the "<filter>" filter does not match with created order
        When "shool admin" removes the "<chip>" chip
        Then "school admin" sees created order is displayed
        Examples:
            | filter       | chip         |
            | created from | created from |
            | created to   | created to   |
            | order type   | order type   |
            | product      | product      |

    Scenario: Update the result list when user remove all chips
        Given school admin has created an order for created student
        And "school admin" sets all filters does not match with created order
        When "shool admin" removes all chips
        Then "school admin" sees created order is displayed
