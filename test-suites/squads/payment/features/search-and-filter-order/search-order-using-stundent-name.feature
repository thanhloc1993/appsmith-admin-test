@cms
@payment
@search-and-filter-order
@ignore

Feature: Search order using student name

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info
        And school admin has created an order for created student

    Scenario Outline: Display all orders match with <keyword>
        When "shool admin" searches order using "<keyword>"
        Then "school admin" sees created order is displayed
        Examples:
            | keyword              |
            | student full name    |
            | student partial name |

    Scenario: Display no result when there is no order match with search keyword
        When "shool admin" searches order using "not exist student name"
        Then "school admin" sees no result page is displayed