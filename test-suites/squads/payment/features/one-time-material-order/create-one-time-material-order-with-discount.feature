@cms
@payment
@one-time-material-order
@ignore

Feature: Create one-time material order with discount

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Create order with one one-time material and discount by <discountType>
        Given "school admin" has created one-time material with price
        And "school admin" has added the same location and grade with student for "one-time material"
        And "school admin" has created a discount by "<discountType>"
        When "school admin" creates order for created student
        And "school admin" selects "one-time material" for order
        And "school admin" selects discount "<discountType>" for "one-time material"
        And "school admin" checks billed at order of "one-time material" order
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"
        Examples:
            | discountType |
            | fixed amount |
            | percent      |