@cms
@course
@ignore

Feature: Paging after change rows of course list

    Background:
        Given "school admin" logins CMS
        And course list has many records

    # Check always select 10 for default records per page
    Scenario Outline: Go to the first page of course list when selecting a new rows per page
        Given school admin is not on the first page of course list
        And the rows per page is "<number1>"
        When school admin changes the rows per page to "<number2>"
        Then school admin is redirected to the first page of course list
        And school admin views "<number2>" rows per page
        Examples:
            | number1 | number2                |
            | 5       | 1 of [10, 25, 50, 100] |
            | 10      | 1 of [5, 25, 50, 100]  |
            | 25      | 1 of [5, 10, 50, 100]  |
            | 50      | 1 of [5, 10, 25, 100]  |
            | 100     | 1 of [5, 10, 25, 50]   |

    Scenario Outline: Still on the current page of course list when selecting the same rows per page
        Given school admin is not on the first page of course list
        And the rows per page is "<number>"
        When school admin changes the rows per page to "<number>"
        Then school admin stays on the current page of course list
        And school admin views "<number>" rows per page
        Examples:
            | number |
            | 5      |
            | 10     |
            | 25     |
            | 50     |
            | 100    |