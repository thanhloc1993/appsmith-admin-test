@cms
@payment
@order-detail-one-time-material
@ignore

Feature: Order detail for one-time material order
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario: General info, product list, billing item, action log, previous button and comment display with correct data
        When school admin creates one-time material order for created student
            | price | discount | tax | billingDate  | taxCategory            | discountAmountType          |
            | 100   | 10       | 10  | current date | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_AMOUNT |
        Then school admin sees message "You have created the order successfully!"
        And school admin sees data is display correct in order detail

    Scenario: Display multiples products and billing items in order detail
        When school admin creates one-time material order with "6" one-time material products
            | price | discount | tax | billingDate  | taxCategory            | discountAmountType          |
            | 100   | 10       | 10  | current date | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_AMOUNT |
        Then school admin sees message "You have created the order successfully!"
        And school admin sees product list and billing item are display correct data

    Scenario Outline: Billing status is <billingStatus> when <conditionDate>
        When school admin creates an one-time material order with "<conditionDate>"
            | price | discount | tax | taxCategory            | discountAmountType          |
            | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_AMOUNT |
        Then school admin sees message "You have created the order successfully!"
        And school admin sees billing status of billing item is "<billingStatus>"
        Examples:
            | billingStatus | conditionDate                     |
            | Billed        | billing date < created order date |
            | Billed        | billing date = created order date |
            | Pending       | billing date > created order date |

    Scenario: Round off product amount and billing amount
        When school admin creates an one-time material order with "one-time material"
            | price | discount | tax | billingDate                       | taxCategory            | discountAmountType           |
            | 95    | 10       | 10  | billing date > created order date | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENT |
            | 94    | 10       | 10  | billing date > created order date | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENT |
        And school admin has created a one-time material order with all products
        Then school admin sees message "You have created the order successfully!"
        And school admin sees amount in product list and billing item
            | amount |
            | 85     |
            | 85     |
