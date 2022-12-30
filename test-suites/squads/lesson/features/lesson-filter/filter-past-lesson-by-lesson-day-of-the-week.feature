@cms
@lesson
@lesson-filter

Feature: School admin can filter past lesson by lesson day of the week
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to "past" lessons list page

    Scenario Outline: School admin can filter by lesson day of the week
        Given "school admin" has chosen "5" lessons per page in the first result page
        And "school admin" has gone to the next lesson results page
        When "school admin" filters lesson day of the week with "<option>"
        Then "school admin" is redirected to the first result page
        And "school admin" sees "Lesson day of the week" chip filter in result page
        And "school admin" sees a lesson list which has day of the week matches "<option>"
        And "school admin" still sees lessons per page is "5"
        Examples:
            | option    |
            | Monday    |
            | Tuesday   |
            | Wednesday |
            | Thursday  |
            | Friday    |
            | Saturday  |
            | Sunday    |