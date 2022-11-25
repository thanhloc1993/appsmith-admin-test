@cms @cms2
@lesson
@lesson-filter

Feature: Teacher can filter future lesson by date time
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to "future" lessons list page

    Scenario Outline: Teacher can filter by <option>
        When "teacher" filters with "<option>"
        Then "teacher" sees "<option>" chip filter in result page
        And "teacher" sees a lesson list which matches "<option>"
        Examples:
            | option            |
            | Lesson Start Date |
            | Lesson End Date   |

    Scenario Outline: Teacher can filter future lesson by <option>
        When "teacher" filters with "<option>"
        Then "teacher" sees "<option>" chip filter in result page
        And "teacher" sees a lesson list which matches "<option>"
        Examples:
            | option     |
            | Start Time |
            | End Time   |
