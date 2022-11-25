@cms
@payment
@one-time-material-order
@ignore

Feature: Create one-time material order with multiple one-time materials and discount

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info
        And "school admin" has created "one-time material 1" and "one-time material 2" with price
        And "school admin" has added the same location and grade with student for "one-time material 1" and "one-time material 2"

    Scenario: Create order with 2 one-time materials and discount by fixed amount for both
        Given "school admin" has created "fixed amount 1" and "fixed amount 2" discounts
        When "school admin" creates order for created student
        And "school admin" adds "one-time material 1" and "one-time material 2"
        And "school admin" selects "fixed amount 1" discount for "one-time material 1"
        And "school admin" selects "fixed amount 2" discount for "one-time material 2"
        And "school admin" checks billed at order of "one-time material" order
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"

    Scenario: Create order with 2 one-time materials and discount by percent for both
        Given "school admin" has created "percent 1" and "percent 2" discounts
        When "school admin" creates order for created student
        And "school admin" adds "one-time material 1" and "one-time material 2"
        And "school admin" selects "percent 1" discount for "one-time material 1"
        And "school admin" selects "percent 2" discount for "one-time material 2"
        And "school admin" checks billed at order of "one-time material" order
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"

    Scenario: Create order with 2 one-time materials and discount by percent and fixed amount
        Given "school admin" has created 2 discounts by "percent" and "fixed amount"
        When "school admin" creates order for created student
        And "school admin" adds "one-time material 1" and "one-time material 2"
        And "school admin" selects discount "fixed amount" for "one-time material 1"
        And "school admin" selects discount "percent" for "one-time material 2"
        And "school admin" checks billed at order of "one-time material" order
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"

    Scenario Outline: Create order with 2 one-time materials and only discount by <discountType> for one
        Given "school admin" has created a discount by "<discountType>"
        When "school admin" creates order for created student
        And "school admin" adds "one-time material 1" and "one-time material 2"
        And "school admin" selects discount "<discountType>" for "one-time material 1"
        And "school admin" checks billed at order of "one-time material" order
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"
        Examples:
            | discountType |
            | percent      |
            | fixed amount |