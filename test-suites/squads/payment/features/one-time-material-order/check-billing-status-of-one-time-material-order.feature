@cms
@payment
@one-time-material-order
@ignore

Feature: Check billing status for one-time material feature

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Billing status is <billingStatus>
        Given "school admin" has created one-time material with price and "<billingDate>"
        And "school admin" has added the same location and grade with student for "one-time material"
        When "school admin" creates order for created student
        And "school admin" selects "one-time material" for order
        And "school admin" checks billed at order of "one-time material" order
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"
        And school admin sees billing status of order is "<billingStatus>"
        Examples:
            | billingDate                   | billingStatus |
            | billing date >= current date  | billed        |
            | billing date < current date   | pending       |