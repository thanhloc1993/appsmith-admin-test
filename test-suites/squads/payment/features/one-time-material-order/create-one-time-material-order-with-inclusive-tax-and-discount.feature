@cms
@payment
@one-time-material-order

Feature: Create one-time material order with inclusive tax and discount

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course

    Scenario Outline: Create order with 1 one-time material with discount by <discountAmountType> and inclusive tax
        Given school admin has created one-time material with discount "<discountAmountType>"
            | price | discount | tax | taxCategory            |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE |
        When school admin goes to creates order for created student
        And school admin selects "one-time material" for order
        And school admin selects discount "<discountAmountType>" for created one-time material
        And school admin adds comment for order
        And school admin checks billed at order of "one-time material" order
            | subTotal | taxAmountText  | productTotal |
            | 90       | Tax (10% incl) | 90           |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
        Examples:
            | discountAmountType                |
            | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT |
            | DISCOUNT_AMOUNT_TYPE_PERCENTAGE   |

    Scenario: Create order with 3 one-time materials with different discount and different inclusive tax
        Given school admin has created one-time material with discount
            | price | discount | tax | taxCategory            | discountAmountType                |
            | 100   | 5        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENTAGE   |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT |
            | 100   | 10       | 5   | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT |
        When school admin goes to creates order for created student
        And school admin select the designated discounts for "one-time material"
        And school admin adds comment for order
        And school admin checks billed at order of "one-time material" order
            | subTotal | taxAmountText                 | productTotal |
            | 275      | Tax (5% incl), Tax (10% incl) | 275          |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
