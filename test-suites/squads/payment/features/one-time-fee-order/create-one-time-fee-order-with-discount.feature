@cms
@payment
@one-time-fee-order
@ignore

Feature: Create one-time fee order with discount

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info

    Scenario Outline: Create order with one one-time fee and discount by <discountAmountType>
        Given school admin has created one-time fee with discount "<discountAmountType>"
            | price | discount | tax | taxCategory       |
            | 100   | 10       | 0   | TAX_CATEGORY_NONE |
        When school admin goes to creates order for created student
        And school admin selects "one-time fee" for order
        And school admin selects discount "<discountAmountType>" for created one-time fee
        And school admin adds comment for order
        And school admin checks billed at order of "one-time fee" order
            | subTotal | taxAmountText | productTotal |
            | 90       | TAX_NONE      | 90           |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
        Examples:
            | discountAmountType                |
            | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT |
            | DISCOUNT_AMOUNT_TYPE_PERCENTAGE   |
