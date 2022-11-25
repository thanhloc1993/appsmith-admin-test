@cms
@payment
@search-and-filter-order
@ignore

Feature: Reset filter

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario: Keep the search keyword, only reset the filter
        Given school admin has created an order for created student
        And "shool admin" searches order using "student name"
        And "school admin" sets all filters
        When "shool admin" resets the filter
        Then "school admin" sees created order is displayed
