@cms
@payment
@search-and-filter-order
@ignore

Feature: Search order using created date

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info
        And school admin has created an order for created student

    Scenario Outline: Display all order which has created date match with <condition>
        When "shool admin" sets "<condition>"
        Then "school admin" sees created order is displayed
        Examples:
            | condition                              |
            | created from = current date            |
            | created to = current date              |
            | created to < current date < created to |

    Scenario Outline: Not display order which has created date does not match with <condition>
        When "shool admin" sets "<condition>"
        Then "school admin" does not see created order is displayed
        Examples:
            | condition                   |
            | created to < current date   |
            | created from > current date |

    Scenario: Cannot set created to smaller than created from
        When "shool admin" sets "created from = current date"
        Then "school admin" sees created to cannot set smaller than current date

    Scenario: Update created to equal with created from if user update created from bigger than created to
        When "shool admin" sets "created from and create to = current date"
        And "school admin" edits "created from > current date"
        Then "school admin" sees created to is updated equal with created from
