@cms
@payment
@student-billing
@ignore

Feature: Student billing is display correctly for one-time material

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario: Student billing is display correctly for one-time material
        Given school admin has created one-time material with discount
            | price | discount | tax | taxCategory            | discountAmountType          |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_AMOUNT |
        When school admin creates New Order with One-time material for created student
        Then school admin sees message "You have created the order successfully!"
        And school admin goes to student billing tab
        And school admin sees student billing display with correct data
