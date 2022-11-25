@cms
@payment
@one-time-material-order

Feature: Remove one-time material on product list successfully

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course

    Scenario: Remove one-time material successfully
        Given school admin has created one-time material with discount
            | price | discount | tax | taxCategory            | discountAmountType                |
            | 100   | 5        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENTAGE   |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT |
        When school admin goes to creates order for created student
        And school admin select the designated discounts for "one-time material"
        And school admin deletes "one-time material 2"
        And school admin checks billed at order of "one-time material" order
            | subTotal | taxAmountText  | productTotal |
            | 95       | Tax (10% incl) | 95           |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
