@cms
@payment
@one-time-fee-order
@ignore

Feature: Update and submit one-time fee order successfully

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info

    Scenario: Update and submit one-time fee order successfully
        Given school admin has created one-time fee with discount
            | price | discount | tax | taxCategory            | discountAmountType                |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENTAGE   |
            | 50    | 10       | 5   | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT |
        When school admin goes to creates order for created student
        And school admin selects the designated discounts for "one-time fee 1"
        And school admin adds comment for order
        And school admin selects the designated discounts for "one-time fee 2"
        And school admin edits comment for order
        And school admin checks billed at order of "one-time fee" order
            | subTotal | taxAmountText | productTotal |
            | 40       | Tax (5% incl) | 40           |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
