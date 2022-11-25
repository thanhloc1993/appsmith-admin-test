@cms
@lesson
@lesson-filter

Feature: School admin can search and apply rows per page for past lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to "past" lessons list page

    Scenario Outline: School admin is redirected to the first result page when he searches for a keyword
        Given "school admin" has chosen "<number>" lessons per page in the first result page
        And "school admin" has gone to the next lesson results page
        When "school admin" searches for the keyword
        Then "school admin" is redirected to the first result page
        And "school admin" still sees lessons per page is "<number>"
        And "school admin" sees number of lesson is equal or less than "<number>" in lesson list
        And "school admin" sees a list of lesson which student name contains the keyword
        Examples:
            | number |
            | 5      |
            | 10     |
            | 25     |
            | 50     |
            | 100    |

    Scenario Outline: School admin is redirected to the first result page when he applies new rows per page
        Given "school admin" has chosen "<number1>" lessons per page in the first result page
        And "school admin" has searched for the keyword
        And "school admin" has gone to the next lesson results page
        When "school admin" chooses "<number2>" lessons per page
        Then "school admin" is redirected to the first result page
        And "school admin" sees lessons per page is "<number2>"
        And "school admin" sees number of lesson is equal or less than "<number2>" in lesson list
        And "school admin" sees a list of lesson which student name contains the keyword
        Examples:
            | number1 | number2             |
            | 5       | 1 of [10,25,50,100] |
            | 10      | 1 of [5,25,50,100]  |
            | 25      | 1 of [5,10,50,100]  |
            | 50      | 1 of [5,10,25,100]  |
            | 100     | 1 of [5,10,25,50]   |