@cms
@payment
@search-and-filter-order
@ignore

Feature: Search order using product name

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario: Display all order match with product name
        Given school admin has created an order for created student
        When "shool admin" selects created product using product name in filter
        Then "school admin" sees created order is displayed

    Scenario: Display all order match with at least one product
        Given school admin has created 3 products "product P1", "product P2", "product P3"
        And school admin has created order with "product P1", "product P2" for created student
        When "shool admin" selects "Product P1", "product P3" in filter
        Then "school admin" sees created order is displayed