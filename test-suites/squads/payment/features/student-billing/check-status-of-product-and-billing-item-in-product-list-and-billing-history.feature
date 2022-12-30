@cms
@payment
@student-billing
@ignore

Feature: Check status of product and billing item in product list and billing history

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Product status is <productStatus> and billing status is <billingStatus> with <conditionDate>
        Given school admin has created one-time material with "<conditionDate>"
            | price | discount | tax | taxCategory            | discountAmountType          |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_AMOUNT |
        When school admin creates New Order with One-time material for created student
        Then school admin sees message "You have created the order successfully!"
        And school admin goes to student billing tab
        And school admin sees product status is "<productStatus>"
        And school admin sees billing status is "<billingStatus>"
        Examples:
            | conditionDate                             | productStatus | billingStatus |
            | custom_billing_date = created order date  | Completed     | Billed        |
            | custom_billing_date < created order date  | Completed     | Billed        |
            | custom_billing_date  > created order date | Inactive      | Pending       |
