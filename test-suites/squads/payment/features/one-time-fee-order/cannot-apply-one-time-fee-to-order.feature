@cms
@payment
@one-time-fee-order
@ignore

Feature: Cannot apply one-time fee to order

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info

    Scenario Outline: Cannot apply <typeOfOneTimeFee> to order
        Given school admin has created one-time fee with discount
            | price | discount | tax | taxCategory       | discountAmountType        |
            | 100   | 0        | 0   | TAX_CATEGORY_NONE | DISCOUNT_AMOUNT_TYPE_NONE |
        When school admin goes to creates order for created student
        And school admin select "one-time fee" and designated "<typeOfOneTimeFee>" with "<date>" and "<archivedValue>"
        And "school admin" selects "<typeOfOneTimeFee>" for order
        Then school admin sees "<typeOfOneTimeFee>" does not available
        Examples:
            | typeOfOneTimeFee | date                                            | archivedValue |
            | expired          | available from and until > current date         | false         |
            | future           | available from and until < current date         | false         |
            | archived         | available from < current date < available until | true          |

    Scenario Outline: Cannot submit the order after user updated one-time fee's <value>
        Given school admin has created one-time fee with discount
            | price | discount | tax | taxCategory       | discountAmountType        |
            | 100   | 0        | 0   | TAX_CATEGORY_NONE | DISCOUNT_AMOUNT_TYPE_NONE |
        When school admin goes to creates order for created student
        And school admin selects "one-time fee" for order
        And "school admin" selects "one-time fee" for order
        And "school admin" updates csv "<value>" of "one-time fee"
        And "school admin" submits the order
        Then school admin sees error message "Billed at order is mis-match. Please refresh the page and try create order again!"
        Examples:
            | value    |
            | location |
            | grade    |
