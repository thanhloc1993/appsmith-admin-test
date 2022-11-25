@cms
@payment
@student-billing
@ignore

Feature: Display multiples products and billing items for one-time material order

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario: Display multiples products and billing items in product list of student billing
        Given school admin has created 11 one-time material with discount
          | price | discount | tax | taxCategory            | discountAmountType          |
          | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_AMOUNT |
        When school admin creates New Order with all created One-time materials for created student
        Then school admin sees message "You have created the order successfully!"
        And school admin goes to student billing tab
        And school admin sees billing items of student billing
        And school admin sees products list of student billing
