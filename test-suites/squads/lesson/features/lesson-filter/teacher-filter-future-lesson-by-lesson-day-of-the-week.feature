@cms @cms2
@lesson
@lesson-filter

Feature: Teacher can filter future lesson by lesson day of the week
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to "future" lessons list page

    Scenario Outline: Teacher can filter by lesson day of the week
        Given "teacher" has chosen "5" lessons per page in the first result page
        And "teacher" has gone to the next lesson results page
        When "teacher" filters lesson day of the week with "<option>"
        Then "teacher" is redirected to the first result page
        And "teacher" sees a lesson list which has day of the week matches "<option>"
        And "teacher" sees "Lesson day of the week" chip filter in result page
        And "teacher" still sees lessons per page is "5"
        Examples:
            | option    |
            | Monday    |
            | Tuesday   |
            | Wednesday |
            | Thursday  |
            | Friday    |
            | Saturday  |
            | Sunday    |