@cms
@payment
@one-time-material-order
@ignore

Feature: Create one-time material order with inclusive tax

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario: Create order with 1 one-time material with inclusive tax
        Given "school admin" has created one-time material with price and inclusive tax
        And "school admin" has added the same location and grade with student for "one-time material"
        When "school admin" creates order for created student
        And "school admin" selects "one-time material" for order
        And "school admin" checks billed at order of "one-time material" order
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"

    Scenario: Create order with 3 one-time materials with inclusive tax
        Given "school admin" has created "one-time material 1" and "one-time material 2" with price and inclusive tax
        And "school admin" has created "one-time material 3" with different price and inclusive tax
        And "school admin" has added the same location and grade with student for all created "one-time material"
        When "school admin" creates order for created student
        And "school admin" selects all created "one-time material" for order
        And "school admin" checks billed at order of "one-time material" order
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"
        