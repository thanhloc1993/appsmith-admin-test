@cms
@lesson
@lesson-filter

Feature: Still remaining filter and search result when turning back from past lessons list page
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "school admin" has gone to "future" lessons list page

    Scenario Outline: Filter and search result are remained when turning back from past lessons list page
        Given "school admin" has filtered with "<option>"
        And "school admin" has searched for the keyword
        When "school admin" goes to "past" lessons list page
        And "school admin" goes back to "future" lessons list page
        Then "school admin" sees an "<option>" chip filters in filter popup
        And "school admin" sees an "<option>" chip filters in result page
        And "school admin" sees the keyword in the search bar
        And "school admin" sees lesson list which matches "<option>" and contains the keyword
        Examples:
            | option                 |
            | Lesson Start Date      |
            | Lesson End Date        |
            | Start Time             |
            | End Time               |
            | Lesson day of the week |
            | Center                 |
            | Teacher Name           |
            | Student Name           |
            | Grade                  |
            | Course                 |
