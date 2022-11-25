@cms
@lesson
@lesson-filter

Feature: School admin can search past lesson
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to "past" lessons list page

    Scenario: School admin can search for a lesson which contains the keyword of student name
        When "school admin" searches for the student name
        Then "school admin" sees newly created lesson containing specific student name

    Scenario: School admin cannot search for a lesson with non existed keyword of student name
        When "school admin" searches for the non existed keyword
        Then "school admin" sees no result

    Scenario Outline: School admin can remove applied keyword in result page
        Given "school admin" has chosen "<number>" lessons per page in the first result page
        And "school admin" has searched for the keyword
        And "school admin" has gone to the next lesson results page
        When "school admin" removes the keyword
        Then "school admin" is redirected to the first result page
        And "school admin" sees no keyword in the search bar
        And "school admin" still sees lessons per page is "<number>"
        And "school admin" sees number of lesson is equal or less than "<number>" in lesson list
        Examples:
            | number |
            | 5      |
            | 10     |
            | 25     |
            | 50     |
            | 100    |