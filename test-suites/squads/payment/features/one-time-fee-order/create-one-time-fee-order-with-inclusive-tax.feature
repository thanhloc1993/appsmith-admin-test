@cms
@payment
@one-time-fee-order
@ignore

Feature: Create one-time fee order with inclusive tax

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info

    Scenario: Create order with 1 one-time fee with inclusive tax
        Given "school admin" has created "one-time fee" for created student
            | price | discount | tax | taxCategory            | discountAmountType        |
            | 100   | 0        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_NONE |
        When school admin goes to creates order for created student
        And school admin select "one-time fee" for order
        And school admin adds comment for order
        And school admin checks billed at order of "one-time fee" order
            | subTotal | taxAmountText  | productTotal |
            | 100      | Tax (10% incl) | 100          |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"

    Scenario: Create order with 3 one-time fees with different inclusive tax
        Given school admin has created one-time fee with discount
            | price | discount | tax | taxCategory            | discountAmountType        |
            | 100   | 0        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_NONE |
            | 100   | 0        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_NONE |
            | 100   | 0        | 5   | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_NONE |
        When school admin goes to creates order for created student
        And school admin select all created "one-time fee" for order
        And school admin adds comment for order
        And school admin checks billed at order of "one-time fee" order
            | subTotal | taxAmountText                 | productTotal |
            | 300      | Tax (5% incl), Tax (10% incl) | 300          |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
