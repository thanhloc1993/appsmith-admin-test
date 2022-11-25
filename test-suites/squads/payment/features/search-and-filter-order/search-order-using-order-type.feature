@cms
@payment
@search-and-filter-order
@ignore

Feature: Search order using order type

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Display all order match with order type is <orderType>
        Given school admin has created an order for created student with order type is "<orderType>"
        When "shool admin" sets order type is "<orderType>" and filters
        Then "school admin" sees created order is displayed
        Examples:
            | orderType      |
            | New            |
            | Update         |
            | Cancel         |
            | Pause          |
            | Enrollment     |
            | Withdrawal     |
            | Graduate       |
            | LOA            |
            | Custom Billing |

    Scenario: Display all order match with multiple order types in filter
        Given school admin has created orders for created student with all order types
        When "shool admin" selects all order types in filter
        Then "school admin" sees all created orders is displayed