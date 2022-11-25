@cms
@lesson
@lesson-filter

Feature: School admin can filter past lesson by date time
    Background:
        Given "school admin" logins CMS
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to "past" lessons list page

    Scenario Outline: School admin can apply filter with <option>
        When "school admin" applies filter lesson date with "<option>"
        Then "school admin" sees a lesson list which lesson date matches "<option>"
        And "school admin" sees "<option>" chip filter in result page
        And "school admin" sees "<option>" chip filter in filter popup
        Examples:
            | option            |
            | Lesson Start Date |
            | Lesson End Date   |

    Scenario Outline: School admin can filter future lesson by <option>
        When "school admin" applies filter lesson time with "<option>"
        Then "school admin" sees a lesson list which lesson time matches "<option>"
        And "school admin" sees "<option>" chip filter in result page
        And "school admin" sees "<option>" chip filter in filter popup
        Examples:
            | option     |
            | Start Time |
            | End Time   |