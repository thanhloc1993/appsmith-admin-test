@cms
@payment
@order-list
@ignore

Feature: Redirect user to order detail after interact with order link
    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info
        And "school admin" has created an order for created student

    Scenario: Redirect user to order detail after interact order link
        When "shool admin" selects order id
        Then "school admin" sees order detail is showed