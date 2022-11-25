@cms
@payment
@order-list
@ignore

Feature: Orders show by category based on order status

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Order with <orderStatus> status is showed on All and <orderStatus> categories
        When "shool admin" creates an order with "<orderStatus>" status for created student
        Then "school admin" sees created order is displayed on "All" category
        And "school admin" sees created order is displayed on "<orderStatus>" category
        Examples:
            | orderStatus |
            | submitted   |
            | pending     |
            | rejected    |
            | voided      |
            | invoiced    |