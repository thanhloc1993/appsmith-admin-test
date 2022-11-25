@cms
@payment
@one-time-material-order
@ignore

Feature: Create one-time material order without tax and discount

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Create order with <numberOfOneTimeMaterial>
        Given "school admin" has created "<numberOfOneTimeMaterial>" with price
        And "school admin" has added the same location and grade with student for "<numberOfOneTimeMaterial>"
        When "school admin" creates order for created student
        And "school admin" selects "<numberOfOneTimeMaterial>" for order
        And "school admin" checks billed at order of "one-time material" order
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"
        Examples:
            | numberOfOneTimeMaterial |
            | 1 one-time material     |
            | 2 one-time materials    |
