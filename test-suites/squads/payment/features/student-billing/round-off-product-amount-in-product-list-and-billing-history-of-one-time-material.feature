@cms
@payment
@student-billing
@ignore

Feature: Round off product amount in product list and billing history of one-time material order

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario: Product amount in product list and billing history of billing item is round off
        Given school admin has created one-time material with discount
            | price | discount | tax | taxCategory            | discountAmountType              |
            | 95    | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENTAGE |
            | 94    | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENTAGE |
        When school admin creates New Order with One-time material for created student
        Then school admin sees message "You have created the order successfully!"
        And school admin goes to student billing tab
        And school admin sees amount display correctly in billing history
            | amount |
            | 85     |
            | 85     |
