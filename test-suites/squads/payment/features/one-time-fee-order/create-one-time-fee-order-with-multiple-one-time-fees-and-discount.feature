@cms
@payment
@one-time-fee-order
@ignore

Feature: Create one-time fee order with multiple one-time fees and discount

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info

    Scenario Outline: Create order with 2 one-time fees and discount by <discountAmountType>
        Given school admin has created 2 "one-time fee" with discount "<discountAmountType>"
            | price | discount | tax | taxCategory       |
            | 100   | 10       | 0   | TAX_CATEGORY_NONE |
        When school admin goes to creates order for created student
        And school admin select the designated discounts for "one-time fee"
        And school admin adds comment for order
        And school admin checks billed at order of "one-time fee" order
            | subTotal | taxAmountText | productTotal |
            | 180      | TAX_NONE      | 180          |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
        Examples:
            | discountAmountType                                                    |
            | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT                                     |
            | DISCOUNT_AMOUNT_TYPE_PERCENTAGE                                       |
            | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT and DISCOUNT_AMOUNT_TYPE_PERCENTAGE |

    Scenario Outline: Create order with 2 one-time fees and only discount by <discountAmountType> for one
        Given school admin has created "one-time fee" with discount "<discountAmountType>"
            | price | discount | tax | taxCategory       |
            | 100   | 10       | 0   | TAX_CATEGORY_NONE |
            | 100   | 0        | 0   | TAX_CATEGORY_NONE |
        When school admin goes to creates order for created student
        And school admin selects "one-time fee 1" for order
        And school admin select the designated discounts for "one-time fee 2"
        And school admin adds comment for order
        And school admin checks billed at order of "one-time fee" order
            | subTotal | taxAmountText | productTotal |
            | 190      | TAX_NONE      | 190          |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
        Examples:
            | discountAmountType                |
            | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT |
            | DISCOUNT_AMOUNT_TYPE_PERCENTAGE   |
