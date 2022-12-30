@cms @cms2
@lesson
@lesson-filter

Feature: Teacher can filter past lesson by date time
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to "past" lessons list page

    Scenario Outline: Teacher can filter by <option>
        When "teacher" filters with "<option>"
        Then "teacher" sees "<option>" chip filter in result page
        And "teacher" sees a lesson list which matches "<option>"
        Examples:
            | option            |
            | Lesson Start Date |
            | Lesson End Date   |

    Scenario Outline: Teacher can filter past lesson by <option>
        When "teacher" filters with "<option>"
        Then "teacher" sees "<option>" chip filter in result page
        And "teacher" sees a lesson list which matches "<option>"
        Examples:
            | option     |
            | Start Time |
            | End Time   |