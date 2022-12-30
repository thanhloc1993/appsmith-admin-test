@cms
@payment
@one-time-fee-order
@ignore

Feature: Create one-time fee order without inclusive tax and discount

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info

    Scenario: Create order with 1 one-time fee
        Given school admin has created one-time fee
            | price | discount | tax | taxCategory       | discountAmountType        |
            | 100   | 0        | 0   | TAX_CATEGORY_NONE | DISCOUNT_AMOUNT_TYPE_NONE |
        When school admin goes to creates order for created student
        And school admin selects "one-time fee" for order
        And school admin adds comment for order
        And school admin checks billed at order of "one-time fee" order
            | subTotal | taxAmountText | productTotal |
            | 100      | TAX_NONE      | 90           |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"

    Scenario: Create order with multiple one-time fees
        Given "school admin" has created 2 "one-time fee" for created student
            | price | discount | tax | taxCategory       | discountAmountType        |
            | 100   | 0        | 0   | TAX_CATEGORY_NONE | DISCOUNT_AMOUNT_TYPE_NONE |
        When school admin goes to creates order for created student
        And school admin selects all created "one-time fee" for order
        And school admin adds comment for order
        And school admin checks billed at order of "one-time fee" order
            | subTotal | taxAmountText | productTotal |
            | 200      | TAX_NONE      | 200          |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
