@cms
@payment
@one-time-material-order

Feature: Check billing date and upcoming billing

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course

    @ignore
    Scenario: Apply custom_billing_date and not show upcoming billing for one-time-material order
        When school admin has created one-time material for created student
            | price | discount | tax | taxCategory            | discountAmountType        | custom_billing_date                      |
            | 100   | 0        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_NONE | NULL                                     |
            | 100   | 0        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_NONE | custom_billing_date < created order date |
        And "school admin" checks billed at order of "one-time material" order
            | subTotal | taxAmountText  | productTotal |
            | 200      | Tax (10% incl) | 200          |
        And "school admin" sees "upcoming billing" has no data
        And "school admin" submits the order
        Then school admin sees message "You have create order successfully"

    Scenario: Apply custom_billing_date and show upcoming billing for one-time-material order
        When school admin has created one-time material with custom billing date for created student
            | price | discount | tax | taxCategory            | discountAmountType                | customBillingDate                                        |
            | 100   | 5        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENTAGE   | billingDate 1 (custom_billing_date > created order date) |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_FIXED_AMOUNT | billingDate 2 (custom_billing_date > created order date) |
            | 100   | 0        | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_NONE         | billingDate 3 (custom_billing_date > created order date) |
        And school admin goes to creates order for created student
        And school admin select the designated discounts for "one-time material"
        And school admin checks upcoming billing item of "one-time material" order
            | billingDate   | discount    | productAmount |
            | billingDate 1 | discount D1 | 95            |
            | billingDate 2 | discount D2 | 90            |
            | billingDate 3 | discount D3 | 100           |
        And school admin sees billed at order section has no data
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
