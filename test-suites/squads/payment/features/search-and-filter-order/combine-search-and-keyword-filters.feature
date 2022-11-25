@cms
@payment
@search-and-filter-order
@ignore

Feature: Combine search keyword and filters

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario: Display all order match with keyword and filter
        Given school admin has created an order for created student with order type is "submitted"
        When "shool admin" searches order using "student name"
        And "school admin" sets all filters match with created order
        Then "school admin" sees created order is displayed