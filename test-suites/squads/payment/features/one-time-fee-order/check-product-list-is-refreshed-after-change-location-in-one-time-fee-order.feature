@cms
@payment
@one-time-fee-order
@ignore

Feature: Check product list is refreshed after change the location in one-time fee order

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And school admin has added "location L1" and "location L2" for student

    Scenario: One-time fee is remove after user change the location
        Given school admin has created "one-time fee" for created student
            | price | discount | tax | taxCategory       | discountAmountType        | productLocation |
            | 100   | 0        | 0   | TAX_CATEGORY_NONE | DISCOUNT_AMOUNT_TYPE_NONE | location L1     |
            | 100   | 0        | 0   | TAX_CATEGORY_NONE | DISCOUNT_AMOUNT_TYPE_NONE | location L2     |
        When school admin goes to creates order for created student
        And school admin selects "one-time fee 1" for order
        And "school admin" changes to "location L2"
        And "school admin" sees "one-time fee 1" is removed
        And school admin selects "one-time fee 2" for order
        And school admin adds comment for order
        And school admin checks billed at order of "one-time fee" order
            | subTotal | taxAmountText | productTotal |
            | 100      | TAX_NONE      | 100          |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
