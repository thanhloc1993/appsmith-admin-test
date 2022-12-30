@cms
@payment
@one-time-material-order

Feature: Check product list is refreshed after change location

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course

    Scenario: One-time material is remove after user change the location
        Given school admin has created one-time material with mutiple locations
            | price | discount | tax | taxCategory       | discountAmountType        | productLocation |
            | 100   | 0        | 0   | TAX_CATEGORY_NONE | DISCOUNT_AMOUNT_TYPE_NONE | location L1     |
            | 100   | 0        | 0   | TAX_CATEGORY_NONE | DISCOUNT_AMOUNT_TYPE_NONE | location L2     |
        When school admin goes to creates order for created student
        And school admin selects "one-time material 1" with "location L1" for order
        And school admin changes to "location L2"
        And school admin sees "one-time material 1" is removed
        And school admin selects "one-time material 2" with "location L2" for order
        And school admin checks billed at order of "one-time material" order
            | subTotal | taxAmountText | productTotal |
            | 100      | TAX_NONE      | 100          |
        And school admin submits the order
        Then school admin sees message "You have created the order successfully!"
