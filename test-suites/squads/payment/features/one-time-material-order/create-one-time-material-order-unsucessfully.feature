@cms
@payment
@one-time-material-order
@ignore

Feature: Create one-time material order unsuccessfully

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info
        And "school admin" has created "one-time material 1" and "one-time material 2" with price

    Scenario: Create order unsuccessfully when not add one-time material
        When "school admin" creates order for created student
        And "school admin" removes product option in product list
        And "school admin" submits the order
        Then school admin sees message "This section is required"

    Scenario: Create order unsuccessfully when not select one-time material
        When "school admin" creates order for created student
        And "school admin" submits the order
        Then school admin sees message "Required fields cannot be blank!"

    Scenario: Create order unsuccessfully in case 1 one-time material is not selected
        Given "school admin" has added the same location and grade with student for "one-time material 1" and "one-time material 2"
        When "school admin" creates order for created student
        And "school admin" adds 2 product options in product list
        And "school admin" selects "one-time material 1" one product option in product list
        And "school admin" submits the order
        Then school admin sees message "This section is required"
