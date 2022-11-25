@cms
@payment
@student-billing
@ignore

Feature: Amount in product list and billing history display correct for one-time material

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with student info

    Scenario: Amount in product list and billing history display correct data
        Given school admin has created one-time material with discount
            | price | discount | tax | taxCategory            | discountAmountType                |
            | 100   | 5        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENTAGE   |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT |
            | 100   | 0        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_NONE         |
        When school admin creates New Order with One-time material for created student
        Then school admin sees message "You have created the order successfully!"
        And school admin goes to student billing tab
        And school admin sees discount and amount display correctly in product list
           | amount |
           | 95     |
           | 90     |
           | 100    |
        And school admin sees amount display correctly in billing history
           | amount |
           | 95     |
           | 90     |
           | 100    |
