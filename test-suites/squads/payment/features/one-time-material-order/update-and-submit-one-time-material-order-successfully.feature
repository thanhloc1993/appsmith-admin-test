@cms
@payment
@one-time-material-order

Feature: Update and submit order successfully

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course

    Scenario: Update and submit order successfully
        Given school admin has created one-time material with discount
            | price | discount | tax | taxCategory            | discountAmountType                |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENTAGE   |
            | 50    | 10       | 5   | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT |
        When school admin goes to creates order for created student
        And school admin select "one-time material 1" and designated "DISCOUNT_AMOUNT_TYPE_PERCENTAGE" discount
        And school admin adds comment for order
        And school admin edits to "one-time material 2" and designated "DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT" discount
        And school admin edits comment for order
        And school admin checks billed at order of "one-time material" order
            | subTotal | taxAmountText | productTotal |
            | 40       | Tax (5% incl) | 40           |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
