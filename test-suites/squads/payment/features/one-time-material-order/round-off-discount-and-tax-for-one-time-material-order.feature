@cms
@payment
@one-time-material-order

Feature: Round off the discount and inclusive tax for one-time material order
    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course

    Scenario Outline: The <inclusiveTaxRound> in billed at order
        Given school admin has created one-time material with price and inclusive tax with "<inclusiveTaxRound>"
            | price | taxPercentage | roundType                     |
            | 95    | 10            | inclusive tax is rounded up   |
            | 94    | 10            | inclusive tax is rounded down |
        When school admin goes to creates order for created student
        And school admin selects "one-time material" for order
        And school admin checks billed at order of "one-time material" order with "<inclusiveTaxRound>"
            | subTotal | taxAmountText  | productTotal | roundType                     |
            | 95       | Tax (10% incl) | 95           | inclusive tax is rounded up   |
            | 94       | Tax (10% incl) | 94           | inclusive tax is rounded down |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
        Examples:
            | inclusiveTaxRound             |
            | inclusive tax is rounded up   |
            | inclusive tax is rounded down |

    Scenario Outline: The <discountRound> in billed at order
        Given school admin has created one-time material with price and discount by percent with "<discountRound>"
            | price | discountPercentage | roundType                |
            | 95    | 10                 | discount is rounded up   |
            | 94    | 10                 | discount is rounded down |
        When school admin goes to creates order for created student
        And school admin select the designated discounts for "one-time material"
        And school admin checks billed at order of "one-time material" order with "<discountRound>"
            | subTotal | taxAmountText | productTotal | roundType                |
            | 85       | TAX_NONE      | 85           | discount is rounded up   |
            | 85       | TAX_NONE      | 85           | discount is rounded down |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
        Examples:
            | discountRound            |
            | discount is rounded up   |
            | discount is rounded down |

    Scenario: Round off discount and inclusive tax in billed at order
        Given school admin has created one-time material with discount
            | price | discount | tax | taxCategory            | discountAmountType              |
            | 95    | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_PERCENTAGE |
        When school admin goes to creates order for created student
        And school admin select the designated discounts for "one-time material"
        And school admin checks billed at order of "one-time material" order
            | subTotal | taxAmountText  | productTotal |
            | 85       | Tax (10% incl) | 85           |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
