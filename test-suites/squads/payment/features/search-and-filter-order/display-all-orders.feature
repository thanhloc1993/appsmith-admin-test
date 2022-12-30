@cms
@payment
@search-and-filter-order
@ignore

Feature: Display all orders

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info
        And school admin has created an order for created student

    Scenario: Display all orders when user access to order list
        When "shool admin" accesses to order list
        Then "school admin" sees created order is displayed

    Scenario: Display all orders when user reset filter
        Given "school admin" has set all filters to search order
        When "school admin" resets filters
        Then "school admin" sees all orders are displayed